import {
  startTransition,
  type ComponentType,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import * as QRCode from "qrcode";
import {
  KeyRound,
  Mail,
  TriangleAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  SdkworkToaster,
  sdkToast,
} from "@sdkwork/ui-pc-react";
import {
  createSdkworkAuthDarkCardStyle,
  createSdkworkAuthDarkIconWellStyle,
  mergeSdkworkAuthClassNames,
  mergeSdkworkAuthStyles,
  resolveSdkworkAuthAppearance,
  type SdkworkAuthAppearanceConfig,
} from "../auth-appearance.ts";
import { useSdkworkAuthIntl } from "../auth-intl.tsx";
import {
  buildSdkworkAuthOAuthCallbackUri,
  getSdkworkAuthRuntimeConfig,
  isConfiguredSdkworkAuthOAuthProvider,
  isSdkworkAuthOAuthLoginEnabled,
  isSdkworkAuthQrLoginEnabled,
  looksLikeEmailAddress,
  looksLikePhoneNumber,
  normalizeSdkworkAuthThirdPartyLoginErrorMessage,
  readSdkworkIdentityErrorMessage,
  resolveSdkworkAuthDevelopmentPrefill,
  resolveSdkworkAuthDevelopmentVerificationCode,
  resolveSdkworkAuthLeftRailMode,
  resolveSdkworkAuthLoginMethods,
  resolveSdkworkAuthMode,
  resolveSdkworkAuthOAuthProviders,
  resolveSdkworkAuthRecoveryMethods,
  resolveSdkworkAuthRegisterMethods,
  resolveSdkworkAuthVerificationPolicy,
  type SdkworkAuthLoginMethod,
  type SdkworkAuthQrPanelState,
  type SdkworkAuthResolvedVerificationPolicy,
  type SdkworkAuthRuntimeConfig,
} from "../auth-config.ts";
import {
  createAuthRouteCatalog,
  resolveAuthRedirectTarget,
} from "../auth.ts";
import {
  buildSdkworkAuthRouteWithContext,
  resolveSdkworkAuthQrEntryCallbackEvent,
  resolveSdkworkAuthQrEntryKeyFromRoute,
  resolveSdkworkAuthRoutePath,
} from "../auth-qr-route.ts";
import {
  useSdkworkAuthController,
  useSdkworkAuthControllerState,
  type CreateSdkworkAuthControllerOptions,
  type SdkworkAuthController,
} from "../auth-controller.ts";
import {
  SdkworkAccountPasswordLoginForm,
} from "../components/auth/AccountPasswordLoginForm.tsx";
import { SdkworkAuthMethodTabs } from "../components/auth/AuthMethodTabs.tsx";
import { SdkworkEmailCodeLoginForm } from "../components/auth/EmailCodeLoginForm.tsx";
import { SdkworkForgotPasswordFlow } from "../components/auth/ForgotPasswordFlow.tsx";
import { SdkworkPhoneCodeLoginForm } from "../components/auth/PhoneCodeLoginForm.tsx";
import { SdkworkRegisterFlow } from "../components/auth/RegisterFlow.tsx";
import { SdkworkSessionBridgeLoginForm } from "../components/auth/SessionBridgeLoginForm.tsx";
import { SdkworkAuthPageShell } from "../components/auth-page-shell.tsx";
import { SdkworkOAuthProviderGrid } from "../components/oauth-provider-grid.tsx";
import { SdkworkQrLoginPanel } from "../components/qr-login-panel.tsx";
import { type SdkworkAuthLoginQrCodeConfirmInput } from "../auth-service.ts";
import {
  SdkworkAuthPageRouterContextBoundary,
  type SdkworkAuthPageRouterContextMode,
} from "./routerContextBoundary.tsx";

const QR_POLL_INTERVAL_MS = 2_000;

interface SdkworkAuthAsideHighlight {
  description: string;
  icon: ReactElement;
  key: string;
  title: string;
}

type SdkworkResolvedAuthMode = "forgot" | "login" | "register";

interface SdkworkAuthPageRenderContext {
  appearance?: SdkworkAuthAppearanceConfig;
  basePath: string;
  homePath: string;
  loginMethods: SdkworkAuthLoginMethod[];
  mode: SdkworkResolvedAuthMode;
  redirectTarget: string;
}

export interface SdkworkAuthHeaderSupplementSlotProps
  extends SdkworkAuthPageRenderContext {
  badge?: string;
  description: string;
  title: string;
}

export interface SdkworkAuthLoginActionsSlotProps
  extends SdkworkAuthPageRenderContext {
  activeLoginMethod: SdkworkAuthLoginMethod;
  forgotPasswordLabel: string;
  needAccountLabel: string;
  showForgotPasswordAction: boolean;
  showRegisterAction: boolean;
  signUpLabel: string;
  navigateToForgot(): void;
  navigateToRegister(): void;
}

export interface SdkworkAuthModeFooterSlotProps
  extends SdkworkAuthPageRenderContext {
  actionLabel: string;
  helperText?: string;
  navigateToLogin(): void;
}

export interface SdkworkAuthPageSlots {
  HeaderSupplement?: ComponentType<SdkworkAuthHeaderSupplementSlotProps>;
  LoginActions?: ComponentType<SdkworkAuthLoginActionsSlotProps>;
  ModeFooter?: ComponentType<SdkworkAuthModeFooterSlotProps>;
}

export interface SdkworkAuthPageEvents {
  onLoginMethodChange?(
    method: SdkworkAuthLoginMethod,
    context: SdkworkAuthPageRenderContext,
  ): void;
  onModeChange?(mode: SdkworkResolvedAuthMode, context: SdkworkAuthPageRenderContext): void;
  onQrStateChange?(
    state: SdkworkAuthQrPanelState,
    context: SdkworkAuthPageRenderContext,
  ): void;
}

function resolveHintedAccount(
  searchParams: URLSearchParams,
  developmentPrefill?: SdkworkAuthRuntimeConfig["developmentPrefill"],
) {
  const account = (
    searchParams.get("account")
    || searchParams.get("email")
    || searchParams.get("phone")
    || ""
  ).trim();
  if (account) {
    return account;
  }

  return (
    developmentPrefill?.account?.trim()
    || developmentPrefill?.email?.trim()
    || developmentPrefill?.phone?.trim()
    || ""
  );
}

function resolveHintedEmail(
  searchParams: URLSearchParams,
  developmentPrefill?: SdkworkAuthRuntimeConfig["developmentPrefill"],
) {
  const email = (searchParams.get("email") || "").trim();
  if (looksLikeEmailAddress(email)) {
    return email;
  }

  const account = (searchParams.get("account") || "").trim();
  if (looksLikeEmailAddress(account)) {
    return account;
  }

  const fallbackEmail = (
    developmentPrefill?.email?.trim()
    || developmentPrefill?.account?.trim()
    || ""
  );
  return looksLikeEmailAddress(fallbackEmail) ? fallbackEmail : "";
}

function resolveHintedPhone(
  searchParams: URLSearchParams,
  developmentPrefill?: SdkworkAuthRuntimeConfig["developmentPrefill"],
) {
  const phone = (searchParams.get("phone") || "").trim();
  if (looksLikePhoneNumber(phone)) {
    return phone;
  }

  const account = (searchParams.get("account") || "").trim();
  if (looksLikePhoneNumber(account)) {
    return account;
  }

  const fallbackPhone = (
    developmentPrefill?.phone?.trim()
    || developmentPrefill?.account?.trim()
    || ""
  );
  return looksLikePhoneNumber(fallbackPhone) ? fallbackPhone : "";
}

function sameVerificationPolicy(
  left: SdkworkAuthResolvedVerificationPolicy,
  right: SdkworkAuthResolvedVerificationPolicy,
): boolean {
  return left.emailCodeLoginEnabled === right.emailCodeLoginEnabled
    && left.emailRegistrationVerificationRequired === right.emailRegistrationVerificationRequired
    && left.phoneCodeLoginEnabled === right.phoneCodeLoginEnabled
    && left.phoneRegistrationVerificationRequired === right.phoneRegistrationVerificationRequired;
}

function SdkworkAuthAsideContent({
  appearance,
  highlights,
  mode,
}: {
  appearance?: SdkworkAuthAppearanceConfig;
  highlights: SdkworkAuthAsideHighlight[];
  mode: "forgot" | "login" | "register";
}) {
  const { copy } = useSdkworkAuthIntl();
  const resolvedAppearance = resolveSdkworkAuthAppearance(appearance);

  return (
    <>
      <div>
        <div
          className={mergeSdkworkAuthClassNames(
            "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.08]",
            resolvedAppearance?.asideIconWellClassName,
          )}
          style={mergeSdkworkAuthStyles(
            createSdkworkAuthDarkIconWellStyle(),
            resolvedAppearance?.asideIconWellStyle,
          )}
        >
          {mode === "register" ? (
            <Sparkles className="h-8 w-8 text-primary-200" />
          ) : (
            <ShieldCheck className="h-8 w-8 text-primary-200" />
          )}
        </div>
        <h2 className="text-2xl font-black tracking-tight">
          {mode === "register"
            ? copy.register.title
            : mode === "forgot"
              ? copy.forgot.title
              : copy.login.title}
        </h2>
        <p className="mt-3 max-w-[320px] text-sm leading-7 text-zinc-300">
          {mode === "register"
            ? copy.register.description
            : mode === "forgot"
              ? copy.forgot.description
              : copy.login.description}
        </p>
      </div>

      <div className="grid gap-4">
        {highlights.map((item) => (
          <div
            className={mergeSdkworkAuthClassNames(
              "rounded-3xl bg-white/[0.06] p-5",
              resolvedAppearance?.asideCardClassName,
            )}
            key={item.key}
            style={mergeSdkworkAuthStyles(
              createSdkworkAuthDarkCardStyle(),
              resolvedAppearance?.asideCardStyle,
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <div className="text-sm font-semibold">{item.title}</div>
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function DefaultSdkworkAuthLoginActions({
  forgotPasswordLabel,
  navigateToForgot,
  navigateToRegister,
  needAccountLabel,
  showForgotPasswordAction,
  showRegisterAction,
  signUpLabel,
}: SdkworkAuthLoginActionsSlotProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm ${
        showForgotPasswordAction ? "justify-between" : "justify-end"
      }`}
    >
      {showForgotPasswordAction ? (
        <button
          className="font-medium text-[var(--sdkwork-auth-muted-color)] transition-colors hover:text-primary-300"
          onClick={navigateToForgot}
          type="button"
        >
          {forgotPasswordLabel}
        </button>
      ) : null}

      {showRegisterAction ? (
        <div className="text-[var(--sdkwork-auth-muted-color)]">
          {needAccountLabel}{" "}
          <button
            className="font-semibold text-primary-600 transition-colors hover:text-primary-500"
            onClick={navigateToRegister}
            type="button"
          >
            {signUpLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function DefaultSdkworkAuthModeFooter({
  actionLabel,
  helperText,
  navigateToLogin,
}: SdkworkAuthModeFooterSlotProps) {
  return (
    <div className="mt-8 text-center text-sm text-[var(--sdkwork-auth-muted-color)]">
      {helperText ? (
        <>
          {helperText}{" "}
          <button
            className="font-bold text-primary-600 transition-colors hover:text-primary-500"
            onClick={navigateToLogin}
            type="button"
          >
            {actionLabel}
          </button>
        </>
      ) : (
        <button
          className="font-bold text-primary-600 transition-colors hover:text-primary-500"
          onClick={navigateToLogin}
          type="button"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export interface SdkworkAuthPageProps {
  appearance?: SdkworkAuthAppearanceConfig;
  basePath?: string;
  controller?: SdkworkAuthController;
  events?: SdkworkAuthPageEvents;
  homePath?: string;
  routerContextMode?: SdkworkAuthPageRouterContextMode;
  runtimeConfig?: SdkworkAuthRuntimeConfig;
  slots?: SdkworkAuthPageSlots;
}

interface SdkworkAuthPageContentProps extends SdkworkAuthPageProps {}

function SdkworkAuthPageContent({
  appearance,
  basePath = "/auth",
  controller: providedController,
  events,
  homePath = "/dashboard",
  runtimeConfig,
  slots,
}: SdkworkAuthPageContentProps) {
  const {
    copy,
    formatLoginMethodLabel,
    formatOAuthProviderName,
  } = useSdkworkAuthIntl();
  const resolvedAppearance = resolveSdkworkAuthAppearance(appearance);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const controllerOptions = useMemo<CreateSdkworkAuthControllerOptions>(() => ({}), []);
  const controller = useSdkworkAuthController(providedController, controllerOptions);
  const authState = useSdkworkAuthControllerState(controller);
  const pathMode = resolveSdkworkAuthMode(location.pathname, basePath);
  const qrEntryKey = resolveSdkworkAuthQrEntryKeyFromRoute(
    params.sessionKey,
    searchParams.get("session_key"),
    location.pathname,
    basePath,
  );
  const qrPurpose = qrEntryKey ? resolveQrEntryPurpose(searchParams) : undefined;
  const mode = qrPurpose === "register" ? "register" : qrPurpose === "login" ? "login" : pathMode;
  const redirectTarget = resolveAuthRedirectTarget(searchParams.get("redirect"), homePath, basePath);
  const qrEntryCallbackMetadata = useMemo(
    () => resolveQrEntryCallbackMetadata(searchParams),
    [searchParams],
  );
  const qrEntryCallbackRequestRef = useRef<null | {
    promise: Promise<void>;
    signature: string;
  }>(null);
  const qrEntryRouteMetadata = useMemo(
    () => resolveQrEntryRouteMetadata(searchParams, qrPurpose),
    [qrPurpose, searchParams],
  );
  const loginRoutePath = createAuthRouteCatalog(basePath).find((route) => route.id === "login")?.path
    ?? resolveSdkworkAuthRoutePath(basePath, "login");
  const registerRoutePath = createAuthRouteCatalog(basePath).find((route) => route.id === "register")?.path
    ?? resolveSdkworkAuthRoutePath(basePath, "register");
  const forgotRoutePath = createAuthRouteCatalog(basePath).find((route) => route.id === "forgot-password")?.path
    ?? resolveSdkworkAuthRoutePath(basePath, "forgot-password");
  const hasExplicitVerificationPolicy = runtimeConfig?.verificationPolicy !== undefined;
  const configuredVerificationPolicy = useMemo(
    () => resolveSdkworkAuthVerificationPolicy(runtimeConfig?.verificationPolicy),
    [runtimeConfig?.verificationPolicy],
  );
  const [remoteVerificationPolicy, setRemoteVerificationPolicy] = useState<SdkworkAuthResolvedVerificationPolicy | null>(null);
  const verificationPolicy = remoteVerificationPolicy ?? configuredVerificationPolicy;
  const loginMethods = resolveSdkworkAuthLoginMethods(runtimeConfig?.loginMethods, verificationPolicy);
  const activeLoginMethods = qrEntryKey && mode === "login"
    ? (["password"] satisfies SdkworkAuthLoginMethod[])
    : loginMethods;
  const activeLoginMethodsKey = activeLoginMethods.join(",");
  const visibleLoginMethods = activeLoginMethods.filter((method) => method !== "sessionBridge");
  const registerMethods = resolveSdkworkAuthRegisterMethods(runtimeConfig?.registerMethods);
  const recoveryMethods = resolveSdkworkAuthRecoveryMethods(runtimeConfig?.recoveryMethods);
  const developmentPrefill = resolveSdkworkAuthDevelopmentPrefill(
    runtimeConfig?.developmentPrefill,
  );
  const developmentVerificationCode = resolveSdkworkAuthDevelopmentVerificationCode(
    runtimeConfig?.developmentPrefill ?? developmentPrefill,
  );
  const hintedAccount = resolveHintedAccount(searchParams, developmentPrefill);
  const hintedEmail = resolveHintedEmail(searchParams, developmentPrefill);
  const hintedPhone = resolveHintedPhone(searchParams, developmentPrefill);
  const hintedPassword = (developmentPrefill?.password || "").trim();
  const oauthLoginEnabled = !qrEntryKey && isSdkworkAuthOAuthLoginEnabled(runtimeConfig?.oauthLoginEnabled);
  const leftRailMode = resolveSdkworkAuthLeftRailMode(runtimeConfig?.leftRailMode);
  const runtimeAuthConfig = getSdkworkAuthRuntimeConfig();
  const explicitQrRailSetting = typeof runtimeConfig?.qrLoginEnabled === "boolean"
    ? runtimeConfig.qrLoginEnabled
    : typeof runtimeAuthConfig?.qrLoginEnabled === "boolean"
      ? runtimeAuthConfig.qrLoginEnabled
      : undefined;
  const qrPanelEnabled = isSdkworkAuthQrLoginEnabled(runtimeConfig?.qrLoginEnabled);
  const canRenderDesktopQrRail = !qrEntryKey && (mode === "login" || mode === "register");
  const shouldRenderQrRail = !canRenderDesktopQrRail
    ? false
    : typeof explicitQrRailSetting === "boolean"
      ? explicitQrRailSetting
      : leftRailMode === "highlights-only"
        ? false
        : leftRailMode === "qr-only"
          ? true
          : qrPanelEnabled;
  const desktopQrPurpose = mode === "register" ? "register" : "login";
  const oauthProviders = oauthLoginEnabled
    ? resolveSdkworkAuthOAuthProviders(runtimeConfig?.oauthProviders, runtimeConfig?.oauthProviderRegion)
    : [];
  const oauthProviderSummary = oauthProviders.map((provider) => formatOAuthProviderName(provider)).join(" / ");
  const [loginMethod, setLoginMethod] = useState<SdkworkAuthLoginMethod>("password");
  const [activeOAuthProvider, setActiveOAuthProvider] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<null | {
    description?: string;
    qrContent?: string;
    qrUrl?: string;
    sessionKey: string;
    title?: string;
    type?: string;
  }>(null);
  const [qrState, setQrState] = useState<SdkworkAuthQrPanelState>("idle");
  const [qrImageSrc, setQrImageSrc] = useState("");
  const [qrErrorMessage, setQrErrorMessage] = useState("");
  const [qrEntryErrorMessage, setQrEntryErrorMessage] = useState("");
  const [qrEntryErrorIsBlocking, setQrEntryErrorIsBlocking] = useState(false);
  const [qrReloadNonce, setQrReloadNonce] = useState(0);

  const isQrEntryBlockingError = (error: unknown) => {
    const message = readSdkworkIdentityErrorMessage(error, "");
    return /invalid or expired qr login code/i.test(message)
      || message === copy.qr.entryUnavailable;
  };

  const readQrEntryErrorMessage = (error: unknown) => {
    const message = readSdkworkIdentityErrorMessage(error, copy.qr.entryUnavailable);
    return /invalid or expired qr login code/i.test(message)
      ? copy.qr.entryUnavailable
      : message;
  };

  const clearQrEntryError = () => {
    setQrEntryErrorMessage("");
    setQrEntryErrorIsBlocking(false);
  };

  const setQrEntryError = (error: unknown) => {
    setQrEntryErrorMessage(readQrEntryErrorMessage(error));
    setQrEntryErrorIsBlocking(isQrEntryBlockingError(error));
  };

  const sendQrEntryCallback = useCallback((event: "bindRequired" | "passwordRequired" | "scanned") => {
    if (!qrEntryKey) {
      return Promise.resolve();
    }
    const payload = {
      ...qrEntryCallbackMetadata,
      event,
      sessionKey: qrEntryKey,
    };
    const signature = JSON.stringify(payload);
    if (qrEntryCallbackRequestRef.current?.signature === signature) {
      return qrEntryCallbackRequestRef.current.promise;
    }
    const request = {
      promise: Promise.resolve(),
      signature,
    };
    const promise = Promise.resolve()
      .then(() => controller.callbackLoginQrCode(payload))
      .then(() => undefined)
      .catch((error) => {
        if (qrEntryCallbackRequestRef.current === request) {
          qrEntryCallbackRequestRef.current = null;
        }
        throw error;
      });
    request.promise = promise;
    qrEntryCallbackRequestRef.current = request;
    return promise;
  }, [controller, qrEntryCallbackMetadata, qrEntryKey]);

  const ensureQrEntryCanContinue = async () => {
    if (!qrEntryKey) {
      return;
    }

    if (qrEntryErrorMessage && qrEntryErrorIsBlocking) {
      throw new Error(qrEntryErrorMessage);
    }

    try {
      await sendQrEntryCallback(resolveSdkworkAuthQrEntryCallbackEvent(mode));
      clearQrEntryError();
    } catch (error) {
      setQrEntryError(error);
      throw error;
    }
  };

  const completeQrEntryWithPassword = useCallback((
    event: "bindRequired" | "passwordRequired",
    payload: Omit<SdkworkAuthLoginQrCodeConfirmInput, "sessionKey">,
  ) => {
    if (!qrEntryKey) {
      return Promise.resolve();
    }

    const confirmSessionKey = qrEntryKey;
    return (async () => {
      await sendQrEntryCallback(event);
      await controller.confirmLoginQrCode({
        ...payload,
        sessionKey: confirmSessionKey,
      });
    })();
  }, [controller, qrEntryKey, sendQrEntryCallback]);

  const completeAuthFlow = async () => {
    startTransition(() => {
      navigate(redirectTarget, { replace: true });
    });
  };

  useEffect(() => {
    void controller.bootstrap();
  }, [controller]);

  useEffect(() => {
    if (!qrEntryKey) {
      return;
    }

    let disposed = false;
    clearQrEntryError();

    void (async () => {
      try {
        await sendQrEntryCallback(resolveSdkworkAuthQrEntryCallbackEvent(mode));
        if (!disposed) {
          clearQrEntryError();
        }
      } catch (error) {
        if (disposed) {
          return;
        }
        setQrEntryError(error);
      }
    })();

    return () => {
      disposed = true;
    };
  }, [mode, qrEntryKey, sendQrEntryCallback]);

  useEffect(() => {
    setRemoteVerificationPolicy(null);
  }, [configuredVerificationPolicy]);

  useEffect(() => {
    let disposed = false;

    if (hasExplicitVerificationPolicy) {
      return () => {
        disposed = true;
      };
    }

    void (async () => {
      try {
        const nextPolicy = await controller.getVerificationPolicy();
        if (disposed) {
          return;
        }

        setRemoteVerificationPolicy((currentPolicy) => {
          if (currentPolicy && sameVerificationPolicy(currentPolicy, nextPolicy)) {
            return currentPolicy;
          }

          return nextPolicy;
        });
      } catch {
        if (!disposed) {
          setRemoteVerificationPolicy(null);
        }
      }
    })();

    return () => {
      disposed = true;
    };
  }, [controller, hasExplicitVerificationPolicy]);

  useEffect(() => {
    if (mode !== "login") {
      return;
    }

    const requestedMethod = (searchParams.get("method") || "").trim();
    if (requestedMethod === "email" || requestedMethod === "emailCode") {
      setLoginMethod(activeLoginMethods.includes("emailCode") ? "emailCode" : activeLoginMethods[0] || "password");
      return;
    }

    if (requestedMethod === "phone" || requestedMethod === "phoneCode") {
      setLoginMethod(activeLoginMethods.includes("phoneCode") ? "phoneCode" : activeLoginMethods[0] || "password");
      return;
    }

    if (requestedMethod === "bridge" || requestedMethod === "sessionBridge") {
      setLoginMethod(activeLoginMethods.includes("sessionBridge") ? "sessionBridge" : activeLoginMethods[0] || "password");
      return;
    }

    setLoginMethod((currentMethod) => activeLoginMethods.includes(currentMethod) ? currentMethod : activeLoginMethods[0] || "password");
  }, [activeLoginMethodsKey, mode, searchParams]);

  useEffect(() => {
    if (!shouldRenderQrRail) {
      setQrCode(null);
      setQrErrorMessage("");
      setQrImageSrc("");
      setQrState("idle");
      return;
    }

    let disposed = false;
    let pollTimer: ReturnType<typeof setTimeout> | null = null;

    const clearPollTimer = () => {
      if (!pollTimer) {
        return;
      }

      clearTimeout(pollTimer);
      pollTimer = null;
    };

    const schedulePoll = (sessionKey: string, delayMs = QR_POLL_INTERVAL_MS) => {
      clearPollTimer();
      pollTimer = setTimeout(() => {
        void pollStatus(sessionKey);
      }, delayMs);
    };

    const pollStatus = async (sessionKey: string) => {
      try {
        const statusResult = await controller.checkLoginQrCodeStatus(sessionKey);
        if (disposed) {
          return;
        }

        setQrState(statusResult.status);

        if (statusResult.status === "confirmed") {
          if (!statusResult.session) {
            const bootstrappedState = await controller.bootstrap();
            if (disposed) {
              return;
            }
            if (!bootstrappedState.isAuthenticated) {
              setQrState("error");
              setQrErrorMessage(copy.qr.unavailable);
              clearPollTimer();
              return;
            }
          }
          startTransition(() => {
            navigate(redirectTarget, { replace: true });
          });
          return;
        }

        if (statusResult.status === "expired" || statusResult.status === "failed") {
          clearPollTimer();
          return;
        }

        schedulePoll(sessionKey);
      } catch (error) {
        if (disposed) {
          return;
        }

        setQrState("error");
        setQrErrorMessage(
          readSdkworkIdentityErrorMessage(error, copy.qr.unavailable),
        );
        clearPollTimer();
      }
    };

    const loadQrCode = async () => {
      setQrCode(null);
      setQrErrorMessage("");
      setQrImageSrc("");
      setQrState("loading");

      try {
        const nextQrCode = await controller.generateLoginQrCode({
          purpose: desktopQrPurpose,
        });
        if (disposed) {
          return;
        }

        let nextQrImageSrc = "";
        if ((nextQrCode.qrUrl || "").trim()) {
          nextQrImageSrc = nextQrCode.qrUrl!.trim();
        } else if ((nextQrCode.qrContent || "").trim()) {
          nextQrImageSrc = await QRCode.toDataURL(nextQrCode.qrContent!.trim(), {
            color: {
              dark: "#111827",
              light: "#ffffff",
            },
            errorCorrectionLevel: "M",
            margin: 1,
            width: 320,
          });
        } else {
          throw new Error(copy.qr.missingPayload);
        }

        if (disposed) {
          return;
        }

        setQrCode(nextQrCode);
        setQrImageSrc(nextQrImageSrc);
        setQrState("pending");
        schedulePoll(nextQrCode.sessionKey);
      } catch (error) {
        if (disposed) {
          return;
        }

        setQrCode(null);
        setQrState("error");
        setQrErrorMessage(
          readSdkworkIdentityErrorMessage(error, copy.qr.generateFailed),
        );
      }
    };

    void loadQrCode();

    return () => {
      disposed = true;
      clearPollTimer();
    };
  }, [controller, copy.qr.generateFailed, copy.qr.missingPayload, copy.qr.unavailable, desktopQrPurpose, navigate, qrReloadNonce, redirectTarget, shouldRenderQrRail]);

  useEffect(() => {
    events?.onModeChange?.(mode, {
      appearance,
      basePath,
      homePath,
      loginMethods: activeLoginMethods,
      mode,
      redirectTarget,
    });
  }, [activeLoginMethodsKey, appearance, basePath, events, homePath, mode, redirectTarget]);

  useEffect(() => {
    if (mode !== "login") {
      return;
    }

    events?.onLoginMethodChange?.(loginMethod, {
      appearance,
      basePath,
      homePath,
      loginMethods: activeLoginMethods,
      mode,
      redirectTarget,
    });
  }, [activeLoginMethodsKey, appearance, basePath, events, homePath, loginMethod, mode, redirectTarget]);

  useEffect(() => {
    if (!shouldRenderQrRail) {
      return;
    }

    events?.onQrStateChange?.(qrState, {
      appearance,
      basePath,
      homePath,
      loginMethods: activeLoginMethods,
      mode,
      redirectTarget,
    });
  }, [activeLoginMethodsKey, appearance, basePath, events, homePath, mode, qrState, redirectTarget, shouldRenderQrRail]);

  if (authState.isAuthenticated && !qrEntryKey) {
    return <Navigate replace to={redirectTarget} />;
  }

  const buildAuthRoute = (
    pathname: string,
    extraQuery: Record<string, string | null | undefined> = {},
  ) => buildSdkworkAuthRouteWithContext(pathname, {
    homePath,
    qrEntryKey,
    redirectTarget,
  }, {
    ...qrEntryRouteMetadata,
    ...extraQuery,
  });

  if (mode === "register" && registerMethods.length === 0) {
    return <Navigate replace to={buildAuthRoute(loginRoutePath)} />;
  }

  if (mode === "forgot" && recoveryMethods.length === 0) {
    return <Navigate replace to={buildAuthRoute(loginRoutePath)} />;
  }

  const showForgotPasswordAction =
    !qrEntryKey
    && recoveryMethods.length > 0
    && activeLoginMethods.includes("password")
    && loginMethod === "password";
  const showRegisterAction = !qrEntryKey && registerMethods.length > 0;

  const sideHighlights: SdkworkAuthAsideHighlight[] = mode === "register"
    ? [
        registerMethods.includes("email")
          ? {
              description: copy.register.highlights[0] || copy.register.description,
              icon: <Mail className="h-5 w-5 text-primary-200" />,
              key: "register-email",
              title: copy.register.emailMethod,
            }
          : null,
        registerMethods.includes("phone")
          ? {
              description: copy.register.highlights[0] || copy.register.description,
              icon: <Smartphone className="h-5 w-5 text-primary-200" />,
              key: "register-phone",
              title: copy.register.phoneMethod,
            }
          : null,
        {
          description: copy.register.highlights[1] || copy.register.description,
          icon: <ShieldCheck className="h-5 w-5 text-primary-200" />,
          key: "register-password",
          title: copy.common.passwordLabel,
        },
      ].filter((item): item is SdkworkAuthAsideHighlight => Boolean(item))
    : mode === "forgot"
      ? [
          recoveryMethods.includes("email")
            ? {
                description: copy.forgot.highlights[0] || copy.forgot.description,
                icon: <Mail className="h-5 w-5 text-primary-200" />,
                key: "reset-email",
                title: copy.forgot.emailMethod,
              }
            : null,
          recoveryMethods.includes("phone")
            ? {
                description: copy.forgot.highlights[0] || copy.forgot.description,
                icon: <Smartphone className="h-5 w-5 text-primary-200" />,
                key: "reset-phone",
                title: copy.forgot.phoneMethod,
              }
            : null,
          {
            description: copy.forgot.highlights[1] || copy.forgot.description,
            icon: <KeyRound className="h-5 w-5 text-primary-200" />,
            key: "reset-password",
            title: copy.forgot.title,
          },
        ].filter((item): item is SdkworkAuthAsideHighlight => Boolean(item))
      : [
          activeLoginMethods.includes("password")
            ? {
                description: copy.login.highlights[0] || copy.login.description,
                icon: <ShieldCheck className="h-5 w-5 text-primary-200" />,
                key: "login-password",
                title: formatLoginMethodLabel("password"),
              }
            : null,
          activeLoginMethods.includes("emailCode")
            ? {
                description: copy.login.highlights[0] || copy.login.description,
                icon: <Sparkles className="h-5 w-5 text-primary-200" />,
                key: "login-email",
                title: formatLoginMethodLabel("emailCode"),
              }
            : null,
          activeLoginMethods.includes("phoneCode")
            ? {
                description: copy.login.highlights[1] || copy.login.description,
                icon: <KeyRound className="h-5 w-5 text-primary-200" />,
                key: "login-phone",
                title: formatLoginMethodLabel("phoneCode"),
              }
            : null,
          oauthProviders.length
            ? {
                description: oauthProviderSummary || copy.oauth.providerHintFallback,
                icon: <Sparkles className="h-5 w-5 text-primary-200" />,
                key: "login-oauth",
                title: copy.oauth.dividerLabel,
              }
            : null,
        ].filter((item): item is SdkworkAuthAsideHighlight => Boolean(item));

  const title = mode === "register"
    ? copy.register.title
    : mode === "forgot"
      ? copy.forgot.title
      : copy.login.title;
  const description = mode === "register"
    ? copy.register.description
    : mode === "forgot"
      ? copy.forgot.description
      : copy.login.description;
  const badge = mode === "login" ? undefined : title;
  const qrPanelTitle = mode === "login" ? undefined : title;
  const qrPanelDescription = mode === "login" ? undefined : description;
  const authPageContext: SdkworkAuthPageRenderContext = {
    appearance,
    basePath,
    homePath,
    loginMethods: activeLoginMethods,
    mode,
    redirectTarget,
  };
  const HeaderSupplementSlot = slots?.HeaderSupplement;
  const LoginActionsSlot = slots?.LoginActions ?? DefaultSdkworkAuthLoginActions;
  const ModeFooterSlot = slots?.ModeFooter ?? DefaultSdkworkAuthModeFooter;

  return (
    <>
      <SdkworkToaster />
      <SdkworkAuthPageShell
        appearance={resolvedAppearance}
        aside={shouldRenderQrRail ? (
          <SdkworkQrLoginPanel
            appearance={resolvedAppearance}
            onRefresh={() => setQrReloadNonce((value) => value + 1)}
            panelDescription={qrPanelDescription}
            panelTitle={qrPanelTitle}
            qrCode={qrCode}
            qrErrorMessage={qrErrorMessage}
            qrImageSrc={qrImageSrc}
            qrState={qrState}
          />
        ) : (
          <SdkworkAuthAsideContent
            appearance={resolvedAppearance}
            highlights={sideHighlights}
            mode={mode}
          />
        )}
        asidePresentation={shouldRenderQrRail ? "raw" : "panel"}
        badge={badge}
        description={description}
        title={title}
      >
        {qrEntryErrorMessage ? (
          <div
            className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700"
            role="alert"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{qrEntryErrorMessage}</span>
          </div>
        ) : null}

        {HeaderSupplementSlot ? (
          <HeaderSupplementSlot
            {...authPageContext}
            badge={badge}
            description={description}
            title={title}
          />
        ) : null}

        {mode === "login" ? (
          <div className="space-y-6">
            {visibleLoginMethods.length > 1 ? (
              <SdkworkAuthMethodTabs
                items={visibleLoginMethods.map((item) => ({
                  icon: item === "password"
                    ? <ShieldCheck className="h-4 w-4" />
                    : item === "phoneCode"
                      ? <KeyRound className="h-4 w-4" />
                      : <Sparkles className="h-4 w-4" />,
                  label: formatLoginMethodLabel(item),
                  value: item,
                }))}
                onChange={(value) => setLoginMethod(value as SdkworkAuthLoginMethod)}
                value={visibleLoginMethods.some((method) => method === loginMethod) ? loginMethod : ""}
              />
            ) : null}

            {activeLoginMethods.includes("password") && loginMethod === "password" ? (
              <SdkworkAccountPasswordLoginForm
                initialAccount={hintedAccount}
                initialPassword={hintedPassword}
                onSubmit={async (payload) => {
                  if (qrEntryKey) {
                    try {
                      await completeQrEntryWithPassword("passwordRequired", {
                        password: payload.password,
                        username: payload.account,
                      });
                      clearQrEntryError();
                    } catch (error) {
                      setQrEntryError(error);
                      throw error;
                    }
                    startTransition(() => {
                      navigate(redirectTarget, { replace: true });
                    });
                    return;
                  }

                  await ensureQrEntryCanContinue();
                  await controller.signIn({
                    password: payload.password,
                    username: payload.account,
                  });
                  await completeAuthFlow();
                }}
              />
            ) : null}

            {activeLoginMethods.includes("phoneCode") && loginMethod === "phoneCode" ? (
              <SdkworkPhoneCodeLoginForm
                developmentVerificationCode={developmentVerificationCode}
                initialPhone={hintedPhone}
                onSendCode={(phone) => controller.sendVerifyCode({
                  scene: "LOGIN",
                  target: phone,
                  verifyType: "PHONE",
                })}
                onSubmit={async (payload) => {
                  await ensureQrEntryCanContinue();
                  await controller.signInWithPhoneCode({
                    code: payload.code,
                    deviceType: "desktop",
                    phone: payload.phone,
                  });
                  await completeAuthFlow();
                }}
              />
            ) : null}

            {activeLoginMethods.includes("emailCode") && loginMethod === "emailCode" ? (
              <SdkworkEmailCodeLoginForm
                developmentVerificationCode={developmentVerificationCode}
                initialEmail={hintedEmail}
                onSendCode={(email) => controller.sendVerifyCode({
                  scene: "LOGIN",
                  target: email,
                  verifyType: "EMAIL",
                })}
                onSubmit={async (payload) => {
                  await ensureQrEntryCanContinue();
                  await controller.signInWithEmailCode({
                    code: payload.code,
                    deviceType: "desktop",
                    email: payload.email,
                  });
                  await completeAuthFlow();
                }}
              />
            ) : null}

            {activeLoginMethods.includes("sessionBridge") && loginMethod === "sessionBridge" ? (
              <SdkworkSessionBridgeLoginForm
                initialEmail={hintedEmail}
                onSubmit={async (payload) => {
                  await ensureQrEntryCanContinue();
                  await controller.signInWithSessionBridge({
                    email: payload.email,
                    name: payload.name,
                  });
                  await completeAuthFlow();
                }}
              />
            ) : null}

            <LoginActionsSlot
              {...authPageContext}
              activeLoginMethod={loginMethod}
              forgotPasswordLabel={copy.login.forgotPassword}
              navigateToForgot={() => navigate(buildAuthRoute(forgotRoutePath), { replace: true })}
              navigateToRegister={() => navigate(buildAuthRoute(registerRoutePath), { replace: true })}
              needAccountLabel={copy.login.needAccount}
              showForgotPasswordAction={showForgotPasswordAction}
              showRegisterAction={showRegisterAction}
              signUpLabel={copy.register.submit}
            />

            {oauthLoginEnabled ? (
              <SdkworkOAuthProviderGrid
                activeProvider={activeOAuthProvider}
                appearance={resolvedAppearance}
                onSelect={(provider) => {
                  if (activeOAuthProvider) {
                    return;
                  }

                  void (async () => {
                    try {
                      if (!isConfiguredSdkworkAuthOAuthProvider(provider, oauthProviders)) {
                        throw new Error(copy.validation.oauthProviderNotConfigured);
                      }

                      setActiveOAuthProvider(provider);
                      const authUrl = await controller.getOAuthAuthorizationUrl({
                        provider,
                        redirectUri: buildSdkworkAuthOAuthCallbackUri(provider, redirectTarget, {
                          basePath,
                          fallbackRoute: homePath,
                        }),
                        state: redirectTarget !== homePath ? redirectTarget : undefined,
                      });
                      window.location.assign(authUrl);
                    } catch (error) {
                      setActiveOAuthProvider(null);
                      sdkToast.error(
                        normalizeSdkworkAuthThirdPartyLoginErrorMessage(
                          readSdkworkIdentityErrorMessage(error, copy.service.startOAuthFailed),
                          {
                            genericProviderError: copy.service.startOAuthFailed,
                            invalidProvider: copy.validation.oauthProviderNotConfigured,
                            providerDenied: copy.callback.providerDenied,
                          },
                        ),
                      );
                    }
                  })();
                }}
                providers={oauthProviders}
              />
            ) : null}
          </div>
        ) : null}

        {mode === "register" ? (
          <>
            <SdkworkRegisterFlow
              developmentVerificationCode={developmentVerificationCode}
              methods={registerMethods}
              onSendCode={(payload) => controller.sendVerifyCode({
                scene: "REGISTER",
                target: payload.target,
                verifyType: payload.method === "email" ? "EMAIL" : "PHONE",
              })}
              onSubmit={async (payload) => {
                if (qrEntryKey) {
                  try {
                    await completeQrEntryWithPassword("bindRequired", payload);
                    clearQrEntryError();
                  } catch (error) {
                    setQrEntryError(error);
                    throw error;
                  }
                  startTransition(() => {
                    navigate(redirectTarget, { replace: true });
                  });
                  return;
                }

                await ensureQrEntryCanContinue();
                await controller.register(payload);
                await completeAuthFlow();
              }}
              verificationPolicy={verificationPolicy}
            />
            {!qrEntryKey ? (
              <ModeFooterSlot
                {...authPageContext}
                actionLabel={copy.login.signIn}
                helperText={copy.register.backHelper}
                navigateToLogin={() => navigate(buildAuthRoute(loginRoutePath), { replace: true })}
              />
            ) : null}
          </>
        ) : null}

        {mode === "forgot" ? (
          <>
            <SdkworkForgotPasswordFlow
              developmentVerificationCode={developmentVerificationCode}
              initialAccount={hintedAccount || hintedEmail || hintedPhone}
              methods={recoveryMethods}
              onRequestReset={(payload) => controller.requestPasswordReset(payload)}
              onSubmit={async (payload) => {
                await controller.resetPassword(payload);
                startTransition(() => {
                  navigate(buildAuthRoute(loginRoutePath, {
                    account: payload.account,
                  }), { replace: true });
                });
              }}
            />
            <ModeFooterSlot
              {...authPageContext}
              actionLabel={copy.common.backToLogin}
              navigateToLogin={() => navigate(buildAuthRoute(loginRoutePath), { replace: true })}
            />
          </>
        ) : null}
      </SdkworkAuthPageShell>
    </>
  );
}

interface SdkworkQrEntryCallbackMetadata {
  accountId?: string;
  entryId?: string;
  externalUserId?: string;
  ipHash?: string;
  scanSource: string;
  userAgent?: string;
}

interface SdkworkQrEntryRouteMetadata {
  account_id?: string;
  entry_id?: string;
  external_user_id?: string;
  ip_hash?: string;
  purpose?: "login" | "register";
  scan_source?: string;
  user_agent?: string;
}

function resolveQrEntryPurpose(searchParams: URLSearchParams): "login" | "register" | undefined {
  const purpose = readQrEntrySearchParam(searchParams, "purpose");
  return purpose === "login" || purpose === "register" ? purpose : undefined;
}

function resolveQrEntryCallbackMetadata(
  searchParams: URLSearchParams,
): SdkworkQrEntryCallbackMetadata {
  const accountId = readQrEntrySearchParam(searchParams, "account_id");
  const entryId = readQrEntrySearchParam(searchParams, "entry_id");
  const externalUserId = readQrEntrySearchParam(searchParams, "external_user_id");
  const ipHash = readQrEntrySearchParam(searchParams, "ip_hash");
  const scanSource = readQrEntrySearchParam(searchParams, "scan_source");
  const userAgent = readQrEntrySearchParam(searchParams, "user_agent");
  return {
    ...(accountId ? { accountId } : {}),
    ...(entryId ? { entryId } : {}),
    ...(externalUserId ? { externalUserId } : {}),
    ...(ipHash ? { ipHash } : {}),
    scanSource: scanSource ?? "browser",
    ...(userAgent ? { userAgent } : {}),
  };
}

function resolveQrEntryRouteMetadata(
  searchParams: URLSearchParams,
  purpose?: "login" | "register",
): SdkworkQrEntryRouteMetadata {
  const accountId = readQrEntrySearchParam(searchParams, "account_id");
  const entryId = readQrEntrySearchParam(searchParams, "entry_id");
  const externalUserId = readQrEntrySearchParam(searchParams, "external_user_id");
  const ipHash = readQrEntrySearchParam(searchParams, "ip_hash");
  const scanSource = readQrEntrySearchParam(searchParams, "scan_source");
  const userAgent = readQrEntrySearchParam(searchParams, "user_agent");
  return {
    ...(accountId ? { account_id: accountId } : {}),
    ...(entryId ? { entry_id: entryId } : {}),
    ...(externalUserId ? { external_user_id: externalUserId } : {}),
    ...(ipHash ? { ip_hash: ipHash } : {}),
    ...(purpose ? { purpose } : {}),
    ...(scanSource ? { scan_source: scanSource } : {}),
    ...(userAgent ? { user_agent: userAgent } : {}),
  };
}

function readQrEntrySearchParam(
  searchParams: URLSearchParams,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = searchParams.get(key)?.trim();
    if (value) {
      return value;
    }
  }
  return undefined;
}

export function SdkworkAuthPage({
  routerContextMode = "auto",
  ...props
}: SdkworkAuthPageProps) {
  return (
    <SdkworkAuthPageRouterContextBoundary mode={routerContextMode}>
      <SdkworkAuthPageContent {...props} />
    </SdkworkAuthPageRouterContextBoundary>
  );
}
