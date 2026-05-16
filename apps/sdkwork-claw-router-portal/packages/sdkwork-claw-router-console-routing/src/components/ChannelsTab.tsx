import React, { useState, useEffect, useCallback } from 'react';
import { BusinessStateTableRow } from 'sdkwork-claw-router-commons';
import { Search, Plus, Network, Key, AlertCircle, RefreshCw, X, Layers, Cpu, ChevronLeft, ChevronRight, Sparkles, Check, Trash2, Server, MessageSquare, Image as ImageIcon, Mic, Music, Video, Volume2, PlayCircle, FilePlus2, Edit2, Ban, CheckCircle } from 'lucide-react';
import { RoutingService, protocolsList, authTypesList, knownModelVendors, prefillModels } from '../routingService';
import {
  createRoutingChannelInputFromForm,
  createRoutingChannelUpdateInputFromForm,
  resolveRoutingAuthTypeFormValue,
  resolveRoutingAuthTypeSubmitValue,
  resolveRoutingMultiProtocolFormValue,
  resolveRoutingMultiProtocolSubmitValue,
  resolveRoutingSelectFormValue,
  type RoutingChannelFormValues,
} from '../channelForm';
import type { Channel } from '../types';

type EditableChannel = Channel & { remarks?: string };
type ChannelVendorFilter = 'all' | 'OpenAI' | 'Anthropic' | 'Gemini' | 'DeepSeek' | 'Zhipu' | 'Ollama' | 'OpenRouter';
type CapabilityBadgeConfig = {
  label: string;
  icon: React.ReactNode;
  color: string;
};

type AddAccountModalProps = {
  onClose: () => void;
  onAdd: (input: RoutingChannelFormValues) => Promise<void>;
  initialData?: EditableChannel | null;
  submitting: boolean;
  submitError: string | null;
};

function getChannelErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function readFormText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function readFormInteger(formData: FormData, key: string): number {
  const value = readFormText(formData, key);
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    throw new Error(`${key} must be an integer`);
  }
  return parsed;
}

function readOptionalFormInteger(formData: FormData, key: string): string {
  return readFormText(formData, key);
}

function readRetryEnabled(formData: FormData): boolean {
  return formData.get('retryEnabled') === 'on';
}

const channelVendorTabs: Array<{ id: ChannelVendorFilter; label: string }> = [
  { id: 'all', label: '全部渠道' },
  { id: 'OpenAI', label: 'OpenAI' },
  { id: 'Anthropic', label: 'Anthropic' },
  { id: 'Gemini', label: 'Gemini' },
  { id: 'DeepSeek', label: 'DeepSeek' },
  { id: 'Zhipu', label: '智谱' },
  { id: 'Ollama', label: 'Ollama' },
  { id: 'OpenRouter', label: 'OpenRouter' },
];

