import { useCallback, useState, useEffect } from 'react';
import { User, Mail, Building, ShieldCheck, LogIn, Smartphone, KeyRound, Briefcase, Wallet, CreditCard, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BusinessStatePanel, CopyButton } from 'sdkwork-claw-router-commons';
import { AccountService, AccountStats } from './accountService';

const readOnlyAccountActions =
  'Read-only account summary. Invoice profile changes, security policy changes, and account mutations require explicit account command contracts before they can be enabled.';

function getAccountErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function AccountView() {
  const [data, setData] = useState<AccountStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadAccountDetails = useCallback(async (isActive: () => boolean = () => true) => {
    setLoading(true);
    setLoadError(null);
    try {
      const accountDetails = await AccountService.fetchAccountDetails();
      if (isActive()) {
        setData(accountDetails);
      }
    } catch (error) {
      if (isActive()) {
        setData(null);
        setLoadError(getAccountErrorMessage(error, 'Failed to load account details.'));
      }
    } finally {
      if (isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    void loadAccountDetails(() => active);
    return () => {
      active = false;
    };
  }, [loadAccountDetails]);

  if (loading) {
    return (
      <div className="p-4 lg:p-6 w-full mx-auto animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#121212]">
        <BusinessStatePanel
          kind="loading"
          title="Loading account details..."
          className="min-h-[400px] rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/5 dark:bg-[#252525]"
        />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-4 lg:p-6 w-full mx-auto animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#121212]">
        <BusinessStatePanel
          kind="error"
          title="Account details could not be loaded"
          description={loadError}
          onRetry={() => void loadAccountDetails()}
          className="min-h-[400px] rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/5 dark:bg-[#252525]"
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 lg:p-6 w-full mx-auto animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#121212]">
        <BusinessStatePanel
          kind="empty"
          title="Account details are unavailable"
          description="The account summary API returned no displayable account data."
          onRetry={() => void loadAccountDetails()}
          className="min-h-[400px] rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/5 dark:bg-[#252525]"
        />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 w-full mx-auto space-y-6 animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#121212]">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-lobster-500" />
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">账户详情与财务总览</h1>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-left sm:text-right">
          <p className="max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {readOnlyAccountActions}
          </p>
          <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Read-only
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Column: Profile & Identity */}
        <div className="xl:col-span-2 space-y-6">

          {/* Main ID Card */}
          <div className="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-start sm:items-center relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-lobster-500 to-amber-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shrink-0 border-4 border-white dark:border-[#1e1e1e]">
              {data.name.charAt(0)}
            </div>

            <div className="flex-1 space-y-2 relative z-10 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  {data.name}
                  {data.isVerified && (
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide flex items-center gap-1 uppercase">
                      <ShieldCheck className="w-3 h-3" /> 已实名认证
                    </span>
                  )}
                </h2>
                <span className="text-xs bg-gradient-to-r from-lobster-500 to-amber-500 text-white px-3 py-1 rounded-full font-semibold shadow-sm w-fit inline-flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5" /> {data.tier}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 dark:text-slate-400 mt-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                   <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                   <span className="text-slate-700 dark:text-slate-300">{data.email}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                   <span className="text-slate-500 font-medium">应用账户 ID:</span>
                   <span className="font-mono text-slate-800 dark:text-slate-300">{data.id}</span>
                   <CopyButton
                     text={data.id}
                     label="复制 ID"
                     copiedLabel="已复制 ID"
                     className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                     iconClassName="w-3.5 h-3.5"
                     title="复制 ID"
                   />
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Building className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span>归属组织结构: <strong className="text-slate-700 dark:text-slate-300">{data.organization}</strong></span>
              </div>
            </div>
          </div>

          {/* New Balance & Financial Widget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-lobster-50 to-amber-50 dark:from-[#252525] dark:to-[#1e1e1e] border border-lobster-100 dark:border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-lobster-500/10 rounded-full blur-2xl -mr-10 -mb-10 pointer-events-none group-hover:bg-lobster-500/20 transition-all"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-2">
                    <Wallet className="w-5 h-5 text-lobster-500 dark:text-lobster-400" />
                    <span className="font-medium text-sm">主账户可用积分</span>
                  </div>
                  <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight flex items-end gap-2">
                   {data.availableCredits.toLocaleString()}<span className="text-xl font-medium text-slate-300 ml-1">积分</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-xs text-slate-400">预计可支撑并发调用约 <strong className="text-white">{data.estDaysRemaining} 天</strong></div>
                  <Link to="/console/billing?tab=recharge" className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/5 flex items-center gap-1 shadow-sm">
                    去充值 <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
               <div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-sm">本月实时消耗 (积分)</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                    {data.monthlyConsumption} 积分
                  </div>
               </div>
               <div className="mt-6 space-y-3">
                 <div className="flex justify-between items-center text-sm">
                   <div className="w-full bg-slate-100 dark:bg-[#1e1e1e] rounded-full h-1.5 overflow-hidden flex">
                     {data.consumptionByService.map((svc, i) => (
                       <div key={i} className={`${svc.color} h-full`} style={{ width: `${svc.percentage}%` }}></div>
                     ))}
                   </div>
                 </div>
                 <Link to="/console/usage" className="block text-right text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline pt-1">
                   查看调用流水趋势
                 </Link>
               </div>
            </div>
          </div>

          {/* KYC / Enterprise Verification */}
          <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-[#1e1e1e]/50">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-lobster-500" /> 会计与发票资质 (Invoice Settings)
              </h3>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                Read-only
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1 uppercase tracking-wider">组织全称 (Company Name)</label>
                <div className="font-medium text-slate-800 dark:text-slate-200">{data.invoiceSettings.orgFull}</div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1 uppercase tracking-wider">统一社会信用代码/税号 (Tax ID)</label>
                <div className="font-medium text-slate-800 dark:text-slate-200 font-mono">{data.invoiceSettings.taxId}</div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1 uppercase tracking-wider">自动扣款授权账户 (Payment Method)</label>
                <div className="font-medium text-slate-800 dark:text-slate-200">{data.invoiceSettings.paymentMethod}</div>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 font-medium mb-1 uppercase tracking-wider">发票抬头类型 (Invoice Type)</label>
                <div className="font-medium text-slate-800 dark:text-slate-200">{data.invoiceSettings.invoiceType}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Security & Logs */}
        <div className="xl:col-span-1 space-y-6">

          {/* Security Overview */}
          <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm p-6 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20">
                 <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white">API 网关安全矩阵</h3>
                 <p className="text-[13px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">企业级防护已全面就绪</p>
               </div>
             </div>

             <div className="space-y-4 relative z-10 mb-6 border-b border-slate-100 dark:border-white/5 pb-6">
               <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                   <Smartphone className="w-4 h-4 text-slate-400 dark:text-slate-500" /> MFA 多因素认证
                 </span>
                 {data.security.mfaEnabled ? (
                   <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-xs font-bold">已启用</span>
                 ) : (
                   <span className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded text-xs font-bold text-slate-500">未启用</span>
                 )}
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                   <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-500" /> 网关单日并发峰值
                 </span>
                 <span className="text-slate-800 dark:text-slate-200 font-mono font-medium">{data.security.qpsLimit} QPS</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-slate-400 dark:text-slate-500" /> IP 跨域调用白名单
                 </span>
                 <span className="text-blue-600 dark:text-blue-400 font-medium">配置中 ({data.security.ipWhitelistCount})</span>
               </div>
             </div>

             <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-sm font-medium text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
               Read-only security summary
             </div>
          </div>

          {/* Login Activity */}
          <div className="bg-white dark:bg-[#252525] border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm overflow-hidden">
             <div className="p-5 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#1e1e1e]/50 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm">
                 <LogIn className="w-4 h-4 text-slate-500 dark:text-slate-400" /> 管理员登录日志
               </h3>
             </div>
             <div className="p-2">
               {data.loginLogs.map((log, i) => (
                 <div key={i} className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-white/[0.02] rounded-lg transition-colors">
                   <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${log.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{log.location}</p>
                     <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                       <span className="font-mono">{log.ip}</span>
                       <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                       <span className="truncate">{log.device}</span>
                     </div>
                   </div>
                   <div className="text-[11px] text-slate-400 shrink-0">{log.time}</div>
                 </div>
               ))}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
