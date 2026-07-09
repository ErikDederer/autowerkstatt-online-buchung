-- booking_requests
--
-- Schema contract between this site (autowerkstatt-online-buchung) and
-- WerkPlan (../werkplan). Both repos' migrations create this table with
-- CREATE TABLE IF NOT EXISTS so either can run first against the shared
-- project. If the schema changes on one side, update it here (or in
-- werkplan/drizzle/schema.ts) first and re-sync both sides.
--
-- Column names for customer_name, phone, vehicle_make, vehicle_model,
-- license_plate, service_type, requested_date, requested_slot,
-- duration_min, note, status, and source follow the spec as given.
-- email, mileage_km and license_plate were added on top of that spec
-- because the booking form already collects them and dropping them
-- would lose data the workshop will want — flagging that deviation
-- here explicitly.

create extension if not exists pgcrypto;

create table if not exists booking_requests (
  id uuid primary key default gen_random_uuid(),

  -- customer
  customer_name text not null,
  phone text not null,
  email text not null,

  -- vehicle
  vehicle_make text not null,
  vehicle_model text not null,
  license_plate text not null,
  mileage_km integer not null check (mileage_km >= 0),

  -- requested appointment
  -- service_type uses the same slugs as lib/site-config.ts's service ids
  -- (oelwechsel, inspektion, reifenwechsel, bremsen-check,
  -- hu-au-vorbereitung, klimaservice). WerkPlan must consume these
  -- exact slugs once it exists.
  service_type text not null,
  requested_date date not null,
  requested_slot text not null, -- "HH:MM", workshop-local time
  duration_min integer not null check (duration_min > 0),

  note text,

  -- status is intentionally a free-text column with a soft default
  -- rather than an enum/check constraint: WerkPlan will define the
  -- real state machine (e.g. neu -> bestätigt -> erledigt) once it
  -- exists, and this table shouldn't have to be migrated again just
  -- to add a status WerkPlan introduces later.
  status text not null default 'neu',
  source text not null default 'website',

  created_at timestamptz not null default now()
);

create index if not exists booking_requests_requested_date_idx
  on booking_requests (requested_date);

create index if not exists booking_requests_status_idx
  on booking_requests (status);

-- RLS is enabled with no public policies: only the service-role key
-- (used exclusively server-side in lib/actions/booking.ts) can write,
-- since the service role bypasses RLS entirely. WerkPlan will need to
-- add its own SELECT/UPDATE policies for its authenticated admin
-- users once it exists.
alter table booking_requests enable row level security;
