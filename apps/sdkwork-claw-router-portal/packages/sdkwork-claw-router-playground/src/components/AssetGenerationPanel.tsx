import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, Image as ImageIcon, Loader2, Music, Plus, Timer, Upload, Volume2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type {
  PlaygroundGenerationConfig,
  PlaygroundGenerationSubmitInput,
  PlaygroundGenerationTargetType,
  PlaygroundModelGroup,
  PlaygroundModelOption,
  PlaygroundModelReferencePrice,
  PlaygroundReferenceImageInput,
} from '../playgroundTypes';
import { usePopoverDismiss } from './usePopoverDismiss';

const DEFAULT_POINTS_PER_USD = 10;

type AssetGenerationAspectRatio = '1:1' | '16:9' | '9:16';

type AssetGenerationConfig = {
  imageCount: number;
  aspectRatio: AssetGenerationAspectRatio;
  durationSeconds: number;
  quality: 'standard' | 'high';
};

type GenerationCreditEstimate = {
  points: number | null;
  detail: string;
  reference: boolean;
};

const IMAGE_COUNT_OPTIONS = [1, 2, 4] as const;

const ASPECT_RATIO_OPTIONS: Array<{
  value: AssetGenerationAspectRatio;
  labelKey: string;
}> = [
  { value: '1:1', labelKey: 'playground.aspectRatio.square' },
  { value: '16:9', labelKey: 'playground.aspectRatio.landscape' },
  { value: '9:16', labelKey: 'playground.aspectRatio.portrait' },
];

export function AssetGenerationPanel({
  modality,
  placeholderKey,
  modelGroups,
  selectedModelId,
  onSubmitGeneration,
  submitting,
  submitError,
}: {
  modality: PlaygroundGenerationTargetType;
  placeholderKey: string;
  modelGroups: PlaygroundModelGroup[];
  selectedModelId: string;
  onSubmitGeneration: (input: PlaygroundGenerationSubmitInput) => Promise<void>;
  submitting: boolean;
  submitError: string | null;
}) {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const referenceImageUrlRef = useRef<string | null>(null);
  const [referenceImageUrl, setReferenceImageUrl] = useState<string | null>(null);
  const [referenceImageName, setReferenceImageName] = useState<string | null>(null);
  const [referenceImageMetadata, setReferenceImageMetadata] = useState<PlaygroundReferenceImageInput | null>(null);
  const [referenceUploadError, setReferenceUploadError] = useState<string | null>(null);
  const [config, setConfig] = useState<AssetGenerationConfig>({
    imageCount: 1,
    aspectRatio: '1:1',
    durationSeconds: defaultDurationSeconds(modality),
    quality: 'standard',
  });
  const normalizedPrompt = prompt.trim();
  const canSubmit = normalizedPrompt.length > 0 && !submitting;
  const selectedModel = findModelById(modelGroups, selectedModelId)
    ?? firstModelForModality(modelGroups, modality);
  const creditEstimate = estimatePlaygroundGenerationCredits({
    modality,
    model: selectedModel,
    config,
  });

  useEffect(() => () => {
    if (referenceImageUrlRef.current) {
      URL.revokeObjectURL(referenceImageUrlRef.current);
    }
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }
    await onSubmitGeneration({
      prompt: normalizedPrompt,
      selectedModality: modality,
      targetType: modality,
      selectedModel: selectedModel?.id || selectedModelId || undefined,
      generationConfig: createGenerationConfig(config),
      referenceImages: referenceImageMetadata ? [referenceImageMetadata] : [],
    });
    setPrompt('');
    setReferenceUploadError(null);
    if (referenceImageUrl) {
      URL.revokeObjectURL(referenceImageUrl);
    }
    referenceImageUrlRef.current = null;
    setReferenceImageUrl(null);
    setReferenceImageName(null);
    setReferenceImageMetadata(null);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-6">
        <div className="flex flex-col gap-4">
          {submitError && (
            <div className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {submitError}
            </div>
          )}

          <div className="flex flex-col overflow-hidden rounded-lg border border-white/5 bg-[#1a1a1a] shadow-sm transition-colors focus-within:border-indigo-500/50">
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSubmit();
                }
              }}
              className="custom-scrollbar min-h-[180px] w-full resize-none bg-transparent p-4 text-sm text-white outline-none placeholder:text-slate-500"
              placeholder={t(placeholderKey)}
            />
          </div>

          <GenerationConfigControls
            modality={modality}
            config={config}
            onChange={setConfig}
          />

          {modality === 'image' && (
            <ReferenceImageUploader
              referenceImageUrl={referenceImageUrl}
              referenceImageName={referenceImageName}
              uploadError={referenceUploadError}
              onChangeReferenceImage={(nextReferenceImageUrl, nextReferenceImage) => {
                if (referenceImageUrl) {
                  URL.revokeObjectURL(referenceImageUrl);
                }
                referenceImageUrlRef.current = nextReferenceImageUrl;
                setReferenceUploadError(null);
                setReferenceImageUrl(nextReferenceImageUrl);
                setReferenceImageName(nextReferenceImage?.name ?? null);
                setReferenceImageMetadata(nextReferenceImage);
              }}
              onUploadError={setReferenceUploadError}
            />
          )}
        </div>
      </div>

      <GenerationBottomActionBar
        canSubmit={canSubmit}
        config={config}
        creditEstimate={creditEstimate}
        modality={modality}
        onChangeConfig={setConfig}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}

