import { Check, RectangleHorizontal, RectangleVertical, Square } from 'lucide-react';
import {
  DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG,
  type SdkworkGenerationVideoModeConfig,
} from '@sdkwork/generation-pc-react/react';
import { GenerationModePopupBase, type ConfigSection } from './GenerationModePopupBase';

export type VideoGenerationConfig = SdkworkGenerationVideoModeConfig;

const VIDEO_SECTIONS = [
  {
    id: 'resolution',
    label: '生成模式',
    type: 'select' as const,
    valueKey: 'resolution',
    options: [
      { value: '720p', label: '720p' },
      { value: '1080p', label: '1080p', isVip: true },
      { value: '4k', label: '4K', isVip: true },
    ],
  },
  {
    id: 'duration',
    label: '生成时长',
    type: 'slider' as const,
    valueKey: 'duration',
    min: 3,
    max: 15,
    step: 1,
    unit: 's',
  },
  {
    id: 'aspectRatio',
    label: '视频比例',
    type: 'select' as const,
    valueKey: 'aspectRatio',
    options: [
      { value: '16:9', label: '16:9', icon: <RectangleHorizontal className="h-4 w-6" /> },
      { value: '1:1', label: '1:1', icon: <Square className="h-4 w-4" /> },
      { value: '9:16', label: '9:16', icon: <RectangleVertical className="h-6 w-4" /> },
    ],
  },
  {
    id: 'count',
    label: '生成数量',
    type: 'select' as const,
    valueKey: 'count',
    options: [
      { value: 1, label: '1' },
      { value: 2, label: '2', isVip: true },
      { value: 3, label: '3', isVip: true },
      { value: 4, label: '4', isVip: true },
    ],
  },
] satisfies ConfigSection<VideoGenerationConfig>[];

interface VideoGenerationModePopupProps {
  config: VideoGenerationConfig;
  onChangeConfig: (config: VideoGenerationConfig) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
  canGenerate?: boolean;
}

export function VideoGenerationModePopup({
  canGenerate = true,
  config,
  isGenerating = false,
  onChangeConfig,
  onGenerate,
}: VideoGenerationModePopupProps) {
  const getSummary = (current: VideoGenerationConfig) =>
    `${current.resolution} · ${current.duration}s · ${current.aspectRatio} · ${current.count}`;

  return (
    <GenerationModePopupBase
      canGenerate={canGenerate}
      config={config}
      getSummary={getSummary}
      isGenerating={isGenerating}
      onChangeConfig={onChangeConfig}
      onGenerate={onGenerate}
      sections={VIDEO_SECTIONS}
      title="视频生成设置"
      renderExtraControls={() => (
        <button
          type="button"
          onClick={() => onChangeConfig({ ...config, syncAudioVideo: !config.syncAudioVideo })}
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
            config.syncAudioVideo
              ? 'border-white/20 bg-white/10 text-white'
              : 'border-white/5 bg-transparent text-gray-500 hover:border-white/10'
          }`}
        >
          <Check className={`h-3.5 w-3.5 transition-opacity ${config.syncAudioVideo ? 'text-green-400 opacity-100' : 'opacity-0'}`} />
          音画同步
        </button>
      )}
    />
  );
}

export const DEFAULT_VIDEO_GENERATION_CONFIG: VideoGenerationConfig = {
  ...DEFAULT_SDKWORK_GENERATION_VIDEO_MODE_CONFIG,
};

export default VideoGenerationModePopup;
