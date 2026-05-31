import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Crown, Loader2, Sparkles, Star, Zap, Info, X, QrCode, CreditCard, Gift, WalletCards, User } from 'lucide-react';
import { toDataURL } from 'qrcode';
import { BusinessStatePanel, formatRechargeCurrencyAmount } from 'sdkwork-claw-router-commons';
import { hasStoredPortalSession } from 'sdkwork-claw-router-commons/runtime';
import { CheckoutService, type CheckoutStatus } from 'sdkwork-claw-router-console-checkout';
import { RechargePackageSelector, RechargeService, type RechargeOption } from 'sdkwork-claw-router-console-recharge';
import { UserService, type UserProfile } from 'sdkwork-claw-router-console-user';
import { VipService, type VipPackageGroup, type VipPackage, type VipSummary, type VipCatalog } from './vipService';
import { useTranslation } from 'react-i18next';

type TranslationFunction = ReturnType<typeof useTranslation>['t'];

function getVipErrorMessage(error: unknown, fallback: string, t: TranslationFunction): string {
  if (error instanceof Error) {
    const message = error.message.trim();
    if (message.startsWith('vip.') || message.startsWith('console.')) {
      return t(message, fallback);
    }
    if (message) {
      return message;
    }
  }
  return fallback;
}

function getCurrentUserDisplayName(currentUser: UserProfile | null, t: TranslationFunction): string {
  const profileName = currentUser?.name?.trim();
  if (profileName) {
    return profileName;
  }
  const profileEmail = currentUser?.email?.trim();
  if (profileEmail) {
    return profileEmail;
  }
  return t('vip.pointsPurchase.defaultUserName', 'Current user');
}

function getCurrentUserAvatarSource(currentUser: UserProfile | null): string {
  return currentUser?.avatar?.trim() ?? '';
}

export function VipView() {
  return <VipPurchasePage />;
}

export function VipPurchasePage() {
  return <VipPurchaseExperience variant="page" />;
}

export function VipPurchaseModal({
  onClose,
  onPurchased,
}: {
  onClose: () => void;
  onPurchased?: () => void;
}) {
  return <VipPurchaseExperience onClose={onClose} onPurchased={onPurchased} variant="modal" />;
}

