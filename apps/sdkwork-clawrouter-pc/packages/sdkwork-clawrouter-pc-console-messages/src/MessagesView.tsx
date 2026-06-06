import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Info,
  Mail,
  MailOpen,
  Search,
  X,
} from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-clawrouter-pc-commons';
import { useTranslation } from 'react-i18next';
import { MessagesService, type Message } from './messagesService';

function getLoadErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function markMessageReadFeedback(messages: Message[], messageId: Message['id']): Message[] {
  return messages.map((message) => (
    message.id === messageId
      ? { ...message, read: true, popupSeen: true }
      : message
  ));
}

export function MessagesView() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<Message['id'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadMessages = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await MessagesService.fetchMessages();
      if (isActive()) {
        setMessages(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, t('console.messages.loadError', '通知加载失败')));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, [t]);

  useEffect(() => {
    let active = true;
    void loadMessages(() => active);
    return () => {
      active = false;
    };
  }, [loadMessages]);

  const filteredMessages = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return messages.filter((message) => {
      const matchesFilter = filter === 'all' || !message.read;
      const searchable = [message.title, message.desc, message.content, message.time].join(' ').toLowerCase();
      return matchesFilter && (!keyword || searchable.includes(keyword));
    });
  }, [filter, messages, search]);

  const unreadCount = useMemo(() => messages.filter((message) => !message.read).length, [messages]);
  const selectedMsg = messages.find((message) => message.id === selectedId);

  const selectFilter = (nextFilter: 'all' | 'unread') => {
    setFilter(nextFilter);
    setSelectedId(null);
  };

  const handleSelectMessage = useCallback((message: Message) => {
    setSelectedId(message.id);
    if (message.read) {
      return;
    }
    setMessages((current) => markMessageReadFeedback(current, message.id));
    void MessagesService.acknowledge(message.id).catch((error) => {
      setLoadError(getLoadErrorMessage(error, t('console.messages.acknowledgeError', '通知已读状态更新失败')));
    });
  }, [t]);

  return (
    <div className="w-full h-[calc(100vh-72px)] mx-auto overflow-hidden flex flex-col animate-in fade-in duration-500 bg-slate-50 p-[5px] dark:bg-[#1e1e1e]">
      <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm flex-1 min-h-0 overflow-hidden flex flex-col md:flex-row relative">
        <div className="w-full md:w-56 border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#1e1e1e]/50 shrink-0 hidden md:flex md:flex-col md:min-h-0">
          <div className="p-4 flex flex-col gap-2">
            <button
              onClick={() => selectFilter('all')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-500 border border-blue-200 dark:border-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> {t('common.actions.allNotifications')}
              </div>
              <span className="bg-slate-200 dark:bg-white/5 px-2 py-0.5 rounded-full text-xs border border-slate-300 dark:border-white/5 text-slate-700 dark:text-slate-300">
                {messages.length}
              </span>
            </button>
            <button
              onClick={() => selectFilter('unread')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-500 border border-blue-200 dark:border-blue-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <MailOpen className="w-4 h-4" /> {t('common.actions.unread')}
              </div>
              <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-500/30">
                {unreadCount}
              </span>
            </button>
          </div>
        </div>

        <div
          className={`flex-1 min-h-0 flex flex-col overflow-hidden border-r border-slate-200 dark:border-white/5 transition-all duration-300 ${
            selectedId ? 'hidden md:flex md:w-80 lg:max-w-md shrink-0 border-r-2 dark:border-r-white/5 border-r-slate-200' : 'flex'
          }`}
        >
          <div className="shrink-0 p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-[#1e1e1e]/80">
            <div className="relative w-full max-w-[280px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder={t('console.messages.searchPlaceholder', '搜索通知...')}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/10 rounded-lg text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            {loading ? (
              <BusinessStatePanel
                kind="loading"
                title={t('console.messages.loading', '正在加载通知...')}
                className="min-h-[520px] border-0 bg-transparent"
              />
            ) : loadError ? (
              <BusinessStatePanel
                kind="error"
                title={t('console.messages.loadFailed', '通知加载失败')}
                description={loadError}
                onRetry={() => void loadMessages()}
                className="min-h-[520px] border-0 bg-transparent"
              />
            ) : filteredMessages.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {filteredMessages.map((message) => (
                  <MessageListItem
                    key={message.id}
                    message={message}
                    selected={selectedId === message.id}
                    onSelect={() => handleSelectMessage(message)}
                  />
                ))}
              </div>
            ) : (
              <BusinessStatePanel
                kind="empty"
                title={t('console.messages.emptyTitle', '暂无通知')}
                description={
                  messages.length === 0
                    ? t('console.messages.emptyDescription', '账户、网关或结算事件产生后会显示在这里。')
                    : t('console.messages.noResultsDescription', '请调整搜索关键词或通知筛选条件。')
                }
                className="min-h-[520px] border-0 bg-transparent"
              />
            )}
          </div>
        </div>

        {selectedMsg ? (
          <MessageDetail message={selectedMsg} onClose={() => setSelectedId(null)} />
        ) : (
          <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden flex-col items-center justify-center bg-white dark:bg-[#1e1e1e]/30 text-slate-500">
            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-transparent rounded-full flex items-center justify-center mb-4 shadow-sm dark:shadow-none">
              <Mail className="w-8 h-8 text-slate-400 dark:text-slate-600" />
            </div>
            <p>{t('console.messages.selectPrompt', '选择一条通知查看详情')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MessageListItem({
  message,
  selected,
  onSelect,
}: {
  message: Message;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`p-5 flex gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer group ${
        !message.read ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''
      } ${selected ? 'bg-blue-50 dark:bg-white/[0.06] border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'}`}
    >
      <MessageTypeIcon message={message} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1.5 gap-2">
          <h3 className={`text-sm truncate ${message.read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-800 dark:text-white font-bold'}`}>
            {message.title}
          </h3>
          <span className="text-xs text-slate-500 shrink-0 whitespace-nowrap">{message.time}</span>
        </div>
        <p className={`text-xs line-clamp-2 leading-relaxed ${message.read ? 'text-slate-500' : 'text-slate-400'}`}>
          {message.desc}
        </p>
      </div>
    </div>
  );
}

function MessageDetail({ message, onClose }: { message: Message; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-white dark:bg-[#1e1e1e]/30 absolute inset-0 md:static md:w-auto z-20 w-full h-full md:h-auto">
      <div className="shrink-0 p-4 sm:px-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-[#1e1e1e]/80">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 auto" style={{ transform: 'rotate(180deg)' }} />
          </button>
          <MessageTypeBadge message={message} />
        </div>
        <button
          onClick={onClose}
          className="md:hidden ml-2 p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-10 custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-4 leading-tight">
            {message.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 border-b border-slate-200 dark:border-white/5 pb-6">
            <span>
              {t('console.messages.sender', '发送方')}:{' '}
              <strong className="text-slate-700 dark:text-slate-300">{t('console.messages.systemSender', '系统通知')}</strong>
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 mx-1" />
            <span>{message.time}</span>
          </div>

          <div className="text-slate-600 dark:text-slate-300 text-[15px] leading-loose whitespace-pre-wrap">
            {message.content}
          </div>

          {message.type === 'billing' && (
            <div className="mt-10 p-5 bg-slate-50 dark:bg-[#151515] border border-slate-200 dark:border-white/5 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-sm">{t('console.messages.settlementStatus', '结算状态')}</span>
                <span className="text-emerald-500 dark:text-emerald-400 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {t('console.messages.recordedBySystem', '已由系统通知记录')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MessageTypeIcon({ message }: { message: Message }) {
  return (
    <div className="shrink-0 mt-0.5">
      {message.type === 'alert' || message.type === 'warning' ? (
        <AlertTriangle className={`w-5 h-5 ${message.type === 'alert' ? 'text-red-500' : 'text-amber-500'}`} />
      ) : message.type === 'billing' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      ) : (
        <Info className="w-5 h-5 text-blue-500" />
      )}
    </div>
  );
}

function MessageTypeBadge({ message }: { message: Message }) {
  const { t } = useTranslation();
  if (message.type === 'alert' || message.type === 'warning') {
    return (
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          message.type === 'alert'
            ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20'
            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
        }`}
      >
        {message.type === 'alert'
          ? t('console.messages.badge.alert', '紧急告警')
          : t('console.messages.badge.warning', '账户提醒')}
      </span>
    );
  }

  if (message.type === 'billing') {
    return (
      <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
        {t('console.messages.badge.billing', '账单通知')}
      </span>
    );
  }

  return (
    <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
      {t('console.messages.badge.service', '服务通知')}
    </span>
  );
}
