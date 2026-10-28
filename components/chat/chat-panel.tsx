"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, CalendarCheck, Loader2, PhoneCall, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatReply, ChatTranscript, ChatUi } from "@/lib/werkplan/client";

type Message = { role: "user" | "assistant"; text: string; ui?: ChatUi };
type Conversation = { id: string; token: string };

const STORAGE_KEY = "werkplan-chat";
const TIMEZONE = "Europe/Berlin";

// Widget chrome in German, English for visitors whose browser isn't German.
// The conversation itself follows whatever language the customer writes.
const TEXT = {
  de: {
    title: "Digitaler Assistent",
    aiBadge: "KI",
    intro: (name: string) =>
      `Ich bin der digitale Assistent von ${name} – eine KI, kein Mensch. Ich finde den passenden Service, nenne Dauer und Preisrahmen und buche einen freien Termin. Bei allem, was ich nicht sicher beantworten kann, übergebe ich an das Team.`,
    languages: "Schreiben Sie gern in Ihrer Sprache:",
    privacy:
      "Ihre Nachrichten werden zur Terminvereinbarung verarbeitet und nach 90 Tagen gelöscht. Geben Sie keine Gesundheits- oder Bankdaten ein.",
    privacyLink: "Datenschutzhinweise",
    start: "Chat starten",
    startNote: "Mit „Chat starten“ akzeptieren Sie die Datenschutzhinweise.",
    greeting:
      "Hallo! Womit kann ich helfen? Beschreiben Sie kurz Ihr Anliegen, z. B. „Die Bremsen quietschen“ oder „Ich brauche einen Reifenwechsel“.",
    placeholder: "Ihre Nachricht …",
    send: "Senden",
    close: "Chat schließen",
    thinking: "Der Assistent schreibt …",
    booked: "Termin gebucht",
    requested: "Termin angefragt",
    handoff: "An das Team übergeben – wir melden uns.",
    handoffUrgent: "Dringend an das Team übergeben – wir melden uns schnellstmöglich.",
    retry: "Erneut senden",
    newChat: "Neues Gespräch",
    pickSlot: "Freie Termine",
  },
  en: {
    title: "Digital assistant",
    aiBadge: "AI",
    intro: (name: string) =>
      `I'm the digital assistant of ${name} — an AI, not a person. I find the right service, tell you duration and price range, and book a free slot. Anything I can't answer reliably goes to the team.`,
    languages: "Feel free to write in your language:",
    privacy:
      "Your messages are processed to arrange your appointment and deleted after 90 days. Please don't share health or bank details.",
    privacyLink: "Privacy notice",
    start: "Start chat",
    startNote: "By clicking “Start chat” you accept the privacy notice.",
    greeting: "Hello! How can I help? Briefly describe what your car needs, e.g. “My brakes squeak”.",
    placeholder: "Your message …",
    send: "Send",
    close: "Close chat",
    thinking: "The assistant is typing …",
    booked: "Appointment booked",
    requested: "Appointment requested",
    handoff: "Handed over to the team — we'll get back to you.",
    handoffUrgent: "Urgently handed over to the team — we'll call you back as soon as possible.",
    retry: "Send again",
    newChat: "New conversation",
    pickSlot: "Available times",
  },
} as const;

const HELLOS = ["Hallo", "Hello", "Merhaba", "Привет", "Привіт", "Cześć", "مرحبا", "Salut", "Ciao", "Γεια", "Zdravo", "Здравей", "Përshëndetje", "سلام", "Silav", "Xin chào", "Hola", "Bonjour"];

function readStored(): Conversation | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Conversation) : null;
  } catch {
    return null;
  }
}

function store(conversation: Conversation | null) {
  try {
    if (conversation) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private mode / blocked storage: the chat still works for this page view.
  }
}

/** "Di., 03.11., 10:00" in the conversation's language, workshop time zone. */
function slotLabel(startsAt: string, language: string | null) {
  try {
    return new Intl.DateTimeFormat(language ?? "de", {
      weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: TIMEZONE,
    }).format(new Date(startsAt));
  } catch {
    return startsAt;
  }
}

