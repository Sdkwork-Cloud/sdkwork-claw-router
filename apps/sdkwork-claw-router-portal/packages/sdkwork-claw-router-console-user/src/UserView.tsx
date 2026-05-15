import { useCallback, useEffect, useState } from 'react';
import { User, Activity, Shield, CheckCircle } from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import { UserService, UserProfile } from './userService';

const readOnlyUserActions =
  'Profile updates require an explicit generated App SDK contract before they can be enabled.';
const readOnlyUserSecurityActions =
  'Password, 2FA, and third-party binding controls are read-only until dedicated security command contracts exist.';
const readOnlyUserAvatarActions =
  'Avatar upload is read-only until a signed upload contract exists.';

function getLoadErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function UserView() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadUserProfile = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await UserService.fetchCurrentUser();
      if (isActive()) {
        setProfile(data);
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getLoadErrorMessage(error, 'Failed to load user profile.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadUserProfile(() => active);
    return () => {
      active = false;
    };
  }, [loadUserProfile]);

  if (loading) {
    return (
      <BusinessStatePanel
        kind="loading"
        title="Loading user profile..."
        className="m-4 lg:m-6 min-h-[400px]"
      />
    );
  }

  if (loadError) {
    return (
      <BusinessStatePanel
        kind="error"
        title="User profile could not be loaded"
        description={loadError}
        onRetry={() => void loadUserProfile()}
        className="m-4 lg:m-6 min-h-[400px]"
      />
    );
  }

  if (!profile) {
    return (
      <BusinessStatePanel
        kind="empty"
        title="No user profile found"
        description="The user profile API returned no profile data for the active session."
        onRetry={() => void loadUserProfile()}
        className="m-4 lg:m-6 min-h-[400px]"
      />
    );
  }

  return (
    <div className="p-4 lg:p-6 w-full mx-auto space-y-6 animate-in fade-in duration-500 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/5">
        <div>
           <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
             个人设置
           </h1>
           <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">查看您的基本信息、安全状态与偏好设置。</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left sm:text-right">
          <p className="max-w-xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {readOnlyUserActions}
          </p>
          <span className="shrink-0 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
            Read-only
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
           <div className="bg-white dark:bg-[#252525] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm flex flex-col items-center text-center">
             <div className="relative group mb-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-4 border-white dark:border-[#1e1e1e]">
                  {profile.avatar}
                </div>
             </div>
             <h2 className="text-lg font-bold text-slate-800 dark:text-white">{profile.name}</h2>
             <p className="text-sm text-slate-500 mb-4">{profile.email}</p>
             {profile.isVerified && (
               <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max mx-auto shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5" /> 已验证
               </span>
             )}
             <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
               {readOnlyUserAvatarActions}
             </p>
           </div>

           <div className="bg-white dark:bg-[#252525] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center gap-2 bg-slate-50 dark:bg-[#1a1a1a]">
                 <Activity className="w-4 h-4 text-slate-400" />
                 <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">账户摘要</h3>
              </div>
              <div className="p-4 space-y-3">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">账户状态</span>
                   <span className="text-emerald-600 font-medium">{profile.status}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">注册时间</span>
                   <span className="font-mono text-slate-800 dark:text-slate-300">{profile.registeredAt}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">最后登录</span>
                   <span className="font-mono text-slate-800 dark:text-slate-300 text-right">{profile.lastLogin}<br/><span className="text-[10px] text-slate-400">{profile.lastLoginIp}</span></span>
                 </div>
              </div>
           </div>
        </div>

        <div className="md:col-span-2 space-y-6">
           <div className="bg-white dark:bg-[#252525] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                 <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                   <User className="w-5 h-5 text-blue-500" /> 基本资料
                 </h3>
                 <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Read-only</span>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                 <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">昵称</label>
                   <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{profile.name}</div>
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">电子邮箱</label>
                   <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{profile.email}</div>
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">电话号码</label>
                   <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{profile.phone}</div>
                 </div>
                 <div>
                   <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">首选语言</label>
                   <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{profile.language}</div>
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-[#252525] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                 <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                   <Shield className="w-5 h-5 text-indigo-500" /> 登录与安全
                 </h3>
                 <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Read-only</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                 <div className="p-5 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-1">登录密码</div>
                      <div className="text-xs text-slate-500">最后修改于 {profile.passwordLastChanged}</div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Read-only</span>
                 </div>
                 <div className="p-5 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-1">二步验证 (2FA)</div>
                      <div className="text-xs text-slate-500">通过身份验证器 App 保护您的账户</div>
                    </div>
                    <div className="flex items-center gap-4">
                      {profile.twoFactorEnabled ? (
                        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded">开启状态</span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 rounded">未开启</span>
                      )}
                      <span className="text-xs text-slate-500 dark:text-slate-400">Read-only</span>
                    </div>
                 </div>
                 <div className="p-5 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-slate-800 dark:text-slate-200 mb-1">第三方账号绑定</div>
                      <div className="text-xs text-slate-500">已绑定 {profile.thirdPartyBound}</div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Read-only</span>
                 </div>
                 <div className="p-5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                   {readOnlyUserSecurityActions}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