function GenerationBottomActionBar({
  canSubmit,
  config,
  creditEstimate,
  modality,
  onChangeConfig,
  onSubmit,
  submitting,
}: {
  canSubmit: boolean;
  config: AssetGenerationConfig;
  creditEstimate: GenerationCreditEstimate;
  modality: PlaygroundGenerationTargetType;
  onChangeConfig: (config: AssetGenerationConfig) => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
}) {
  const { t } = useTranslation();
  const estimateDetail = creditEstimate.detail.startsWith('playground.')
    ? t(creditEstimate.detail)
    : creditEstimate.detail;
  const costLabel = creditEstimate.points === null
    ? t('playground.generationCost.unavailable')
    : t('playground.generationCost.points', { points: formatPoints(creditEstimate.points) });
  const outputLabel = generationOutputLabel(modality, config, t);

  return (
    <div
      className="z-30 flex h-[64px] shrink-0 items-center gap-2 border-t border-white/10 bg-[#151515]/95 px-4 shadow-[0_-10px_20px_rgba(0,0,0,0.28)] backdrop-blur"
      title={estimateDetail}
    >
      {modality === 'image' ? (
        <ImageGenerationBottomControls config={config} onChange={onChangeConfig} />
      ) : (
        <div className="min-w-0 flex-1" />
      )}

      <div className="flex min-w-0 shrink-0 items-center justify-end gap-2">
        {creditEstimate.reference && (
          <span className="shrink-0 whitespace-nowrap rounded bg-cyan-400/10 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300">
            {t('playground.generationCost.reference')}
          </span>
        )}
        <GenerationSubmitButton
          canSubmit={canSubmit}
          costLabel={costLabel}
          onSubmit={onSubmit}
          outputLabel={outputLabel}
          submitting={submitting}
        />
      </div>
    </div>
  );
}

function GenerationSubmitButton({
  canSubmit,
  costLabel,
  onSubmit,
  outputLabel,
  submitting,
}: {
  canSubmit: boolean;
  costLabel: string;
  onSubmit: () => Promise<void>;
  outputLabel: string;
  submitting: boolean;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      disabled={!canSubmit}
      onClick={() => {
        void onSubmit();
      }}
      className={`flex h-9 w-[214px] shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-bold transition-colors ${
        canSubmit
          ? 'bg-white text-black hover:bg-slate-200'
          : 'cursor-not-allowed bg-white/10 text-slate-500'
      }`}
    >
      {submitting ? (
        <span className="flex w-full items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </span>
      ) : (
        <>
          <span className="shrink-0">{t('playground.generate')}</span>
          <span className="min-w-0 flex-1 truncate text-center text-xs font-semibold opacity-75">{outputLabel}</span>
          <span className="shrink-0 text-xs font-bold">{costLabel}</span>
        </>
      )}
    </button>
  );
}

