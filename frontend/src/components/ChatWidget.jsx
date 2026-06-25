import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import { getApiUrl } from "@/lib/api";

const STORAGE_KEY = "aionex_chat";
const SESSION_KEY = "aionex_chat_session";

/** Premium accent — champagne gold on dark, teal brand glow */
const chatAccent = {
  gold: "text-[#D4BC8A]",
  goldBright: "text-[#E8D5A8]",
  dot: "bg-[#C9A962]",
  border: "border-[#C9A962]/45",
  borderSoft: "border-[#C9A962]/22",
  bgSoft: "bg-[#C9A962]/10",
  surface: "bg-[hsl(220,12%,9%)]",
  glow: "shadow-[0_0_24px_rgba(201,169,98,0.2)]",
  launcher:
    "bg-[hsl(220,12%,9%)] text-[#E8D5A8] border border-[#C9A962]/50 " +
    "shadow-[0_10px_36px_rgba(0,0,0,0.45),0_0_0_1px_rgba(201,169,98,0.15),0_0_32px_hsl(var(--glow-primary)/0.12)] " +
    "hover:border-[#D4BC8A]/65 hover:shadow-[0_12px_44px_rgba(0,0,0,0.5),0_0_28px_rgba(201,169,98,0.18),0_0_36px_hsl(var(--glow-primary)/0.18)]",
  userBubble:
    "bg-[hsl(220,12%,11%)] text-foreground border border-[#C9A962]/28 border-l-2 border-l-[#C9A962]",
  sendBtn:
    "bg-[#C9A962]/12 text-[#E8D5A8] border border-[#C9A962]/40 hover:bg-[#C9A962]/22",
  badge:
    "border-[#C9A962]/30 bg-[hsl(220,12%,7%)]/95 text-[#D4BC8A] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.35)]",
  aiBadge: "bg-[#C9A962] text-[hsl(220,15%,4%)] border border-[#E8D5A8]/25",
};

function loadMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(msgs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-100)));
  } catch {
    /* quota exceeded — ignore */
  }
}

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={`block w-1 h-1 rounded-full ${chatAccent.dot}`}
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1, 0.85] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

function RobotIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <circle cx="9" cy="13.5" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.5" r="1.25" fill="currentColor" stroke="none" />
      <path d="M9.5 17h5" />
      <path d="M12 4v3" />
      <circle cx="12" cy="3" r="1" fill="currentColor" stroke="none" />
      <path d="M2 12.5h2M20 12.5h2" />
    </svg>
  );
}

