import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  QrCode,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { BusinessStatePanel } from 'sdkwork-claw-router-commons';
import { RechargeService } from 'sdkwork-claw-router-console-recharge';
import { CheckoutService, type CheckoutStatus } from './checkoutService';

type PaymentMethod = 'wechat' | 'alipay' | 'card';

function getCheckoutErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function CheckoutView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const amount = parseAmount(searchParams.get('amount'));
  const initialOrderNo = searchParams.get('orderNo') || '';

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wechat');
  const [orderNo, setOrderNo] = useState(initialOrderNo);
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const payableAmount = checkoutStatus?.amount || amount;
  const payableCents = moneyCents(payableAmount);
  const points = checkoutStatus?.points;
  const status = checkoutStatus?.status || 'pending';
  const terminalNotice = checkoutStatus ? checkoutStatusNotice(status) : '';
  const activePaymentMethod = normalizePaymentMethod(checkoutStatus?.paymentMethod) || paymentMethod;

  const loadCheckoutStatus = useCallback(async (targetOrderNo = orderNo, isActive: () => boolean = () => true) => {
    if (!targetOrderNo) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await CheckoutService.fetchCheckoutStatus(targetOrderNo);
      if (isActive()) {
        setCheckoutStatus(data);
        const normalizedMethod = normalizePaymentMethod(data.paymentMethod);
        if (normalizedMethod) {
          setPaymentMethod(normalizedMethod);
        }
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getCheckoutErrorMessage(error, 'Failed to load checkout status.'));
      }
    } finally {
      if (isActive()) {
        setIsLoading(false);
      }
    }
  }, [orderNo]);

  useEffect(() => {
    let active = true;
    if (initialOrderNo) {
      setOrderNo(initialOrderNo);
      void loadCheckoutStatus(initialOrderNo, () => active);
    } else if (moneyCents(amount) <= 0) {
      navigate('/console/billing?tab=recharge', { replace: true });
    }
    return () => {
      active = false;
    };
  }, [initialOrderNo, amount, navigate, loadCheckoutStatus]);

  const handleCreateCheckoutOrder = useCallback(async () => {
    setCheckoutError(null);
    if (moneyCents(amount) <= 0) return;
    setIsProcessing(true);
    try {
      const result = await RechargeService.submitRecharge(formatMoneyAmount(amount), paymentMethod);
      if (!result.orderNo) {
        setCheckoutError('Payment order could not be created. Please start a new recharge.');
        return;
      }
      setOrderNo(result.orderNo);
      navigate(`/console/checkout?orderNo=${encodeURIComponent(result.orderNo)}`, { replace: true });
      await loadCheckoutStatus(result.orderNo);
    } catch (error) {
      setCheckoutError(getCheckoutErrorMessage(error, 'Failed to create checkout order.'));
    } finally {
      setIsProcessing(false);
    }
  }, [amount, loadCheckoutStatus, navigate, paymentMethod]);

  if (status === 'success' && checkoutStatus) {
    return (
      <div className="p-4 lg:p-6 w-full mx-auto animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#121212] flex items-center justify-center">
        <div className="bg-white dark:bg-[#252525] p-8 md:p-12 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">支付成功</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            订单 {checkoutStatus.orderNo} 已完成支付。
          </p>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            充值金额 ${formatMoneyAmount(checkoutStatus.amount)}，到账 {checkoutStatus.points.toLocaleString()} 积分。
          </p>
          <button
            onClick={() => navigate('/console/billing?tab=recharge')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            返回钱包
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-business-state={loadError ? 'error' : undefined}
      className="p-4 lg:p-6 w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 min-h-[calc(100vh-72px)] bg-slate-50 dark:bg-[#121212]"
    >
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-slate-500 dark:text-slate-400"
          title="返回"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">收银台</h1>
          {orderNo && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">订单号 {orderNo}</p>}
        </div>
      </div>

      {loadError && (
        <BusinessStatePanel
          kind="error"
          title="Checkout status could not be loaded"
          description={loadError}
          onRetry={() => { void loadCheckoutStatus(orderNo); }}
          className="rounded-xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
        />
      )}

      {checkoutError && (
        <BusinessStatePanel
          kind="error"
          title="Checkout order could not be created"
          description={checkoutError}
          onRetry={() => { void handleCreateCheckoutOrder(); }}
          className="rounded-xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
        />
      )}

      {terminalNotice && (
        <div className="bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{terminalNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#252525] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">选择支付方式</h2>
              {orderNo && (
                <span className="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400">
                  已锁定订单支付方式
                </span>
              )}
            </div>
            <div className="space-y-4">
              <PaymentMethodOption
                active={activePaymentMethod === 'wechat'}
                disabled={Boolean(orderNo)}
                tone="emerald"
                badge="微"
                title="微信支付 (WeChat Pay)"
                description="支持扫码支付"
                onSelect={() => setPaymentMethod('wechat')}
              />
              <PaymentMethodOption
                active={activePaymentMethod === 'alipay'}
                disabled={Boolean(orderNo)}
                tone="blue"
                badge="支"
                title="支付宝 (Alipay)"
                description="支持扫码支付"
                onSelect={() => setPaymentMethod('alipay')}
              />
              <PaymentMethodOption
                active={activePaymentMethod === 'card'}
                disabled={Boolean(orderNo)}
                tone="slate"
                icon={<CreditCard className="w-5 h-5" />}
                title="国际信用卡 (Stripe)"
                description="支持 Visa, Mastercard"
                onSelect={() => setPaymentMethod('card')}
              />
            </div>
          </div>

          {checkoutStatus && (
            <div className="bg-white dark:bg-[#252525] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">支付进度</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusTile label="订单状态" value={checkoutStatus.orderStatus} />
                <StatusTile label="支付状态" value={checkoutStatus.paymentStatus} />
                <StatusTile label="充值状态" value={checkoutStatus.rechargeStatus} />
              </div>
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                创建时间 {checkoutStatus.createdAt || '-'}，过期时间 {checkoutStatus.expiresAt || '-'}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-[#252525] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">订单信息</h2>

            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>充值金额</span>
                <span className="font-semibold text-slate-800 dark:text-white">${formatMoneyAmount(payableAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span>获得积分</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">
                  {points === undefined ? '创建订单后确认' : `${points.toLocaleString()} 积分`}
                </span>
              </div>
              {checkoutStatus?.outTradeNo && (
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 gap-3">
                  <span>支付单号</span>
                  <span className="font-mono text-right break-all text-slate-800 dark:text-white">
                    {checkoutStatus.outTradeNo}
                  </span>
                </div>
              )}
              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-white">应付总额</span>
                <span className="text-2xl font-bold text-slate-800 dark:text-white font-mono">
                  ${formatMoneyAmount(payableAmount)}
                </span>
              </div>
            </div>

            {(activePaymentMethod === 'wechat' || activePaymentMethod === 'alipay') && (
              <div className="mt-6 border border-slate-200 dark:border-white/10 rounded-xl p-5 bg-slate-50 dark:bg-[#1e1e1e] flex flex-col items-center justify-center gap-4 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  {orderNo ? '请使用支付应用扫码完成付款' : '创建订单后生成支付凭证'}
                </p>
                <div className="w-40 h-40 bg-white rounded-xl p-3 shadow-sm flex items-center justify-center">
                  <QrCode className="w-full h-full text-slate-800" strokeWidth={1} />
                </div>
                <p className="text-[10px] text-slate-400 break-all">
                  {checkoutStatus?.qrCodePayload || orderNo || '等待创建支付订单'}
                </p>
              </div>
            )}

            <button
              onClick={orderNo ? () => { void loadCheckoutStatus(orderNo); } : () => { void handleCreateCheckoutOrder(); }}
              disabled={isProcessing || isLoading || payableCents <= 0 || isTerminalCheckoutStatus(status)}
              className="w-full mt-6 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing || isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> 处理中...
                </>
              ) : orderNo ? (
                <>
                  <RefreshCw className="w-5 h-5" /> 刷新支付状态
                </>
              ) : activePaymentMethod === 'card' ? (
                '创建卡支付订单'
              ) : (
                '创建扫码支付订单'
              )}
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 加密传输，保障资产安全
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PaymentMethodOptionProps {
  active: boolean;
  disabled: boolean;
  tone: 'emerald' | 'blue' | 'slate';
  badge?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  onSelect: () => void;
}

function PaymentMethodOption({
  active,
  disabled,
  tone,
  badge,
  icon,
  title,
  description,
  onSelect,
}: PaymentMethodOptionProps) {
  const activeClass =
    tone === 'emerald'
      ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/10'
      : 'border-blue-500 bg-blue-50/30 dark:bg-blue-500/10';
  const hoverClass = tone === 'emerald' ? 'hover:border-emerald-300' : 'hover:border-blue-300';
  const badgeClass =
    tone === 'emerald'
      ? 'bg-[#09B83E]/10 text-[#09B83E]'
      : tone === 'blue'
        ? 'bg-[#1677FF]/10 text-[#1677FF]'
        : 'bg-slate-100 dark:bg-[#1e1e1e] text-slate-600 dark:text-slate-300';
  const dotClass = tone === 'emerald' ? 'border-emerald-500 bg-emerald-500' : 'border-blue-500 bg-blue-500';

  return (
    <label
      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
        active ? activeClass : `border-slate-200 dark:border-white/10 ${disabled ? '' : hoverClass}`
      } ${disabled ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${badgeClass}`}>
          {icon || badge}
        </div>
        <div>
          <div className="font-semibold text-slate-800 dark:text-white">{title}</div>
          <div className="text-xs text-slate-500">{description}</div>
        </div>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? dotClass.split(' ')[0] : 'border-slate-300'}`}>
        {active && <div className={`w-2.5 h-2.5 rounded-full ${dotClass.split(' ')[1]}`}></div>}
      </div>
      <input type="radio" className="hidden" checked={active} disabled={disabled} onChange={onSelect} />
    </label>
  );
}

function StatusTile({ label, value }: { label: string; value: string }) {
  const tone = checkoutStatusTone(value);
  const text = checkoutStatusText(value);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/10 p-4 bg-slate-50 dark:bg-[#1e1e1e]">
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">{label}</div>
      <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${tone}`}>{text}</div>
    </div>
  );
}

function isTerminalCheckoutStatus(status: CheckoutStatus['status']): boolean {
  return status === 'failed' || status === 'expired' || status === 'refunding' || status === 'refunded';
}

function checkoutStatusNotice(status: CheckoutStatus['status']): string {
  switch (status) {
    case 'failed':
      return '当前订单支付失败，请重新发起充值或联系支持处理。';
    case 'expired':
      return '当前订单已过期，请重新发起充值。';
    case 'refunding':
      return '当前订单正在退款处理中，请等待退款结果或联系支持。';
    case 'refunded':
      return '当前订单已退款，如需充值请重新创建订单。';
    default:
      return '';
  }
}

function checkoutStatusText(value: string): string {
  switch (value) {
    case 'success':
      return '成功';
    case 'failed':
      return '失败';
    case 'expired':
      return '已过期';
    case 'refunding':
      return '退款中';
    case 'refunded':
      return '已退款';
    default:
      return '待支付';
  }
}

function checkoutStatusTone(value: string): string {
  if (value === 'success') {
    return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
  }
  if (value === 'failed') {
    return 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400';
  }
  if (value === 'expired' || value === 'refunding' || value === 'refunded') {
    return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300';
  }
  return 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400';
}

function parseAmount(value: string | null): string {
  if (!value) {
    return '0.00';
  }
  const decoded = value.trim();
  return /^\d+(?:\.\d{1,2})?$/.test(decoded) ? formatMoneyAmount(decoded) : '0.00';
}

function moneyCents(amount: string): number {
  const value = amount.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) {
    return 0;
  }
  const [whole, fraction = ''] = value.split('.');
  const cents = Number.parseInt(whole, 10) * 100 + Number.parseInt(fraction.padEnd(2, '0'), 10);
  return Number.isSafeInteger(cents) ? cents : 0;
}

function formatMoneyAmount(amount: string): string {
  const cents = moneyCents(amount);
  const whole = Math.floor(cents / 100);
  const fraction = String(cents % 100).padStart(2, '0');
  return `${whole}.${fraction}`;
}

function normalizePaymentMethod(value?: string): PaymentMethod | null {
  const normalized = (value || '').toLowerCase();
  if (normalized.includes('wechat')) {
    return 'wechat';
  }
  if (normalized.includes('ali')) {
    return 'alipay';
  }
  if (normalized.includes('card') || normalized.includes('stripe')) {
    return 'card';
  }
  return null;
}