const capabilityBadgeConfig: Record<string, CapabilityBadgeConfig> = {
  llm: { label: 'LLM', icon: <MessageSquare className="w-3 h-3" />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
  image: { label: '图像', icon: <ImageIcon className="w-3 h-3" />, color: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400' },
  audio: { label: '语音', icon: <Mic className="w-3 h-3" />, color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
  music: { label: '音乐', icon: <Music className="w-3 h-3" />, color: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' },
  sfx: { label: '音效', icon: <Volume2 className="w-3 h-3" />, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400' },
  video: { label: '视频', icon: <Video className="w-3 h-3" />, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' },
};

function AddAccountModal({ onClose, onAdd, initialData, submitting, submitError }: AddAccountModalProps) {
  const isInitialMount = React.useRef(true);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>(
    resolveRoutingMultiProtocolFormValue(initialData?.protocol, protocolsList, ['OpenAI'])
  );
  const [activeAuthType, setActiveAuthType] = useState(resolveRoutingAuthTypeFormValue(initialData?.accessType, authTypesList));
  const [showMoreAuth, setShowMoreAuth] = useState(false);

  const [modelVendor, setModelVendor] = useState(resolveRoutingSelectFormValue(initialData?.vendor, knownModelVendors, 'OpenAI')); // Right side Model Vendor
  const [whitelist, setWhitelist] = useState<string[]>(initialData?.models || []);
  const [capabilities, setCapabilities] = useState<string[]>(initialData?.capabilities || ['llm']);
  const [customModel, setCustomModel] = useState('');

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (initialData) return;
    }
    if (modelVendor && prefillModels[modelVendor as keyof typeof prefillModels]) {
      setWhitelist(prefillModels[modelVendor as keyof typeof prefillModels].slice(0, 5));
    }
  }, [modelVendor, initialData]);

  const toggleCapability = (cap: string) => {
    setCapabilities(prev => prev.includes(cap) ? prev.filter(c => c !== cap) : [...prev, cap]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) {
      return;
    }
    const formData = new FormData(e.target as HTMLFormElement);
    const secretRef = readFormText(formData, 'authKey');
    const input: RoutingChannelFormValues = {
      name: readFormText(formData, 'name'),
      vendor: modelVendor,
      protocol: resolveRoutingMultiProtocolSubmitValue(selectedProtocols, protocolsList),
      accessType: resolveRoutingAuthTypeSubmitValue(activeAuthType, authTypesList),
      baseUrl: readFormText(formData, 'baseUrl') || initialData?.baseUrl || '',
      secretRef,
      capabilities,
      models: whitelist,
      timeoutMs: readOptionalFormInteger(formData, 'timeoutMs'),
      retryEnabled: readRetryEnabled(formData),
      retryMaxAttempts: readOptionalFormInteger(formData, 'retryMaxAttempts'),
      retryableStatusCodes: readFormText(formData, 'retryableStatusCodes'),
      retryBackoffMs: readOptionalFormInteger(formData, 'retryBackoffMs'),
      weight: readFormInteger(formData, 'weight'),
      status: initialData?.status || 'active',
    };
    await onAdd(input);
  };

  const fillRelatedModels = () => {
    setWhitelist(prefillModels[modelVendor as keyof typeof prefillModels] || []);
  };

  const addCustomModel = () => {
    if (customModel.trim() && !whitelist.includes(customModel.trim())) {
      setWhitelist([...whitelist, customModel.trim()]);
      setCustomModel('');
    }
  };

  const removeModel = (m: string) => {
    setWhitelist(whitelist.filter(x => x !== m));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto w-full animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={submitting ? undefined : onClose}></div>
      <div className="relative bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden flex flex-col my-4 h-[95vh] z-10 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] shrink-0">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-wide flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-500" />{initialData ? "编辑渠道账号" : "添加渠道账号"}
          </h3>
          <button type="button" onClick={onClose} disabled={submitting} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden h-full">
          <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto">
            {/* LEFT COLUMN: Basic Config */}
            <div className="flex-1 p-5 space-y-5 lg:border-r border-slate-200 dark:border-white/10 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">账号名称</label>
                  <input required name="name" type="text" placeholder="请输入名称" defaultValue={initialData?.name} className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">备注 <span className="text-slate-400 text-xs ml-1 font-normal">可选</span></label>
                  <input name="remarks" type="text" placeholder="请输入备注" defaultValue={initialData?.remarks} className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors" />
                </div>
              </div>

              {/* Vendor Selector */}
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium flex items-center justify-between">
                   关联下游模型厂家
                   <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded">从模型管理库同步</span>
                </label>
                <div className="relative">
                  <select
                    value={modelVendor}
                    onChange={e => setModelVendor(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm font-medium focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white shadow-sm appearance-none transition-colors"
                  >
                    {knownModelVendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                    {!knownModelVendors.some((vendor) => vendor.id === modelVendor) && (
                      <option value={modelVendor}>{modelVendor}</option>
                    )}
                  </select>
                  <ChevronRight className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">
                  支持的协议 <span className="text-slate-400 text-xs ml-1 font-normal">(多选)</span>
                </label>
                <div className="flex flex-wrap gap-2 bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/5 rounded-lg p-2">
                  {protocolsList.map(p => {
                    const isSelected = selectedProtocols.includes(p.id);
                    return (
                      <label key={p.id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md cursor-pointer transition-colors text-xs ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-medium' : 'hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400'}`}>
                        <div className="relative flex items-center justify-center w-3.5 h-3.5">
                           <input
                             type="checkbox"
                             className="peer sr-only"
                             checked={isSelected}
                             onChange={(e) => {
                               if (e.target.checked) {
                                 setSelectedProtocols([...selectedProtocols, p.id]);
                               } else {
                                 if (selectedProtocols.length > 1) {
                                   setSelectedProtocols(selectedProtocols.filter(id => id !== p.id));
                                 }
                               }
                             }}
                           />
                           <div className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-slate-500 bg-white dark:bg-transparent'}`}>
                             {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                           </div>
                        </div>
                        {p.label}
                      </label>
                    );
                  })}
                  {selectedProtocols.filter((protocol) => !protocolsList.some((item) => item.id === protocol)).map((protocol) => (
                    <label key={protocol} className="flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-300 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/40">
                      <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked
                          onChange={(e) => {
                            if (!e.target.checked && selectedProtocols.length > 1) {
                              setSelectedProtocols(selectedProtocols.filter((id) => id !== protocol));
                            }
                          }}
                        />
                        <div className="flex h-3.5 w-3.5 items-center justify-center rounded-sm border border-amber-500 bg-amber-500">
                          <Check className="h-2.5 w-2.5 text-white" />
                        </div>
                      </div>
                      {protocol}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-slate-700 dark:text-slate-300 font-medium">鉴权类型</label>
                  {authTypesList.some(t => t.isSpecial) && (
                    <button type="button" onClick={() => setShowMoreAuth(!showMoreAuth)} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline">
                      {showMoreAuth ? '收起验证方式' : '更多知名 Vendor 验证 (OAuth等)'}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {authTypesList.filter(t => !t.isSpecial || showMoreAuth).map(type => {
                    const isActive = activeAuthType === type.id;
                    const icon = type.id === 'api-key' || type.id === 'claude-code' ? <Key className="w-4 h-4" /> : <Layers className="w-4 h-4" />;
                    return (
                      <button type="button" key={type.id} onClick={() => setActiveAuthType(type.id)} className={`text-left p-2.5 rounded-xl border transition-all duration-200 flex flex-col gap-1.5 ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/50' : 'bg-white dark:bg-black border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}`}>
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'}`}>
                             {icon}
                          </div>
                          <span className={`font-semibold text-[13px] ${isActive ? 'text-slate-900 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>{type.title}</span>
                        </div>
                        <span className={`text-[10px] font-mono tracking-wide ${isActive ? 'text-emerald-700/70 dark:text-emerald-400/70' : 'text-slate-500'}`}>{type.desc}</span>
                      </button>
                    );
                  })}
                  {!authTypesList.some((type) => type.id === activeAuthType) && (
                    <button
                      key={activeAuthType}
                      type="button"
                      onClick={() => setActiveAuthType(activeAuthType)}
                      className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-left text-xs text-amber-800 transition-all dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
                    >
                      <Key className="h-4 w-4" />
                      <span>
                        <span className="block font-semibold">{activeAuthType}</span>
                        <span className="text-[10px] opacity-80">Custom backend auth type</span>
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Base URL <span className="text-slate-400 text-xs ml-1 font-normal">可选</span></label>
                    <input type="url" name="baseUrl" placeholder="https://api.openai.com/v1" defaultValue={initialData?.baseUrl} className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors" />
                 </div>
                 <div>
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">鉴权凭证 *</label>
                    <input required={!initialData?.id} type="text" name="authKey" placeholder="vault://providers/openai/main" defaultValue="" className="w-full font-mono bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors" />
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">流控权重</label>
                  <input required name="weight" type="number" min="1" max="10000" defaultValue={initialData?.weight ?? ""} className="w-full flex-1 bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">Timeout ms</label>
                  <input name="timeoutMs" type="number" min="1" max="600000" placeholder="60000" defaultValue={initialData?.timeoutMs ?? ""} className="w-full flex-1 bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="border border-slate-200 dark:border-white/10 rounded-xl p-4 bg-slate-50 dark:bg-[#121212]">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  <input
                    name="retryEnabled"
                    type="checkbox"
                    defaultChecked={Boolean(initialData?.retryPolicy)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Retry policy
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Max attempts</label>
                    <input name="retryMaxAttempts" type="number" min="1" max="5" defaultValue={initialData?.retryPolicy?.maxAttempts ?? 3} className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">HTTP statuses</label>
                    <input name="retryableStatusCodes" type="text" placeholder="429, 500, 502, 503, 504" defaultValue={initialData?.retryPolicy?.retryableStatusCodes.join(', ') ?? '429, 500, 502, 503, 504'} className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Backoff ms</label>
                    <input name="retryBackoffMs" type="number" min="0" max="2000" defaultValue={initialData?.retryPolicy?.backoffMs ?? 0} className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 focus:border-emerald-500 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2 font-medium">模型能力 (多模态)</label>
                <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'llm', label: 'LLM 生成', icon: <MessageSquare className="w-3.5 h-3.5" /> },
                    { id: 'image', label: '图像生成', icon: <ImageIcon className="w-3.5 h-3.5" /> },
                    { id: 'audio', label: '语音', icon: <Mic className="w-3.5 h-3.5" /> },
                    { id: 'music', label: '音乐', icon: <Music className="w-3.5 h-3.5" /> },
                    { id: 'sfx', label: '音效', icon: <Volume2 className="w-3.5 h-3.5" /> },
                    { id: 'video', label: '视频生成', icon: <Video className="w-3.5 h-3.5" /> },
                  ].map(cap => {
                    const isChecked = capabilities.includes(cap.id);
                    return (
                      <button
                        type="button"
                        key={cap.id}
                        onClick={() => toggleCapability(cap.id)}
                        className={`flex justify-center items-center gap-1.5 p-1.5 rounded-lg border text-xs transition-all ${isChecked ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400 font-medium' : 'bg-white dark:bg-[#1e1e1e] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'}`}
                      >
                        {cap.icon}
                        <span className="whitespace-nowrap">{cap.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Model Configuration */}
            <div className="flex-1 px-6 py-4 bg-slate-50 dark:bg-transparent overflow-y-auto custom-scrollbar flex flex-col h-[70vh] lg:h-auto">
              <div className="mb-4 shrink-0">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">模型白名单</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">按当前通道契约绑定可用模型池；全局映射规则请在路由与负载均衡中配置。</p>
              </div>

              <div className="flex flex-col flex-1 h-full min-h-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 bg-white dark:bg-black p-4 rounded-xl border border-slate-200 dark:border-white/10 overflow-y-auto max-h-[300px]">
                  {whitelist.map(model => (
                    <div key={model} className="flex justify-between items-center bg-slate-50 dark:bg-[#1e1e1e] border border-slate-100 dark:border-white/5 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 group">
                      <span className="flex items-center gap-2 truncate pr-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{model}</span>
                      </span>
                      <button type="button" onClick={() => removeModel(model)} className="text-slate-400 hover:text-red-500 transition-colors shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {whitelist.length === 0 && <div className="col-span-2 text-slate-500 text-sm text-center py-8">至少添加一个模型后才能保存</div>}
                </div>

                <div className="mt-auto space-y-4 shrink-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">{whitelist.length} 个模型</span>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={fillRelatedModels} className="border border-indigo-500 text-indigo-500 dark:border-indigo-500/50 dark:text-indigo-400 px-4 py-2 rounded-lg text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors font-medium">应用默认白名单</button>
                    <button type="button" onClick={() => setWhitelist([])} className="border border-red-500 text-red-500 dark:border-red-500/50 dark:text-red-400 px-4 py-2 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors font-medium">清除所有</button>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-white/10">
                    <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">自定义追加</label>
                    <div className="flex gap-2">
                       <input value={customModel} onChange={e => setCustomModel(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomModel())} className="flex-1 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500" placeholder="输入自定义模型名称" />
                       <button type="button" onClick={addCustomModel} className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-200 dark:border-emerald-500/20 px-6 py-2 rounded-lg text-sm hover:bg-emerald-100 dark:hover:bg-emerald-500/20 font-medium transition-colors">添加</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 rounded-b-2xl">
            {submitError && (
              <div role="alert" className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400 sm:mr-auto">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}
            <button type="button" onClick={onClose} disabled={submitting} className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              取消
            </button>
            <button type="submit" disabled={submitting} aria-busy={submitting} className="px-8 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
              {initialData ? "保存修改" : "立即创建"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export function ChannelsTab() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'|'info'} | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submittingChannel, setSubmittingChannel] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [commandChannelIds, setCommandChannelIds] = useState<Set<string>>(() => new Set());
  const submittingChannelRef = React.useRef(false);
  const commandChannelIdsRef = React.useRef<Set<string>>(new Set());

  const loadChannels = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await RoutingService.fetchChannels();
      if (isActive()) {
        setChannels(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getChannelErrorMessage(error, 'Failed to load routing channels'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadChannels(() => active);
    return () => {
      active = false;
    };
  }, [loadChannels]);

  const showToast = (message: string, type: 'success'|'error'|'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const beginChannelCommand = (channelId: string): boolean => {
    if (commandChannelIdsRef.current.has(channelId)) {
      return false;
    }
    const next = new Set(commandChannelIdsRef.current);
    next.add(channelId);
    commandChannelIdsRef.current = next;
    setCommandChannelIds(next);
    return true;
  };

  const endChannelCommand = (channelId: string) => {
    const next = new Set(commandChannelIdsRef.current);
    next.delete(channelId);
    commandChannelIdsRef.current = next;
    setCommandChannelIds(next);
  };

  const isChannelCommanding = (channelId: string): boolean => commandChannelIds.has(channelId);

  const [activeTab, setActiveTab] = useState<ChannelVendorFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeTab]);

  const filteredChannels = channels.filter(c => {
    const matchesTab = activeTab === 'all' || c.vendor === activeTab;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalItems = filteredChannels.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedChannels = filteredChannels.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleAddChannel = async (input: RoutingChannelFormValues) => {
    if (submittingChannelRef.current) {
      return;
    }
    submittingChannelRef.current = true;
    setSubmittingChannel(true);
    setSubmitError(null);
    try {
      if (editingChannel?.id) {
      const updated = await RoutingService.updateChannel(editingChannel.id, createRoutingChannelUpdateInputFromForm(input));
      setChannels(prev => prev.map(c => c.id === updated.id ? updated : c));
      showToast('账号更新成功');
    } else {
      const created = await RoutingService.createChannel(createRoutingChannelInputFromForm(input));
      setChannels(prev => [created, ...prev]);
      showToast('新增账号成功');
    }
    setIsModalOpen(false);
    setEditingChannel(null);
    } catch (error) {
      setSubmitError(getChannelErrorMessage(error, 'Channel save failed'));
    } finally {
      submittingChannelRef.current = false;
      setSubmittingChannel(false);
    }
  };

  const handleCloseModal = () => {
    if (submittingChannelRef.current) {
      return;
    }
    setIsModalOpen(false);
    setEditingChannel(null);
    setSubmitError(null);
  };

  const handleCopyChannel = (channel: Channel) => {
    setSubmitError(null);
    setEditingChannel({
      ...channel,
      id: '',
      name: `${channel.name}-copy`,
      apiKey: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };
  const handleTestChannel = async (channel: Channel) => {
    if (!beginChannelCommand(channel.id)) {
      return;
    }
    try {
      const result = await RoutingService.testChannel(channel.id);
      setChannels(prev => prev.map(ch => ch.id === channel.id ? result.item : ch));
      showToast(`Channel test passed, latency ${result.latency}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Channel test failed', 'error');
    } finally {
      endChannelCommand(channel.id);
    }
  };

  const handleToggleChannelStatus = async (channel: Channel) => {
    if (!beginChannelCommand(channel.id)) {
      return;
    }
    try {
      const nextStatus = channel.status === 'active' ? 'disabled' : 'active';
      const updated = await RoutingService.setChannelStatus(channel.id, nextStatus);
      setChannels(prev => prev.map(ch => ch.id === channel.id ? updated : ch));
      showToast(channel.status === 'active' ? 'Channel disabled' : 'Channel enabled');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Channel status update failed', 'error');
    } finally {
      endChannelCommand(channel.id);
    }
  };

  const handleDeleteChannel = async (channel: Channel) => {
    if (!beginChannelCommand(channel.id)) {
      return;
    }
    try {
      const deleted = await RoutingService.deleteChannel(channel.id);
      if (deleted) {
        setChannels(prev => prev.filter(ch => ch.id !== channel.id));
        showToast('Channel deleted', 'info');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Channel delete failed', 'error');
    } finally {
      endChannelCommand(channel.id);
    }
  };

  const openCreateChannelModal = () => {
    setEditingChannel(null);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const openEditChannelModal = (channel: Channel) => {
    if (isChannelCommanding(channel.id)) {
      return;
    }
    setEditingChannel(channel);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <Network className="w-6 h-6 text-emerald-500" />
            渠道供应商账号管理
          </h2>
          <p className="text-sm text-slate-500">统一接入不同的上游模型 API 服务商，配置权重与密钥自动轮询池。</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索渠道名..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 w-full sm:w-64 text-slate-900 dark:text-white placeholder-slate-500 transition-colors shadow-sm"
            />
          </div>
          <button onClick={openCreateChannelModal} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0 shadow-lg shadow-emerald-500/20">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">添加渠道账号</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-white/10 pb-4 overflow-x-auto hide-scrollbar">
        {channelVendorTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0 border-b border-slate-200 dark:border-white/10 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">渠道服务 & 能力</th>
                <th className="px-6 py-4">厂商与接入标准</th>
                <th className="px-6 py-4 w-48">绑定模型池</th>
                <th className="px-6 py-4">流量权重</th>
                <th className="px-6 py-4">连通状态</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {loading ? (
                <BusinessStateTableRow colSpan={6} kind="loading" title="Loading routing channels..." />
              ) : loadError ? (
                <BusinessStateTableRow
                  colSpan={6}
                  kind="error"
                  title="Routing channels could not be loaded"
                  description={loadError}
                  onRetry={() => { void loadChannels(); }}
                  retryLabel="Retry"
                />
              ) : paginatedChannels.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={6}
                  kind="empty"
                  title="No routing channels found"
                  description={activeTab !== 'all' ? `No ${activeTab} channels match the current filters.` : 'Create a routing channel to start sending model traffic through the gateway.'}
                />
              ) : paginatedChannels.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group" data-command-state={isChannelCommanding(c.id) ? 'busy' : undefined}>
                  <td className="px-6 py-4 align-top">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                       {c.name}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.capabilities?.map((cap: string) => {
                        const capMapping = {
                          llm: { label: 'LLM', icon: <MessageSquare className="w-3 h-3" />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' },
                          image: { label: '图像', icon: <ImageIcon className="w-3 h-3" />, color: 'bg-pink-50 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400' },
                          audio: { label: '语音', icon: <Mic className="w-3 h-3" />, color: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400' },
                          music: { label: '音乐', icon: <Music className="w-3 h-3" />, color: 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' },
                          sfx: { label: '音效', icon: <Volume2 className="w-3 h-3" />, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400' },
                          video: { label: '视频', icon: <Video className="w-3 h-3" />, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' },
                        };
                        const info = capMapping[cap] || capabilityBadgeConfig[cap];
                        if (!info) return null;
                        return (
                          <span key={cap} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap ${info.color}`}>
                            {info.icon} {info.label}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col gap-1.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200 text-sm flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-slate-400" /> {c.vendor}</span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                         <Layers className="w-3.5 h-3.5" /> <span>{c.protocol}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                         <Key className="w-3.5 h-3.5" /> <span>{c.accessType}</span>
                      </div>
                      {(c.timeoutMs || c.retryPolicy) && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                           <RefreshCw className="w-3.5 h-3.5" />
                           <span>{c.timeoutMs ? `${c.timeoutMs}ms` : 'default timeout'}{c.retryPolicy ? `, retry ${c.retryPolicy.maxAttempts}x` : ''}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-top">
                     <div className="flex flex-wrap gap-1.5">
                       {c.models.slice(0, 3).map((m: string, i: number) => (
                         <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-xs font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">{m}</span>
                       ))}
                       {c.models.length > 3 && (
                         <span className="px-1.5 py-0.5 rounded bg-slate-50 dark:bg-black text-[10px] font-mono text-slate-500 border border-dashed border-slate-200 dark:border-white/10">+{c.models.length - 3}</span>
                       )}
                     </div>
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-slate-700 dark:text-slate-300 align-top">{c.weight}</td>
                  <td className="px-6 py-4 align-top">
                    {c.status === 'active' ? (
                       <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium"><RefreshCw className="w-3.5 h-3.5"/> 健康</span>
                    ) : (
                       <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-medium"><AlertCircle className="w-3.5 h-3.5"/> {c.errors} 连通错误</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right align-middle">
                    <fieldset disabled={isChannelCommanding(c.id)} className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50" aria-busy={isChannelCommanding(c.id)}>
                      <button title="测试连通性" className="p-1.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded transition-colors" onClick={() => { void handleTestChannel(c); }}>
                        <PlayCircle className="w-4 h-4" />
                      </button>
                      <button title="Clone channel" className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded transition-colors" onClick={() => { void handleCopyChannel(c); }}>
                        <FilePlus2 className="w-4 h-4" />
                      </button>
                      <button title="编辑账号" className="p-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors" onClick={() => { setEditingChannel(c); setIsModalOpen(true); }}>
                         <Edit2 className="w-4 h-4" />
                      </button>
                      <button title={c.status === 'active' ? '禁用账号' : '启用账号'} className="p-1.5 text-amber-600 hover:text-amber-700 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded transition-colors" onClick={() => { void handleToggleChannelStatus(c); }}>
                        {c.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button title="删除账号" className="p-1.5 text-red-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors" onClick={() => { void handleDeleteChannel(c); }}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </fieldset>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#121212] flex items-center justify-between">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            共 <span className="font-medium text-slate-900 dark:text-white">{totalItems}</span> 个渠道账号
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              第 {currentPage} 页 <span className="text-slate-400 dark:text-slate-500 font-normal">/ 共 {totalPages} 页</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                title="上一页"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:text-slate-400 dark:hover:text-emerald-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
                title="下一页"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <AddAccountModal
          onClose={handleCloseModal}
          onAdd={handleAddChannel}
          initialData={editingChannel}
          submitting={submittingChannel}
          submitError={submitError}
        />
      )}
    </div>
  );
}
