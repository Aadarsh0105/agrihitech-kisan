import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Bot, Send, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import supportAssistant from '../../data/support-assistant.json';

type ChatMessage = {
  id: number;
  role: 'bot' | 'user';
  text: string;
  link?: string;
  linkLabel?: string;
};

type Topic = (typeof supportAssistant.assistant.topics)[number];

interface ChatbotWidgetProps {
  open: boolean;
  onClose: () => void;
}

let nextMessageId = 1;

const normalize = (value: string) =>
  value.toLocaleLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

function findTopic(question: string): Topic | undefined {
  const query = normalize(question);
  const queryWords = new Set(query.split(' ').filter((word) => word.length > 1));

  return supportAssistant.assistant.topics
    .map((topic) => {
      const score = topic.keywords.reduce((total, keyword) => {
        const normalizedKeyword = normalize(keyword);
        if (query.includes(normalizedKeyword)) return total + normalizedKeyword.split(' ').length + 2;
        return total + normalizedKeyword.split(' ').filter((word) => queryWords.has(word)).length;
      }, 0);
      return { topic, score };
    })
    .sort((a, b) => b.score - a.score)
    .find(({ score }) => score > 0)?.topic;
}

export function ChatbotWidget({ open, onClose }: ChatbotWidgetProps) {
  const { pathname } = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([...supportAssistant.assistant.initialSuggestions]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: nextMessageId++, role: 'bot', text: supportAssistant.assistant.welcome },
  ]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = (value: string) => {
    const question = value.trim();
    if (!question) return;
    const topic = findTopic(question);

    setMessages((current) => [
      ...current,
      { id: nextMessageId++, role: 'user', text: question },
      {
        id: nextMessageId++,
        role: 'bot',
        text: topic?.answer ?? supportAssistant.assistant.fallback,
        link: topic?.link,
        linkLabel: topic?.linkLabel,
      },
    ]);
    setSuggestions(topic?.suggestions ?? [...supportAssistant.assistant.initialSuggestions]);
    setInput('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.section
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 right-4 z-[70] flex h-[min(34rem,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft-lg sm:right-6"
          aria-label="Kisan support chatbot"
        >
          <header className="flex items-center gap-3 bg-primary px-4 py-4 text-primary-foreground">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15"><Bot className="h-5 w-5" /></span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-sm font-bold">{supportAssistant.assistant.name}</h2>
              <p className="text-xs text-primary-foreground/75">Agri HiTech Kisan support</p>
            </div>
            <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/10" aria-label="Close chatbot">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-secondary/25 p-4" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${message.role === 'user' ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md border border-border bg-card text-foreground shadow-sm'}`}>
                  <p>{message.text}</p>
                  {message.link && message.linkLabel ? (
                    <Link to={message.link} className="mt-2 inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                      {message.linkLabel}<ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-card p-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} className="shrink-0 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10">
                  {suggestion}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about products, schemes..."
                className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                aria-label="Chat message"
              />
              <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft hover:opacity-90" aria-label="Send message">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
