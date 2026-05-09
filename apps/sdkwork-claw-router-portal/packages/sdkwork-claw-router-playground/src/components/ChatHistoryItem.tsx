import { Image as ImageIcon, Video, Music, Headphones, FileAudio, Edit3, RefreshCw } from 'lucide-react';
import { VideoMessageItem, MusicMessageItem, ImagesMessageItem, AudioMessageItem } from './MessageItems';
import type { PlaygroundHistoryItem, PlaygroundPreviewSetter } from '../playgroundTypes';

export function ChatHistoryItem({ item, setPreviewItem, isCompact = false }: { item: PlaygroundHistoryItem, setPreviewItem: PlaygroundPreviewSetter, isCompact?: boolean }) {
  const isImage = item.type === 'images' || item.type === 'image';
  const isVideo = item.type === 'video';
  const typeLabel = isImage ? '图片生成' : isVideo ? '视频生成' : item.type === 'music' ? '音乐生成' : item.type === 'audio' ? '语音合成' : '音效生成';
  const typeIcon = isImage ? <ImageIcon className="w-3.5 h-3.5" /> : isVideo ? <Video className="w-3.5 h-3.5" /> : item.type === 'music' ? <Music className="w-3.5 h-3.5" /> : item.type === 'audio' ? <Headphones className="w-3.5 h-3.5" /> : <FileAudio className="w-3.5 h-3.5" />;

  return (
    <div className="flex flex-col gap-2 group">
      {/* Header Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1.5 text-white font-bold text-[13px]">
             {typeIcon}
             {typeLabel}
           </div>
           <div className="w-px h-3 bg-white/20 mx-1" />
           <div className="bg-[#222] border border-white/5 px-2 py-0.5 rounded text-[10px] text-slate-300 font-medium tracking-wide">
             {item.modelInfo?.split('|')[0]?.trim()}
           </div>
           <div className="bg-[#222] border border-white/5 px-2 py-0.5 rounded text-[10px] text-slate-300 font-medium tracking-wide">
             {item.modelInfo?.split('|')[1]?.trim() || "默认设置"}
           </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors">
              <Edit3 className="w-3.5 h-3.5" />
           </button>
           <button className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>

      {/* Prompt Text */}
      <p className="text-[13px] leading-relaxed text-slate-300 line-clamp-3 hover:line-clamp-none transition-all cursor-pointer mt-0.5">
         {item.prompt}
      </p>

      {/* Media Content */}
      <div className="mt-1">
         {item.type === 'video' && <VideoMessageItem item={item} setPreviewItem={setPreviewItem} />}
         {item.type === 'music' && <MusicMessageItem item={item} setPreviewItem={setPreviewItem} />}
         {item.type === 'images' && <ImagesMessageItem item={item} setPreviewItem={setPreviewItem} />}
         {item.type === 'audio' && <AudioMessageItem item={item} setPreviewItem={setPreviewItem} />}
         {item.type === 'sfx' && <AudioMessageItem item={item} setPreviewItem={setPreviewItem} />}
      </div>
   </div>
  );
}