function VipPurchaseExperience({
  onClose,
  onPurchased,
  variant = 'page',
}: {
  onClose?: () => void;
  onPurchased?: () => void;
  variant?: 'page' | 'modal';
}) {
  const { t } = useTranslation();
  const [catalog, setCatalog] = useState<VipCatalog | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [processingPackageId, setProcessingPackageId] = useState<string | null>(null);
  const [purchaseErrorMsg, setPurchaseErrorMsg] = useState('');
  const [pointsPurchaseDialogOpen, setPointsPurchaseDialogOpen] = useState(false);
  const [membershipRedeemDialogOpen, setMembershipRedeemDialogOpen] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState<{
    packageItem: VipPackage;
    paymentId?: string;
    qrCodePayload?: string;
    qrCodeImageUrl?: string;
    requestNo: string;
    status: string;
  } | null>(null);

  const loadVipData = useCallback(async (isActive: () => boolean = () => true) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await VipService.fetchVipCatalog();
      if (isActive()) {
        setCatalog(data);
        if (data.groups.length > 0 && !activeGroupId) {
          setActiveGroupId(data.groups[0].id);
        }
      }
    } catch (error) {
      if (isActive()) {
        setLoadError(getVipErrorMessage(error, t('vip.loadError', 'VIP packages could not be loaded'), t));
      }
    } finally {
      if (isActive()) {
        setIsLoading(false);
      }
    }
  }, [activeGroupId, t]);

  useEffect(() => {
    let active = true;
    void loadVipData(() => active);
    return () => { active = false; };
  }, [loadVipData]);

  useEffect(() => {
    if (variant !== 'modal' || typeof document === 'undefined') {
      return undefined;
    }
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [variant]);

  const activeGroup = useMemo(() => {
    if (!catalog || !activeGroupId) return null;
    return catalog.groups.find((g) => g.id === activeGroupId) ?? catalog.groups[0] ?? null;
  }, [catalog, activeGroupId]);

  const activePackages = useMemo(() => activeGroup?.packages ?? [], [activeGroup]);

  const summary = catalog?.summary ?? null;

  const handleGroupChange = useCallback((groupId: string) => {
    setActiveGroupId(groupId);
    setPurchaseErrorMsg('');
  }, []);

  const handlePurchase = async (pkg: VipPackage) => {
    if (!pkg.isPurchasable) {
      setPurchaseErrorMsg(t('vip.purchaseUnavailable', 'This package is temporarily unavailable for purchase.'));
      return;
    }
    setProcessingPackageId(pkg.id);
    setPurchaseErrorMsg('');
    try {
      const result = await VipService.purchaseVipPackage(pkg.id);
      setPaymentDialog({
        packageItem: pkg,
        paymentId: result.paymentId,
        qrCodePayload: result.qrCodePayload,
        qrCodeImageUrl: result.qrCodeImageUrl,
        requestNo: result.requestNo,
        status: result.status,
      });
      onPurchased?.();
      void loadVipData();
    } catch (error) {
      setPurchaseErrorMsg(getVipErrorMessage(error, t('vip.purchaseError', 'VIP purchase could not be created'), t));
    } finally {
      setProcessingPackageId(null);
    }
  };

  const purchaseContent = (
    <div className={variant === 'modal' ? 'bg-white dark:bg-[#050505]' : 'min-h-[calc(100vh-72px)] bg-white dark:bg-[#050505]'}>
      <div className={variant === 'modal' ? 'mx-auto w-full px-4 pb-8 pt-10 sm:px-6 lg:px-8' : 'mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8'}>
        <div className={variant === 'modal' ? 'mb-8 text-left sm:text-center' : 'mb-12 text-center'}>
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl">
            {t('vip.title', 'Upgrade your VIP membership')}
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-400">
            {t('vip.subtitle', 'Choose the package that matches your usage. VIP purchases are fulfilled by the standard order and payment center.')}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>{t('vip.directPurchasePrefix', 'Or')}</span>
            <button
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-lobster-600 transition-colors hover:bg-lobster-50 hover:text-lobster-700 dark:text-lobster-400 dark:hover:bg-lobster-500/10 dark:hover:text-lobster-300"
              onClick={() => setPointsPurchaseDialogOpen(true)}
              type="button"
            >
              <WalletCards className="h-4 w-4" />
              {t('vip.buyPoints', 'buy credits directly')}
            </button>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-lobster-600 transition-colors hover:bg-lobster-50 hover:text-lobster-700 dark:text-lobster-400 dark:hover:bg-lobster-500/10 dark:hover:text-lobster-300"
              onClick={() => setMembershipRedeemDialogOpen(true)}
              type="button"
            >
              <Gift className="h-4 w-4" />
              {t('vip.membershipRedeem', 'redeem membership')}
            </button>
          </div>
          {summary?.currentPlanName && (
            <p className="mt-3 text-sm text-lobster-600 dark:text-lobster-400">
              {summary.expiresAt
                ? t('vip.currentPlanExpires', 'Current plan: {{planName}} · Expires: {{date}}', {
                  date: new Date(summary.expiresAt).toLocaleDateString(),
                  planName: summary.currentPlanName,
                })
                : t('vip.currentPlanInfo', 'Current plan: {{planName}}', { planName: summary.currentPlanName })}
            </p>
          )}
        </div>

        {catalog && catalog.groups.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            {catalog.groups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleGroupChange(group.id)}
                className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeGroupId === group.id
                    ? 'bg-lobster-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
                type="button"
              >
                {t(group.name, group.name)}
                {group.discount ? (
                  <span className={`ml-1.5 ${activeGroupId === group.id ? 'text-lobster-100' : 'text-lobster-500 dark:text-lobster-400'}`}>
                    {t(group.discount, group.discount)}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <BusinessStatePanel
            kind="loading"
            title={t('vip.loading', 'Loading VIP packages...')}
            className="min-h-96 rounded-2xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5"
          />
        ) : loadError ? (
          <BusinessStatePanel
            kind="error"
            title={t('vip.loadFailed', 'VIP packages failed to load')}
            description={loadError}
            onRetry={() => { void loadVipData(); }}
            className="min-h-96 rounded-2xl border border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10"
          />
        ) : (
          <>
            {purchaseErrorMsg ? (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                {purchaseErrorMsg}
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {activePackages.map((pkg) => (
                <VipPackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isCurrentPlan={summary?.currentPlanId === pkg.planId}
                  isProcessing={processingPackageId === pkg.id}
                  onPurchase={() => { void handlePurchase(pkg); }}
                />
              ))}
            </div>

            {paymentDialog ? (
              <VipPaymentDialog
                paymentDialog={paymentDialog}
                onClose={() => setPaymentDialog(null)}
              />
            ) : null}

            {pointsPurchaseDialogOpen ? (
              <VipPointsPurchaseModal
                pointsBalance={summary?.pointsBalance ?? null}
                onClose={() => setPointsPurchaseDialogOpen(false)}
              />
            ) : null}

            {membershipRedeemDialogOpen ? (
              <VipMembershipRedeemModal
                onClose={() => setMembershipRedeemDialogOpen(false)}
                onRedeemed={() => { void loadVipData(); }}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );

  if (variant === 'modal') {
    return (
      <div
        aria-label={t('vip.title', 'Upgrade your VIP membership')}
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-3 py-4 backdrop-blur-sm sm:px-6"
        role="dialog"
      >
        <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-7xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#050505]">
          <button
            aria-label={t('vip.modalClose', 'Close VIP purchase dialog')}
            className="absolute right-4 top-4 z-10 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-500 shadow-sm transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:bg-[#171717]/90 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
          {purchaseContent}
        </div>
      </div>
    );
  }

  return purchaseContent;
}

function VipPointsPurchaseModal({
  pointsBalance,
  onClose,
}: {
  pointsBalance: number | null;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [selectedRechargeOptionId, setSelectedRechargeOptionId] = useState('');
  const [selectedRechargeOption, setSelectedRechargeOption] = useState<RechargeOption | null>(null);
  const [checkoutError, setCheckoutError] = useState('');
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [pointsCheckoutStatus, setPointsCheckoutStatus] = useState<CheckoutStatus | null>(null);
  const [generatedPointsQrCodeUrl, setGeneratedPointsQrCodeUrl] = useState('');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [avatarLoadFailed, setAvatarLoadFailed] = useState(false);
  const latestCheckoutRequestRef = useRef(0);
  const selectionCheckoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeCheckoutOrderRef = useRef<{
    currencyCode: string;
    orderNo: string;
    optionId: string;
    packageId?: string;
  } | null>(null);

  useEffect(() => {
    if (!hasStoredPortalSession()) {
      setCurrentUser(null);
      return;
    }

    let active = true;
    void UserService.fetchCurrentUser()
      .then((profile) => {
        if (active) {
          setCurrentUser(profile);
        }
      })
      .catch(() => {
        if (active) {
          setCurrentUser(null);
        }
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const currentUserDisplayName = useMemo(
    () => getCurrentUserDisplayName(currentUser, t),
    [currentUser, t],
  );
  const currentUserAvatarSource = useMemo(
    () => getCurrentUserAvatarSource(currentUser),
    [currentUser],
  );
  const currentUserAvatarUrl = avatarLoadFailed ? '' : currentUserAvatarSource;

  useEffect(() => {
    setAvatarLoadFailed(false);
  }, [currentUserAvatarSource]);

  const onCheckoutCreated = useCallback((checkoutStatus: CheckoutStatus) => {
    setPointsCheckoutStatus(checkoutStatus);
  }, []);

  const clearSelectionCheckoutTimer = useCallback(() => {
    if (selectionCheckoutTimerRef.current !== null) {
      clearTimeout(selectionCheckoutTimerRef.current);
      selectionCheckoutTimerRef.current = null;
    }
  }, []);

  const resetCheckoutPresentation = useCallback(() => {
    setPointsCheckoutStatus(null);
    setGeneratedPointsQrCodeUrl('');
  }, []);

  const cancelRechargeOrderSilently = useCallback((orderNo: string, note: string) => {
    void RechargeService.cancelRechargeOrder(orderNo, note).catch(() => {});
  }, []);

  const cancelActiveCheckoutOrder = useCallback(async (
    checkoutOrder: {
      currencyCode: string;
      orderNo: string;
      optionId: string;
      packageId?: string;
    },
  ) => {
    try {
      await RechargeService.cancelRechargeOrder(checkoutOrder.orderNo, 'package-switch');
      if (activeCheckoutOrderRef.current?.orderNo === checkoutOrder.orderNo) {
        activeCheckoutOrderRef.current = null;
      }
      return;
    } catch (error) {
      const latestStatus = await CheckoutService.fetchCheckoutStatus(checkoutOrder.orderNo).catch(() => null);
      if (latestStatus && isTerminalPointCheckoutStatus(latestStatus.paymentStatus)) {
        if (activeCheckoutOrderRef.current?.orderNo === checkoutOrder.orderNo) {
          activeCheckoutOrderRef.current = null;
        }
        return;
      }
      throw error;
    }
  }, []);

  const createPointsCheckout = useCallback(async (option: RechargeOption, forceRefresh = false, isActive: () => boolean = () => true) => {
    const checkoutSequence = latestCheckoutRequestRef.current + 1;
    latestCheckoutRequestRef.current = checkoutSequence;
    setSelectedRechargeOptionId(option.id);
    setSelectedRechargeOption(option);
    setCheckoutError('');
    const activeCheckoutOrder = activeCheckoutOrderRef.current;
    const canReuseActiveOrder =
      !forceRefresh
      && activeCheckoutOrder !== null
      && activeCheckoutOrder.optionId === option.id
      && activeCheckoutOrder.currencyCode === option.currencyCode
      && activeCheckoutOrder.packageId === option.packageId;
    if (!canReuseActiveOrder) {
      resetCheckoutPresentation();
    }
    setIsCheckoutLoading(true);
    let createdOrderNo: string | null = null;
    try {
      if (!canReuseActiveOrder && activeCheckoutOrder && activeCheckoutOrder.optionId !== option.id) {
        await cancelActiveCheckoutOrder(activeCheckoutOrder);
      }

      const reusableCheckoutOrder = activeCheckoutOrderRef.current;
      const canReuseCurrentOrder =
        !forceRefresh
        && reusableCheckoutOrder !== null
        && reusableCheckoutOrder.optionId === option.id
        && reusableCheckoutOrder.currencyCode === option.currencyCode
        && reusableCheckoutOrder.packageId === option.packageId;

      const targetOrderNo = canReuseCurrentOrder
        ? reusableCheckoutOrder.orderNo
        : (createdOrderNo = (await RechargeService.submitRecharge(option.amount, option.currencyCode, option.packageId)).orderNo);
      const checkoutStatus = await CheckoutService.fetchCheckoutStatus(targetOrderNo);
      if (!isActive() || latestCheckoutRequestRef.current !== checkoutSequence) {
        if (createdOrderNo) {
          cancelRechargeOrderSilently(createdOrderNo, 'selection-replaced');
        }
        return;
      }
      if (!isTerminalPointCheckoutStatus(checkoutStatus.paymentStatus)) {
        activeCheckoutOrderRef.current = {
          currencyCode: option.currencyCode,
          orderNo: targetOrderNo,
          optionId: option.id,
          packageId: option.packageId,
        };
      } else {
        activeCheckoutOrderRef.current = null;
      }
      onCheckoutCreated(checkoutStatus);
    } catch (error) {
      if (!isActive() || latestCheckoutRequestRef.current !== checkoutSequence) {
        if (createdOrderNo) {
          cancelRechargeOrderSilently(createdOrderNo, 'selection-replaced');
        }
        return;
      }
      if (createdOrderNo) {
        activeCheckoutOrderRef.current = {
          currencyCode: option.currencyCode,
          orderNo: createdOrderNo,
          optionId: option.id,
          packageId: option.packageId,
        };
      } else if (activeCheckoutOrderRef.current?.optionId !== option.id) {
        activeCheckoutOrderRef.current = null;
      }
      setCheckoutError(getVipErrorMessage(error, t('vip.pointsPurchase.checkoutError', 'Credit purchase checkout could not be created.'), t));
    } finally {
      if (isActive() && latestCheckoutRequestRef.current === checkoutSequence) {
        setIsCheckoutLoading(false);
      }
    }
  }, [cancelActiveCheckoutOrder, cancelRechargeOrderSilently, onCheckoutCreated, resetCheckoutPresentation, t]);

  const handleRechargeOptionChange = useCallback((option: RechargeOption | null) => {
    clearSelectionCheckoutTimer();
    latestCheckoutRequestRef.current += 1;
    setSelectedRechargeOption(option);
    setSelectedRechargeOptionId(option?.id ?? '');
    setCheckoutError('');
    if (!option) {
      resetCheckoutPresentation();
      setIsCheckoutLoading(false);
      return;
    }

    const isSameOption = selectedRechargeOptionId === option.id;
    const shouldForceRefresh = Boolean(
      isSameOption
      && pointsCheckoutStatus
      && isTerminalPointCheckoutStatus(pointsCheckoutStatus.paymentStatus),
    );

    if (!isSameOption || shouldForceRefresh || !activeCheckoutOrderRef.current) {
      resetCheckoutPresentation();
    }

    selectionCheckoutTimerRef.current = setTimeout(() => {
      selectionCheckoutTimerRef.current = null;
      void createPointsCheckout(option, shouldForceRefresh);
    }, 180);
  }, [clearSelectionCheckoutTimer, createPointsCheckout, pointsCheckoutStatus, resetCheckoutPresentation, selectedRechargeOptionId]);

  useEffect(() => {
    return () => {
      clearSelectionCheckoutTimer();
      latestCheckoutRequestRef.current += 1;
      activeCheckoutOrderRef.current = null;
    };
  }, [clearSelectionCheckoutTimer]);

  useEffect(() => {
    let active = true;
    setGeneratedPointsQrCodeUrl('');
    if (!pointsCheckoutStatus?.qrCodePayload) {
      return () => { active = false; };
    }
    void toDataURL(pointsCheckoutStatus.qrCodePayload, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 512,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (active) {
          setGeneratedPointsQrCodeUrl(url);
        }
      })
      .catch(() => {
        if (active) {
          setGeneratedPointsQrCodeUrl('');
        }
      });
    return () => { active = false; };
  }, [pointsCheckoutStatus?.qrCodePayload]);

  const paymentStatusText = pointsCheckoutStatus?.paymentStatus
    ? getPointCheckoutStatusText(pointsCheckoutStatus.paymentStatus, t)
    : isCheckoutLoading
      ? t('vip.pointsPurchase.creatingOrder', 'Creating order...')
      : selectedRechargeOption
        ? t('vip.pointsPurchase.paymentHint', 'The payment code updates automatically when you switch credit packages')
        : t('vip.pointsPurchase.selectPackageHint', 'Select a credit package to automatically update the payment code');

  return (
    <div data-vip-points-purchase className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-3 py-4 backdrop-blur-md sm:px-6">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-[1020px] overflow-y-auto rounded-[24px] bg-[#22262b] text-white shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-12 sm:py-9">
          <div className="flex min-w-0 items-center gap-3">
            <div
              aria-label={currentUserAvatarUrl ? undefined : t('vip.pointsPurchase.defaultAvatarLabel', 'Default user avatar')}
              className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700 text-white shadow-lg shadow-black/20 ring-1 ring-white/10"
              role={currentUserAvatarUrl ? undefined : 'img'}
            >
              {currentUserAvatarUrl ? (
                <img
                  alt={t('vip.pointsPurchase.userAvatarAlt', '{{name}} avatar', { name: currentUserDisplayName })}
                  className="h-full w-full object-cover"
                  onError={() => setAvatarLoadFailed(true)}
                  src={currentUserAvatarUrl}
                />
              ) : (
                <User aria-hidden="true" className="h-7 w-7 text-slate-200" strokeWidth={1.8} />
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-bold tracking-normal text-white sm:text-xl" title={currentUserDisplayName}>
                {currentUserDisplayName}
              </div>
              <div className="mt-0.5 truncate text-xs font-medium text-slate-400">
                {t('vip.pointsPurchase.accountLabel', 'Credit account')}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-6">
            <div className="hidden items-center gap-3 text-sm text-slate-400 sm:flex">
              <span>{t('vip.pointsPurchase.myPoints', 'My credits')}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-lg font-bold text-white">
                <Sparkles className="h-4 w-4 fill-white text-white" />
                {pointsBalance === null ? '-' : pointsBalance.toLocaleString()}
              </span>
            </div>
            <span className="hidden h-5 w-px bg-white/10 sm:block" />
            <button
              aria-label={t('vip.pointsPurchase.close', 'Close credits purchase dialog')}
              className="rounded-full p-2 text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              onClick={onClose}
              type="button"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="rounded-t-[24px] bg-[#292e34] px-5 pb-8 pt-10 sm:px-12">
          <div className="mb-10 flex items-center justify-center gap-6">
            <span className="h-px w-20 bg-white/10 sm:w-32" />
            <h2 className="shrink-0 text-2xl font-bold tracking-normal text-white">
              {t('vip.pointsPurchase.title', 'Buy credits')}
            </h2>
            <span className="h-px w-20 bg-white/10 sm:w-32" />
          </div>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_1px_minmax(280px,0.45fr)]">
            <div>
              <RechargePackageSelector
                disabled={isCheckoutLoading}
                onSelectionChange={handleRechargeOptionChange}
                selectedOptionId={selectedRechargeOptionId}
                variant="vip"
              />

              <p className="mt-10 text-center text-sm leading-6 text-slate-400 sm:text-left">
                {t('vip.pointsPurchase.rules', 'Notice: credits cannot be exchanged for membership, transferred, or withdrawn. Credits are valid for 2 years after recharge and do not support refund or reverse conversion to RMB.')}
              </p>
            </div>

            <div className="hidden min-h-[280px] bg-white/10 lg:block" />

            <div className="flex flex-col items-center text-center">
              <div className="flex aspect-square w-full max-w-[270px] items-center justify-center rounded-xl bg-white p-4 shadow-xl shadow-black/20">
                {generatedPointsQrCodeUrl ? (
                  <img
                    alt={t('vip.pointsPurchase.qrAlt', 'Credit purchase payment QR code')}
                    className="h-full w-full bg-white object-contain"
                    src={generatedPointsQrCodeUrl}
                  />
                ) : isCheckoutLoading ? (
                  <Loader2 className="h-12 w-12 animate-spin text-slate-700" />
                ) : (
                  <QrCode className="h-full w-full text-slate-900" strokeWidth={1.5} />
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-base font-semibold text-slate-300">
                <span>{t('vip.pointsPurchase.scanTitle', 'Scan to complete payment')}</span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#1677ff] text-xs font-bold text-white">
                  {t('vip.pointsPurchase.alipayShort', 'A')}
                </span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#17b26a] text-xs font-bold text-white">
                  {t('vip.pointsPurchase.wechatShort', 'W')}
                </span>
              </div>

              <p className="mt-3 max-w-sm text-xs leading-5 text-slate-500">{paymentStatusText}</p>

              {checkoutError ? (
                <div className="mt-4 w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-left text-xs font-medium leading-5 text-red-200">
                  {checkoutError}
                </div>
              ) : null}

              <p className="mt-5 text-sm font-semibold text-slate-500">
                {t('vip.pointsPurchase.agreed', 'You have agreed')}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-300">
                {t('vip.pointsPurchase.agreement', 'Instant Payment Service Agreement (including auto-renewal terms)')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VipMembershipRedeemModal({
  onClose,
  onRedeemed,
}: {
  onClose: () => void;
  onRedeemed: () => void;
}) {
  const { t } = useTranslation();
  const [redeemCode, setRedeemCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRedeem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = redeemCode.trim();
    if (!normalizedCode) {
      setErrorMsg(t('vip.membershipRedeem.codeRequired', 'Enter a membership redeem code.'));
      return;
    }
    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const result = await VipService.redeemMembershipCode(normalizedCode);
      setRedeemCode('');
      setSuccessMsg(
        result.message
          || t('vip.membershipRedeem.success', 'Membership redeem request accepted: {{requestNo}}', { requestNo: result.requestNo }),
      );
      onRedeemed();
    } catch (error) {
      setErrorMsg(getVipErrorMessage(error, t('vip.membershipRedeem.error', 'Membership redeem failed.'), t));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VipModalFrame
      title={t('vip.membershipRedeem.title', 'Redeem membership')}
      eyebrow={t('vip.membershipRedeem.eyebrow', 'Redeem code')}
      closeLabel={t('vip.membershipRedeem.close', 'Close membership redeem dialog')}
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleRedeem}>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          {t('vip.membershipRedeem.description', 'Use a membership redeem code to activate or extend VIP entitlements through the standard redemption and fulfillment flow.')}
        </p>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
            {t('vip.membershipRedeem.codeLabel', 'Redeem code')}
          </span>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-lobster-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-lobster-400"
            onChange={(event) => setRedeemCode(event.target.value)}
            placeholder={t('vip.membershipRedeem.codePlaceholder', 'Enter membership redeem code')}
            value={redeemCode}
          />
        </label>

        {successMsg ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            {successMsg}
          </div>
        ) : null}

        {errorMsg ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {errorMsg}
          </div>
        ) : null}

        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-lobster-600 px-5 py-3 font-bold text-white shadow-sm transition-all hover:bg-lobster-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-700 dark:disabled:bg-white/20 dark:disabled:text-slate-300"
          disabled={isSubmitting || !redeemCode.trim()}
          type="submit"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gift className="h-4 w-4" />}
          {isSubmitting
            ? t('vip.membershipRedeem.submitting', 'Redeeming...')
            : t('vip.membershipRedeem.submit', 'Redeem membership')}
        </button>
      </form>
    </VipModalFrame>
  );
}

function VipModalFrame({
  children,
  closeLabel,
  eyebrow,
  onClose,
  title,
}: {
  children: React.ReactNode;
  closeLabel: string;
  eyebrow: string;
  onClose: () => void;
  title: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#101010]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-lobster-600 dark:text-lobster-400">
              {eyebrow}
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {title}
            </h2>
          </div>
          <button
            aria-label={closeLabel}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function VipPackageCard({
  pkg,
  isCurrentPlan,
  isProcessing,
  onPurchase,
}: {
  pkg: VipPackage;
  isCurrentPlan: boolean;
  isProcessing: boolean;
  onPurchase: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`group relative rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-slate-300 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:shadow-lg ${pkg.isPopular ? 'ring-2 ring-lobster-500/30' : ''}`}
    >
      {pkg.badge ? (
        <div className="absolute -top-3 right-4 rounded-full bg-lobster-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
          {t(pkg.badge, pkg.badge)}
        </div>
      ) : null}

      <div className="mb-4 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Sparkles className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
          <span className="truncate font-bold text-slate-900 dark:text-white">
            {t(pkg.planName, pkg.planName)}
          </span>
        </div>
        {isCurrentPlan ? (
          <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400">
            {t('vip.currentPlan', 'Current plan')}
          </span>
        ) : null}
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(pkg.priceAmount, pkg.currencyCode)}
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">/{getDurationUnitText(pkg.durationUnit, t)}</span>
        </div>
        {pkg.originalPriceAmount ? (
          <p className="mt-1 text-sm text-slate-400 line-through dark:text-slate-500">
            {formatCurrency(pkg.originalPriceAmount, pkg.currencyCode)}
          </p>
        ) : null}
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {getDurationText(pkg, t)}
        </p>
      </div>

      <button
        onClick={onPurchase}
        disabled={!pkg.isPurchasable || isProcessing}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-lobster-600 py-3 font-bold text-white shadow-sm transition-all hover:bg-lobster-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-700 disabled:shadow-none dark:disabled:bg-white/20 dark:disabled:text-slate-300"
        type="button"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('vip.purchasing', 'Creating purchase request...')}
          </>
        ) : (
          <>
            <Crown className="h-4 w-4" />
            {getPurchaseButtonLabel(pkg, t)}
          </>
        )}
      </button>

      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
        <div className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4 text-yellow-500" />
          <span className="font-semibold text-slate-900 dark:text-white">
            {pkg.pointsPerMonth
              ? t('vip.pointsPerMonth', { points: pkg.pointsPerMonth.toLocaleString() })
              : t('vip.durationDays', { days: pkg.durationDays })}
          </span>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {pkg.packageNo} | {getPackageStatusText(pkg.status, t)}
        </p>
      </div>

      <div className="space-y-3">
        {pkg.features.map((feature) => (
          <div key={feature.id} className="flex items-start gap-2 text-sm">
            <Check className={`mt-0.5 h-4 w-4 shrink-0 ${feature.included ? 'text-lobster-500' : 'text-slate-300 dark:text-slate-600'}`} />
            <span className={feature.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 line-through dark:text-slate-600'}>
              {t(feature.name, feature.name)}
              {feature.id === 'orders' ? (
                <span className="ml-1 inline-flex items-center rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-white/10 dark:text-slate-400">
                  <Info className="mr-0.5 h-3 w-3" />
                </span>
              ) : null}
            </span>
          </div>
        ))}
      </div>

      {pkg.isPopular ? (
        <div className="absolute top-4 left-4">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
        </div>
      ) : null}
    </div>
  );
}

function VipPaymentDialog({
  paymentDialog,
  onClose,
}: {
  paymentDialog: {
    packageItem: VipPackage;
    paymentId?: string;
    qrCodePayload?: string;
    qrCodeImageUrl?: string;
    requestNo: string;
    status: string;
  };
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const pkg = paymentDialog.packageItem;
  const [generatedQrCodeUrl, setGeneratedQrCodeUrl] = useState('');

  useEffect(() => {
    let active = true;
    setGeneratedQrCodeUrl('');
    if (!paymentDialog.qrCodePayload || paymentDialog.qrCodeImageUrl) {
      return () => { active = false; };
    }
    void toDataURL(paymentDialog.qrCodePayload, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 512,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (active) {
          setGeneratedQrCodeUrl(url);
        }
      })
      .catch(() => {
        if (active) {
          setGeneratedQrCodeUrl('');
        }
      });
    return () => { active = false; };
  }, [paymentDialog.qrCodeImageUrl, paymentDialog.qrCodePayload]);

  const qrImageUrl = paymentDialog.qrCodeImageUrl || generatedQrCodeUrl;
  const priceText = formatCurrency(pkg.priceAmount, pkg.currencyCode);
  const durationText = getDurationText(pkg, t);
  const includedFeatures = pkg.features.filter((feature) => feature.included).slice(0, 4);
  const pointsText = pkg.pointsPerMonth
    ? t('vip.pointsPerMonth', { points: pkg.pointsPerMonth.toLocaleString() })
    : durationText;
  const paymentStatusText = paymentDialog.status.trim() || t('vip.status.unknown', 'Unknown');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-3 py-4 backdrop-blur-md sm:px-6">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-white/10 bg-[#24282d] text-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lobster-500 text-white shadow-lg shadow-lobster-500/20">
              <Crown className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-white">VIP</p>
              <p className="truncate text-xs text-slate-400">{t(pkg.planName, pkg.planName)}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 text-sm text-slate-300 sm:flex">
              <span>{t('vip.paymentAmount', 'Amount')}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-semibold text-white">
                <Sparkles className="h-4 w-4" />
                {priceText}
              </span>
            </div>
            <button
              aria-label={t('vip.paymentClose', 'Close payment dialog')}
              className="rounded-full p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
              onClick={onClose}
              type="button"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="rounded-t-[24px] bg-[#292e34] px-5 pb-6 pt-8 sm:px-10 sm:pb-9">
          <div className="mb-8 flex items-center justify-center gap-5">
            <span className="h-px w-16 bg-white/10 sm:w-28" />
            <h2 className="shrink-0 text-2xl font-bold tracking-normal text-white">
              {t('vip.paymentTitle', 'Complete payment')}
            </h2>
            <span className="h-px w-16 bg-white/10 sm:w-28" />
          </div>

          <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1.05fr)_auto_minmax(280px,0.9fr)] lg:gap-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2 rounded-xl border border-white/70 bg-[#353a42] p-5 shadow-lg shadow-black/10">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <Sparkles className="h-5 w-5 text-white" />
                  {t('vip.paymentPlan', 'Selected plan')}
                </div>
                <p className="break-words text-3xl font-bold tracking-normal text-white">
                  {t(pkg.planName, pkg.planName)}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-300">{priceText}</p>
              </div>

              <div className="rounded-xl bg-[#373c45] p-4">
                <p className="text-xs font-medium uppercase text-slate-500">{t('vip.paymentAmount', 'Amount')}</p>
                <p className="mt-2 break-words text-lg font-bold text-white">{priceText}</p>
              </div>
              <div className="rounded-xl bg-[#373c45] p-4">
                <p className="text-xs font-medium uppercase text-slate-500">{t('vip.paymentDuration', 'Validity')}</p>
                <p className="mt-2 break-words text-sm font-semibold leading-6 text-white">{durationText}</p>
              </div>
              <div className="rounded-xl bg-[#373c45] p-4">
                <p className="text-xs font-medium uppercase text-slate-500">{t('vip.paymentRequestNo', 'Request number')}</p>
                <p className="mt-2 truncate text-sm font-semibold text-white" title={paymentDialog.requestNo}>
                  {paymentDialog.requestNo}
                </p>
              </div>
              <div className="rounded-xl bg-[#373c45] p-4">
                <p className="text-xs font-medium uppercase text-slate-500">{t('vip.paymentStatus', 'Status')}</p>
                <p className="mt-2 break-words text-sm font-semibold text-lobster-300">{paymentStatusText}</p>
              </div>

              <div className="sm:col-span-2 rounded-xl bg-[#373c45] p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Zap className="h-4 w-4 text-lobster-300" />
                  {pointsText}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {includedFeatures.length > 0 ? includedFeatures.map((feature) => (
                    <div key={feature.id} className="flex min-w-0 items-center gap-2 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 shrink-0 text-lobster-300" />
                      <span className="truncate">{t(feature.name, feature.name)}</span>
                    </div>
                  )) : (
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-lobster-300" />
                      <span>{durationText}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="hidden min-h-[20rem] items-center justify-center lg:flex">
              <div className="relative h-64 w-px bg-white/10">
                <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-white/15 bg-[#292e34]" />
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex aspect-square w-full max-w-[22rem] items-center justify-center rounded-2xl bg-white p-4 shadow-xl shadow-black/20">
                {qrImageUrl ? (
                  <img
                    alt={t('vip.paymentQrPlaceholder', 'Payment channel is ready')}
                    className="h-full w-full rounded-lg bg-white object-contain"
                    src={qrImageUrl}
                  />
                ) : (
                  <QrCode className="h-full w-full text-slate-400" />
                )}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-slate-200">
                <span>{t('vip.paymentScanTitle', 'Scan to complete payment')}</span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#1677ff] text-xs font-bold text-white">A</span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#17b26a] text-xs font-bold text-white">W</span>
              </div>
              <p className="mt-3 max-w-sm text-xs leading-5 text-slate-400">
                {t('vip.paymentAgreement', 'By continuing, you agree to the payment service terms.')}
              </p>
              <button
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#24282d] shadow-sm transition-colors hover:bg-slate-100"
                onClick={onClose}
                type="button"
              >
                <CreditCard className="h-4 w-4" />
                {t('vip.paymentDone', 'I have paid')}
              </button>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <p className="mx-auto max-w-3xl text-center text-xs leading-6 text-slate-400">
              <Info className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
              {t('vip.paymentReminder', 'VIP benefits are activated after payment confirmation. Refunds, invoices, and order details are managed in the standard order center.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDurationText(pkg: VipPackage, t: TranslationFunction): string {
  if (pkg.recurrenceCycle.includes('yearly') || pkg.durationDays >= 300) {
    return t('vip.annualHint', '{{days}} days validity, renewable through standard orders', { days: pkg.durationDays });
  }
  if (pkg.recurrenceCycle.includes('monthly') || (pkg.durationDays >= 25 && pkg.durationDays <= 35)) {
    return t('vip.monthlyHint', '{{days}} days validity, cancel and renew from orders', { days: pkg.durationDays });
  }
  return t('vip.onetimeHint', '{{days}} days validity', { days: pkg.durationDays });
}

function getPurchaseButtonText(pkg: VipPackage, t: TranslationFunction): string {
  if (!pkg.isPurchasable) {
    return pkg.isPreview
      ? t('vip.previewOnly', 'Preview only')
      : t('vip.purchaseUnavailableShort', 'Unavailable');
  }
  if (pkg.recurrenceCycle.includes('yearly') || pkg.durationDays >= 300) {
    return t('vip.buyAnnual', 'Buy annual plan');
  }
  if (pkg.recurrenceCycle.includes('monthly') || (pkg.durationDays >= 25 && pkg.durationDays <= 35)) {
    return t('vip.buyMonthly', 'Buy monthly plan');
  }
  return t('vip.buyNow', 'Buy now');
}

function getPurchaseButtonLabel(pkg: VipPackage, t: TranslationFunction): string {
  if (!pkg.isPurchasable) {
    return getPurchaseButtonText(pkg, t);
  }
  return `${formatCurrency(pkg.priceAmount, pkg.currencyCode)} ${getPurchaseButtonText(pkg, t)}`;
}

function getPointCheckoutStatusText(status: CheckoutStatus['paymentStatus'], t: TranslationFunction): string {
  switch (status) {
    case 'success':
      return t('vip.pointsPurchase.statusSuccess', 'Payment completed. Credits will arrive after confirmation.');
    case 'failed':
      return t('vip.pointsPurchase.statusFailed', 'Payment failed. Refresh the payment code and try again.');
    case 'expired':
      return t('vip.pointsPurchase.statusExpired', 'This payment code has expired. Refresh it to continue.');
    case 'refunding':
      return t('vip.pointsPurchase.statusRefunding', 'Refund is being processed.');
    case 'refunded':
      return t('vip.pointsPurchase.statusRefunded', 'This order has been refunded.');
    default:
      return t('vip.pointsPurchase.statusPending', 'Payment order is pending. Scan the QR code to pay.');
  }
}

function isTerminalPointCheckoutStatus(status: CheckoutStatus['paymentStatus']): boolean {
  return status === 'success' || status === 'failed' || status === 'expired' || status === 'refunding' || status === 'refunded';
}

function getDurationUnitText(durationUnit: string, t: TranslationFunction): string {
  const normalizedUnit = normalizeTranslationKeyToken(durationUnit);
  const fallback = durationUnit.trim() || t('vip.durationUnits.period', 'period');
  return t(`vip.durationUnits.${normalizedUnit}`, fallback);
}

function getPackageStatusText(status: string, t: TranslationFunction): string {
  const normalizedStatus = normalizeTranslationKeyToken(status);
  const fallback = status.trim() || t('vip.status.unknown', 'Unknown');
  return t(`vip.status.${normalizedStatus}`, fallback);
}

function normalizeTranslationKeyToken(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'unknown';
}

function formatCurrency(amount: string, currencyCode: string): string {
  return formatRechargeCurrencyAmount(amount, currencyCode);
}

export type { VipPackageGroup, VipPackage, VipSummary, VipCatalog };
export type { VipPackageFeature } from './vipService';
export { VipService };