function ReferenceImageUploader({
  referenceImageUrl,
  referenceImageName,
  uploadError,
  onChangeReferenceImage,
  onUploadError,
}: {
  referenceImageUrl: string | null;
  referenceImageName: string | null;
  uploadError: string | null;
  onChangeReferenceImage: (referenceImageUrl: string | null, referenceImage: PlaygroundReferenceImageInput | null) => void;
  onUploadError: (message: string | null) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border border-white/5 bg-[#1a1a1a] p-2">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/5 bg-[#202020]">
          {referenceImageUrl ? (
            <img
              src={referenceImageUrl}
              alt={t('playground.referenceAssets')}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-5 w-5 text-slate-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-slate-300">
            {referenceImageName || t('playground.referenceAssets')}
          </div>
          <label className="mt-1 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-white/5 bg-[#222] px-2.5 text-xs font-semibold text-slate-300 transition-colors hover:border-white/10 hover:text-white">
            <Upload className="h-3.5 w-3.5" />
            <span className="whitespace-nowrap">{t('playground.referenceImage.upload')}</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.currentTarget.files?.[0];
                if (file) {
                  void readReferenceImageDataUrl(file)
                    .then((referenceImageDataUrl) => {
                      onChangeReferenceImage(URL.createObjectURL(file), {
                        name: file.name,
                        mimeType: file.type,
                        sizeBytes: file.size,
                        dataUrl: referenceImageDataUrl,
                      });
                    })
                    .catch((error) => {
                      const message = error instanceof Error && error.message !== 'playground.referenceImage.readFailed'
                        ? error.message
                        : t('playground.referenceImage.readFailed');
                      onUploadError(message);
                    });
                }
                event.currentTarget.value = '';
              }}
            />
          </label>
        </div>
        {referenceImageUrl && (
          <button
            type="button"
            onClick={() => onChangeReferenceImage(null, null)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/5 bg-[#222] text-slate-400 transition-colors hover:border-red-400/30 hover:text-red-200"
            title={t('playground.referenceImage.remove')}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {uploadError && (
        <div className="mt-2 text-xs text-red-300">{uploadError}</div>
      )}
    </div>
  );
}

function ImageGenerationBottomControls({
  config,
  onChange,
}: {
  config: AssetGenerationConfig;
  onChange: (config: AssetGenerationConfig) => void;
}) {
  const { t } = useTranslation();
  const [openPopover, setOpenPopover] = useState<'ratio' | 'count' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  usePopoverDismiss(containerRef, openPopover !== null, () => setOpenPopover(null));

  return (
    <div ref={containerRef} className="flex min-w-0 flex-1 items-center gap-1.5">
      <div className="relative shrink-0">
        <button
          type="button"
          aria-expanded={openPopover === 'ratio'}
          onClick={() => setOpenPopover(openPopover === 'ratio' ? null : 'ratio')}
          className="flex h-9 items-center gap-1 whitespace-nowrap rounded-lg border border-white/5 bg-[#202020] px-2 text-xs font-semibold text-slate-300 transition-colors hover:border-white/10 hover:text-white"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span className="sr-only">{t('playground.action.ratio')}</span>
          <span className="font-mono text-cyan-200">{config.aspectRatio}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
        </button>
        {openPopover === 'ratio' && (
          <GenerationPopover>
            {ASPECT_RATIO_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange({ ...config, aspectRatio: option.value });
                  setOpenPopover(null);
                }}
                className={`flex h-8 w-full items-center justify-between gap-3 rounded-md px-2 text-xs font-semibold transition-colors ${
                  config.aspectRatio === option.value
                    ? 'bg-cyan-400/10 text-cyan-200'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{t(option.labelKey)}</span>
                <span className="font-mono text-slate-500">{option.value}</span>
              </button>
            ))}
          </GenerationPopover>
        )}
      </div>

      <div className="relative shrink-0">
        <button
          type="button"
          aria-expanded={openPopover === 'count'}
          onClick={() => setOpenPopover(openPopover === 'count' ? null : 'count')}
          className="flex h-9 items-center gap-1 whitespace-nowrap rounded-lg border border-white/5 bg-[#202020] px-2 text-xs font-semibold text-slate-300 transition-colors hover:border-white/10 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{t('playground.config.images', { count: config.imageCount })}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
        </button>
        {openPopover === 'count' && (
          <GenerationPopover>
            {IMAGE_COUNT_OPTIONS.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  onChange({ ...config, imageCount: count });
                  setOpenPopover(null);
                }}
                className={`flex h-8 w-full items-center gap-2 rounded-md px-2 text-xs font-semibold transition-colors ${
                  config.imageCount === count
                    ? 'bg-cyan-400/10 text-cyan-200'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                {t('playground.config.images', { count })}
              </button>
            ))}
          </GenerationPopover>
        )}
      </div>
    </div>
  );
}

function GenerationPopover({ children }: { children: ReactNode }) {
  return (
    <div className="absolute bottom-[calc(100%+8px)] left-0 z-40 min-w-[140px] rounded-lg border border-white/10 bg-[#202020] p-1 shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
      {children}
    </div>
  );
}

function readReferenceImageDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('playground.referenceImage.readFailed'));
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('playground.referenceImage.readFailed'));
    };
    reader.readAsDataURL(file);
  });
}