function BotAvatar({ size = "md" }) {
  const wrap = { sm: "w-7 h-7", md: "w-9 h-9", lg: "w-11 h-11" };
  const icon = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };

  return (
    <div
      className={`${wrap[size]} shrink-0 rounded-full ${chatAccent.border} ${chatAccent.surface}
                  flex items-center justify-center ${chatAccent.goldBright} ${chatAccent.glow}`}
    >
      <RobotIcon className={icon[size]} />
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChatWidget() {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadMessages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [confirmationNotice, setConfirmationNotice] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const lastAnalyzedCount = useRef(0);

  const cw = (key) => t(`chatWidget.${key}`);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streaming, scrollToBottom]);

  const analyzeConversation = useCallback(async () => {
    const cleanMessages = messages
      .filter((m) => !m._streaming && m.content?.trim())
      .map((m) => ({ role: m.role, content: m.content }));

    if (cleanMessages.length < 2) return null;
    if (cleanMessages.length === lastAnalyzedCount.current) return null;
    lastAnalyzedCount.current = cleanMessages.length;

    const base = getApiUrl();
    try {
      const resp = await fetch(`${base}/api/chat/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: cleanMessages,
          sessionId: getSessionId(),
          language,
        }),
      });
      if (!resp.ok) return null;
      return await resp.json();
    } catch {
      return null;
    }
  }, [messages, language]);

  const closeChat = useCallback(async () => {
    const result = await analyzeConversation();
    if (result?.clientConfirmationSent) {
      setConfirmationNotice(cw("confirmationSent"));
      setTimeout(() => {
        setConfirmationNotice(null);
        setOpen(false);
      }, 2200);
      return;
    }
    setOpen(false);
  }, [analyzeConversation, cw]);

  useEffect(() => {
    const handleUnload = () => {
      const cleanMessages = messages
        .filter((m) => !m._streaming && m.content?.trim())
        .map((m) => ({ role: m.role, content: m.content }));
      if (cleanMessages.length < 2) return;
      const base = getApiUrl();
      fetch(`${base}/api/chat/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: cleanMessages,
          sessionId: getSessionId(),
          language,
        }),
        keepalive: true,
      }).catch(() => {});
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [messages, language]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || streaming) return;
      setError(null);

      const userMsg = { role: "user", content: text.trim() };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const base = getApiUrl();
        const url = `${base}/api/chat`;

        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: nextMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            sessionId: getSessionId(),
            language,
          }),
          signal: controller.signal,
        });

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";
        let buffer = "";

        const finalizeAssistantMessage = () => {
          setMessages((prev) =>
            prev.map((m) => (m._streaming ? { role: m.role, content: m.content } : m))
          );
        };

        streamLoop: while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.error) {
                setError(parsed.error);
                break streamLoop;
              }
              if (parsed.done) {
                break streamLoop;
              }
              if (parsed.content) {
                assistantContent += parsed.content;
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (last?.role === "assistant" && last?._streaming) {
                    return [
                      ...prev.slice(0, -1),
                      { role: "assistant", content: assistantContent, _streaming: true },
                    ];
                  }
                  return [
                    ...prev,
                    { role: "assistant", content: assistantContent, _streaming: true },
                  ];
                });
              }
            } catch {
              /* skip malformed SSE chunks */
            }
          }
        }

        finalizeAssistantMessage();
        setStreaming(false);
        reader.cancel().catch(() => {});
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(cw("errorMessage"));
        }
      } finally {
        setStreaming(false);
        abortRef.current = null;
        inputRef.current?.focus();
      }
    },
    [messages, streaming, language, cw] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleStarterClick = (text) => {
    sendMessage(text);
  };

  const greeting = cw("greeting");
  const starters = cw("starters") || [];
  const showStarters = messages.length === 0;

  return (
    <>
      {/* Launcher */}
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2"
          >
            <span className={`mr-1 rounded-full ${chatAccent.badge} px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm`}>
              {cw("launcherLabel")} · 24/7
            </span>
            <motion.button
              type="button"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setOpen(true)}
              className={`group relative flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full transition-all duration-300 ${chatAccent.launcher}`}
              aria-label={cw("launcherLabel")}
            >
              <RobotIcon className="w-7 h-7" />
              <span className={`absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold ${chatAccent.aiBadge}`}>
                AI
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[9999] flex flex-col overflow-hidden
                       bottom-0 right-0 w-full h-[100dvh]
                       sm:bottom-6 sm:right-6 sm:w-[390px] sm:h-[min(620px,calc(100dvh-3rem))] sm:rounded-sm
                       border border-border/80 bg-card/95 backdrop-blur-xl
                       shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            {/* Header */}
            <div className="relative shrink-0 border-b border-border/70 px-4 py-3.5">
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(var(--grid-line) / 0.35) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--grid-line) / 0.35) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <BotAvatar size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium tracking-tight text-foreground truncate">
                        {cw("title")}
                      </span>
                      <span className={`shrink-0 rounded-sm ${chatAccent.borderSoft} ${chatAccent.bgSoft} px-2 py-0.5 text-[10px] uppercase tracking-wider ${chatAccent.gold}`}>
                        {cw("launcherLabel")}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className={`inline-flex h-1.5 w-1.5 rounded-full ${chatAccent.dot} shadow-[0_0_10px_rgba(201,169,98,0.7)]`} />
                      {cw("online")}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeChat}
                  className="shrink-0 rounded-sm border border-transparent p-2 text-muted-foreground
                             hover:border-border hover:bg-secondary/60 hover:text-foreground transition-colors"
                  aria-label="Close chat"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="relative flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
              style={{
                backgroundImage:
                  "radial-gradient(hsl(var(--grid-dot) / 0.35) 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            >
              <div className="flex gap-3 items-start">
                <BotAvatar size="sm" />
                <div className="max-w-[88%] rounded-sm border border-border/70 bg-secondary/30 px-3.5 py-3 text-sm leading-relaxed text-secondary-foreground">
                  {greeting}
                </div>
              </div>

              {showStarters && (
                <div className="pl-10 flex flex-wrap gap-2">
                  {starters.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleStarterClick(q)}
                      disabled={streaming}
                      className="text-left text-xs px-3 py-2 rounded-sm border border-border/70 bg-background/40
                                 text-muted-foreground hover:text-[#E8D5A8] hover:border-[#C9A962]/35
                                 hover:bg-[#C9A962]/8 transition-colors disabled:opacity-40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 items-end ${msg.role === "user" ? "justify-end" : "items-start"}`}
                >
                  {msg.role === "assistant" && <BotAvatar size="sm" />}
                  <div
                    className={`max-w-[88%] rounded-sm px-3.5 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      msg.role === "user"
                        ? chatAccent.userBubble
                        : "bg-secondary/25 text-secondary-foreground border border-border/70"
                    }`}
                  >
                    {msg.content}
                    {msg._streaming && (
                      <motion.span
                        className="inline-block w-px h-4 bg-[#C9A962]/80 ml-0.5 align-middle"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.55, repeat: Infinity }}
                      />
                    )}
                  </div>
                </div>
              ))}

              {streaming && !messages.some((m) => m._streaming) && (
                <div className="flex gap-3 items-start">
                  <BotAvatar size="sm" />
                  <div className="rounded-sm border border-border/70 bg-secondary/25 px-3.5 py-3">
                    <TypingDots />
                  </div>
                </div>
              )}

              {error && (
                <div className="ml-10 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-sm px-3 py-2">
                  {error}
                </div>
              )}

              {confirmationNotice && (
                <div className={`ml-10 text-xs ${chatAccent.gold} ${chatAccent.bgSoft} border ${chatAccent.borderSoft} rounded-sm px-3 py-2`}>
                  {confirmationNotice}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-border/70 px-4 py-2.5 bg-background/30">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {cw("poweredBy")}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    closeChat();
                    setTimeout(() => {
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className={`text-[11px] ${chatAccent.gold} hover:text-[#E8D5A8] transition-colors whitespace-nowrap`}
                >
                  {cw("wantSame")} →
                </button>
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="shrink-0 flex items-center gap-2 border-t border-border/70 bg-card px-3 py-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={cw("placeholder")}
                disabled={streaming}
                maxLength={500}
                className="flex-1 min-w-0 rounded-sm border border-input bg-input px-3.5 py-2.5 text-sm text-foreground
                           placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring
                           disabled:opacity-50 transition-colors"
              />
              <button
                type="submit"
                disabled={streaming || !input.trim()}
                className={`shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-sm disabled:opacity-30 transition-opacity ${chatAccent.sendBtn}`}
                aria-label={cw("send")}
              >
                <SendIcon />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
