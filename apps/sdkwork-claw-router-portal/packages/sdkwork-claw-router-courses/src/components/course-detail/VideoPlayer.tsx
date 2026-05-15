import React from 'react';
import { PlayCircle } from 'lucide-react';
import type { CourseVideoView } from '../../data';

export function VideoPlayer({ video }: { video: CourseVideoView }) {
  return (
    <div className="bg-black overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 rounded-none sm:rounded-xl aspect-video relative group w-full">
      {video.embedUrl && video.sourceProvider === 'local' ? (
        <video
          src={video.embedUrl}
          title={video.title}
          controls
          className="w-full h-full absolute inset-0 rounded-none sm:rounded-xl bg-black"
        />
      ) : video.embedUrl ? (
        <iframe
          src={video.embedUrl}
          title={video.title}
          scrolling="no"
          style={{ border: 0 }}
          allowFullScreen={true}
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full absolute inset-0 rounded-none sm:rounded-xl"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-white rounded-none sm:rounded-xl">
          <PlayCircle className="w-16 h-16 opacity-50 mb-4" />
          <p className="text-slate-300">{video.unavailableMessage}</p>
        </div>
      )}
    </div>
  );
}
