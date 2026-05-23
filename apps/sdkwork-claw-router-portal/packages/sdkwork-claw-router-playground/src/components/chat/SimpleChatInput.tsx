import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowUp, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PlaygroundModelPicker, createFallbackModel } from '../PlaygroundModelPicker';
import { ChatApiKeySwitcher } from './ChatApiKeySwitcher';
import type { ChatApiKeyOption, SimpleChatInputSubmit } from './chatTypes';
import type { PlaygroundModelGroup, PlaygroundModelOption } from '../../playgroundTypes';

const FALLBACK_CHAT_MODEL = createFallbackModel('Chat model', 'Chat model catalog is being prepared', 'AI', 'llms', 'Claw Router');
const flatComposer = 'rounded-[26px] bg-[#1c1c20]/95 p-3 backdrop-blur-xl';

export function SimpleChatInput({
  modelGroups,
  selectedModelId,
  setSelectedModelId,
  apiKeys,
  selectedApiKeyId,
  onSelectApiKey,
  loadingApiKeys,
  loadingHistory = false,
  apiKeyError,
  onSubmit,
  submitting = false,
  onHeightChange,
}: {
  modelGroups: PlaygroundModelGroup[];
  selectedModelId: string;
  setSelectedModelId: (modelId: string) => void;
  apiKeys: ChatApiKeyOption[];
  selectedApiKeyId: string;
  onSelectApiKey: (apiKeyId: string) => void;
  loadingApiKeys: boolean;
  loadingHistory?: boolean;
  apiKeyError: string | null;
  onSubmit: (input: SimpleChatInputSubmit) => Promise<boolean> | boolean;
  submitting?: boolean;
  onHeightChange?: (heightPx: number) => void;
}) {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const composerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectedModel = useMemo(() => findChatModel(modelGroups, selectedModelId), [modelGroups, selectedModelId]);
  const realSelectedModel = selectedModel || firstChatModel(modelGroups);
  const normalizedPrompt = prompt.trim();
  const hasRealModel = Boolean(realSelectedModel);
  const selectedApiKey = apiKeys.find((apiKey) => apiKey.id === selectedApiKeyId) || apiKeys[0];
  const canSubmit = Boolean(normalizedPrompt && hasRealModel && !submitting && !loadingHistory);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    textarea.style.height = '0px';
    const nextHeight = Math.min(Math.max(textarea.scrollHeight, 88), 240);
    textarea.style.height = `${nextHeight}px`;
  }, [prompt]);

  useLayoutEffect(() => {
    const element = composerRef.current;
    if (!element) {
      return;
    }
    const reportHeight = () => {
      onHeightChange?.(Math.ceil(element.getBoundingClientRect().height));
    };
    reportHeight();
    if (typeof ResizeObserver === 'undefined') {
      return undefined;
    }
    const observer = new ResizeObserver(() => {
      reportHeight();
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [onHeightChange]);

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }
    const submitted = await onSubmit({
      prompt: normalizedPrompt,
      selectedModelId: realSelectedModel!.id,
      selectedApiKeyId: selectedApiKey?.id || '',
      apiKey: selectedApiKey?.copyableKey || '',
    });
    if (submitted) {
      setPrompt('');
    }
    textareaRef.current?.focus();
  };

  return (
    <div ref={composerRef} className={flatComposer}>
      <div className="rounded-[20px] bg-[#151519] px-4 py-3 transition-colors focus-within:bg-[#19191e]">
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => {
            setIsComposing(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && !isComposing) {
              event.preventDefault();
              void handleSubmit();
            }
          }}
          className="min-h-[88px] w-full resize-none overflow-hidden border-none bg-transparent text-[15px] leading-6 text-slate-100 outline-none placeholder:text-slate-500"
          placeholder={t('playground.chat.input.placeholder')}
        />
      </div>

      <div className="mt-2 flex flex-col gap-2 px-0.5 pb-0.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <div className="w-full max-w-[220px] shrink-0">
            <PlaygroundModelPicker
              bucket="llms"
              modelGroups={modelGroups}
              selectedModelId={realSelectedModel?.id ?? ''}
              onSelectModel={setSelectedModelId}
              showModelMenu={showModelMenu}
              setShowModelMenu={setShowModelMenu}
              fallback={FALLBACK_CHAT_MODEL}
              menuPlacement="top"
              compact
              variant="flat"
              disabled={submitting}
            />
          </div>

          <div className="w-full max-w-[136px] shrink-0">
            <ChatApiKeySwitcher
              apiKeys={apiKeys}
              selectedApiKeyId={selectedApiKeyId}
              onSelectApiKey={onSelectApiKey}
              loading={loadingApiKeys}
              error={apiKeyError}
              disabled={submitting}
            />
          </div>

          {loadingHistory && (
            <div className="flex h-10 items-center rounded-full bg-white/5 px-3 text-[11px] text-slate-500">
              {t('playground.chat.messagesLoading')}
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={!canSubmit}
          title={t('playground.chat.input.send')}
          aria-label={t('playground.chat.input.send')}
          onClick={() => {
            void handleSubmit();
          }}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
            canSubmit
              ? 'bg-white text-slate-950 shadow-[0_8px_24px_rgba(255,255,255,0.18)] hover:bg-slate-200 active:scale-95'
              : 'cursor-not-allowed bg-white/6 text-slate-600'
          }`}
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function findChatModel(groups: PlaygroundModelGroup[], modelId: string): PlaygroundModelOption | null {
  for (const group of groups) {
    const model = group.llms.find((item) => item.id === modelId);
    if (model) {
      return model;
    }
  }
  return null;
}

function firstChatModel(groups: PlaygroundModelGroup[]): PlaygroundModelOption | null {
  for (const group of groups) {
    const model = group.llms[0];
    if (model) {
      return model;
    }
  }
  return null;
}
