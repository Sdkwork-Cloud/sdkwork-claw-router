import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, Image as ImageIcon, Video, Music, Plus, ArrowUp, ChevronDown, Square, RectangleHorizontal, RectangleVertical, Sparkles, Type, Activity, Package, Smile } from 'lucide-react';
import { Modality } from '../pages/Playground';
import { PLAYGROUND_READ_ONLY_REASON, ReadOnlyPlaygroundButton } from './ReadOnlyPlaygroundControl';

export function GenerationChatInput({ modality, selectedModality, setSelectedModality }: { modality: Modality, selectedModality: Modality, setSelectedModality: (m: Modality) => void }) {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [showModalityMenu, setShowModalityMenu] = useState(false);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showRatioMenu, setShowRatioMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedModels, setSelectedModels] = useState<Record<Modality, string>>({
    agent: 'Agent Runtime',
    image: 'Image 5.0 Lite',
    video: 'Kling 1.5',
    audio: 'ElevenLabs V1',
    music: 'Suno V3.5',
    sfx: 'SFX Engine V1',
    package: 'NPM Standard'
  });

  const modelOptions: Record<Modality, string[]> = {
    agent: [t('playground.input.type.agent'), 'GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro'],
    image: ['Image 5.0', 'Image 5.0 Ultra', 'Image 2.0'],
    video: ['Video 1.5', 'Video 1.0'],
    audio: ['Voice Pro', 'Voice Lite'],
    music: ['Music 4.0', 'Music 3.0'],
    sfx: ['SFX Engine V1'],
    package: ['Package 1.0']
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setShowModalityMenu(false);
        setShowModelMenu(false);
        setShowRatioMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getModalityIcon = (m: Modality) => {
    switch(m) {
      case 'agent': return <Bot className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Smile className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
      case 'sfx': return <Activity className="w-4 h-4" />;
      case 'package': return <Package className="w-4 h-4" />;
    }
  };

  const modalityLabels: Record<Modality, string> = {
    agent: t('playground.input.type.agent'),
    image: t('playground.input.type.image'),
    video: t('playground.input.type.video'),
    audio: t('playground.input.type.audio'),
    music: t('playground.input.type.music'),
    sfx: t('playground.input.type.sfx'),
    package: t('playground.input.type.package')
  };

  const currentPlaceholder = selectedModality === 'agent' ? t('playground.input.placeholder.agent') : t('playground.input.placeholder.generic');

  return (
    <div ref={containerRef} className="w-full max-w-[1280px] relative">
      <div
        className={`w-full bg-[#1c1c1e] border border-white/10 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${
          isFocused
            ? 'rounded-[24px] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.8)]'
            : 'rounded-full p-2 cursor-text hover:border-white/20'
        }`}
        onClick={() => { if (!isFocused) setIsFocused(true); }}
      >

        {/* Unfocused Content Overlay */}
        {!isFocused && (
          <div className="flex items-center animate-in fade-in duration-200">
            <ReadOnlyPlaygroundButton className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-white/5 text-white ml-1">
               <Plus className="w-4 h-4" />
            </ReadOnlyPlaygroundButton>
            <div className="flex-1 px-3 text-[15px] text-slate-400 truncate select-none">
              {currentPlaceholder}
            </div>
            <ReadOnlyPlaygroundButton className="w-8 h-8 shrink-0 bg-white/5 text-slate-400 rounded-full flex items-center justify-center mr-1">
              <ArrowUp className="w-4 h-4" />
            </ReadOnlyPlaygroundButton>
          </div>
        )}

        {/* Focused Content */}
        {isFocused && (
          <div className="flex flex-col animate-in fade-in duration-300">
            <div className="flex gap-4">
              {/* Left Upload Square */}
              {(selectedModality === 'image' || selectedModality === 'video' || selectedModality === 'agent') && (
                <ReadOnlyPlaygroundButton className="w-[72px] h-[96px] shrink-0 bg-[#252528] border border-dashed border-white/10 rounded-xl flex items-center justify-center">
                  <Plus className="w-6 h-6 text-slate-500" />
                </ReadOnlyPlaygroundButton>
              )}

              {/* Right Textarea */}
              <div className="flex-1 relative">
                 <textarea
                   autoFocus
                   value={prompt}
                   onChange={e => setPrompt(e.target.value)}
                   className="w-full h-[96px] bg-transparent border-none text-[15px] leading-relaxed text-white placeholder:text-slate-500 focus:outline-none resize-none"
                   placeholder={currentPlaceholder}
                 />
              </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-wrap items-center gap-2">
                 {/* Modality Switcher Dropdown */}
                 <div className="relative">
                   <button
                     onClick={(e) => { e.stopPropagation(); setShowModalityMenu(!showModalityMenu); setShowRatioMenu(false); }}
                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors border border-transparent border-white/5 ${showModalityMenu ? 'bg-[#2a2a2d] text-white' : 'bg-[#252528] hover:bg-[#2a2a2d] text-slate-300'}`}
                   >
                     {getModalityIcon(selectedModality)}
                     <span>{modalityLabels[selectedModality]}</span>
                     <ChevronDown className="w-3.5 h-3.5 text-slate-400 opacity-80" />
                   </button>

                   {/* Modality Menu Popup */}
                   {showModalityMenu && (
                     <div className="absolute bottom-[calc(100%+8px)] left-0 w-48 bg-[#252528] rounded-xl border border-white/10 shadow-2xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 origin-bottom-left z-50">
                        <div className="px-3 py-2 text-[11px] text-slate-500 tracking-wider">{t("playground.input.menu.type")}</div>
                        {(Object.keys(modalityLabels) as Modality[]).filter(t => t !== 'package').map(type => (
                          <button
                            key={type}
                            onClick={() => { setSelectedModality(type); setShowModalityMenu(false); }}
                            className="w-full px-3 py-2 text-left flex items-center justify-between text-sm text-slate-200 hover:bg-white/5 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                               {getModalityIcon(type)}
                               <span>{modalityLabels[type]}</span>
                            </div>
                            {selectedModality === type && <div className="w-4 h-4 flex items-center justify-center shrink-0"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><polyline points="20 6 9 17 4 12"></polyline></svg></div>}
                          </button>
                        ))}
                     </div>
                   )}
                 </div>

                 {/* Model Selector */}
                 <div className="relative">
                   <button
                     onClick={(e) => { e.stopPropagation(); setShowModelMenu(!showModelMenu); setShowModalityMenu(false); setShowRatioMenu(false); }}
                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors border border-transparent border-white/5 ${showModelMenu ? 'bg-[#2a2a2d] text-white' : 'bg-[#252528] hover:bg-[#2a2a2d] text-slate-300'}`}
                   >
                     <div className="w-3.5 h-3.5 rounded-[3px] border border-current opacity-70 flex items-center justify-center p-0.5">
                        <div className="w-full h-full bg-current rounded-[1px]" />
                     </div>
                     <span>{selectedModels[selectedModality]}</span>
                     <ChevronDown className="w-3.5 h-3.5 text-slate-400 opacity-80" />
                   </button>

                   {/* Model Menu Popup */}
                   {showModelMenu && selectedModality !== 'package' && (
                     <div className="absolute bottom-[calc(100%+8px)] left-0 w-48 bg-[#252528] rounded-xl border border-white/10 shadow-2xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 origin-bottom-left z-50">
                        <div className="px-3 py-2 text-[11px] text-slate-500 tracking-wider">{t("playground.input.menu.model")}</div>
                        {modelOptions[selectedModality].map(model => (
                          <button
                            key={model}
                            onClick={() => { setSelectedModels({...selectedModels, [selectedModality]: model}); setShowModelMenu(false); }}
                            className="w-full px-3 py-2 text-left flex items-center justify-between text-sm text-slate-200 hover:bg-white/5 transition-colors"
                          >
                            <span>{model}</span>
                            {selectedModels[selectedModality] === model && <div className="w-4 h-4 flex items-center justify-center shrink-0"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><polyline points="20 6 9 17 4 12"></polyline></svg></div>}
                          </button>
                        ))}
                     </div>
                   )}
                 </div>

                 {/* Ratio/Resolution Switcher (For Image/Video) */}
                 {(selectedModality === 'image' || selectedModality === 'video') && (
                   <div className="relative">
                     <button
                       onClick={(e) => { e.stopPropagation(); setShowRatioMenu(!showRatioMenu); setShowModalityMenu(false); }}
                       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors border border-transparent border-white/5 ${showRatioMenu ? 'bg-[#2a2a2d] text-white' : 'bg-[#252528] hover:bg-[#2a2a2d] text-slate-300'}`}
                     >
                       <Square className="w-3.5 h-3.5 opacity-70" />
                       <span>1:1<span className="opacity-40 mx-1.5">|</span>{t("playground.input.ratio.hd")}</span>
                     </button>

                     {/* Ratio Menu Popup */}
                     {showRatioMenu && (
                       <div className="absolute bottom-[calc(100%+8px)] left-0 w-[420px] bg-[#252528] rounded-2xl border border-white/10 shadow-2xl p-5 animate-in fade-in zoom-in-95 origin-bottom-left z-50">
                          <div className="text-xs text-slate-500 mb-3">{t("playground.input.ratio.label")}</div>
                          <div className="flex justify-between items-center bg-[#1c1c1e] p-1.5 rounded-xl border border-white/5 mb-5">
                            {[
                              { id: 'free', icon: <div className="w-4 h-4 border border-current rounded-[3px] flex items-center justify-center"><div className="w-2 h-2 border border-current border-dashed rounded-[1px]"/></div>, label: t('playground.input.ratio.auto') },
                              { id: '21:9', icon: <RectangleHorizontal className="w-4 h-3" />, label: '21:9' },
                              { id: '16:9', icon: <RectangleHorizontal className="w-4 h-3" />, label: '16:9' },
                              { id: '3:2', icon: <RectangleHorizontal className="w-4 h-3.5" />, label: '3:2' },
                              { id: '4:3', icon: <RectangleHorizontal className="w-4 h-3.5" />, label: '4:3' },
                              { id: '1:1', icon: <Square className="w-4 h-4" />, label: '1:1', active: true },
                              { id: '3:4', icon: <RectangleVertical className="w-3.5 h-4" />, label: '3:4' },
                              { id: '2:3', icon: <RectangleVertical className="w-3.5 h-4" />, label: '2:3' },
                              { id: '9:16', icon: <RectangleVertical className="w-3 h-4" />, label: '9:16' }
                            ].map(ratio => (
                              <button key={ratio.id} className={`flex flex-col items-center justify-center gap-1.5 w-10 h-12 rounded-lg transition-colors ${ratio.active ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                                 {ratio.icon}
                                 <span className="text-[10px] scale-90 origin-bottom font-medium">{ratio.label}</span>
                              </button>
                            ))}
                          </div>

                          <div className="text-xs text-slate-500 mb-3">{t("playground.input.resolution.label")}</div>
                          <div className="grid grid-cols-2 gap-2 mb-5">
                             <button className="py-2.5 bg-white/10 text-white text-sm font-medium rounded-xl transition-colors border border-transparent border-white/5">{t("playground.input.ratio.hd")}</button>
                             <button className="py-2.5 bg-[#1c1c1e] text-slate-500 hover:text-slate-300 text-sm font-medium rounded-xl transition-colors border border-white/5 flex items-center justify-center gap-1">{t("playground.input.ratio.uhd")} <Sparkles className="w-3.5 h-3.5 text-cyan-400" /></button>
                          </div>

                          <div className="text-xs text-slate-500 mb-2">{t("playground.input.size.label")}</div>
                          <div className="flex items-center gap-3">
                             <div className="flex-1 bg-[#1c1c1e] border border-white/5 rounded-xl px-4 py-2.5 flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-mono">W</span>
                                <span className="text-sm text-white font-mono">2048</span>
                             </div>
                             <div className="text-slate-600"><Plus className="w-3.5 h-3.5 border-2 rounded-full opacity-50" /></div>
                             <div className="flex-1 bg-[#1c1c1e] border border-white/5 rounded-xl px-4 py-2.5 flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-mono">H</span>
                                <span className="text-sm text-white font-mono">2048</span>
                             </div>
                             <span className="text-xs text-slate-400 font-mono ml-1 font-medium">PX</span>
                          </div>
                       </div>
                     )}
                   </div>
                 )}

                 {/* Settings / Parameters Button */}
                 <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white bg-[#252528] hover:bg-[#2a2a2d] transition-colors border border-transparent border-white/5 group">
                   <Type className="w-4 h-4 group-hover:scale-110 transition-transform" />
                 </button>

              </div>

              <div className="flex items-center gap-3">
                 <span className="text-[13px] text-slate-500 font-medium tracking-wide">
                    3<span className="hidden sm:inline">{t("playground.input.cost")}</span>
                 </span>
                 <ReadOnlyPlaygroundButton
                   className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-slate-600"
                   title={PLAYGROUND_READ_ONLY_REASON}
                 >
                   <ArrowUp className="w-4 h-4" />
                 </ReadOnlyPlaygroundButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
