# Historische Migrationen

Seit der Plattform-Grundlage (Phase 1) besitzt die Website keinen
Datenbankzugang mehr und spricht ausschließlich mit WerkPlans öffentlicher
Buchungs-API. Das gemeinsame Schema wird nur noch in
`../werkplan/supabase/migrations` gepflegt und mit `npm run db:push` (im
WerkPlan-Repo) angewendet. Die Dateien hier bleiben als Historie erhalten;
bitte nicht erneut ausführen.
