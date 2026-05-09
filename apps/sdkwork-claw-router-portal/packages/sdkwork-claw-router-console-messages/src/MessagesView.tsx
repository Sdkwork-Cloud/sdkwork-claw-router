import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronRight,
  Info,
  Mail,
  MailOpen,
  Search,
  X,
} from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import { MessagesService, type Message } from './messagesService';

const readOnlyMessageActions =
  'Read-only notification center. Message read status, deletion, and receipt downloads require explicit notification command contracts before they can be enabled.';

function getLoadErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function MessagesView() {
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
        setLoadError(getLoadErrorMessage(error, 'Failed to load notifications.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

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

  return (
    <div className="p-4 lg:p-6 w-full mx-auto animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#1e1e1e]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-white/5 pb-4 mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-lobster-500" /> Message Center
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left sm:text-right">
          <p className="max-w-xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {readOnlyMessageActions}
          </p>
          <span className="shrink-0 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            Read-only
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[650px] relative">
        <div className="w-full md:w-56 border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#1e1e1e]/50 shrink-0 hidden md:block">
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
                <Mail className="w-4 h-4" /> All Messages
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
                <MailOpen className="w-4 h-4" /> Unread
              </div>
              <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-500/30">
                {unreadCount}
              </span>
            </button>
          </div>
        </div>

        <div
          className={`flex-1 flex flex-col border-r border-slate-200 dark:border-white/5 transition-all duration-300 ${
            selectedId ? 'hidden md:flex md:w-80 lg:max-w-md shrink-0 border-r-2 dark:border-r-white/5 border-r-slate-200' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-[#1e1e1e]/80">
            <div className="relative w-full max-w-[280px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/10 rounded-lg text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <BusinessStatePanel
                kind="loading"
                title="Loading messages..."
                className="min-h-[520px] border-0 bg-transparent"
              />
            ) : loadError ? (
              <BusinessStatePanel
                kind="error"
                title="Messages could not be loaded"
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
                    onSelect={() => setSelectedId(message.id)}
                  />
                ))}
              </div>
            ) : (
              <BusinessStatePanel
                kind="empty"
                title="No messages found"
                description={
                  messages.length === 0
                    ? readOnlyMessageActions
                    : 'Adjust the search query or message filter to find matching notifications.'
                }
                className="min-h-[520px] border-0 bg-transparent"
              />
            )}
          </div>
        </div>

        {selectedMsg ? (
          <MessageDetail message={selectedMsg} onClose={() => setSelectedId(null)} />
        ) : (
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-white dark:bg-[#1e1e1e]/30 text-slate-500">
            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-transparent rounded-full flex items-center justify-center mb-4 shadow-sm dark:shadow-none">
              <Mail className="w-8 h-8 text-slate-400 dark:text-slate-600" />
            </div>
            <p>Select a message to inspect its details.</p>
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
  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#1e1e1e]/30 absolute inset-0 md:static md:w-auto z-20 w-full h-full md:h-auto">
      <div className="p-4 sm:px-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-[#1e1e1e]/80">
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

      <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-4 leading-tight">
            {message.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 border-b border-slate-200 dark:border-white/5 pb-6">
            <span>
              Sender: <strong className="text-slate-700 dark:text-slate-300">System (Claw Router)</strong>
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
                <span className="text-slate-500 dark:text-slate-400 text-sm">Settlement status</span>
                <span className="text-emerald-500 dark:text-emerald-400 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Recorded by system notification
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
  if (message.type === 'alert' || message.type === 'warning') {
    return (
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          message.type === 'alert'
            ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20'
            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
        }`}
      >
        {message.type === 'alert' ? 'Urgent Alert' : 'Account Warning'}
      </span>
    );
  }

  if (message.type === 'billing') {
    return (
      <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
        Billing Notice
      </span>
    );
  }

  return (
    <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
      Service Notice
    </span>
  );
}
