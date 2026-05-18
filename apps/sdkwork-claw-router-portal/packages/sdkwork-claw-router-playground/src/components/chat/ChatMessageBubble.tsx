import { Bot, UserRound } from 'lucide-react';
import type { ChatMessage } from './chatTypes';

export function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const timestamp = formatChatTime(message.createdAt);
  const isPending = message.status === 'responding';
  const blocks = isPending ? [] : splitMessageBlocks(message.content);

  return (
    <div className={`flex w-full gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-cyan-300">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div className={`flex max-w-[min(760px,85%)] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
            isUser
              ? 'rounded-br-md bg-white text-slate-950'
              : isPending
                ? 'rounded-bl-md bg-white/6 text-slate-300'
                : 'rounded-bl-md bg-[#1d1d20] text-slate-100'
          }`}
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2 text-slate-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:240ms]" />
            </span>
          ) : (
            blocks.map((block, index) => (
              <div key={`${message.id}-${index}`} className={index === 0 ? '' : 'mt-3'}>
                {block.kind === 'code' ? (
                  <pre className="overflow-x-auto rounded-xl bg-black/30 px-3 py-2 text-[12px] leading-5 text-slate-100">
                    <code className="font-mono">{block.content}</code>
                  </pre>
                ) : (
                  <p className={`${isUser ? 'text-slate-950/90' : 'text-inherit'} whitespace-pre-wrap break-words`}>
                    {block.content || '\u00a0'}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
        <div className="flex max-w-full items-center gap-2 px-1 text-[11px] text-slate-500">
          {!isUser && message.vendorName && <span className="truncate">{message.vendorName}</span>}
          {!isUser && message.modelName && <span className="truncate">{message.modelName}</span>}
          <span>{timestamp}</span>
        </div>
      </div>

      {isUser && (
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-950">
          <UserRound className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}

function formatChatTime(value: string): string {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function splitMessageBlocks(content: string): Array<{ kind: 'text' | 'code'; content: string }> {
  const lines = content.split('\n');
  const blocks: Array<{ kind: 'text' | 'code'; content: string }> = [];
  let current: string[] = [];
  let inCode = false;

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        blocks.push({ kind: 'code', content: current.join('\n').trimEnd() });
        current = [];
      } else if (current.length > 0) {
        blocks.push({ kind: 'text', content: current.join('\n').trimEnd() });
        current = [];
      }
      inCode = !inCode;
      continue;
    }
    current.push(line);
  }

  if (current.length > 0) {
    blocks.push({ kind: inCode ? 'code' : 'text', content: current.join('\n').trimEnd() });
  }

  return blocks.length > 0 ? blocks : [{ kind: 'text', content }];
}
