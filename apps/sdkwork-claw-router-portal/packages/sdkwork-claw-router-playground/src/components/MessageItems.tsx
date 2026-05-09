import React from 'react';
import { PlaySquare, Play } from 'lucide-react';
import { getDeterministicWaveBarStyle } from './waveform';
import type { PlaygroundHistoryItem, PlaygroundMedia, PlaygroundPreviewSetter } from '../playgroundTypes';

const getGridColsClass = (length: number) => {
  if (length === 1) return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';
  if (length === 2) return 'grid-cols-2 md:grid-cols-2 xl:grid-cols-3';
  if (length === 3) return 'grid-cols-3';
  if (length === 4) return 'grid-cols-2 md:grid-cols-4';
  if (length === 5 || length === 6) return 'grid-cols-3 md:grid-cols-3 xl:grid-cols-4';
  return 'grid-cols-4 md:grid-cols-4 xl:grid-cols-5';
};

export function VideoMessageItem({ item, setPreviewItem }: { item: PlaygroundHistoryItem, setPreviewItem: PlaygroundPreviewSetter }) {
  const videos = item.videos || (item.url ? [item.url] : []);
  const gridClass = getGridColsClass(videos.length);

  if (videos.length === 0) return null;

  return (
    <div className={`grid ${gridClass} gap-3 w-full`}>
       {videos.map((vid: PlaygroundMedia, i: number) => {
         const thumbSrc = typeof vid === 'string' ? vid : vid.thumb || vid.url;
         return (
           <div key={i} className="relative aspect-[16/9] bg-[#1a1a1a] rounded-lg overflow-hidden border border-white/5 shadow-sm group">
             <img src={thumbSrc} alt="video thumbnail" className="w-full h-full object-cover opacity-90 mx-auto transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex flex-col items-center justify-center transition-all cursor-pointer" onClick={() => setPreviewItem({ ...item, type: 'video', activeIndex: i })}>
               <PlaySquare className="w-10 h-10 text-white/90 drop-shadow-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110" />
             </div>
           </div>
         );
       })}
    </div>
  );
}

export function MusicMessageItem({ item, setPreviewItem }: { item: PlaygroundHistoryItem, setPreviewItem: PlaygroundPreviewSetter }) {
  return (
    <div className="relative w-full h-24 bg-[#1a1a1a] rounded-lg border border-white/5 shadow-sm flex items-center px-4 cursor-pointer hover:border-indigo-500/50 transition-colors" onClick={() => setPreviewItem(item)}>
       <button className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 hover:bg-indigo-600 transition-colors">
         <Play className="w-5 h-5 text-white ml-1" />
       </button>
       <div className="ml-4 flex-1 h-8 flex items-center gap-1 opacity-60">
          {[...Array(30)].map((_, i) => (
             <div key={i} className="flex-1 bg-white rounded-full" style={getDeterministicWaveBarStyle(i, 20, 80)}></div>
          ))}
       </div>
    </div>
  );
}

export function ImagesMessageItem({ item, setPreviewItem }: { item: PlaygroundHistoryItem, setPreviewItem: PlaygroundPreviewSetter }) {
  const images = item.images || [];
  const gridClass = getGridColsClass(images.length);

  if (images.length === 0) return null;

  return (
    <div className={`grid ${gridClass} gap-3 w-full`}>
       {images.map((img: string, i: number) => (
         <div key={i} className="aspect-[16/9] relative rounded-xl overflow-hidden border border-white/5 shadow-sm cursor-pointer group" onClick={() => setPreviewItem({ ...item, type: 'image', activeIndex: i })}>
            <img src={img} alt="generated" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
         </div>
       ))}
    </div>
  );
}

export function AudioMessageItem({ item, setPreviewItem }: { item: PlaygroundHistoryItem, setPreviewItem: PlaygroundPreviewSetter }) {
  return (
    <div className="relative w-full bg-gradient-to-tr from-[#111] to-[#1a1a24] rounded-lg border border-white/5 shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:border-indigo-500/50 transition-colors" onClick={() => setPreviewItem(item)}>
       <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 hover:bg-white/20 transition-colors">
         <Play className="w-4 h-4 text-white ml-0.5" />
       </button>
       <div className="flex-1">
         <div className="flex items-end gap-1 h-6">
           {[...Array(20)].map((_, i) => (
             <div key={i} className="flex-1 bg-indigo-400/80 rounded-t-sm" style={getDeterministicWaveBarStyle(i, 30, 70)}></div>
           ))}
         </div>
       </div>
       <div className="text-xs font-mono text-slate-500">0:12</div>
    </div>
  );
}
