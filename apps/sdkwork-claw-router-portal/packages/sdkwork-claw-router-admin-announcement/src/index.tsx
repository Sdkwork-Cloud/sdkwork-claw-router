import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Megaphone, Clock, CheckCircle2, MoreVertical, X, Edit, Trash2, Send, Loader2, AlertCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { BusinessStateTableRow, ConfirmDialog } from 'sdkwork-claw-router-commons';
import { AnnouncementService, type Announcement } from './announcementService';
import {
  createAnnouncementInputFromForm,
  createAnnouncementPublishInput,
  createAnnouncementUpdateInputFromForm,
} from './announcementForm';

const DEFAULT_TARGET = 'all';
const DEFAULT_CONTENT = '### System update notice\n\nEnter the announcement details here.';

const targetOptions = [
  { value: 'all', label: 'All users' },
  { value: 'vip', label: 'VIP groups' },
  { value: 'free', label: 'Free tier users' },
  { value: 'beta', label: 'Beta cohort' },
];

export function AnnouncementAdmin() {
  const [search, setSearch] = useState('');
  const [editorTheme, setEditorTheme] = useState('light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [content, setContent] = useState(DEFAULT_CONTENT);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const loadAnnouncements = () => {
    let active = true;
    setLoading(true);
    setLoadError(null);
    AnnouncementService.fetchAnnouncements()
      .then(data => {
        if (!active) return;
        setAnnouncements(data);
      })
      .catch(err => {
        if (!active) return;
        setLoadError(errorMessage(err, 'Failed to load announcements.'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  };

  useEffect(() => {
    return loadAnnouncements();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const syncEditorTheme = () => {
      setEditorTheme(root.classList.contains('dark') ? 'vs-dark' : 'light');
    };
    syncEditorTheme();
    const observer = new MutationObserver(syncEditorTheme);
    observer.observe(root, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => observer.disconnect();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return announcements;
    return announcements.filter(item => item.title.toLowerCase().includes(keyword));
  }, [announcements, search]);

  const openModal = (ann?: Announcement) => {
    setError(null);
    if (ann) {
      setEditingId(ann.id);
      setTitle(ann.title);
      setTarget(normalizeTarget(ann.target));
      setStatus(ann.status);
      setContent(ann.content);
    } else {
      setEditingId(null);
      setTitle('');
      setTarget(DEFAULT_TARGET);
      setStatus('published');
      setContent(DEFAULT_CONTENT);
    }
    setIsModalOpen(true);
    setDropdownOpen(null);
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);

    try {
      if (editingId) {
        const updated = await AnnouncementService.updateAnnouncement(editingId, createAnnouncementUpdateInputFromForm({
          title,
          target,
          status,
          content,
        }));
        if (updated) {
          setAnnouncements(items => items.map(item => item.id === editingId ? updated : item));
        }
      } else {
        const newAnnouncement = await AnnouncementService.addAnnouncement(createAnnouncementInputFromForm({
          title,
          target,
          status,
          content,
        }));
        setAnnouncements(items => [newAnnouncement, ...items]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(errorMessage(err, 'Failed to save announcement.'));
    } finally {
      setSaving(false);
    }
  };

  const closeDeleteConfirmation = () => {
    if (pendingActionId) {
      return;
    }
    setDeleteTarget(null);
  };

  const executeDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    const id = deleteTarget.id;
    setPendingActionId(id);
    setError(null);
    try {
      const success = await AnnouncementService.deleteAnnouncement(id);
      if (success) {
        setAnnouncements(items => items.filter(item => item.id !== id));
      }
      setDeleteTarget(null);
    } catch (err) {
      setError(errorMessage(err, 'Failed to delete announcement.'));
    } finally {
      setPendingActionId(null);
      setDropdownOpen(null);
    }
  };

  const handlePublish = async (id: string) => {
    setPendingActionId(id);
    setError(null);
    try {
      const updated = await AnnouncementService.updateAnnouncement(id, createAnnouncementPublishInput());
      if (updated) {
        setAnnouncements(items => items.map(item => item.id === id ? updated : item));
      }
    } catch (err) {
      setError(errorMessage(err, 'Failed to publish announcement.'));
    } finally {
      setPendingActionId(null);
      setDropdownOpen(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <Megaphone className="w-6 h-6 text-amber-500" />
            Announcement Management
          </h2>
          <p className="text-sm text-slate-500">Publish operational notices to selected customer cohorts.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-500 w-full sm:w-64 text-slate-900 dark:text-white placeholder-slate-500 transition-colors shadow-sm"
            />
          </div>
          <button onClick={() => openModal()} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Announcement</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex-1 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0 border-b border-slate-200 dark:border-white/10 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Audience</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Published At</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 pb-24">
              {loading ? (
                <BusinessStateTableRow colSpan={5} kind="loading" title="Loading announcements..." />
              ) : loadError ? (
                <BusinessStateTableRow
                  colSpan={5}
                  kind="error"
                  title="Announcements could not be loaded"
                  description={loadError}
                  onRetry={() => { loadAnnouncements(); }}
                  retryLabel="Retry"
                />
              ) : filteredAnnouncements.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={5}
                  kind="empty"
                  title="No announcements found"
                  description="Create an announcement or adjust the search keyword."
                  action={{
                    label: 'New announcement',
                    onClick: () => openModal(),
                  }}
                />
              ) : filteredAnnouncements.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group relative">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white max-w-sm truncate">{item.title}</td>
                  <td className="px-6 py-4"><span className="text-xs bg-slate-100 dark:bg-white/10 px-2 py-1 rounded">{targetLabel(item.target)}</span></td>
                  <td className="px-6 py-4">
                    {item.status === 'published' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Published</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500"><Clock className="w-3.5 h-3.5" /> Draft</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{item.date || '-'}</td>
                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={() => setDropdownOpen(dropdownOpen === item.id ? null : item.id)}
                      className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-white/5 rounded transition-colors duration-200"
                      disabled={pendingActionId === item.id}
                    >
                      {pendingActionId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreVertical className="w-4 h-4" />}
                    </button>

                    {dropdownOpen === item.id && (
                      <div className="absolute right-8 top-10 w-36 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg border border-slate-200 dark:border-white/10 z-10 overflow-hidden text-left flex flex-col py-1">
                        {item.status === 'draft' && (
                          <button onClick={() => handlePublish(item.id)} className="w-full px-4 py-2.5 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2">
                            <Send className="w-4 h-4" /> Publish
                          </button>
                        )}
                        <button onClick={() => openModal(item)} className="w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2">
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => { setDeleteTarget(item); setDropdownOpen(null); }} className="w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 border-t border-slate-100 dark:border-white/5">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm shadow-xl">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10 shrink-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-500" /> {editingId ? 'Edit Announcement' : 'Create Announcement'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" disabled={saving}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 flex flex-col flex-1 space-y-5 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Title</label>
                  <input
                    required
                    maxLength={200}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    type="text"
                    placeholder="Platform API endpoint migration notice"
                    className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-900 dark:text-white transition-all shadow-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Audience</label>
                    <select
                      required
                      value={target}
                      onChange={e => setTarget(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-900 dark:text-white transition-all shadow-sm"
                    >
                      {targetOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Publication</label>
                    <select
                      required
                      value={status}
                      onChange={e => setStatus(e.target.value as 'published' | 'draft')}
                      className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-slate-900 dark:text-white transition-all shadow-sm"
                    >
                      <option value="published">Publish now</option>
                      <option value="draft">Save as draft</option>
                    </select>
                  </div>
                </div>
                <div className="flex-1 flex flex-col min-h-[300px]">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Content</span>
                    <span className="text-xs text-slate-400 font-mono tracking-wider">MARKDOWN</span>
                  </label>
                  <div className="flex-1 border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden shadow-sm bg-white dark:bg-[#1e1e1e] p-1">
                    <Editor
                      height="100%"
                      defaultLanguage="markdown"
                      theme={editorTheme}
                      value={content}
                      onChange={(val) => setContent(val || '')}
                      options={{
                        minimap: { enabled: false },
                        wordWrap: 'on',
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        padding: { top: 16, bottom: 16 },
                        fontFamily: "'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace",
                        renderLineHighlight: 'all',
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',
                        formatOnPaste: true,
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212] shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a]" disabled={saving}>
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-sm transition-colors border border-transparent flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-70" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete announcement?"
          description={`This removes "${deleteTarget.title}" from the announcement center. Published users will no longer see it after confirmation.`}
          confirmLabel="Delete announcement"
          tone="danger"
          icon={<Trash2 className="h-4 w-4" />}
          isBusy={pendingActionId === deleteTarget.id}
          onConfirm={() => void executeDelete()}
          onCancel={closeDeleteConfirmation}
        />
      )}
    </div>
  );
}

function targetLabel(value: string): string {
  return targetOptions.find(option => option.value === normalizeTarget(value))?.label ?? 'All users';
}

function normalizeTarget(value: string): string {
  return targetOptions.some(option => option.value === value) ? value : DEFAULT_TARGET;
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}
