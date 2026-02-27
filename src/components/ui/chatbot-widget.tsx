"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, GraduationCap } from "lucide-react";

// ─── Teacher Avatar SVG ─────────────────────────────────────────────────────
function TeacherAvatar({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background circle */}
      <circle cx="20" cy="20" r="20" fill="#2F3B69" />
      {/* Head */}
      <circle cx="20" cy="15" r="7" fill="#E8C9A0" />
      {/* Grad cap – brim */}
      <rect x="10" y="9" width="20" height="3" rx="1.5" fill="#8B3B3B" />
      {/* Grad cap – top */}
      <polygon points="20,4 28,9 12,9" fill="#8B3B3B" />
      {/* Tassel */}
      <line x1="28" y1="9" x2="30" y2="14" stroke="#8B3B3B" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="30" cy="15" r="1.5" fill="#8B3B3B" />
      {/* Body / shoulders */}
      <path d="M8 36 C8 28 12 26 20 26 C28 26 32 28 32 36" fill="#1C233F" />
    </svg>
  );
}

// ─── Types ──────────────────────────────────────────────────────────────────
type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

const INITIAL_MESSAGE: Message = {
  id: 0,
  role: "assistant",
  text: "Hi! 👋 I'm your Ymit Academy advisor. How can I help you with university admissions today?",
};

// ─── Widget ─────────────────────────────────────────────────────────────────
export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [nextId, setNextId] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: nextId, role: "user", text: trimmed };
    const botMsg: Message = {
      id: nextId + 1,
      role: "assistant",
      text: "Thanks for your message! Our team will get back to you shortly. In the meantime, feel free to book a free consultation.",
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setNextId((n) => n + 2);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Chat panel ─────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Support chat"
          className="fixed bottom-24 right-4 sm:right-6 z-[9999] w-[calc(100vw-2rem)] max-w-sm flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-white/20"
          style={{ height: "420px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#2F3B69]">
            <TeacherAvatar size={36} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold leading-tight truncate">
                TUA Advisor
              </p>
              <p className="text-white/60 text-[11px] leading-tight">
                Admissions support
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-white/70 hover:text-white transition-colors rounded-full p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-white px-4 py-3 space-y-3 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex-shrink-0 mt-0.5">
                    <TeacherAvatar size={28} />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3 py-2 max-w-[80%] leading-snug ${
                    msg.role === "user"
                      ? "bg-[#2F3B69] text-white rounded-tr-none"
                      : "bg-[#F3F4F6] text-[#111111] rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 bg-white border-t border-[#E5E7EB] px-3 py-2.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              aria-label="Chat message input"
              className="flex-1 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-full px-4 py-2 outline-none focus:border-[#2F3B69] transition-colors placeholder:text-[#9CA3AF] text-[#111111]"
            />
            <button
              onClick={sendMessage}
              aria-label="Send message"
              disabled={!input.trim()}
              className="flex-shrink-0 w-9 h-9 rounded-full bg-[#8B3B3B] flex items-center justify-center text-white disabled:opacity-40 hover:bg-[#6F2F2F] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating toggle button ──────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close support chat" : "Open support chat"}
        className="fixed bottom-5 right-4 sm:right-6 z-[9999] w-14 h-14 rounded-full shadow-xl flex items-center justify-center bg-[#2F3B69] hover:bg-[#262F54] transition-all duration-200 hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <span className="relative flex items-center justify-center">
            <TeacherAvatar size={40} />
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#8B3B3B] rounded-full border-2 border-white animate-pulse" />
          </span>
        )}
      </button>
    </>
  );
}
