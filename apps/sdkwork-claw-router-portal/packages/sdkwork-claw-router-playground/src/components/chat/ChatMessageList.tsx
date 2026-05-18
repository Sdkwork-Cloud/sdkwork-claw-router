import { useEffect, useRef } from 'react';
import { Loader2, MessageSquareText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ChatMessageBubble } from './ChatMessageBubble';
import type { ChatMessage } from './chatTypes';

export function ChatMessageList({
  messages,
  loading = false,
  error = null,
  bottomPaddingPx = 224,
}: {
  messages: ChatMessage[];
  loading?: boolean;
  error?: string | null;
  bottomPaddingPx?: number;
}) {
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);
  const bottomPaddingStyle = { paddingBottom: `${Math.max(bottomPaddingPx, 224)}px` };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [loading, messages, error]);

  if (loading && messages.length === 0) {
    return (
      <div style={bottomPaddingStyle} className="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center justify-center px-6 pt-20 text-center">
        <Loader2 className="mb-4 h-6 w-6 animate-spin text-slate-500" />
        <p className="text-sm text-slate-500">{t('playground.chat.messagesLoading')}</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div style={bottomPaddingStyle} className="mx-auto flex min-h-full w-full max-w-2xl flex-col items-center justify-center px-6 pt-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-cyan-300">
          <MessageSquareText className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-semibold text-white">{t('playground.chat.emptyTitle')}</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{t('playground.chat.emptyDescription')}</p>
        {error && <p className="mt-3 max-w-md text-xs leading-5 text-red-300">{error}</p>}
      </div>
    );
  }

  return (
    <div style={bottomPaddingStyle} className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pt-6 md:px-8">
      {loading && messages.length > 0 && (
        <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-400">
          {t('playground.chat.messagesLoading')}
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}
      {messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