export function ChatPanel({ workshopName, onClose }: { workshopName: string; onClose: () => void }) {
  const t = typeof navigator !== "undefined" && !navigator.language?.toLowerCase().startsWith("de") ? TEXT.en : TEXT.de;
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<{ message: string; retryText?: string } | null>(null);
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [language, setLanguage] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Resume an ongoing conversation after navigation within the site.
  useEffect(() => {
    const stored = readStored();
    if (!stored) return;
    fetch(`/api/chat?conversationId=${stored.id}`, { headers: { "x-chat-token": stored.token } })
      .then((r) => (r.ok ? (r.json() as Promise<ChatTranscript>) : Promise.reject()))
      .then((transcript) => {
        setConversation(stored);
        setStarted(true);
        setDir(transcript.dir);
        setLanguage(transcript.language);
        setMessages([{ role: "assistant", text: t.greeting }, ...transcript.messages.map((m) => ({ role: m.role, text: m.text }))]);
      })
      .catch(() => store(null));
    // Only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (started) inputRef.current?.focus();
  }, [started]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function start() {
    setStarted(true);
    setMessages([{ role: "assistant", text: t.greeting }]);
  }

  async function send(text: string) {
    const message = text.trim();
    if (!message || pending) return;
    setError(null);
    setInput("");
    setMessages((m) => [...m, { role: "user", text: message }]);
    setPending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversationId: conversation?.id ?? null,
          token: conversation?.token ?? null,
          privacyAccepted: true,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        if (body?.error?.code === "conversation_not_found") {
          store(null);
          setConversation(null);
        }
        setError({ message: body?.error?.message ?? "Der Chat ist gerade nicht erreichbar.", retryText: message });
        return;
      }
      const reply = body as ChatReply;
      if (reply.token) {
        const next = { id: reply.conversationId, token: reply.token };
        setConversation(next);
        store(next);
      }
      setDir(reply.dir);
      setLanguage(reply.language);
      setMessages((m) => [...m, { role: "assistant", text: reply.reply, ui: reply.ui }]);
    } catch {
      setError({ message: "Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung.", retryText: message });
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  }

  function reset() {
    store(null);
    setConversation(null);
    setMessages([{ role: "assistant", text: t.greeting }]);
    setError(null);
    setDir("ltr");
  }

  const lastUi = messages.at(-1)?.role === "assistant" ? messages.at(-1)?.ui : undefined;

  return (
    <section
      id="assistant-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby="assistant-title"
      className="fixed inset-0 z-50 flex flex-col bg-card text-card-foreground sm:inset-auto sm:bottom-20 sm:right-4 sm:h-[min(600px,calc(100dvh-7rem))] sm:w-[400px] sm:rounded-2xl sm:border sm:shadow-2xl"
    >
      <header className="flex items-center justify-between gap-2 border-b px-4 py-3">
        <h2 id="assistant-title" className="flex items-center gap-2 font-heading text-base font-semibold">
          <Bot className="size-5 text-primary" aria-hidden />
          {t.title}
          <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
            {t.aiBadge}
          </span>
        </h2>
        <div className="flex items-center gap-1">
          {started && conversation && (
            <button type="button" onClick={reset} className="rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {t.newChat}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-5" />
          </button>
        </div>
      </header>

      {!started ? (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5 text-sm">
          <p className="text-pretty">{t.intro(workshopName)}</p>
          <div>
            <p className="text-muted-foreground">{t.languages}</p>
            <p className="mt-1 leading-relaxed" lang="mul">
              {HELLOS.map((h) => (
                <span key={h} dir="auto" className="mr-2 inline-block">{h}</span>
              ))}
            </p>
          </div>
          <p className="rounded-lg bg-secondary/50 p-3 text-xs text-muted-foreground">
            {t.privacy}{" "}
            <a href="/datenschutz" className="underline underline-offset-2 hover:text-foreground">
              {t.privacyLink}
            </a>
          </p>
          <div className="mt-auto">
            <button
              type="button"
              onClick={start}
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
            >
              {t.start}
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">{t.startNote}</p>
          </div>
        </div>
      ) : (
        <>
          <div ref={logRef} role="log" aria-live="polite" aria-relevant="additions" dir={dir} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className="max-w-[85%] space-y-2">
                  <p
                    dir="auto"
                    className={cn(
                      "whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm",
                      m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    )}
                  >
                    <span className="sr-only">{m.role === "user" ? "Sie: " : "Assistent: "}</span>
                    {m.text}
                  </p>
                  {m.ui?.booking && (
                    <p className="flex items-start gap-2 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-sm">
                      <CalendarCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      <span>
                        <strong>{m.ui.booking.status === "booked" ? t.booked : t.requested}</strong>
                        <br />
                        {m.ui.booking.services.join(", ")} · {m.ui.booking.date.split("-").reverse().join(".")}, {m.ui.booking.time}
                      </span>
                    </p>
                  )}
                  {m.ui?.handoff && (
                    <p className="flex items-start gap-2 rounded-xl border px-3 py-2 text-sm">
                      <PhoneCall className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                      {m.ui.handoff.urgency === "urgent" ? t.handoffUrgent : t.handoff}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {pending && (
              <p className="flex items-center gap-2 text-xs text-muted-foreground" role="status">
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                {t.thinking}
              </p>
            )}
            {error && (
              <div role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">
                {error.message}
                {error.retryText && (
                  <button
                    type="button"
                    onClick={() => {
                      setMessages((m) => m.slice(0, -1));
                      send(error.retryText!);
                    }}
                    className="ml-2 underline underline-offset-2"
                  >
                    {t.retry}
                  </button>
                )}
              </div>
            )}
          </div>

          {lastUi?.slots && lastUi.slots.length > 0 && !pending && (
            <div className="border-t px-4 py-2" aria-label={t.pickSlot}>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {lastUi.slots.slice(0, 6).map((s) => {
                  const label = slotLabel(s.startsAt, language);
                  return (
                    <button
                      key={s.startsAt}
                      type="button"
                      onClick={() => send(label)}
                      className="shrink-0 rounded-full border border-primary/50 px-3 py-1.5 font-mono text-xs text-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <form
            className="flex items-end gap-2 border-t p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <label htmlFor="assistant-input" className="sr-only">
              {t.placeholder}
            </label>
            <textarea
              id="assistant-input"
              ref={inputRef}
              value={input}
              dir="auto"
              rows={1}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder={t.placeholder}
              className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border bg-background px-3 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label={t.send}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
            >
              <Send className="size-4" aria-hidden />
            </button>
          </form>
        </>
      )}
    </section>
  );
}