function GenerationConfigControls({
  modality,
  config,
  onChange,
}: {
  modality: PlaygroundGenerationTargetType;
  config: AssetGenerationConfig;
  onChange: (config: AssetGenerationConfig) => void;
}) {
  const { t } = useTranslation();
  const showDuration = modality !== 'image';
  const durationOptions = durationOptionsForModality(modality);

  return (
    <div className="grid gap-3">
      {modality === 'image' && (
        <div className="grid gap-2">
          <QualityButton config={config} onChange={onChange} />
        </div>
      )}

      {showDuration && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-400">{t('playground.duration')}</span>
            <span className="font-mono text-slate-500">{config.durationSeconds}s</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {durationOptions.map((duration) => (
              <button
                key={duration}
                type="button"
                onClick={() => onChange({ ...config, durationSeconds: duration })}
                className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                  config.durationSeconds === duration
                    ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200'
                    : 'border-white/5 bg-[#1f1f1f] text-slate-400 hover:border-white/10 hover:text-slate-200'
                }`}
              >
                {modality === 'music' ? <Music className="h-3.5 w-3.5" /> : modality === 'audio' || modality === 'sfx' ? <Volume2 className="h-3.5 w-3.5" /> : <Timer className="h-3.5 w-3.5" />}
                {duration}s
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function QualityButton({
  config,
  onChange,
}: {
  config: AssetGenerationConfig;
  onChange: (config: AssetGenerationConfig) => void;
}) {
  const { t } = useTranslation();
  const active = config.quality === 'high';
  return (
    <button
      type="button"
      onClick={() => onChange({ ...config, quality: active ? 'standard' : 'high' })}
      className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
        active
          ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-200'
          : 'border-white/5 bg-[#1f1f1f] text-slate-400 hover:border-white/10 hover:text-slate-200'
      }`}
    >
      {t('playground.config.highQuality')}
    </button>
  );
}

function generationOutputLabel(
  modality: PlaygroundGenerationTargetType,
  config: AssetGenerationConfig,
  t: (key: string, options?: Record<string, unknown>) => string,
): string {
  if (modality === 'image') {
    return t('playground.generationOutput.images', { count: config.imageCount });
  }
  return t('playground.generationOutput.items', { count: 1 });
}

function createGenerationConfig(config: AssetGenerationConfig): PlaygroundGenerationConfig {
  return {
    imageCount: config.imageCount,
    aspectRatio: config.aspectRatio,
    durationSeconds: config.durationSeconds,
    quality: config.quality,
  };
}

function estimatePlaygroundGenerationCredits({
  modality,
  model,
  config,
}: {
  modality: PlaygroundGenerationTargetType;
  model: PlaygroundModelOption | null;
  config: AssetGenerationConfig;
}): GenerationCreditEstimate {
  if (!model || model.priceAvailability.status === 'unavailable') {
    return {
      points: null,
      detail: 'playground.generationCost.settlement',
      reference: false,
    };
  }

  const price = selectReferencePrice(model.officialReferencePrices, modality)
    ?? fallbackReferencePrice(model);
  if (!price) {
    return {
      points: null,
      detail: 'playground.generationCost.settlement',
      reference: false,
    };
  }

  const unitPrice = readPositiveNumber(price.unitPrice);
  if (unitPrice === null) {
    return {
      points: null,
      detail: 'playground.generationCost.settlement',
      reference: false,
    };
  }

  const quantity = estimateMeterQuantity(price.billingMeter, modality, config);
  const points = Math.ceil(unitPrice * quantity * DEFAULT_POINTS_PER_USD);
  return {
    points,
    detail: describeCreditEstimate(price, quantity),
    reference: model.priceAvailability.status === 'reference',
  };
}

function findModelById(groups: PlaygroundModelGroup[], modelId: string): PlaygroundModelOption | null {
  for (const group of groups) {
    for (const bucket of ['llms', 'images', 'videos', 'audios', 'music', 'sfx'] as const) {
      const model = group[bucket].find((item) => item.id === modelId);
      if (model) {
        return model;
      }
    }
  }
  return null;
}

function firstModelForModality(
  groups: PlaygroundModelGroup[],
  modality: PlaygroundGenerationTargetType,
): PlaygroundModelOption | null {
  const bucket = bucketForModality(modality);
  for (const group of groups) {
    const model = group[bucket][0];
    if (model) {
      return model;
    }
  }
  return null;
}

function bucketForModality(
  modality: PlaygroundGenerationTargetType,
): 'images' | 'videos' | 'music' | 'audios' | 'sfx' {
  switch (modality) {
    case 'image':
      return 'images';
    case 'video':
      return 'videos';
    case 'music':
      return 'music';
    case 'audio':
      return 'audios';
    case 'sfx':
      return 'sfx';
  }
}

function selectReferencePrice(
  prices: readonly PlaygroundModelReferencePrice[],
  modality: PlaygroundGenerationTargetType,
): PlaygroundModelReferencePrice | null {
  const meters = metersForModality(modality);
  for (const meter of meters) {
    const price = prices.find((candidate) => candidate.billingMeter === meter);
    if (price) {
      return price;
    }
  }
  return prices[0] ?? null;
}

function fallbackReferencePrice(model: PlaygroundModelOption): PlaygroundModelReferencePrice | null {
  if (!model.officialReferenceUnitPrice || readPositiveNumber(model.officialReferenceUnitPrice) === null) {
    return null;
  }
  return {
    billingMeter: 'api_result',
    unitPrice: model.officialReferenceUnitPrice,
    currency: model.officialReferenceCurrency || 'USD',
  };
}

function metersForModality(modality: PlaygroundGenerationTargetType): string[] {
  switch (modality) {
    case 'image':
      return ['image_result', 'image_megapixel', 'image_pixel', 'image_output_token', 'api_result'];
    case 'video':
      return ['video_output_second', 'video_input_second', 'video_result', 'api_result'];
    case 'music':
      return ['music_output_second', 'audio_output_second', 'sfx_result', 'api_result'];
    case 'audio':
      return ['audio_output_second', 'audio_output_minute', 'tts_input_character', 'speech_character', 'api_result'];
    case 'sfx':
      return ['sfx_result', 'audio_output_second', 'audio_output_minute', 'api_result'];
  }
}

function estimateMeterQuantity(
  billingMeter: string,
  modality: PlaygroundGenerationTargetType,
  config: AssetGenerationConfig,
): number {
  const qualityMultiplier = config.quality === 'high' ? 1.5 : 1;
  if (billingMeter.endsWith('_minute')) {
    return Math.max(1, Math.ceil(config.durationSeconds / 60));
  }
  if (billingMeter.endsWith('_second')) {
    return Math.max(1, config.durationSeconds);
  }
  if (billingMeter === 'image_result') {
    return config.imageCount * qualityMultiplier;
  }
  if (billingMeter === 'image_megapixel') {
    return config.imageCount * estimateImagePixels(config.aspectRatio) / 1_000_000 * qualityMultiplier;
  }
  if (billingMeter === 'image_pixel') {
    return config.imageCount * estimateImagePixels(config.aspectRatio) * qualityMultiplier;
  }
  if (billingMeter === 'video_result') {
    return Math.max(1, Math.ceil(config.durationSeconds / defaultDurationSeconds('video')));
  }
  if (billingMeter === 'sfx_result') {
    return Math.max(1, modality === 'sfx' ? 1 : Math.ceil(config.durationSeconds / 30));
  }
  return 1;
}

function estimateImagePixels(aspectRatio: AssetGenerationAspectRatio): number {
  switch (aspectRatio) {
    case '16:9':
    case '9:16':
      return 1792 * 1024;
    case '1:1':
      return 1024 * 1024;
  }
}

function describeCreditEstimate(price: PlaygroundModelReferencePrice, quantity: number): string {
  return `${price.currency} ${formatDecimal(price.unitPrice)} x ${formatDecimal(quantity.toString())} ${unitLabelForMeter(price.billingMeter)}`;
}

function unitLabelForMeter(billingMeter: string): string {
  if (billingMeter.endsWith('_second')) {
    return 'sec';
  }
  if (billingMeter.endsWith('_minute')) {
    return 'min';
  }
  if (billingMeter === 'image_result') {
    return 'image';
  }
  if (billingMeter === 'video_result') {
    return 'video';
  }
  if (billingMeter === 'sfx_result') {
    return 'effect';
  }
  if (billingMeter === 'image_megapixel') {
    return 'MP';
  }
  if (billingMeter === 'image_pixel') {
    return 'px';
  }
  return 'unit';
}

function defaultDurationSeconds(modality: PlaygroundGenerationTargetType): number {
  switch (modality) {
    case 'video':
      return 5;
    case 'music':
      return 30;
    case 'audio':
      return 10;
    case 'sfx':
      return 5;
    case 'image':
      return 1;
  }
}

function durationOptionsForModality(modality: PlaygroundGenerationTargetType): number[] {
  switch (modality) {
    case 'video':
      return [5, 10, 15];
    case 'music':
      return [30, 60, 120];
    case 'audio':
      return [10, 30, 60];
    case 'sfx':
      return [3, 5, 10];
    case 'image':
      return [];
  }
}

function readPositiveNumber(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    return null;
  }
  return number;
}

function formatPoints(value: number): string {
  return value.toLocaleString('en-US');
}

function formatDecimal(value: string): string {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return value;
  }
  return number.toLocaleString('en-US', {
    maximumFractionDigits: 6,
  });
}
