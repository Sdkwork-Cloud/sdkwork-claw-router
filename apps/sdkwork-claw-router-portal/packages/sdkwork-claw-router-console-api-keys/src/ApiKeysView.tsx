import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Key,
  Loader2,
  Lock,
  MessageSquare,
  Mic,
  Music,
  Plus,
  Search,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CopyButton } from 'sdkwork-claw-router-commons';
import { CreateKeyDrawer, type ApiKeyFormValues } from './CreateKeyDrawer';
import { createApiKeyInputsFromForm } from './apiKeyForm';
import { ApiKeyService, type ApiKey, type ApiKeyGroup } from './apiKeyService';

interface CreatedSecret {
  name: string;
  rawKey: string;
}

export function ApiKeysView() {
  const [keysData, setKeysData] = useState<ApiKey[]>([]);
  const [groups, setGroups] = useState<ApiKeyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdKeys, setCreatedKeys] = useState<CreatedSecret[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailsKey, setDetailsKey] = useState<ApiKey | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    ApiKeyService.fetchKeys()
      .then((data) => {
        if (!mounted) return;
        setKeysData(data.keys);
        setGroups(data.groups);
        setError(null);
      })
      .catch((reason) => {
        if (!mounted) return;
        setError(reason instanceof Error ? reason.message : 'Failed to load API keys');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredKeys = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return keysData;
    }
    return keysData.filter((key) => {
      return (
        key.name.toLowerCase().includes(query) ||
        key.maskedKey.toLowerCase().includes(query) ||
        key.group.toLowerCase().includes(query)
      );
    });
  }, [keysData, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredKeys.length / itemsPerPage));
  const paginatedKeys = filteredKeys.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCreateSubmit = async (data: ApiKeyFormValues) => {
    setCreating(true);
    setError(null);
    try {
      const created: CreatedSecret[] = [];
      const createdItems: ApiKey[] = [];
      for (const input of createApiKeyInputsFromForm(data)) {
        const result = await ApiKeyService.createKey(input);
        created.push({ name: result.key.name, rawKey: result.rawKey });
        createdItems.push(result.key);
      }
      setKeysData((previous) => [...createdItems, ...previous]);
      setCreatedKeys(created);
      setShowCreateDrawer(false);
      setShowSuccessModal(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const closeSuccessDialog = () => {
    setShowSuccessModal(false);
    setCreatedKeys([]);
  };

  const renderModalities = (modes: string[]) => {
    return (
      <div className="flex items-center gap-1.5">
        {modes.includes('text') && <ModalityIcon title="Text" icon={<MessageSquare className="w-3.5 h-3.5" />} className="bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-500" />}
        {modes.includes('image') && <ModalityIcon title="Image" icon={<ImageIcon className="w-3.5 h-3.5" />} className="bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/20 text-pink-500" />}
        {modes.includes('video') && <ModalityIcon title="Video" icon={<Video className="w-3.5 h-3.5" />} className="bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 text-purple-500" />}
        {modes.includes('audio') && <ModalityIcon title="Audio" icon={<Mic className="w-3.5 h-3.5" />} className="bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-500" />}
        {modes.includes('music') && <ModalityIcon title="Music" icon={<Music className="w-3.5 h-3.5" />} className="bg-sky-50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20 text-sky-500" />}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 w-full mx-auto space-y-6 animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#121212]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Key className="w-6 h-6 text-lobster-500" />
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">API Keys</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white dark:bg-[#252525] p-4 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          <button
            onClick={() => setShowCreateDrawer(true)}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-transparent shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create key
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search keys or groups"
            className="w-full bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 pl-9 pr-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-shadow text-slate-800 dark:text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-xl shadow-sm flex flex-col min-h-[500px] overflow-hidden">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[1000px]">
            <thead className="bg-slate-50 dark:bg-[#1e1e1e]/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4">Name / Token</th>
                <th className="px-4 py-4">Status / Group</th>
                <th className="px-4 py-4">Quota</th>
                <th className="px-4 py-4">Modalities</th>
                <th className="px-4 py-4">IP ACL</th>
                <th className="px-4 py-4">Lifecycle</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300 text-sm">
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-slate-500">
                    <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />
                    Loading API keys
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-bold text-slate-800 dark:text-white">{key.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-medium bg-slate-100 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/5 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                            {key.maskedKey}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-start gap-1.5">
                        <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-2 flex items-center gap-1 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">
                          <CheckSquare className="w-3 h-3" /> {key.status}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                            Grp: {key.group}
                          </span>
                          {key.rate && (
                            <span className="bg-slate-100 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold">
                              X {key.rate}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1 text-[11px]">
                        <span className="text-amber-600 dark:text-amber-500 font-mono font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3" /> {key.usedQuota}
                        </span>
                        <span className="text-slate-500 font-mono font-medium">/ {key.quota}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">{renderModalities(key.modalities)}</td>
                    <td className="px-4 py-4">
                      <span className="bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 px-2 py-1 flex items-center gap-1 w-fit rounded text-[11px] font-mono font-medium">
                        <Lock className="w-3 h-3" /> {key.ipLimit}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5 text-[11px] font-mono">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{key.created}</span>
                        <span className="text-slate-500">{key.expires}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setDetailsKey(key)}
                        className="bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && paginatedKeys.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-slate-500">
                    No API keys found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredKeys.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#1e1e1e]/50">
            <div>
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredKeys.length)} of{' '}
              <strong className="text-slate-800 dark:text-slate-200">{filteredKeys.length}</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="p-1.5 border border-slate-200 dark:border-transparent hover:bg-slate-200 dark:hover:bg-white/5 text-slate-500 dark:text-slate-300 rounded disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="bg-blue-600 text-white min-w-[28px] h-7 px-2 rounded flex items-center justify-center font-bold shadow-sm">
                {currentPage}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                className="p-1.5 border border-slate-200 dark:border-transparent hover:bg-slate-200 dark:hover:bg-white/5 text-slate-500 dark:text-slate-300 rounded disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <CreateKeyDrawer
        isOpen={showCreateDrawer}
        mode="create"
        groups={groups}
        submitting={creating}
        onClose={() => setShowCreateDrawer(false)}
        onSubmit={handleCreateSubmit}
      />
      <CreateKeyDrawer
        isOpen={!!detailsKey}
        mode="view"
        initialData={detailsKey}
        groups={groups}
        onClose={() => setDetailsKey(null)}
      />

      <AnimatePresence>
        {showSuccessModal && createdKeys.length > 0 && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" /> API key created
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {createdKeys.map((item) => (
                  <div key={`${item.name}-${item.rawKey}`} className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">{item.name}</label>
                    <div className="flex items-center gap-2 relative">
                      <input
                        type="text"
                        readOnly
                        value={item.rawKey}
                        className="w-full bg-slate-50 dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 pl-4 pr-12 py-3.5 rounded-xl text-sm font-mono text-slate-800 dark:text-white shadow-inner focus:outline-none"
                      />
                      <CopyButton
                        text={item.rawKey}
                        label="Copy key"
                        copiedLabel="Key copied"
                        className="absolute right-2 p-2 bg-white dark:bg-[#252525] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white rounded-lg border border-slate-200 dark:border-white/10 transition-colors shadow-sm"
                        title="Copy key"
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-2 flex justify-end">
                  <button onClick={closeSuccessDialog} className="px-6 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-full shadow-sm">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalityIcon({ title, icon, className }: { title: string; icon: React.ReactNode; className: string }) {
  return (
    <div className={`w-6 h-6 rounded flex items-center justify-center border cursor-help ${className}`} title={title}>
      {icon}
    </div>
  );
}
