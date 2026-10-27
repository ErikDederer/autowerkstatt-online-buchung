"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

// The panel (and its logic) loads only when a visitor opens the chat, so
// pages don't ship chat code up front.
const ChatPanel = dynamic(() => import("./chat-panel").then((m) => m.ChatPanel), {
  ssr: false,
  loading: () => null,
});

export function AssistantLauncher({ workshopName }: { workshopName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatPanel workshopName={workshopName} onClose={() => setOpen(false)} />}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="assistant-panel"
        className={cn(
          "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/60",
          open && "max-sm:hidden"
        )}
      >
        {open ? <X className="size-5" aria-hidden /> : <MessageCircle className="size-5" aria-hidden />}
        <span>{open ? "Chat schließen" : "Termin per Chat"}</span>
      </button>
    </>
  );
}
