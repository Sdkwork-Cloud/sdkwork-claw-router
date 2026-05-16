import React, { useState, useEffect } from 'react';
import { BusinessStateTableRow, ConfirmDialog } from 'sdkwork-claw-router-commons';
import { Plus, Search, Trash2, Edit, ChevronDown, RefreshCw, ArrowUpDown, Settings, LayoutGrid, X } from 'lucide-react';
import { GroupService, GroupData } from './groupService';
import { createGroupInputFromForm, createGroupUpdateInputFromForm } from './groupForm';

export function GroupAdmin() {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupData | null>(null);
  const [platformFilter, setPlatformFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GroupData | null>(null);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  const loadGroups = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await GroupService.fetchGroups();
      setGroups(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGroups();
  }, []);

  const platformOptions = Array.from(new Set(groups.map(group => group.platform).filter(Boolean))).sort();

  const filteredGroups = groups
    .filter(group => group.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(group => !platformFilter || group.platform === platformFilter)
    .filter(group => !statusFilter || group.status === statusFilter)
    .filter(group => !typeFilter || group.type === typeFilter)
    .sort((left, right) => {
      const result = left.name.localeCompare(right.name);
      return sortDirection === 'asc' ? result : -result;
    });

  const openCreateModal = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const openEditModal = (group: GroupData) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setSaving(true);
    try {
      if (editingGroup) {
        const updated = await GroupService.updateGroup(editingGroup.id, createGroupUpdateInputFromForm(formData));
        setGroups(current => current.map(group => group.id === updated.id ? updated : group));
      } else {
        const added = await GroupService.addGroup(createGroupInputFromForm(formData));
        setGroups(current => [added, ...current]);
      }
      setIsModalOpen(false);
      setEditingGroup(null);
      setLoadError(null);
    } finally {
      setSaving(false);
    }
  };

  const closeDeleteConfirmation = () => {
    if (deletingGroupId) {
      return;
    }
    setDeleteTarget(null);
  };

  const executeDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    const id = deleteTarget.id;
    setDeletingGroupId(id);
    try {
      const success = await GroupService.deleteGroup(id);
      if (success) {
        setGroups(current => current.filter(g => g.id !== id));
      }
      setDeleteTarget(null);
    } finally {
      setDeletingGroupId(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-2">
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索分组..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 w-[200px] text-slate-900 dark:text-white placeholder-slate-500 transition-colors shadow-sm"
            />
          </div>

          <div className="relative">
            <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300 appearance-none shadow-sm cursor-pointer w-[140px]">
              <option value="">全部平台</option>
              {platformOptions.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300 appearance-none shadow-sm cursor-pointer w-[140px]">
              <option value="">全部状态</option>
              <option value="active">正常</option>
              <option value="disabled">异常</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300 appearance-none shadow-sm cursor-pointer w-[140px]">
              <option value="">全部分组</option>
              <option value="public">公开</option>
              <option value="dedicated">专属</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto xl:ml-0">
          <button onClick={() => { void loadGroups(); }} className="p-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => setSortDirection(current => current === 'asc' ? 'desc' : 'asc')} className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-white/10 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm font-medium">
            <ArrowUpDown className="w-4 h-4" /> 排序
          </button>
          <button onClick={openCreateModal} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> 创建分组
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">名称 <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4">平台 <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4">计费类型 <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4">费率倍数 <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4">类型 <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4">账号数 <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4">容量</th>
                <th className="px-6 py-4">用量</th>
                <th className="px-6 py-4">状态 <ChevronDown className="inline w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {loading ? (
                <BusinessStateTableRow colSpan={10} kind="loading" title="Loading groups..." />
              ) : loadError ? (
                <BusinessStateTableRow
                  colSpan={10}
                  kind="error"
                  title="Groups could not be loaded"
                  description={loadError}
                  onRetry={() => { void loadGroups(); }}
                  retryLabel="Retry"
                />
              ) : filteredGroups.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={10}
                  kind="empty"
                  title="No groups found"
                  description="Create a group before assigning users, channels, or billing policy."
                />
              ) : filteredGroups.map(group => (
                <tr key={group.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                    {group.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-full text-xs font-medium border border-amber-500/20">
                      <Settings className="w-3.5 h-3.5" /> {group.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs">
                      {group.billingType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {group.rateMultiplier}x
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs">
                      {displayGroupType(group.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                      <div>可用: <span className="font-mono text-emerald-600 dark:text-emerald-400">{group.accountCount.available}</span> <span className="bg-slate-100 dark:bg-white/10 px-1 rounded ml-1 text-[10px]">个账号</span></div>
                      <div>总量: <span className="font-mono">{group.accountCount.total}</span> <span className="bg-slate-100 dark:bg-white/10 px-1 rounded ml-1 text-[10px]">个账号</span></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-slate-500 text-xs font-mono">
                      <LayoutGrid className="w-3 h-3" /> {group.capacity.used} / {group.capacity.total}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-xs text-slate-500">
                      <div>今日 <span className="font-mono text-slate-900 dark:text-white">${group.usage.today.toFixed(2)}</span></div>
                      <div>累计 <span className="font-mono">${group.usage.total.toFixed(2)}</span></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                      {displayGroupStatus(group.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                      <button onClick={() => openEditModal(group)} className="flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
                        <Edit className="w-4 h-4" /> <span>编辑</span>
                      </button>
                      <button onClick={() => setDeleteTarget(group)} className="flex flex-col items-center gap-1 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" /> <span>删除</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE GROUP MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-xl flex flex-col my-auto relative">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingGroup ? '编辑分组' : '创建分组'}</h3>
              <button onClick={closeModal} disabled={saving} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors disabled:cursor-not-allowed disabled:opacity-60">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGroup} className="flex flex-col">
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">名称</label>
                  <input required name="name" type="text" placeholder="请输入分组名称" defaultValue={editingGroup?.name ?? ''} className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white transition-colors" />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">平台</label>
                  <div className="relative">
                    <select name="platform" defaultValue={editingGroup?.platform ?? 'Anthropic'} className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white appearance-none cursor-pointer transition-colors">
                      <option value="Anthropic">Anthropic</option>
                      <option value="OpenAI">OpenAI</option>
                      {editingGroup && !['Anthropic', 'OpenAI'].includes(editingGroup.platform) && (
                        <option value={editingGroup.platform}>{editingGroup.platform}</option>
                      )}
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">选择此分组关联的平台</p>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">费率倍数</label>
                  <input required name="rateMultiplier" type="number" min="0.01" step="0.01" defaultValue={editingGroup?.rateMultiplier ?? 1} className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white transition-colors" />
                  <p className="text-xs text-slate-500 mt-1.5">1.0 = 标准费率， 0.5 = 半价， 2.0 = 双倍</p>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">容量总额</label>
                  <input required name="capacityTotal" type="number" min="1" step="1" defaultValue={editingGroup?.capacity.total ?? 100} className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white transition-colors" />
                  <p className="text-xs text-slate-500 mt-1.5">后端将按此容量上限创建分组策略。</p>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">分组类型</label>
                  <div className="relative">
                    <select name="type" defaultValue={editingGroup?.type ?? 'public'} className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white appearance-none cursor-pointer transition-colors">
                      <option value="public">公开</option>
                      <option value="dedicated">专属</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-700 dark:text-slate-300 mb-2">计费类型</label>
                  <div className="relative">
                    <select name="billingType" defaultValue={editingGroup?.billingType ?? 'standard'} className="w-full bg-transparent border border-slate-300 dark:border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 text-slate-900 dark:text-white appearance-none cursor-pointer transition-colors">
                      <option value="standard">标准 (余额)</option>
                      <option value="subscription">订阅</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">标准计费从用户余额扣除。订阅模式使用配额限制。</p>
                </div>

              </div>
              <div className="p-5 flex justify-end gap-3 rounded-b-2xl">
                <button type="button" onClick={closeModal} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent dark:border-white/10 rounded-xl transition-colors bg-slate-50 dark:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-60">
                  取消
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-xl shadow-sm transition-colors border border-transparent dark:border-[rgba(255,255,255,0.1)] disabled:cursor-not-allowed disabled:opacity-70">
                  {editingGroup ? '保存' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteTarget && (
        <ConfirmDialog
          title="Delete access group?"
          description={`This removes "${deleteTarget.name}" from access group configuration. Verify related routing and billing policies before confirming.`}
          confirmLabel="Delete group"
          tone="danger"
          icon={<Trash2 className="h-4 w-4" />}
          isBusy={deletingGroupId === deleteTarget.id}
          onConfirm={() => void executeDelete()}
          onCancel={closeDeleteConfirmation}
        />
      )}
    </div>
  );
}

function displayGroupType(type: GroupData['type']): string {
  return type === 'dedicated' ? '专属' : '公开';
}

function displayGroupStatus(status: GroupData['status']): string {
  return status === 'disabled' ? '异常' : '正常';
}
