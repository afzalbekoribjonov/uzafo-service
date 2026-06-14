import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { Brain, Sparkles, Send, Check, CheckCheck } from 'lucide-react';
import type { ChatTurn } from '@/data/services';

interface ChatDemoProps {
  turns: ChatTurn[];
  variant: 'ai' | 'telegram';
  gradient: [string, string];
  subtitle?: string;
}

interface RenderedMessage {
  role: 'user' | 'assistant';
  text: string;
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function ChatDemo({ turns, variant, gradient, subtitle }: ChatDemoProps) {
  const [rendered, setRendered] = useState<RenderedMessage[]>([]);
  const [typing, setTyping] = useState<string | null>(null);
  const [showDots, setShowDots] = useState(false);
  const [thinking, setThinking] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.35 });

  // Keep the conversation scrolled to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rendered, typing, showDots, thinking]);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;

    async function run() {
      // Honour reduced-motion: render the full transcript instantly.
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        setRendered(turns.map((t) => ({ role: t.role, text: t.text })));
        return;
      }

      while (!cancelled) {
        setRendered([]);
        setTyping(null);
        setShowDots(false);
        setThinking(null);
        await sleep(700);

        for (const turn of turns) {
          if (cancelled) return;

          if (turn.role === 'user') {
            setRendered((prev) => [...prev, { role: 'user', text: turn.text }]);
            await sleep(950);
          } else {
            setShowDots(true);
            await sleep(900);
            if (cancelled) return;
            setShowDots(false);

            // Optional "reasoning" phase — makes the assistant feel alive.
            if (turn.thinking) {
              setThinking(turn.thinking);
              await sleep(1200);
              if (cancelled) return;
              setThinking(null);
            }

            // Live "writing" — reveal the answer character by character.
            for (let i = 1; i <= turn.text.length; i++) {
              if (cancelled) return;
              setTyping(turn.text.slice(0, i));
              const ch = turn.text[i - 1];
              await sleep(ch === ' ' ? 14 : 22 + Math.random() * 26);
            }
            setTyping(null);
            setRendered((prev) => [...prev, { role: 'assistant', text: turn.text }]);
            await sleep(1300);
          }
        }
        await sleep(2800);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [inView, turns]);

  const isTelegram = variant === 'telegram';
  const assistantName = isTelegram ? 'Uzafo Shop Bot' : 'Uzafo AI';
  const Avatar = isTelegram ? Send : Brain;

  return (
    <div
      ref={rootRef}
      className="rounded-3xl overflow-hidden shadow-2xl border"
      style={{
        borderColor: 'rgba(255,255,255,0.08)',
        background: isTelegram ? '#0E1621' : 'rgba(10,10,26,0.6)',
        backdropFilter: 'blur(14px)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{
          borderColor: 'rgba(255,255,255,0.07)',
          background: isTelegram
            ? '#17212B'
            : `linear-gradient(135deg, ${gradient[0]}33, ${gradient[1]}1a)`,
        }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
        >
          <Avatar size={18} color="#fff" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">{assistantName}</div>
          <div className="flex items-center gap-1.5 text-[11px]" style={{ color: '#9AE6B4' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300/80">{subtitle || 'onlayn'}</span>
          </div>
        </div>
        {!isTelegram && (
          <div className="ml-auto flex items-center gap-1 text-[11px] text-white/40">
            <Sparkles size={12} /> AI
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="px-4 py-4 space-y-2.5 overflow-y-auto scroll-smooth"
        style={{
          height: 340,
          background: isTelegram
            ? 'linear-gradient(180deg, #0E1621, #0B1019)'
            : 'transparent',
        }}
      >
        {rendered.map((m, i) => (
          <Bubble key={i} role={m.role} text={m.text} variant={variant} gradient={gradient} />
        ))}

        {showDots && <TypingDots variant={variant} />}

        {thinking !== null && <ThinkingRow text={thinking} gradient={gradient} />}

        {typing !== null && (
          <Bubble role="assistant" text={typing} variant={variant} gradient={gradient} caret />
        )}
      </div>

      {/* Fake input bar */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 border-t"
        style={{
          borderColor: 'rgba(255,255,255,0.07)',
          background: isTelegram ? '#17212B' : 'rgba(255,255,255,0.03)',
        }}
      >
        <div className="flex-1 text-sm px-3 py-2 rounded-full text-white/35"
          style={{ background: isTelegram ? '#242F3D' : 'rgba(255,255,255,0.05)' }}
        >
          Xabar yozing…
        </div>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
        >
          <Send size={16} color="#fff" />
        </div>
      </div>
    </div>
  );
}

function Bubble({
  role,
  text,
  variant,
  gradient,
  caret,
}: {
  role: 'user' | 'assistant';
  text: string;
  variant: 'ai' | 'telegram';
  gradient: [string, string];
  caret?: boolean;
}) {
  const isUser = role === 'user';
  const isTelegram = variant === 'telegram';

  const userBg = isTelegram ? '#2B5278' : `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`;
  const botBg = isTelegram ? '#182533' : 'rgba(255,255,255,0.07)';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      style={{ animation: 'chatBubbleIn 0.28s cubic-bezier(0.16,1,0.3,1)' }}
    >
      <div
        className="max-w-[82%] px-3.5 py-2.5 text-[13.5px] leading-relaxed whitespace-pre-wrap break-words text-white"
        style={{
          background: isUser ? userBg : botBg,
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          border: isUser ? 'none' : '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {text}
        {caret && (
          <span
            className="inline-block w-[2px] h-[1em] ml-0.5 align-middle"
            style={{ background: '#fff', animation: 'caretBlink 0.9s step-end infinite' }}
          />
        )}
        {isUser && isTelegram && (
          <span className="inline-flex items-center ml-1.5 align-middle text-sky-300/70">
            <CheckCheck size={13} />
          </span>
        )}
        {isUser && !isTelegram && (
          <span className="inline-flex items-center ml-1.5 align-middle text-white/40">
            <Check size={12} />
          </span>
        )}
      </div>
    </div>
  );
}

function ThinkingRow({ text, gradient }: { text: string; gradient: [string, string] }) {
  return (
    <div className="flex justify-start" style={{ animation: 'chatBubbleIn 0.25s ease-out' }}>
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] italic"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'var(--text-secondary)' }}
      >
        <span
          className="w-4 h-4 rounded-full shrink-0"
          style={{
            background: `conic-gradient(${gradient[0]}, ${gradient[1]}, transparent)`,
            animation: 'spin 0.9s linear infinite',
          }}
        />
        {text}
      </div>
    </div>
  );
}

function TypingDots({ variant }: { variant: 'ai' | 'telegram' }) {
  const isTelegram = variant === 'telegram';
  return (
    <div className="flex justify-start" style={{ animation: 'chatBubbleIn 0.2s ease-out' }}>
      <div
        className="px-4 py-3 flex items-center gap-1.5"
        style={{
          background: isTelegram ? '#182533' : 'rgba(255,255,255,0.07)',
          borderRadius: '16px 16px 16px 4px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/50"
            style={{ animation: `typingDot 1.2s ease-in-out ${i * 0.18}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
