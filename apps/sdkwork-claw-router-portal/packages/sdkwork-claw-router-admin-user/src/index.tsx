import React, { useState, useEffect, useRef } from 'react';
import { BusinessStateTableRow, CopyButton } from 'sdkwork-claw-router-commons';
import { Search, Plus, User, Shield, CheckCircle2, X, Edit, MoreHorizontal, RefreshCw, Key, Users, MinusCircle, DollarSign, Wallet } from 'lucide-react';
import { UserService, UserListItem, ApiKeyItem } from './userService';
import {
  createApiKeyInputFromForm,
  createUserBalanceAdjustmentInputFromForm,
  createUserGroupUpdateInputFromForm,
  createUserInputFromForm,
  createUserProfileUpdateInputFromForm,
} from './userForm';

export function UserAdmin() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rechargeTarget, setRechargeTarget] = useState<UserListItem | null>(null);
  const [refundTarget, setRefundTarget] = useState<UserListItem | null>(null);
  const [recordsTarget, setRecordsTarget] = useState<UserListItem | null>(null);
  const [editTarget, setEditTarget] = useState<UserListItem | null>(null);
  const [apiKeysTarget, setApiKeysTarget] = useState<UserListItem | null>(null);
  const [groupsTarget, setGroupsTarget] = useState<UserListItem | null>(null);
  const [isCreateApiKeyModalOpen, setIsCreateApiKeyModalOpen] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [recordsTab, setRecordsTab] = useState<'recharge' | 'exchange'>('recharge');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiKeysMap, setApiKeysMap] = useState<Record<number, ApiKeyItem[]>>({});
  const [users, setUsers] = useState<UserListItem[]>([]);

  const loadUsers = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [fetchedUsers, fetchedApiKeys] = await Promise.all([
        UserService.fetchUsers(),
        UserService.fetchApiKeysMap(),
      ]);
      setUsers(fetchedUsers);
      setApiKeysMap(fetchedApiKeys);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const randomValues = new Uint32Array(16);
    crypto.getRandomValues(randomValues);
    let pass = '';
    for (let i = 0; i < 16; i++) {
        pass += chars.charAt(randomValues[i] % chars.length);
    }
    setGeneratedPassword(pass);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const user = await UserService.addUser(createUserInputFromForm(formData));
    setUsers((currentUsers) => [user, ...currentUsers]);
    setIsModalOpen(false);
    setGeneratedPassword('');
  };

  const handleRechargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rechargeTarget) return;
    const formData = new FormData(e.target as HTMLFormElement);

    const updatedUser = await UserService.updateBalance(
      rechargeTarget.id,
      createUserBalanceAdjustmentInputFromForm(formData, 'recharge'),
    );
    if (updatedUser) {
      setUsers((currentUsers) => currentUsers.map((user) => user.id === updatedUser.id ? updatedUser : user));
    }
    setRechargeTarget(null);
  };

  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTarget) return;
    const formData = new FormData(e.target as HTMLFormElement);

    const updatedUser = await UserService.updateBalance(
      refundTarget.id,
      createUserBalanceAdjustmentInputFromForm(formData, 'refund'),
    );
    if (updatedUser) {
      setUsers((currentUsers) => currentUsers.map((user) => user.id === updatedUser.id ? updatedUser : user));
    }
    setRefundTarget(null);
  };

  const setRefundAll = (target: UserListItem) => {
    const currentBalance = parseFloat(target.balance.replace(/[^0-9.-]+/g,"")) || 0;
    const amountInput = document.getElementById('refund_amount') as HTMLInputElement;
    if (amountInput) {
        amountInput.value = currentBalance.toString();
    }
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    const formData = new FormData(e.target as HTMLFormElement);

    const updatedUser = await UserService.updateUser(editTarget.id, createUserProfileUpdateInputFromForm(formData));
    if (updatedUser) {
       setUsers((currentUsers) => currentUsers.map((user) => user.id === updatedUser.id ? updatedUser : user));
    }

    setEditTarget(null);
    setGeneratedPassword('');
  };

  const handleCreateApiKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeysTarget) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const { key, rawKey } = await UserService.createApiKey(createApiKeyInputFromForm(formData, apiKeysTarget.id));

    setApiKeysMap((currentApiKeysMap) => {
      const currentUserApiKeys = currentApiKeysMap[apiKeysTarget.id] || [];
      return {
        ...currentApiKeysMap,
        [apiKeysTarget.id]: [...currentUserApiKeys, key],
      };
    });

    setNewlyCreatedKey(rawKey);
    setIsCreateApiKeyModalOpen(false);
  };

  const deleteApiKey = async (keyId: string) => {
    if (!apiKeysTarget) return;
    await UserService.deleteApiKey(apiKeysTarget.id, keyId);
    setApiKeysMap((currentApiKeysMap) => {
      const currentUserApiKeys = currentApiKeysMap[apiKeysTarget.id] || [];
      return {
        ...currentApiKeysMap,
        [apiKeysTarget.id]: currentUserApiKeys.filter((key) => key.id !== keyId),
      };
    });
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupsTarget) return;
    const formData = new FormData(e.target as HTMLFormElement);

    const updatedUser = await UserService.updateUser(groupsTarget.id, createUserGroupUpdateInputFromForm(formData));
    if (updatedUser) {
      setUsers((currentUsers) => currentUsers.map((user) => user.id === updatedUser.id ? updatedUser : user));
    }
    setGroupsTarget(null);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <User className="w-6 h-6 text-blue-500" />
            用户管理
          </h2>
          <p className="text-sm text-slate-500">管理平台注册用户生命周期，调配额度，分配权限架构。</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索邮箱或昵称..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-full sm:w-64 text-slate-900 dark:text-white placeholder-slate-500 transition-colors shadow-sm"
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 flex-shrink-0">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">创建用户</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-xl shadow-sm overflow-hidden flex flex-col" onClick={() => setActiveDropdown(null)}>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400 pb-32">
            <thead className="bg-slate-50 dark:bg-[#121212] sticky top-0 border-b border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400 select-none z-10">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">用户</div></th>
                <th className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">ID</div></th>
                <th className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">用户名</div></th>
                <th className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">角色</div></th>
                <th className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">分组</div></th>
                <th className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">余额</div></th>
                <th className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">状态</div></th>
                <th className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">最后活跃时间</div></th>
                <th className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">最后使用时间</div></th>
                <th className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors">创建时间</div></th>
                <th className="px-6 py-4 whitespace-nowrap text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {loading ? (
                <BusinessStateTableRow colSpan={11} kind="loading" title="Loading users..." />
              ) : loadError ? (
                <BusinessStateTableRow
                  colSpan={11}
                  kind="error"
                  title="Users could not be loaded"
                  description={loadError}
                  onRetry={() => { void loadUsers(); }}
                  retryLabel="Retry"
                />
              ) : users.length === 0 ? (
                <BusinessStateTableRow
                  colSpan={11}
                  kind="empty"
                  title="No users found"
                  description="Create a user before assigning groups, balances, or API keys."
                />
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 w-48">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 flex items-center justify-center text-sm font-bold shrink-0">
                        {u.email.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white truncate">{u.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs">{u.id}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{u.username}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400' : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300'}`}>
                      {u.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      {u.group}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <span className="font-mono text-slate-900 dark:text-white font-medium">{u.balance}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {u.status === 'active' ? (
                       <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> 启用</span>
                    ) : (
                       <span className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 text-sm whitespace-nowrap"><div className="w-2 h-2 rounded-full bg-red-500"></div> 禁用</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-xs">{u.lastActive}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-xs">{u.lastUsed}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-xs">{u.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditTarget(u);
                        }}
                        className="p-1.5 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded transition-colors" title="编辑">
                         <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === u.id ? null : u.id);
                        }}
                        className={`p-1.5 rounded transition-colors flex items-center gap-1 ${activeDropdown === u.id ? 'text-slate-900 bg-slate-100 dark:text-white dark:bg-white/10' : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'}`}
                        title="更多"
                      >
                         <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdown === u.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute top-10 right-0 w-36 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-[#333] rounded-lg shadow-xl z-50 overflow-hidden flex flex-col divide-y divide-slate-100 dark:divide-white/5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-1">
                            <button
                              onClick={() => { setApiKeysTarget(u); setActiveDropdown(null); }}
                              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"
                            >
                              <Key className="w-4 h-4 text-slate-400" />
                              API密钥
                            </button>
                            <button
                              onClick={() => { setGroupsTarget(u); setActiveDropdown(null); }}
                              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"
                            >
                              <Users className="w-4 h-4 text-slate-400" />
                              分组
                            </button>
                          </div>
                          <div className="py-1">
                            <button
                              onClick={() => { setRechargeTarget(u); setActiveDropdown(null); }}
                              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-emerald-500" />
                              充值
                            </button>
                            <button
                              onClick={() => { setRefundTarget(u); setActiveDropdown(null); }}
                              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"
                            >
                              <MinusCircle className="w-4 h-4 text-orange-500" />
                              退款
                            </button>
                            <button
                              onClick={() => { setRecordsTarget(u); setActiveDropdown(null); }}
                              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-3 transition-colors"
                            >
                              <DollarSign className="w-4 h-4 text-slate-400" />
                              充值记录
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">创建用户</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="flex flex-col flex-1">
              <div className="p-5 space-y-5 flex-1">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">邮箱</label>
                  <input required name="email" type="email" placeholder="请输入邮箱" className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">密码</label>
                  <div className="flex gap-2">
                    <input required name="password" type="text" value={generatedPassword} onChange={(e) => setGeneratedPassword(e.target.value)} placeholder="请输入密码" className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                    <button type="button" onClick={generateRandomPassword} className="px-3 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#1e1e1e] text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">用户名</label>
                  <input name="username" type="text" placeholder="请输入用户名 (选填)" className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">余额</label>
                    <input required name="balance" type="number" step="0.01" defaultValue="0" min="0" className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">并发数</label>
                    <input required name="concurrency" type="number" step="1" defaultValue="1" min="1" className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212] rounded-b-2xl">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  取消
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-xl shadow-sm transition-colors">
                  创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECHARGE MODAL */}
      {rechargeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-[420px] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">充值</h3>
              <button onClick={() => setRechargeTarget(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRechargeSubmit} className="flex flex-col flex-1">
              <div className="p-5 space-y-5 flex-1">
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center text-xl font-bold shrink-0">
                     {rechargeTarget.email.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <div className="font-semibold text-slate-900 dark:text-white">{rechargeTarget.email}</div>
                     <div className="text-sm text-slate-500 mt-0.5">当前余额: <span className="font-mono">{rechargeTarget.balance}</span></div>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">充值金额</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                    <input required name="amount" type="number" step="0.01" min="0" placeholder="0" className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">备注</label>
                  <textarea name="remark" rows={3} className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white transition-all resize-none shadow-sm"></textarea>
                </div>
              </div>

              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212] rounded-b-2xl">
                <button type="button" onClick={() => setRechargeTarget(null)} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  取消
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-xl shadow-sm transition-colors">
                  确认
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REFUND MODAL */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-[420px] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">退款</h3>
              <button onClick={() => setRefundTarget(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRefundSubmit} className="flex flex-col flex-1">
              <div className="p-5 space-y-5 flex-1">
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center text-xl font-bold shrink-0">
                     {refundTarget.email.charAt(0).toUpperCase()}
                   </div>
                   <div>
                     <div className="font-semibold text-slate-900 dark:text-white">{refundTarget.email}</div>
                     <div className="text-sm text-slate-500 mt-0.5">当前余额: <span className="font-mono">{refundTarget.balance}</span></div>
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">退款金额</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-500 font-medium z-10">$</span>
                    <input id="refund_amount" required name="amount" type="number" step="0.01" min="0" placeholder="0" className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl pl-8 pr-16 py-2.5 text-sm focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                    <button type="button" onClick={() => setRefundAll(refundTarget)} className="absolute right-2 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 rounded-md transition-colors">
                      全部
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">备注</label>
                  <textarea name="remark" rows={3} className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500 dark:focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-900 dark:text-white transition-all resize-none shadow-sm"></textarea>
                </div>
              </div>

              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212] rounded-b-2xl">
                <button type="button" onClick={() => setRefundTarget(null)} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  取消
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-[rgba(164,54,54,1)] dark:hover:bg-red-800 rounded-xl shadow-sm transition-colors border border-transparent dark:border-[rgba(255,255,255,0.1)]">
                  确认
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORDS MODAL */}
      {recordsTarget && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-3xl h-[600px] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10 shrink-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-500" />
                交易记录 - {recordsTarget.email}
              </h3>
              <button onClick={() => setRecordsTarget(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-white/10 px-5 shrink-0 bg-slate-50 dark:bg-[#121212]">
                <button
                  onClick={() => setRecordsTab('recharge')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${recordsTab === 'recharge' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  充值记录
                </button>
                <button
                  onClick={() => setRecordsTab('exchange')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${recordsTab === 'exchange' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
                >
                  兑换记录
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5">
              {recordsTab === 'recharge' ? (
                <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                   <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
                      <tr>
                        <th className="px-4 py-3 font-medium">交易时间</th>
                        <th className="px-4 py-3 font-medium">用户ID</th>
                        <th className="px-4 py-3 font-medium">充值金额</th>
                        <th className="px-4 py-3 font-medium">状态</th>
                        <th className="px-4 py-3 font-medium">备注</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="px-4 py-3 font-mono text-xs">Unavailable</td>
                        <td className="px-4 py-3 font-mono text-xs">{recordsTarget.id}</td>
                        <td className="px-4 py-3 text-slate-500 font-medium">Unavailable</td>
                        <td className="px-4 py-3"><span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-xs">成功</span></td>
                        <td className="px-4 py-3 text-xs text-slate-500">支付宝充值</td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="px-4 py-3 font-mono text-xs">Unavailable</td>
                        <td className="px-4 py-3 font-mono text-xs">{recordsTarget.id}</td>
                        <td className="px-4 py-3 text-slate-500 font-medium">Unavailable</td>
                        <td className="px-4 py-3"><span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-xs">成功</span></td>
                        <td className="px-4 py-3 text-xs text-slate-500">微信扫码</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                   <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
                      <tr>
                        <th className="px-4 py-3 font-medium">兑换时间</th>
                        <th className="px-4 py-3 font-medium">用户ID</th>
                        <th className="px-4 py-3 font-medium">兑换码</th>
                        <th className="px-4 py-3 font-medium">额度发放</th>
                        <th className="px-4 py-3 font-medium">状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                      <tr className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="px-4 py-3 font-mono text-xs">Unavailable</td>
                        <td className="px-4 py-3 font-mono text-xs">{recordsTarget.id}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">Unavailable</td>
                        <td className="px-4 py-3 text-slate-500 font-medium">Unavailable</td>
                        <td className="px-4 py-3"><span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-xs">成功</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
         </div>
      )}

      {/* EDIT USER MODAL */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">编辑用户 - {editTarget.email}</h3>
              <button onClick={() => setEditTarget(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="flex flex-col flex-1">
              <div className="p-5 space-y-5 flex-1">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">用户名</label>
                  <input name="username" type="text" defaultValue={editTarget.username !== '-' ? editTarget.username : ''} placeholder="请输入新的用户名" className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">修改密码 (留空则不修改)</label>
                  <div className="flex gap-2">
                    <input name="password" type="text" value={generatedPassword} onChange={(e) => setGeneratedPassword(e.target.value)} placeholder="如需重置密码，请输入新密码" className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white shadow-sm transition-all" />
                    <button type="button" onClick={generateRandomPassword} className="px-3 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-50 dark:bg-[#1e1e1e] text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212] rounded-b-2xl">
                <button type="button" onClick={() => setEditTarget(null)} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  取消
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 rounded-xl shadow-sm transition-colors">
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API KEYS MODAL */}
      {apiKeysTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-500" /> API密钥管理 - {apiKeysTarget.email}
              </h3>
              <button onClick={() => setApiKeysTarget(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <button type="button" onClick={() => setIsCreateApiKeyModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 dark:bg-white/5 dark:border-white/10 dark:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-sm font-medium">
                <Plus className="w-4 h-4" /> 添加新的 API 密钥
              </button>
              <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-[#121212] border-b border-slate-200 dark:border-white/10">
                    <tr>
                      <th className="px-4 py-3 font-medium">名称</th>
                      <th className="px-4 py-3 font-medium">密钥值</th>
                      <th className="px-4 py-3 font-medium">已用额度</th>
                      <th className="px-4 py-3 font-medium">状态</th>
                      <th className="px-4 py-3 font-medium text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                    {(apiKeysMap[apiKeysTarget.id] || []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                          暂无 API 密钥
                        </td>
                      </tr>
                    ) : (
                      (apiKeysMap[apiKeysTarget.id] || []).map((key) => (
                        <tr key={key.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                          <td className="px-4 py-3 text-slate-900 dark:text-white">{key.name}</td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-500">{key.key}</td>
                          <td className="px-4 py-3">{key.used}</td>
                          <td className="px-4 py-3"><span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded text-xs">启用</span></td>
                          <td className="px-4 py-3 text-right">
                            <button type="button" onClick={() => deleteApiKey(key.id)} className="text-slate-400 hover:text-red-500 transition-colors text-xs font-medium">
                              删除
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GROUPS MODAL */}
      {groupsTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" /> 分配分组
              </h3>
              <button onClick={() => setGroupsTarget(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleGroupSubmit} className="flex flex-col">
              <div className="p-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">为用户 {groupsTarget.email} 选择分组</label>
                <select name="group" defaultValue={groupsTarget.group} className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white shadow-sm transition-all appearance-none cursor-pointer">
                  <option value="default">default (默认分组)</option>
                  <option value="vip">VIP (高级用户)</option>
                  <option value="svip">SVIP (超级用户)</option>
                </select>
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212]">
                  <button type="button" onClick={() => setGroupsTarget(null)} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                    取消
                  </button>
                  <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 rounded-xl shadow-sm transition-colors">
                    保存
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* CREATE API KEY MODAL */}
      {isCreateApiKeyModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">创建新 API 密钥</h3>
              <button onClick={() => setIsCreateApiKeyModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApiKeySubmit} className="flex flex-col">
              <div className="p-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">名称</label>
                <input name="keyName" type="text" placeholder="如：开发环境密钥" className="w-full bg-white dark:bg-[#121212] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 text-slate-900 dark:text-white shadow-sm transition-all" />
              </div>
              <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end gap-3 bg-slate-50 dark:bg-[#121212] rounded-b-2xl">
                <button type="button" onClick={() => setIsCreateApiKeyModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1a1a1a] border border-slate-300 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  取消
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 rounded-xl shadow-sm transition-colors">
                  生成密钥
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHOW RAW KEY MODAL */}
      {newlyCreatedKey && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 API 密钥创建成功
              </h3>
              <button onClick={() => setNewlyCreatedKey(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-400 rounded-xl p-4 text-sm flex items-start gap-3">
                 <Shield className="w-5 h-5 shrink-0" />
                 <div className="leading-relaxed">请立即复制您的 API 密钥。由于安全原因，您将无法再次查看此密钥的完整内容。如果丢失，请删除此密钥并重新创建。</div>
              </div>
              <div className="relative">
                 <input type="text" readOnly value={newlyCreatedKey} className="w-full bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-32 py-3 text-sm font-mono text-slate-900 dark:text-white" />
                  <CopyButton
                    text={newlyCreatedKey}
                    label="复制"
                    copiedLabel="已复制"
                    variant="inline"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-slate-200 dark:border-white/10 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 shadow-sm transition-colors"
                    title="复制 API 密钥"
                  />
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 dark:border-white/10 flex justify-end bg-slate-50 dark:bg-[#121212]">
                <button onClick={() => setNewlyCreatedKey(null)} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 rounded-xl shadow-sm transition-colors w-full sm:w-auto">
                  我已经保存了此密钥
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
