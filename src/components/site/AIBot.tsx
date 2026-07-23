import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, X, Maximize2, Minimize2 } from "lucide-react";
import { askGeminiStream } from "@/lib/gemini";
import { MarkdownMessage } from "@/components/site/MarkdownMessage";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  isStreaming?: boolean;
};

export function AIBot({
  context,
  onClose,
  initialPrompt,
  className = "",
  isExpanded: propIsExpanded,
  onToggleExpand: propOnToggleExpand,
  messages: propMessages,
  onMessagesChange: propOnMessagesChange,
}: {
  context?: string;
  onClose?: () => void;
  initialPrompt?: string;
  className?: string;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  messages?: Message[];
  onMessagesChange?: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = propIsExpanded ?? internalExpanded;
  const toggleExpand = propOnToggleExpand ?? (() => setInternalExpanded((prev) => !prev));

  const [internalMessages, setInternalMessages] = useState<Message[]>([]);
  const messages = propMessages ?? internalMessages;
  const setMessages = propOnMessagesChange ?? setInternalMessages;

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const initialPromptSent = useRef(false);

  useEffect(() => {
    if (initialPrompt && messages.length === 0 && !initialPromptSent.current) {
      initialPromptSent.current = true;
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        toggleExpand();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, toggleExpand]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text };
    const aiMsgId = (Date.now() + 1).toString();
    const initialAiMsg: Message = { id: aiMsgId, role: "ai", text: "", isStreaming: true };

    setMessages((prev) => [...prev, userMsg, initialAiMsg]);
    setInput("");
    setLoading(true);

    const fullPrompt = context
      ? `System context:\n${context}\n\nUser request: ${text}`
      : text;

    try {
      await askGeminiStream(fullPrompt, (chunkText) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId ? { ...msg, text: msg.text + chunkText } : msg
          )
        );
      });
    } catch (err) {
      console.error("Streaming error:", err);
    } finally {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
      setLoading(false);
    }
  };

  const innerContent = (
    <motion.div
      layout
      transition={{ type: "spring", damping: 25, stiffness: 280 }}
      className={`flex flex-col bg-background border border-hairline overflow-hidden shadow-2xl ${
        isExpanded
          ? "w-full max-w-5xl h-[85vh] sm:h-[90vh] max-h-[900px] rounded-3xl"
          : `w-full h-full rounded-2xl ${className}`
      }`}
    >
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-hairline bg-surface/50 select-none shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-foreground text-background p-1.5 sm:p-2 rounded-xl shadow-xs">
            <Sparkles className="size-4 sm:size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold tracking-tight">Datazone AI Assistant</h3>
              {isExpanded && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-foreground/10 text-foreground">
                  Expanded
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-ink-soft">Ask me anything about our products!</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleExpand}
            className="p-2 hover:bg-surface rounded-full text-ink-soft hover:text-foreground transition-colors"
            title={isExpanded ? "Minimize view (Esc)" : "Expand view"}
          >
            {isExpanded ? <Minimize2 className="size-4 sm:size-5" /> : <Maximize2 className="size-4 sm:size-5" />}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-surface rounded-full text-ink-soft hover:text-foreground transition-colors"
              title="Close chat"
            >
              <X className="size-4 sm:size-5" />
            </button>
          )}
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 ${
          isExpanded ? "max-w-4xl mx-auto w-full space-y-6" : "min-h-[300px] max-h-[500px]"
        }`}
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-ink-soft opacity-50 py-12">
            <Bot className="size-12 mb-3 stroke-[1.5]" />
            <p className="text-sm sm:text-base text-center max-w-sm">
              Hi! I can help you compare products or find exactly what you need.
            </p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`${
                isExpanded ? "max-w-[85%] sm:max-w-[75%]" : "max-w-[85%]"
              } rounded-2xl ${
                isExpanded ? "px-5 py-3.5 text-sm sm:text-base" : "px-4 py-2.5 text-sm"
              } ${
                m.role === "user"
                  ? "bg-foreground text-background rounded-tr-sm"
                  : "bg-surface text-foreground rounded-tl-sm overflow-hidden shadow-xs"
              }`}
            >
              {m.role === "user" ? (
                <div className="whitespace-pre-wrap break-words">{m.text}</div>
              ) : (
                <div className="relative">
                  {m.text ? (
                    <MarkdownMessage content={m.text} />
                  ) : m.isStreaming ? (
                    <div className="flex items-center gap-1.5 text-ink-soft py-0.5">
                      <span className="text-xs sm:text-sm">Thinking</span>
                      <span className="inline-block w-1.5 h-3.5 bg-foreground/70 animate-pulse rounded-xs" />
                    </div>
                  ) : null}
                  {m.text && m.isStreaming && (
                    <span className="inline-block w-1.5 h-3.5 ml-1 bg-foreground/80 animate-pulse align-middle rounded-xs" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-3 sm:p-4 border-t border-hairline bg-surface/50 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className={`flex items-center gap-2 ${isExpanded ? "max-w-4xl mx-auto w-full gap-3" : ""}`}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className={`flex-1 bg-background border border-hairline rounded-full px-4 ${
              isExpanded ? "py-3 text-sm sm:text-base px-5 shadow-xs" : "py-2 text-sm"
            } focus:outline-none focus:border-foreground transition`}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`bg-foreground text-background rounded-full disabled:opacity-50 transition ${
              isExpanded ? "p-3" : "p-2"
            }`}
            title="Send message"
          >
            <Send className={isExpanded ? "size-5" : "size-4"} />
          </button>
        </form>
      </div>
    </motion.div>
  );

  if (isExpanded) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md p-3 sm:p-6 md:p-8 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) toggleExpand();
          }}
        >
          {innerContent}
        </motion.div>
      </AnimatePresence>
    );
  }

  return innerContent;
}

export function FloatingAIBot({ context }: { context?: string }) {
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={
              isExpanded
                ? "contents"
                : "absolute bottom-16 right-0 w-[350px] sm:w-[380px] h-[520px] mb-4 origin-bottom-right"
            }
          >
            <AIBot
              context={context}
              messages={messages}
              onMessagesChange={setMessages}
              onClose={() => {
                setOpen(false);
                setIsExpanded(false);
              }}
              isExpanded={isExpanded}
              onToggleExpand={() => setIsExpanded((prev) => !prev)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {!isExpanded && (
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 bg-foreground text-background rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
          title={open ? "Close AI Assistant" : "Open AI Assistant"}
        >
          {open ? <X className="size-6" /> : <Sparkles className="size-6" />}
        </button>
      )}
    </div>
  );
}

