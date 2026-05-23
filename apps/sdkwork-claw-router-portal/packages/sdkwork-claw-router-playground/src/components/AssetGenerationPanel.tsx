import { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, Loader2, Music, Timer, Upload, Volume2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  createDefaultSdkworkGenerationAssetConfig,
  estimateSdkworkGenerationCredits,
  findFirstSdkworkGenerationModelForModality,
  findSdkworkGenerationModelById,
  getSdkworkGenerationDurationOptions,
  reconcileSdkworkGenerationAssetConfig,
  serializeSdkworkGenerationAssetConfig,
  updateSdkworkGenerationImageModeConfig,
  updateSdkworkGenerationVideoModeConfig,
  type SdkworkGenerationAssetConfig,
  type SdkworkGenerationCreditEstimate,
} from '@sdkwork/generation-pc-react/react';
import type {
  PlaygroundGenerationSubmitInput,
  PlaygroundGenerationTargetType,
  PlaygroundModelGroup,
  PlaygroundReferenceImageInput,
} from '../playgroundTypes';
import { ImageGenerationModePopup } from './ImageGenerationModePopup';
import { VideoGenerationModePopup } from './VideoGenerationModePopup';

type AssetGenerationConfig = SdkworkGenerationAssetConfig;

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
  const [config, setConfig] = useState<AssetGenerationConfig>(() => createPlaygroundAssetConfig(modality));

  useEffect(() => {
    setConfig((current) => reconcileSdkworkGenerationAssetConfig(current, modality));
  }, [modality]);

  useEffect(() => () => {
    if (referenceImageUrlRef.current) {
      URL.revokeObjectURL(referenceImageUrlRef.current);
    }
  }, []);

  const normalizedPrompt = prompt.trim();
  const canSubmit = normalizedPrompt.length > 0 && !submitting;
  const selectedModel = findSdkworkGenerationModelById(modelGroups, selectedModelId)
    ?? findFirstSdkworkGenerationModelForModality(modelGroups, modality);
  const creditEstimate = estimateSdkworkGenerationCredits({
    config,
    modality,
    model: selectedModel,
    unavailableDetail: 'playground.generationCost.settlement',
  });

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    await onSubmitGeneration({
      prompt: normalizedPrompt,
      selectedModality: modality,
      targetType: modality,
      selectedModel: selectedModel?.id || selectedModelId || undefined,
      generationConfig: serializeSdkworkGenerationAssetConfig(config, modality),
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
            config={config}
            modality={modality}
            onChange={setConfig}
          />

          {modality === 'image' && (
            <ReferenceImageUploader
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
              referenceImageName={referenceImageName}
              referenceImageUrl={referenceImageUrl}
              uploadError={referenceUploadError}
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
  creditEstimate: SdkworkGenerationCreditEstimate;
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
    <div className="z-30 shrink-0" title={estimateDetail}>
      {modality === 'video' && config.videoMode ? (
        <VideoGenerationModePopup
          canGenerate={canSubmit}
          config={config.videoMode}
          isGenerating={submitting}
          onChangeConfig={(videoConfig) => onChangeConfig(updateSdkworkGenerationVideoModeConfig(config, videoConfig))}
          onGenerate={onSubmit}
        />
      ) : modality === 'image' && config.imageMode ? (
        <ImageGenerationModePopup
          canGenerate={canSubmit}
          config={config.imageMode}
          isGenerating={submitting}
          onChangeConfig={(imageConfig) => onChangeConfig(updateSdkworkGenerationImageModeConfig(config, imageConfig))}
          onGenerate={onSubmit}
          showCost={creditEstimate.points ?? undefined}
        />
      ) : (
        <div className="flex h-[64px] items-center gap-2 border-t border-white/10 bg-[#151515]/95 px-4 shadow-[0_-10px_20px_rgba(0,0,0,0.28)] backdrop-blur">
          <div className="min-w-0 flex-1" />

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
      )}
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
      className={`flex h-9 w-[214px] shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-lg px-3 text-sm font-bold transition-all ${
        canSubmit
          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 shadow-lg shadow-cyan-400/30'
          : 'cursor-not-allowed bg-gray-700 text-gray-500'
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
  const showDuration = modality !== 'image' && modality !== 'video';
  if (!showDuration) {
    return null;
  }

  const durationOptions = getSdkworkGenerationDurationOptions(modality);

  return (
    <div className="grid gap-3">
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
    </div>
  );
}

function createPlaygroundAssetConfig(modality: PlaygroundGenerationTargetType): AssetGenerationConfig {
  return createDefaultSdkworkGenerationAssetConfig(modality);
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

function formatPoints(value: number): string {
  return value.toLocaleString('en-US');
}
