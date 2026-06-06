import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Send, Upload, X } from 'lucide-react';
import { readMediaResourceUrl } from 'sdkwork-clawrouter-pc-commons';
import type {
  CourseApplicationInput,
  CourseApplicationResult,
  CourseApplicationVideoUploadInput,
  CourseApplicationVideoUploadResult,
} from '../courseService';

type CourseApplicationDialogProps = {
  open: boolean;
  onClose: () => void;
  requireLoginForAction: () => boolean;
  onSubmit: (input: CourseApplicationInput) => Promise<CourseApplicationResult>;
  onUploadVideo: (input: CourseApplicationVideoUploadInput) => Promise<CourseApplicationVideoUploadResult>;
};

type SourceProvider = 'bilibili' | 'local';

const COURSE_APPLICATION_CATEGORIES = [
  { code: 'ai-coding', label: 'AI Coding' },
  { code: 'openclaw-agent', label: 'OpenClaw 智能体' },
  { code: 'agent-workflow', label: '智能体工作流' },
  { code: 'ai-image-creation', label: '即梦 AI 图片制作' },
  { code: 'ai-video-creation', label: '即梦 AI 视频制作' },
  { code: 'ai-short-drama', label: 'AI 短剧制作' },
  { code: 'ai-productivity', label: 'AI 办公与生产力' },
  { code: 'ai-marketing-content', label: 'AI 内容营销' },
  { code: 'ai-design-commerce', label: 'AI 设计电商' },
  { code: 'ai-data-automation', label: 'AI 数据与自动化' },
] as const;

export function CourseApplicationDialog({
  open,
  onClose,
  requireLoginForAction,
  onSubmit,
  onUploadVideo,
}: CourseApplicationDialogProps) {
  const [sourceProvider, setSourceProvider] = useState<SourceProvider>('bilibili');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [result, setResult] = useState<CourseApplicationResult | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<CourseApplicationVideoUploadResult | null>(null);

  const sourceHelp = useMemo(() => sourceProvider === 'bilibili'
    ? '填写 BVID 后平台会以内嵌播放器展示课程。'
    : '选择本地视频文件后会上传到课程视频目录，并自动用于课程申请。', [sourceProvider]);

  if (!open) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!requireLoginForAction()) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setResult(null);
    const form = new FormData(event.currentTarget);
    const application: CourseApplicationInput = {
      title: formText(form, 'title'),
      category: formText(form, 'category'),
      description: formText(form, 'description'),
      sourceProvider,
      externalBvid: sourceProvider === 'bilibili' ? formText(form, 'externalBvid') : undefined,
      video: sourceProvider === 'local' ? uploadedVideo?.video : undefined,
      contactName: formText(form, 'contactName'),
      contactEmail: formText(form, 'contactEmail'),
      notes: formText(form, 'notes'),
    };
    if (sourceProvider === 'local' && !application.video) {
      setError('请先上传本地视频教程');
      setIsSubmitting(false);
      return;
    }
    try {
      const submitted = await onSubmit(application);
      setResult(submitted);
      event.currentTarget.reset();
      setUploadedVideo(null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : '课程申请提交失败');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLocalVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!requireLoginForAction()) {
      event.currentTarget.value = '';
      return;
    }
    const file = event.currentTarget.files?.[0];
    setUploadError(null);
    setError(null);
    setUploadedVideo(null);
    if (!file) {
      return;
    }
    setIsUploadingVideo(true);
    try {
      const uploaded = await onUploadVideo({ file, fileName: file.name });
      setUploadedVideo(uploaded);
    } catch (uploadError) {
      setUploadError(uploadError instanceof Error ? uploadError.message : '本地视频上传失败');
    } finally {
      setIsUploadingVideo(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#0d1117]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-white/10">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">申请上传课程</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              支持 Bilibili 内嵌课程和本地上传视频教程。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭课程申请"
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-5 px-5 py-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>课程标题</span>
              <input
                name="title"
                required
                maxLength={200}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-[#010409] dark:text-white"
                placeholder="Claude Code 实战课"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>课程分类</span>
              <select
                name="category"
                required
                defaultValue="ai-coding"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-[#010409] dark:text-white"
              >
                {COURSE_APPLICATION_CATEGORIES.map((category) => (
                  <option key={category.code} value={category.code}>{category.label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>课程说明</span>
            <textarea
              name="description"
              required
              maxLength={2000}
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-[#010409] dark:text-white"
              placeholder="适合在线学习的 Claude Code 入门课程"
            />
          </label>

          <div className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
            <div className="mb-3 flex rounded-lg bg-slate-100 p-1 dark:bg-white/5">
              {(['bilibili', 'local'] as const).map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => {
                    setSourceProvider(provider);
                    setUploadedVideo(null);
                    setUploadError(null);
                    setError(null);
                  }}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                    sourceProvider === provider
                      ? 'bg-white text-blue-700 shadow-sm dark:bg-[#0d1117] dark:text-blue-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {provider === 'bilibili' ? 'Bilibili 视频' : '本地视频'}
                </button>
              ))}
            </div>
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">{sourceHelp}</p>
            {sourceProvider === 'bilibili' ? (
              <label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                <span>BVID</span>
                <input
                  name="externalBvid"
                  required
                  maxLength={64}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-[#010409] dark:text-white"
                  placeholder="BV1FAiPBeEZf"
                />
              </label>
            ) : (
              <div className="space-y-3">
                <label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                  <span>本地视频教程</span>
                  <input
                    name="videoFile"
                    type="file"
                    required={!uploadedVideo}
                    accept="video/mp4,video/webm,video/quicktime,video/x-m4v,.mp4,.webm,.mov,.m4v"
                    onChange={handleLocalVideoChange}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 dark:border-white/10 dark:bg-[#010409] dark:text-white dark:file:bg-blue-500/10 dark:file:text-blue-200"
                  />
                </label>
                {isUploadingVideo && (
                  <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300">
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    <span>正在上传本地视频教程</span>
                  </div>
                )}
                {uploadedVideo && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span>{uploadedVideo.fileName}</span>
                    </div>
                    <input name="video" type="hidden" value={readMediaResourceUrl(uploadedVideo.video)} readOnly />
                  </div>
                )}
                {uploadError && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>联系人</span>
              <input
                name="contactName"
                maxLength={128}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-[#010409] dark:text-white"
                placeholder="Ada"
              />
            </label>
            <label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
              <span>联系邮箱</span>
              <input
                name="contactEmail"
                type="email"
                maxLength={254}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-[#010409] dark:text-white"
                placeholder="ada@example.com"
              />
            </label>
          </div>

          <label className="space-y-1.5 text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>备注</span>
            <textarea
              name="notes"
              maxLength={2000}
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-[#010409] dark:text-white"
              placeholder="课程来源、适合人群、版权确认等"
            />
          </label>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {result && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>课程申请已提交，状态：{result.status}</span>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 dark:border-white/10 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
            >
              <Upload className="h-4 w-4" />
              稍后继续
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingVideo}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              提交申请
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formText(form: FormData, key: string): string | undefined {
  const value = form.get(key);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}
