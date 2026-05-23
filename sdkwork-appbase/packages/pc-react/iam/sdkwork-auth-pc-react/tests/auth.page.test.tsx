import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { CSSProperties, ReactNode } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { SdkworkI18nProvider } from "@sdkwork/i18n-pc-react";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import {
  SDKWORK_AUTH_I18N_CATALOG,
  SdkworkAuthPage,
  SdkworkIamAuthRoutes,
  createSdkworkAuthAppearancePreset,
  createSdkworkAuthController,
} from "../src";
import type { SdkworkAuthRuntimeConfig } from "../src";

const { toDataUrlMock } = vi.hoisted(() => ({
  toDataUrlMock: vi.fn().mockResolvedValue("data:image/png;base64,qr-login"),
}));

const sdkToastMock = vi.hoisted(() => Object.assign(
  vi.fn(),
  {
    custom: vi.fn(),
    dismiss: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    loading: vi.fn(),
    message: vi.fn(),
    promise: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
));

vi.mock("qrcode", () => ({
  toDataURL: toDataUrlMock,
}));

vi.mock("@sdkwork/ui-pc-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@sdkwork/ui-pc-react")>();
  return {
    ...actual,
    SdkworkToaster: () => null,
    sdkToast: sdkToastMock,
    toast: sdkToastMock,
  };
});

function LocationProbe() {
  const location = useLocation();
  return (
    <output data-testid="auth-location">
      {location.pathname}
      {location.search}
    </output>
  );
}

function CapturedAsideContainer({
  children,
  className,
  presentation,
  style,
}: {
  children?: ReactNode;
  className?: string;
  presentation: "panel" | "raw";
  style?: CSSProperties;
}) {
  return (
    <section
      className={className}
      data-presentation={presentation}
      data-testid="auth-left-rail"
      style={style}
    >
      {children}
    </section>
  );
}

function CapturedPage({
  children,
  className,
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <main
      className={className}
      data-testid="auth-page"
      style={style}
    >
      {children}
    </main>
  );
}

function CapturedShell({
  children,
  className,
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section
      className={className}
      data-testid="auth-card"
      style={style}
    >
      {children}
    </section>
  );
}

function CapturedContentContainer({
  children,
  className,
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <section
      className={className}
      data-testid="auth-form-panel"
      style={style}
    >
      {children}
    </section>
  );
}

describe("sdkwork-auth-pc-react page", () => {
  function renderAuthPage(
    initialEntry: string,
    options: {
      defaultLoginMethods?: boolean;
      locale?: string;
      runtimeConfig?: Partial<SdkworkAuthRuntimeConfig>;
    } = {},
  ) {
    const controller = createSdkworkAuthController({
      service: {
        confirmLoginQrCode: vi.fn(),
        signIn: vi.fn(),
        signInWithPhoneCode: vi.fn(),
        signInWithEmailCode: vi.fn(),
        signInWithOAuth: vi.fn(),
        register: vi.fn(),
        requestPasswordReset: vi.fn(),
        resetPassword: vi.fn(),
        sendVerifyCode: vi.fn(),
        signOut: vi.fn(),
        getOAuthAuthorizationUrl: vi.fn(),
        generateLoginQrCode: vi.fn(),
        checkLoginQrCodeStatus: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });
    const runtimeConfig: SdkworkAuthRuntimeConfig = {
      ...(options.defaultLoginMethods === false
        ? {}
        : { loginMethods: ["password", "emailCode"] as SdkworkAuthRuntimeConfig["loginMethods"] }),
      oauthProviders: ["github", "google"],
      qrLoginEnabled: false,
      ...options.runtimeConfig,
    };
    const authRoutes = (
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route
            path="/auth/login"
            element={
              <>
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={runtimeConfig}
                />
                <LocationProbe />
              </>
            }
          />
          <Route
            path="/auth/qr/:sessionKey"
            element={
              <>
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={runtimeConfig}
                />
                <LocationProbe />
              </>
            }
          />
          <Route
            path="/auth/register"
            element={
              <>
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={runtimeConfig}
                />
                <LocationProbe />
              </>
            }
          />
          <Route
            path="/auth/forgot-password"
            element={
              <>
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={runtimeConfig}
                />
                <LocationProbe />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    const renderResult = render(
      <SdkworkThemeProvider defaultTheme="light">
        {options.locale ? (
          <SdkworkI18nProvider
            catalogs={[SDKWORK_AUTH_I18N_CATALOG]}
            locale={options.locale}
          >
            {authRoutes}
          </SdkworkI18nProvider>
        ) : authRoutes}
      </SdkworkThemeProvider>,
    );

    return {
      controller,
      ...renderResult,
    };
  }

  it("renders the sdkwork-style login workspace with tabs and oauth providers", () => {
    renderAuthPage("/auth/login");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /welcome back/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /^password$/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /phone code/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /sign in with github/i,
      }),
    ).toBeInTheDocument();
  });

  it("uses short browser QR entry routes to complete desktop QR login with submitted password", async () => {
    const signIn = vi.fn().mockResolvedValue({
      accessToken: "scan-access-token",
      authToken: "scan-auth-token",
      user: {
        displayName: "Scan Operator",
        email: "scan@sdkwork.ai",
        id: "scan-user-1",
      },
    });
    const callbackLoginQrCode = vi.fn().mockResolvedValue({
      status: "scanned",
    });
    const confirmLoginQrCode = vi.fn().mockResolvedValue({
      status: "confirmed",
    });
    const controller = createSdkworkAuthController({
      service: {
        callbackLoginQrCode,
        checkLoginQrCodeStatus: vi.fn(),
        confirmLoginQrCode,
        generateLoginQrCode: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
        signIn,
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/qr/qr-browser-1"]}>
          <Routes>
            <Route
              path="/auth/qr/:sessionKey"
              element={
                <>
                  <SdkworkAuthPage
                    controller={controller}
                    runtimeConfig={{
                      loginMethods: ["password"],
                      oauthProviders: [],
                      qrLoginEnabled: false,
                    }}
                  />
                  <LocationProbe />
                </>
              }
            />
            <Route
              path="/dashboard"
              element={<LocationProbe />}
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    fireEvent.change(screen.getByLabelText(/account/i), {
      target: { value: "scan@sdkwork.ai" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(confirmLoginQrCode).toHaveBeenCalledWith({
        password: "secret",
        sessionKey: "qr-browser-1",
        username: "scan@sdkwork.ai",
      });
    });
    expect(callbackLoginQrCode).toHaveBeenCalledWith({
      event: "passwordRequired",
      scanSource: "browser",
      sessionKey: "qr-browser-1",
    });
    expect(signIn).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByTestId("auth-location")).toHaveTextContent("/dashboard");
    });
  });

  it("keeps already signed-in browser QR entry routes on password completion instead of auto-confirming", async () => {
    const callbackLoginQrCode = vi.fn().mockResolvedValue({
      status: "scanned",
    });
    const confirmLoginQrCode = vi.fn().mockResolvedValue({
      status: "confirmed",
    });
    const controller = createSdkworkAuthController({
      initialState: {
        isAuthenticated: true,
        isBootstrapped: true,
        session: {
          accessToken: "existing-access-token",
          authToken: "existing-auth-token",
        },
        status: "authenticated",
      },
      service: {
        callbackLoginQrCode,
        checkLoginQrCodeStatus: vi.fn(),
        confirmLoginQrCode,
        generateLoginQrCode: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue({
          accessToken: "existing-access-token",
          authToken: "existing-auth-token",
        }),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/qr/qr-existing-session?redirect=%2Fconsole"]}>
          <Routes>
            <Route
              path="/auth/qr/:sessionKey"
              element={
                <>
                  <SdkworkAuthPage
                    controller={controller}
                    runtimeConfig={{
                      loginMethods: ["password"],
                      oauthProviders: [],
                      qrLoginEnabled: false,
                    }}
                  />
                  <LocationProbe />
                </>
              }
            />
            <Route
              path="/console"
              element={<LocationProbe />}
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    await waitFor(() => {
      expect(callbackLoginQrCode).toHaveBeenCalledWith({
        event: "passwordRequired",
        scanSource: "browser",
        sessionKey: "qr-existing-session",
      });
    });
    expect(confirmLoginQrCode).not.toHaveBeenCalled();
    expect(screen.getByTestId("auth-location")).toHaveTextContent("/auth/qr/qr-existing-session?redirect=%2Fconsole");

    fireEvent.change(screen.getByLabelText(/account/i), {
      target: { value: "owner@sdkwork.ai" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(confirmLoginQrCode).toHaveBeenCalledWith({
        password: "secret",
        sessionKey: "qr-existing-session",
        username: "owner@sdkwork.ai",
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId("auth-location")).toHaveTextContent("/console");
    });
  });

  it("keeps QR entry purpose authoritative by hiding mode-changing actions", async () => {
    const callbackLoginQrCode = vi.fn().mockResolvedValue({
      status: "scanned",
    });
    const confirmLoginQrCode = vi.fn().mockResolvedValue({
      status: "confirmed",
    });
    const generateLoginQrCode = vi.fn();
    const controller = createSdkworkAuthController({
      service: {
        callbackLoginQrCode,
        checkLoginQrCodeStatus: vi.fn(),
        confirmLoginQrCode,
        generateLoginQrCode,
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login?session_key=qr-switch-purpose&purpose=login&redirect=%2Fconsole"]}>
          <Routes>
            <Route
              path="/auth/*"
              element={
                <>
                  <SdkworkAuthPage
                    controller={controller}
                    runtimeConfig={{
                      loginMethods: ["password"],
                      oauthLoginEnabled: true,
                      oauthProviders: ["github"],
                      registerMethods: ["email"],
                    }}
                  />
                  <LocationProbe />
                </>
              }
            />
            <Route
              path="/console"
              element={<LocationProbe />}
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /welcome back/i,
      }),
    ).toBeInTheDocument();
    expect(generateLoginQrCode).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /^sign up$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /forgot password/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sign in with github/i })).not.toBeInTheDocument();
    expect(screen.getByTestId("auth-location")).toHaveTextContent(
      "/auth/login?session_key=qr-switch-purpose&purpose=login&redirect=%2Fconsole",
    );

    fireEvent.change(screen.getByLabelText(/account/i), {
      target: { value: "qr-login@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "login-secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(confirmLoginQrCode).toHaveBeenCalledWith({
        password: "login-secret",
        sessionKey: "qr-switch-purpose",
        username: "qr-login@example.com",
      });
    });
    expect(callbackLoginQrCode).toHaveBeenCalledWith({
      event: "passwordRequired",
      scanSource: "browser",
      sessionKey: "qr-switch-purpose",
    });
    await waitFor(() => {
      expect(screen.getByTestId("auth-location")).toHaveTextContent("/console");
    });
  });

  it("completes QR registration from an API_SPEC session_key fallback URL", async () => {
    const callbackLoginQrCode = vi.fn().mockResolvedValue({
      status: "scanned",
    });
    const confirmLoginQrCode = vi.fn().mockResolvedValue({
      status: "confirmed",
    });
    const register = vi.fn();
    const generateLoginQrCode = vi.fn();
    const controller = createSdkworkAuthController({
      service: {
        callbackLoginQrCode,
        checkLoginQrCodeStatus: vi.fn(),
        confirmLoginQrCode,
        generateLoginQrCode,
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
        register,
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/register?session_key=qr-register-1&purpose=register&redirect=%2Fconsole"]}>
          <Routes>
            <Route
              path="/auth/*"
              element={
                <>
                  <SdkworkAuthPage
                    controller={controller}
                    runtimeConfig={{
                      loginMethods: ["password"],
                      oauthLoginEnabled: true,
                      oauthProviders: ["github"],
                      registerMethods: ["email"],
                    }}
                  />
                  <LocationProbe />
                </>
              }
            />
            <Route
              path="/console"
              element={<LocationProbe />}
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /create an account/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^sign in$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /sign in with github/i })).not.toBeInTheDocument();
    expect(generateLoginQrCode).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "qr-register-user" },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "qr-register@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "Passw0rd!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: { value: "Passw0rd!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^sign up$/i }));

    await waitFor(() => {
      expect(confirmLoginQrCode).toHaveBeenCalledWith({
        channel: "EMAIL",
        confirmPassword: "Passw0rd!",
        email: "qr-register@example.com",
        password: "Passw0rd!",
        phone: undefined,
        sessionKey: "qr-register-1",
        username: "qr-register-user",
      });
    });
    expect(callbackLoginQrCode).toHaveBeenCalledWith({
      event: "bindRequired",
      scanSource: "browser",
      sessionKey: "qr-register-1",
    });
    expect(register).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByTestId("auth-location")).toHaveTextContent("/console");
    });
  });

  it("ignores retired qrKey query parameters and keeps purpose inert without session_key", async () => {
    const callbackLoginQrCode = vi.fn();
    const confirmLoginQrCode = vi.fn();
    const signIn = vi.fn().mockResolvedValue({
      accessToken: "normal-access-token",
      authToken: "normal-auth-token",
      user: {
        displayName: "Normal User",
        email: "normal@sdkwork.ai",
        id: "normal-user-1",
      },
    });
    const controller = createSdkworkAuthController({
      service: {
        callbackLoginQrCode,
        checkLoginQrCodeStatus: vi.fn(),
        confirmLoginQrCode,
        generateLoginQrCode: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
        signIn,
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login?qrKey=legacy-qr&purpose=register&redirect=%2Fconsole"]}>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <>
                  <SdkworkAuthPage
                    controller={controller}
                    runtimeConfig={{
                      loginMethods: ["password"],
                      oauthProviders: [],
                      qrLoginEnabled: false,
                    }}
                  />
                  <LocationProbe />
                </>
              }
            />
            <Route
              path="/console"
              element={<LocationProbe />}
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /welcome back/i,
      }),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/account/i), {
      target: { value: "normal@sdkwork.ai" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "normal-secret" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith({
        password: "normal-secret",
        username: "normal@sdkwork.ai",
      });
    });
    expect(callbackLoginQrCode).not.toHaveBeenCalled();
    expect(confirmLoginQrCode).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByTestId("auth-location")).toHaveTextContent("/console");
    });
  });

  it("renders localized login copy from the global i18n provider", async () => {
    renderAuthPage("/auth/login", {
      locale: "zh-CN",
    });

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "\u6b22\u8fce\u56de\u6765",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "\u5bc6\u7801",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /使用GitHub登录/,
      }),
    ).toBeInTheDocument();
  });

  it("fully localizes the Chinese login surface across tabs, forms, QR, OAuth, and actions", async () => {
    const controller = createSdkworkAuthController({
      service: {
        checkLoginQrCodeStatus: vi.fn().mockResolvedValue({
          status: "pending",
        }),
        generateLoginQrCode: vi.fn().mockResolvedValue({
          description: "Scan with SDKWork mobile app to continue",
          qrContent: "sdkwork://auth/zh-login-surface",
          sessionKey: "zh-login-surface",
          title: "Desktop QR Login",
          type: "app",
        }),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
        getOAuthAuthorizationUrl: vi.fn(),
        sendVerifyCode: vi.fn(),
        signIn: vi.fn(),
        signInWithEmailCode: vi.fn(),
        signInWithPhoneCode: vi.fn(),
        signInWithSessionBridge: vi.fn(),
      },
    });

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkI18nProvider
          catalogs={[SDKWORK_AUTH_I18N_CATALOG]}
          locale="zh-CN"
        >
          <MemoryRouter initialEntries={["/auth/login"]}>
            <Routes>
              <Route
                path="/auth/login"
                element={
                  <SdkworkAuthPage
                    controller={controller}
                    runtimeConfig={{
                      loginMethods: ["password", "emailCode", "phoneCode", "sessionBridge"],
                      oauthLoginEnabled: true,
                      oauthProviders: ["wechat", "alipay", "douyin"],
                      qrLoginEnabled: true,
                      registerMethods: ["email", "phone"],
                    }}
                  />
                }
              />
            </Routes>
          </MemoryRouter>
        </SdkworkI18nProvider>
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "\u6b22\u8fce\u56de\u6765",
      }),
    ).toBeInTheDocument();
    expect(await screen.findByAltText("\u767b\u5f55\u4e8c\u7ef4\u7801")).toBeInTheDocument();
    expect(screen.getByText("扫描二维码，快速登录")).toBeInTheDocument();
    expect(screen.queryByText("\u626b\u7801\u767b\u5f55")).not.toBeInTheDocument();
    expect(screen.queryByText("\u4f7f\u7528\u53d7\u652f\u6301\u7684 App \u626b\u7801\uff0c\u5373\u53ef\u5feb\u901f\u5b8c\u6210\u767b\u5f55\u3002")).not.toBeInTheDocument();

    const tabLabels = screen.getAllByRole("button")
      .filter((button) => button.className.includes("sdkwork-auth-tab-button"))
      .map((button) => button.textContent);
    expect(tabLabels).toEqual([
      "\u5bc6\u7801",
      "\u90ae\u7bb1\u9a8c\u8bc1\u7801",
      "\u624b\u673a\u9a8c\u8bc1\u7801",
    ]);

    expect(screen.getByLabelText("\u8d26\u53f7")).toHaveAttribute(
      "placeholder",
      "\u7528\u6237\u540d\u3001\u624b\u673a\u53f7\u6216\u90ae\u7bb1",
    );
    expect(screen.getByLabelText("\u5bc6\u7801")).toHaveAttribute(
      "placeholder",
      "\u8bf7\u8f93\u5165\u5bc6\u7801",
    );
    expect(
      screen.getByRole("button", {
        name: "\u767b\u5f55",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("\u5fd8\u8bb0\u5bc6\u7801\uff1f")).toBeInTheDocument();
    expect(screen.getByText("\u8fd8\u6ca1\u6709\u8d26\u53f7\uff1f")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "\u6ce8\u518c",
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "\u90ae\u7bb1\u9a8c\u8bc1\u7801",
      }),
    );
    expect(screen.getByLabelText("\u90ae\u7bb1")).toHaveAttribute(
      "placeholder",
      "name@example.com",
    );
    expect(
      screen.getByRole("button", {
        name: "\u53d1\u9001\u9a8c\u8bc1\u7801",
      }),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "\u624b\u673a\u9a8c\u8bc1\u7801",
      }),
    );
    expect(screen.getByLabelText("\u624b\u673a\u53f7")).toHaveAttribute(
      "placeholder",
      "+86 138 0000 0000",
    );

    expect(screen.getByText("第三方登录")).toBeInTheDocument();
    expect(screen.queryByText("使用常用平台账号快速登录，授权过程安全可控。")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /^使用微信登录/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /^使用支付宝登录/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /^使用抖音登录/,
      }),
    ).toBeInTheDocument();
    expect(container).not.toHaveTextContent("账号授权");
    expect(container).not.toHaveTextContent("可信任的身份提供商");
    expect(container).not.toHaveTextContent("安全的身份提供商跳转");
    expect(container).not.toHaveTextContent("启动");
    expect(container).not.toHaveTextContent("OAuth");
    expect(container).not.toHaveTextContent("提供商");
    expect(container).not.toHaveTextContent("TikTok");
    expect(container).not.toHaveTextContent("Google");
    expect(container).not.toHaveTextContent("GitHub");
    expect(container).not.toHaveTextContent("\u5355\u70b9\u767b\u5f55");
    expect(container).not.toHaveTextContent("\u7edf\u4e00\u7528\u6237\u4e2d\u5fc3");
    expect(container).not.toHaveTextContent("Desktop QR Login");
    expect(container).not.toHaveTextContent("Use your mobile app to continue");
    expect(container).not.toHaveTextContent("Scan with SDKWork mobile app to continue");
    expect(container).not.toHaveTextContent(/Welcome back|Password|Email code|Phone code|Forgot password|Don't have an account|Sign in|Sign up|Trusted identity providers|Continue with/i);
  });

  it("shows mainland China third-party authorization providers by default", async () => {
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode: vi.fn(),
        checkLoginQrCodeStatus: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
        getOAuthAuthorizationUrl: vi.fn(),
      },
    });

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkI18nProvider
          catalogs={[SDKWORK_AUTH_I18N_CATALOG]}
          locale="zh-CN"
        >
          <MemoryRouter initialEntries={["/auth/login"]}>
            <Routes>
              <Route
                path="/auth/login"
                element={
                  <SdkworkAuthPage
                    controller={controller}
                    runtimeConfig={{
                      leftRailMode: "highlights-only",
                      loginMethods: ["password"],
                      oauthLoginEnabled: true,
                      qrLoginEnabled: false,
                    }}
                  />
                }
              />
            </Routes>
          </MemoryRouter>
        </SdkworkI18nProvider>
      </SdkworkThemeProvider>,
    );

    const oauthDivider = await screen.findByRole("heading", {
      level: 3,
      name: "第三方登录",
    });
    expect(oauthDivider).toBeInTheDocument();
    expect(oauthDivider.parentElement?.className).toContain("flex");
    expect(oauthDivider.parentElement?.className).toContain("items-center");
    expect(oauthDivider.parentElement?.className).toContain("gap-4");
    expect(oauthDivider.parentElement?.querySelectorAll('span[aria-hidden="true"]')).toHaveLength(2);
    expect(screen.queryByText("使用常用平台账号快速登录，授权过程安全可控。")).not.toBeInTheDocument();

    const providerButtons = screen.getAllByRole("button")
      .filter((button) => button.textContent?.startsWith("使用"))
      .map((button) => button.textContent);

    expect(providerButtons).toEqual([
      "使用微信登录",
      "使用支付宝登录",
      "使用抖音登录",
    ]);
    expect(container).not.toHaveTextContent("可信任的身份提供商");
    expect(container).not.toHaveTextContent("第三方授权登录");
    expect(container).not.toHaveTextContent("账号授权");
    expect(container).not.toHaveTextContent("TikTok");
    expect(container).not.toHaveTextContent("Google");
    expect(container).not.toHaveTextContent("GitHub");
    const oauthCardButtons = Array.from(container.querySelectorAll("button"))
      .filter((button) => button.className.includes("--sdkwork-auth-oauth-card-background-color"));

    expect(container.querySelector(".border-t.border-zinc-200")).toBeNull();
    expect(oauthCardButtons).toHaveLength(3);
    for (const oauthCardButton of oauthCardButtons) {
      expect(oauthCardButton.className).not.toContain("border");
      expect(oauthCardButton.className).not.toContain("shadow");
      expect(oauthCardButton.className).toContain("rounded-lg");
    }
    expect(container.innerHTML).not.toContain("bg-white px-2 text-zinc-500 dark:bg-zinc-900");
  });

  it("shows overseas third-party login providers when the auth region is overseas", async () => {
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode: vi.fn(),
        checkLoginQrCodeStatus: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
        getOAuthAuthorizationUrl: vi.fn(),
      },
    });

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login"]}>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={{
                    leftRailMode: "highlights-only",
                    loginMethods: ["password"],
                    oauthLoginEnabled: true,
                    oauthProviderRegion: "overseas",
                    qrLoginEnabled: false,
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("button", {
        name: /^Sign in with Google/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /^Sign in with GitHub/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /^Sign in with TikTok/,
      }),
    ).toBeInTheDocument();
    expect(container).not.toHaveTextContent("WeChat");
    expect(container).not.toHaveTextContent("Alipay");
    expect(container).not.toHaveTextContent("Douyin");
  });

  it("shows only configured third-party login providers in the requested order", async () => {
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode: vi.fn(),
        checkLoginQrCodeStatus: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
        getOAuthAuthorizationUrl: vi.fn(),
      },
    });

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkI18nProvider
          catalogs={[SDKWORK_AUTH_I18N_CATALOG]}
          locale="zh-CN"
        >
          <MemoryRouter initialEntries={["/auth/login"]}>
            <Routes>
              <Route
                path="/auth/login"
                element={
                  <SdkworkAuthPage
                    controller={controller}
                    runtimeConfig={{
                      leftRailMode: "highlights-only",
                      loginMethods: ["password"],
                      oauthLoginEnabled: true,
                      oauthProviders: ["github", "wechat", "tiktok"],
                      qrLoginEnabled: false,
                    }}
                  />
                }
              />
            </Routes>
          </MemoryRouter>
        </SdkworkI18nProvider>
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("button", {
        name: /^使用GitHub登录/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /^使用微信登录/,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /^使用TikTok登录/,
      }),
    ).toBeInTheDocument();
    expect(container).not.toHaveTextContent("\u6296\u97f3");
    expect(container).not.toHaveTextContent("Google");

    const providerButtons = screen.getAllByRole("button")
      .filter((button) => button.textContent?.startsWith("使用"))
      .map((button) => button.textContent);
    expect(providerButtons).toEqual([
      "使用GitHub登录",
      "使用微信登录",
      "使用TikTok登录",
    ]);
    expect(container).not.toHaveTextContent("账号授权");
  });

  it("hides third-party login providers when the configured provider list is empty", async () => {
    const controller = createSdkworkAuthController({
      service: {
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
        getOAuthAuthorizationUrl: vi.fn(),
      },
    });

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkI18nProvider
          catalogs={[SDKWORK_AUTH_I18N_CATALOG]}
          locale="zh-CN"
        >
          <MemoryRouter initialEntries={["/auth/login"]}>
            <Routes>
              <Route
                path="/auth/login"
                element={
                  <SdkworkAuthPage
                    controller={controller}
                    runtimeConfig={{
                      leftRailMode: "highlights-only",
                      loginMethods: ["password"],
                      oauthLoginEnabled: true,
                      oauthProviders: [],
                      qrLoginEnabled: false,
                    }}
                  />
                }
              />
            </Routes>
          </MemoryRouter>
        </SdkworkI18nProvider>
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByLabelText("\u8d26\u53f7")).toBeInTheDocument();
    expect(screen.getByLabelText("\u5bc6\u7801")).toBeInTheDocument();
    expect(screen.queryByRole("heading", {
      level: 3,
      name: "\u7b2c\u4e09\u65b9\u767b\u5f55",
    })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /\u4f7f\u7528\u5fae\u4fe1\u767b\u5f55/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /\u4f7f\u7528\u652f\u4ed8\u5b9d\u767b\u5f55/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /\u4f7f\u7528\u6296\u97f3\u767b\u5f55/ })).not.toBeInTheDocument();
  });

  it("keeps session bridge out of login tabs and internal user-center terminology out of the login UI", async () => {
    const controller = createSdkworkAuthController({
      service: {
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
        signInWithSessionBridge: vi.fn(),
      },
    });

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkI18nProvider
          catalogs={[SDKWORK_AUTH_I18N_CATALOG]}
          locale="zh-CN"
        >
          <MemoryRouter initialEntries={["/auth/login?method=sessionBridge"]}>
            <Routes>
              <Route
                path="/auth/login"
                element={
                  <SdkworkAuthPage
                    controller={controller}
                    runtimeConfig={{
                      loginMethods: ["password", "emailCode", "phoneCode", "sessionBridge"],
                      oauthProviders: [],
                      qrLoginEnabled: false,
                    }}
                  />
                }
              />
            </Routes>
          </MemoryRouter>
        </SdkworkI18nProvider>
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("button", {
        name: "\u5bc6\u7801",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "\u90ae\u7bb1\u9a8c\u8bc1\u7801",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "\u624b\u673a\u9a8c\u8bc1\u7801",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "\u7ee7\u7eed\u767b\u5f55",
      }),
    ).toBeInTheDocument();
    expect(container).not.toHaveTextContent("\u5355\u70b9\u767b\u5f55");
    expect(container).not.toHaveTextContent("\u4f01\u4e1a\u5355\u70b9\u767b\u5f55");
    expect(container).not.toHaveTextContent("\u4f7f\u7528\u7ec4\u7ec7\u8eab\u4efd\u63d0\u4f9b\u65b9");
    expect(container).not.toHaveTextContent("\u7edf\u4e00\u7528\u6237\u4e2d\u5fc3");
    expect(container).not.toHaveTextContent(/user center/i);
    expect(container).not.toHaveTextContent("\u8ba4\u8bc1\u5951\u7ea6");
    expect(container).not.toHaveTextContent(/auth contract/i);
    expect(container).not.toHaveTextContent(/Enterprise SSO|Continue with SSO|Welcome back|Password/i);
  });

  it("uses the SDKWork aligned auth shell with soft glow background", () => {
    const { container } = renderAuthPage("/auth/login");

    expect(container.innerHTML).toContain("bg-zinc-100");
    expect(container.innerHTML).toContain("dark:bg-zinc-950");
    expect(container.innerHTML).toContain("sdkwork-auth-surface");
    expect(container.innerHTML).toContain("sdkwork-auth-shell");
    expect(container.innerHTML).toContain("[data-sdk-color-mode=\"dark\"] .sdkwork-auth-surface");
    expect(container.innerHTML).toContain("[data-sdk-color-mode=\"dark\"] .sdkwork-auth-shell");
    expect(container.innerHTML).toContain(".sdkwork-auth-tab-button[data-state=\"active\"]");
    expect(container.innerHTML).toContain("--sdkwork-auth-tab-active-text-color");
    expect(container.innerHTML).toContain("--sdkwork-auth-field-text-color");
    expect(container.innerHTML).toContain("min-h-[100dvh]");
    expect(container.innerHTML).toContain("items-center");
    expect(container.innerHTML).toContain("sm:p-8");
    expect(container.innerHTML).toContain("max-w-6xl");
    expect(container.innerHTML).toContain("rounded-[32px]");
    expect(container.innerHTML).toContain("bg-white/92");
    expect(container.innerHTML).toContain("md:min-h-[720px]");
    expect(container.innerHTML).not.toContain("lg:my-8");
    expect(container.innerHTML).not.toContain("lg:mx-8");
    expect(container.innerHTML).not.toContain("items-stretch");
    expect(container.innerHTML).not.toContain("max-w-none");
    expect(container.innerHTML).not.toContain("max-w-[1040px]");
    expect(container.innerHTML).not.toContain("bg-slate-950/90");
    expect(container.innerHTML).toContain("blur-3xl");
  });

  it("centers the SDKWork auth card with the QR rail on the left and forms on the right for login and register", async () => {
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode: vi.fn().mockResolvedValue({
          description: "Use your mobile app to continue",
          qrContent: "sdkwork://auth/centered-card-qr-login",
          sessionKey: "qr-centered-card-1",
          title: "Desktop QR Login",
          type: "app",
        }),
        checkLoginQrCodeStatus: vi.fn().mockResolvedValue({
          status: "pending",
        }),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    for (const initialEntry of [
      "/auth/login",
      "/auth/register",
    ]) {
      const { unmount } = render(
        <SdkworkThemeProvider defaultTheme="light">
          <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
              <Route
                path="/auth/*"
                element={
                  <SdkworkAuthPage
                    appearance={{
                      slots: {
                        AsideContainer: CapturedAsideContainer,
                        ContentContainer: CapturedContentContainer,
                        Page: CapturedPage,
                        Shell: CapturedShell,
                      },
                    }}
                    controller={controller}
                    runtimeConfig={{
                      loginMethods: ["password"],
                      oauthProviders: [],
                    }}
                  />
                }
              />
            </Routes>
          </MemoryRouter>
        </SdkworkThemeProvider>,
      );

      expect(await screen.findByAltText(/login qr code/i)).toHaveAttribute(
        "src",
        "data:image/png;base64,qr-login",
      );

      const page = screen.getByTestId("auth-page");
      expect(page).toHaveClass("items-center");
      expect(page).toHaveClass("justify-center");
      expect(page).toHaveClass("bg-zinc-100");
      expect(page.className).toContain("dark:bg-zinc-950");
      expect(page).toHaveClass("p-4");
      expect(page.className).toContain("sm:p-8");
      expect(page.className).not.toContain("items-stretch");
      expect(page.className).not.toContain("p-0");
      expect(page.style.backgroundColor).toBe("");

      const card = screen.getByTestId("auth-card");
      expect(card.className).toContain("max-w-6xl");
      expect(card.className).toContain("sdkwork-auth-shell");
      expect(card.className).toContain("rounded-[32px]");
      expect(card.className).toContain("bg-white/92");
      expect(card.className).toContain("dark:bg-zinc-950/88");
      expect(card.className).toContain("md:min-h-[720px]");
      expect(card.className).toContain("md:flex-row");
      expect(card.className).not.toContain("h-full");
      expect(card.className).not.toContain("max-w-none");
      expect(card.className).not.toContain("max-w-[1040px]");
      expect(card.className).not.toContain("flex-1");
      expect(card.style.backgroundColor).toBe("");

      const qrRail = screen.getByTestId("auth-left-rail");
      expect(qrRail).toHaveAttribute("data-presentation", "raw");
      expect(qrRail.className).toContain("p-4");
      expect(qrRail.className).toContain("md:w-[42%]");
      expect(qrRail.className).toContain("md:p-6");

      const formPanel = screen.getByTestId("auth-form-panel");
      expect(formPanel.className).toContain("p-8");
      expect(formPanel.className).toContain(
        "md:w-[58%]",
      );
      expect(formPanel.className).toContain("md:px-10");
      expect(formPanel.className).toContain("md:py-12");
      expect(formPanel.className).not.toContain("md:border-l");
      expect(formPanel.style.color).toBe("");
      expect(formPanel.firstElementChild?.className).toContain(
        "max-w-xl",
      );
      expect(formPanel.firstElementChild?.className).not.toContain(
        "max-w-[360px]",
      );

      unmount();
    }

    expect(controller.service.generateLoginQrCode).toHaveBeenCalledTimes(2);
    expect(controller.service.generateLoginQrCode).toHaveBeenNthCalledWith(1, {
      purpose: "login",
    });
    expect(controller.service.generateLoginQrCode).toHaveBeenNthCalledWith(2, {
      purpose: "register",
    });
  });

  it("keeps forgot-password in the standard product shell without creating a QR login session", async () => {
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode: vi.fn(),
        checkLoginQrCodeStatus: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/forgot-password"]}>
          <Routes>
            <Route
              path="/auth/*"
              element={
                <SdkworkAuthPage
                  appearance={{
                    slots: {
                      AsideContainer: CapturedAsideContainer,
                      ContentContainer: CapturedContentContainer,
                      Page: CapturedPage,
                      Shell: CapturedShell,
                    },
                  }}
                  controller={controller}
                  runtimeConfig={{
                    loginMethods: ["password"],
                    oauthProviders: [],
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /reset password/i,
      }),
    ).toBeInTheDocument();

    expect(screen.queryByAltText(/login qr code/i)).not.toBeInTheDocument();
    expect(controller.service.generateLoginQrCode).not.toHaveBeenCalled();

    const page = screen.getByTestId("auth-page");
    expect(page).toHaveClass("items-center");
    expect(page).toHaveClass("justify-center");
    expect(page).toHaveClass("bg-zinc-100");

    const card = screen.getByTestId("auth-card");
    expect(card.className).toContain("max-w-6xl");
    expect(card.className).toContain("sdkwork-auth-shell");
    expect(card.className).toContain("rounded-[32px]");
    expect(card.className).toContain("bg-white/92");
    expect(card.className).toContain("md:min-h-[720px]");

    const aside = screen.getByTestId("auth-left-rail");
    expect(aside).toHaveAttribute("data-presentation", "panel");

    const formPanel = screen.getByTestId("auth-form-panel");
    expect(formPanel.className).toContain("md:w-[58%]");
  });

  it("renders SDKWork aligned login form controls", async () => {
    renderAuthPage("/auth/login");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /welcome back/i,
      }),
    ).toBeInTheDocument();

    const passwordTab = screen.getByRole("button", {
      name: /^password$/i,
    });
    expect(passwordTab).toHaveAttribute("data-state", "active");
    expect(passwordTab.className).toContain("sdkwork-auth-tab-button");
    expect(passwordTab.className).toContain("bg-white");
    expect(passwordTab.className).toContain("text-zinc-950");

    const emailTab = screen.getByRole("button", {
      name: /email code/i,
    });
    expect(emailTab).toHaveAttribute("data-state", "inactive");
    expect(emailTab.className).toContain("sdkwork-auth-tab-button");
    expect(emailTab.className).toContain("hover:bg-white/70");
    expect(emailTab.className).toContain("hover:text-zinc-900");

    const accountInput = screen.getByPlaceholderText(/username/i);
    expect(accountInput.className).toContain("rounded-xl");
    expect(accountInput.className).toContain("border-zinc-200");
    expect(accountInput.className).toContain("bg-white");
    expect(accountInput.className).toContain("shadow-sm");
    expect(accountInput.className).toContain("focus-visible:ring-primary-500");

    const submitButton = screen.getByRole("button", {
      name: "Sign in",
    });
    expect(submitButton.className).toContain("rounded-xl");
    expect(submitButton.className).toContain("bg-primary-600");
    expect(submitButton.className).toContain("text-white");
    expect(submitButton.className).toContain("shadow-sm");
    expect(submitButton).toHaveStyle({
      backgroundColor: "var(--sdkwork-auth-primary-button-background-color, var(--sdk-color-brand-primary, #dc2626))",
      color: "var(--sdkwork-auth-primary-button-text-color, #ffffff)",
    });

    const githubButton = screen.getByRole("button", {
      name: /sign in with github/i,
    });
    expect(githubButton.className).toContain("rounded-lg");
    expect(githubButton.className).toContain("bg-[var(--sdkwork-auth-oauth-card-background-color");
    expect(githubButton.className).toContain("hover:bg-[var(--sdkwork-auth-oauth-card-hover-background-color");
    expect(githubButton.className).not.toContain("border");
    expect(githubButton.className).not.toContain("shadow");
    expect(screen.getByText("Sign in with GitHub").className).toContain(
      "text-[var(--sdkwork-auth-oauth-card-title-color",
    );
    expect(screen.queryByText("GitHub account authorization")).not.toBeInTheDocument();
  });

  it("keeps third-party login card text and icons visible when theme colors override the card background", async () => {
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode: vi.fn(),
        checkLoginQrCodeStatus: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
        getOAuthAuthorizationUrl: vi.fn(),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login"]}>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <SdkworkAuthPage
                  appearance={createSdkworkAuthAppearancePreset("midnight")}
                  controller={controller}
                  runtimeConfig={{
                    leftRailMode: "highlights-only",
                    loginMethods: ["password"],
                    oauthLoginEnabled: true,
                    oauthProviders: ["github"],
                    qrLoginEnabled: false,
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    const githubButton = await screen.findByRole("button", {
      name: /sign in with github/i,
    });
    expect(githubButton).toHaveStyle({
      backgroundColor: "rgba(15,23,42,0.70)",
    });
    expect(githubButton.style.borderColor).toBe("");
    expect(githubButton.className).not.toContain("border");
    expect(githubButton.className).not.toContain("shadow");

    const providerTitle = screen.getByText("Sign in with GitHub");
    expect(providerTitle.className).toContain("text-[var(--sdkwork-auth-oauth-card-title-color");
    expect(providerTitle.className).not.toContain("text-zinc-800");

    expect(screen.queryByText("GitHub account authorization")).not.toBeInTheDocument();

    const iconWell = githubButton.querySelector("[data-sdkwork-oauth-provider-icon]");
    expect(iconWell?.className).toContain("text-[var(--sdkwork-auth-oauth-card-icon-color");
    expect(iconWell?.className).not.toContain("text-zinc-600");
  });

  it("self-hosts a router outside an app router", async () => {
    const controller = createSdkworkAuthController({
      service: {
        signIn: vi.fn(),
        signInWithPhoneCode: vi.fn(),
        signInWithEmailCode: vi.fn(),
        signInWithOAuth: vi.fn(),
        register: vi.fn(),
        requestPasswordReset: vi.fn(),
        resetPassword: vi.fn(),
        sendVerifyCode: vi.fn(),
        signOut: vi.fn(),
        getOAuthAuthorizationUrl: vi.fn(),
        generateLoginQrCode: vi.fn(),
        checkLoginQrCodeStatus: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkAuthPage
          controller={controller}
          runtimeConfig={{
            loginMethods: ["password", "emailCode", "phoneCode"],
            oauthProviders: ["github", "google"],
            qrLoginEnabled: false,
          }}
        />
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /welcome back/i,
      }),
    ).toBeInTheDocument();
  });

  it("starts oauth login when providers are configured with common aliases", async () => {
    const getOAuthAuthorizationUrl = vi.fn().mockResolvedValue("#oauth-alipay");
    const controller = createSdkworkAuthController({
      service: {
        signIn: vi.fn(),
        signInWithPhoneCode: vi.fn(),
        signInWithEmailCode: vi.fn(),
        signInWithOAuth: vi.fn(),
        register: vi.fn(),
        requestPasswordReset: vi.fn(),
        resetPassword: vi.fn(),
        sendVerifyCode: vi.fn(),
        signOut: vi.fn(),
        getOAuthAuthorizationUrl,
        generateLoginQrCode: vi.fn(),
        checkLoginQrCodeStatus: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login"]}>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={{
                    leftRailMode: "highlights-only",
                    loginMethods: ["password"],
                    oauthLoginEnabled: true,
                    oauthProviders: ["ali-pay"],
                    qrLoginEnabled: false,
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    fireEvent.click(await screen.findByRole("button", {
      name: /sign in with alipay/i,
    }));

    await waitFor(() => {
      expect(getOAuthAuthorizationUrl).toHaveBeenCalledWith(expect.objectContaining({
        provider: "alipay",
      }));
    });
    expect(window.location.hash).toBe("#oauth-alipay");
  });

  it("does not expose backend OAuth provider configuration errors during third-party login startup", async () => {
    sdkToastMock.error.mockClear();
    const getOAuthAuthorizationUrl = vi.fn().mockRejectedValue(
      new Error("OAuth provider is not configured"),
    );
    const controller = createSdkworkAuthController({
      service: {
        signIn: vi.fn(),
        signInWithPhoneCode: vi.fn(),
        signInWithEmailCode: vi.fn(),
        signInWithOAuth: vi.fn(),
        register: vi.fn(),
        requestPasswordReset: vi.fn(),
        resetPassword: vi.fn(),
        sendVerifyCode: vi.fn(),
        signOut: vi.fn(),
        getOAuthAuthorizationUrl,
        generateLoginQrCode: vi.fn(),
        checkLoginQrCodeStatus: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <SdkworkI18nProvider
          catalogs={[SDKWORK_AUTH_I18N_CATALOG]}
          locale="zh-CN"
        >
          <MemoryRouter initialEntries={["/auth/login"]}>
            <Routes>
              <Route
                path="/auth/login"
                element={
                  <SdkworkAuthPage
                    controller={controller}
                    runtimeConfig={{
                      leftRailMode: "highlights-only",
                      loginMethods: ["password"],
                      oauthLoginEnabled: true,
                      oauthProviders: ["wechat"],
                      qrLoginEnabled: false,
                    }}
                  />
                }
              />
            </Routes>
          </MemoryRouter>
        </SdkworkI18nProvider>
      </SdkworkThemeProvider>,
    );

    fireEvent.click(await screen.findByRole("button", {
      name: /^使用微信登录/,
    }));

    await waitFor(() => {
      expect(sdkToastMock.error).toHaveBeenCalledWith("该第三方登录方式暂不可用。");
    });
    expect(container).not.toHaveTextContent("OAuth provider is not configured");
    expect(container).not.toHaveTextContent(/provider is not configured/i);
  });

  it("uses localized validation messages for empty password login fields", async () => {
    const { controller } = renderAuthPage("/auth/login", {
      locale: "zh-CN",
    });

    fireEvent.click(
      await screen.findByRole("button", {
        name: "\u767b\u5f55",
      }),
    );

    expect(
      await screen.findByText("\u8bf7\u8f93\u5165\u8d26\u53f7\u3002"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("\u8bf7\u8f93\u5165\u5bc6\u7801\u3002"),
    ).toBeInTheDocument();
    expect(controller.service.signIn).not.toHaveBeenCalled();
  });

  it("uses localized validation messages for empty email code login fields", async () => {
    const { controller } = renderAuthPage("/auth/login?method=email", {
      locale: "zh-CN",
      runtimeConfig: {
        developmentPrefill: {
          enabled: false,
        },
      },
    });

    fireEvent.click(
      await screen.findByRole("button", {
        name: "\u767b\u5f55",
      }),
    );

    expect(
      await screen.findByText("\u8bf7\u8f93\u5165\u90ae\u7bb1\u3002"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("\u8bf7\u8f93\u5165\u9a8c\u8bc1\u7801\u3002"),
    ).toBeInTheDocument();
    expect(controller.service.signInWithEmailCode).not.toHaveBeenCalled();
  });

  it("defaults to password-only login when verification-code login is not enabled", async () => {
    renderAuthPage("/auth/login", {
      defaultLoginMethods: false,
      runtimeConfig: {
        oauthLoginEnabled: false,
        qrLoginEnabled: false,
      },
    });

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /welcome back/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /email code/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /phone code/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("shows email and phone code login when verification-code login is enabled by policy", async () => {
    renderAuthPage("/auth/login", {
      defaultLoginMethods: false,
      runtimeConfig: {
        oauthLoginEnabled: false,
        qrLoginEnabled: false,
        verificationPolicy: {
          emailCodeLoginEnabled: true,
          phoneCodeLoginEnabled: true,
        },
      },
    });

    expect(
      await screen.findByRole("button", {
        name: /^password$/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /email code/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /phone code/i,
      }),
    ).toBeInTheDocument();
  });

  it("loads backend verification policy and hides disabled verification-code tabs", async () => {
    const controller = createSdkworkAuthController({
      service: {
        checkLoginQrCodeStatus: vi.fn(),
        confirmLoginQrCode: vi.fn(),
        generateLoginQrCode: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
        getOAuthAuthorizationUrl: vi.fn(),
        getVerificationPolicy: vi.fn().mockResolvedValue({
          emailCodeLoginEnabled: true,
          emailRegisterVerificationRequired: true,
          phoneCodeLoginEnabled: false,
          phoneRegisterVerificationRequired: false,
        }),
        sendVerifyCode: vi.fn(),
        signIn: vi.fn(),
        signInWithEmailCode: vi.fn(),
        signInWithPhoneCode: vi.fn(),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login"]}>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={{
                    oauthLoginEnabled: false,
                    qrLoginEnabled: false,
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("button", {
        name: /^password$/i,
      }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(controller.service.getVerificationPolicy).toHaveBeenCalledOnce();
    });
    expect(
      await screen.findByRole("button", {
        name: /email code/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: /phone code/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("uses the default development verification code for email login without sending a real code", async () => {
    const { controller } = renderAuthPage("/auth/login", {
      runtimeConfig: {
        developmentPrefill: {
          enabled: true,
        },
      },
    });

    fireEvent.click(
      await screen.findByRole("button", {
        name: /email code/i,
      }),
    );
    const emailInput = await screen.findByLabelText("Email address");
    fireEvent.change(emailInput, {
      target: {
        value: "dev@example.com",
      },
    });

    const codeInput = screen.getByPlaceholderText("Enter verification code");
    expect(codeInput).toHaveValue("666666");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send code",
      }),
    );

    expect(controller.service.sendVerifyCode).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sign in",
      }),
    );

    await waitFor(() => {
      expect(controller.service.signInWithEmailCode).toHaveBeenCalledWith({
        code: "666666",
        deviceType: "desktop",
        email: "dev@example.com",
      });
    });
  });

  it("uses the default development verification code for phone login without sending a real code", async () => {
    const { controller } = renderAuthPage("/auth/login", {
      runtimeConfig: {
        developmentPrefill: {
          enabled: true,
        },
        loginMethods: ["password", "emailCode", "phoneCode"],
      },
    });

    fireEvent.click(
      await screen.findByRole("button", {
        name: /phone code/i,
      }),
    );
    const phoneInput = await screen.findByLabelText("Phone number");
    fireEvent.change(phoneInput, {
      target: {
        value: "+8613800000000",
      },
    });

    expect(screen.getByPlaceholderText("Enter verification code")).toHaveValue("666666");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send code",
      }),
    );

    expect(controller.service.sendVerifyCode).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sign in",
      }),
    );

    await waitFor(() => {
      expect(controller.service.signInWithPhoneCode).toHaveBeenCalledWith({
        code: "666666",
        deviceType: "desktop",
        phone: "+8613800000000",
      });
    });
  });

  it("submits email registration without a verification code by default", async () => {
    const { controller } = renderAuthPage("/auth/register", {
      runtimeConfig: {
        developmentPrefill: {
          enabled: false,
        },
        loginMethods: ["password"],
        oauthLoginEnabled: false,
        qrLoginEnabled: false,
        registerMethods: ["email"],
      },
    });

    fireEvent.change(await screen.findByLabelText("Username"), {
      target: {
        value: "plain-user",
      },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: {
        value: "plain@example.com",
      },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: "Passw0rd!",
      },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: {
        value: "Passw0rd!",
      },
    });

    expect(screen.queryByPlaceholderText("Enter verification code")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sign up",
      }),
    );

    await waitFor(() => {
      expect(controller.service.register).toHaveBeenCalled();
    });
    const registerPayload = vi.mocked(controller.service.register).mock.calls[0]?.[0];
    expect(registerPayload).toMatchObject({
      channel: "EMAIL",
      confirmPassword: "Passw0rd!",
      email: "plain@example.com",
      password: "Passw0rd!",
      phone: undefined,
      username: "plain-user",
    });
    expect(registerPayload).not.toHaveProperty("verificationCode");
    expect(controller.service.sendVerifyCode).not.toHaveBeenCalled();
  });

  it("requires and sends an email registration verification code when enabled by policy", async () => {
    const { controller } = renderAuthPage("/auth/register", {
      runtimeConfig: {
        developmentPrefill: {
          enabled: false,
        },
        loginMethods: ["password"],
        oauthLoginEnabled: false,
        qrLoginEnabled: false,
        registerMethods: ["email"],
        verificationPolicy: {
          emailRegistrationVerificationRequired: true,
        },
      },
    });

    fireEvent.change(await screen.findByLabelText("Username"), {
      target: {
        value: "verified-user",
      },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: {
        value: "verified@example.com",
      },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: "Passw0rd!",
      },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: {
        value: "Passw0rd!",
      },
    });

    const codeInput = screen.getByPlaceholderText("Enter verification code");
    expect(codeInput).toHaveValue("");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sign up",
      }),
    );

    expect(await screen.findByText("Enter the verification code.")).toBeInTheDocument();
    expect(controller.service.register).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send code",
      }),
    );

    await waitFor(() => {
      expect(controller.service.sendVerifyCode).toHaveBeenCalledWith({
        scene: "REGISTER",
        target: "verified@example.com",
        verifyType: "EMAIL",
      });
    });

    fireEvent.change(codeInput, {
      target: {
        value: "123456",
      },
    });
    fireEvent.click(
      screen.getByRole("button", {
        name: "Sign up",
      }),
    );

    await waitFor(() => {
      expect(controller.service.register).toHaveBeenCalledWith({
        channel: "EMAIL",
        confirmPassword: "Passw0rd!",
        email: "verified@example.com",
        password: "Passw0rd!",
        phone: undefined,
        username: "verified-user",
        verificationCode: "123456",
      });
    });
  });

  it("sends phone registration verification codes only when phone verification is required", async () => {
    const { controller } = renderAuthPage("/auth/register", {
      runtimeConfig: {
        developmentPrefill: {
          enabled: false,
        },
        loginMethods: ["password"],
        oauthLoginEnabled: false,
        qrLoginEnabled: false,
        registerMethods: ["phone"],
        verificationPolicy: {
          phoneRegistrationVerificationRequired: true,
        },
      },
    });

    fireEvent.change(await screen.findByLabelText("Phone number"), {
      target: {
        value: "+8613800000000",
      },
    });
    expect(screen.getByPlaceholderText("Enter verification code")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send code",
      }),
    );

    await waitFor(() => {
      expect(controller.service.sendVerifyCode).toHaveBeenCalledWith({
        scene: "REGISTER",
        target: "+8613800000000",
        verifyType: "PHONE",
      });
    });
  });

  it("uses the default development verification code for registration without sending a real code", async () => {
    const { controller } = renderAuthPage("/auth/register", {
      runtimeConfig: {
        developmentPrefill: {
          enabled: true,
        },
        registerMethods: ["email"],
        verificationPolicy: {
          emailRegistrationVerificationRequired: true,
        },
      },
    });

    fireEvent.change(await screen.findByLabelText("Username"), {
      target: {
        value: "dev-user",
      },
    });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: {
        value: "dev@example.com",
      },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: {
        value: "Passw0rd!",
      },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: {
        value: "Passw0rd!",
      },
    });

    expect(screen.getByPlaceholderText("Enter verification code")).toHaveValue("666666");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send code",
      }),
    );

    expect(controller.service.sendVerifyCode).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sign up",
      }),
    );

    await waitFor(() => {
      expect(controller.service.register).toHaveBeenCalledWith({
        channel: "EMAIL",
        confirmPassword: "Passw0rd!",
        email: "dev@example.com",
        password: "Passw0rd!",
        phone: undefined,
        username: "dev-user",
        verificationCode: "666666",
      });
    });
  });

  it("uses the default development verification code for password reset without sending a real code", async () => {
    const { controller } = renderAuthPage("/auth/forgot-password", {
      runtimeConfig: {
        developmentPrefill: {
          enabled: true,
        },
        recoveryMethods: ["email"],
      },
    });

    fireEvent.change(await screen.findByLabelText("Email address"), {
      target: {
        value: "dev@example.com",
      },
    });
    fireEvent.change(screen.getByLabelText("New password"), {
      target: {
        value: "Passw0rd!",
      },
    });
    fireEvent.change(screen.getByLabelText("Confirm password"), {
      target: {
        value: "Passw0rd!",
      },
    });

    expect(screen.getByPlaceholderText("Enter verification code")).toHaveValue("666666");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send reset code",
      }),
    );

    expect(controller.service.requestPasswordReset).not.toHaveBeenCalled();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Reset password",
      }),
    );

    await waitFor(() => {
      expect(controller.service.resetPassword).toHaveBeenCalledWith({
        account: "dev@example.com",
        code: "666666",
        confirmPassword: "Passw0rd!",
        newPassword: "Passw0rd!",
      });
    });
  });

  it("sends real verification code requests when development verification code is disabled", async () => {
    const { controller } = renderAuthPage("/auth/login", {
      runtimeConfig: {
        developmentPrefill: {
          enabled: false,
        },
      },
    });

    fireEvent.click(
      await screen.findByRole("button", {
        name: /email code/i,
      }),
    );
    fireEvent.change(await screen.findByLabelText("Email address"), {
      target: {
        value: "prod@example.com",
      },
    });

    expect(screen.getByPlaceholderText("Enter verification code")).toHaveValue("");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send code",
      }),
    );

    await waitFor(() => {
      expect(controller.service.sendVerifyCode).toHaveBeenCalledWith({
        scene: "LOGIN",
        target: "prod@example.com",
        verifyType: "EMAIL",
      });
    });
  });

  it("lets register flows return to the login screen", async () => {
    renderAuthPage("/auth/register?redirect=%2Fworkspace");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Sign in",
      }),
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /welcome back/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("auth-location")).toHaveTextContent(
      "/auth/login?redirect=%2Fworkspace",
    );
  });

  it("lets forgot-password flows return to the login screen", async () => {
    renderAuthPage("/auth/forgot-password?redirect=%2Fworkspace");

    fireEvent.click(
      screen.getByRole("button", {
        name: /back to login/i,
      }),
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /welcome back/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("auth-location")).toHaveTextContent(
      "/auth/login?redirect=%2Fworkspace",
    );
  });

  it("loads and renders a QR login surface when QR auth is enabled", async () => {
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode: vi.fn().mockResolvedValue({
          description: "Scan with another signed-in SDKWork User Center session to confirm login quickly",
          qrContent: "sdkwork://auth/qr-login",
          sessionKey: "qr-key-1",
          title: "Scan To Sign In",
          type: "sdkwork_app",
        }),
        checkLoginQrCodeStatus: vi.fn().mockResolvedValue({
          status: "pending",
        }),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login"]}>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={{
                    loginMethods: ["password"],
                    oauthProviders: [],
                    qrLoginEnabled: true,
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByText("Scan to login")).toBeInTheDocument();
    expect(screen.queryByText("Scan To Sign In")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Scan with another signed-in SDKWork User Center session to confirm login quickly"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Scan the QR code to continue")).not.toBeInTheDocument();
    expect(screen.queryByText("Open the linked app to scan and approve sign-in.")).not.toBeInTheDocument();
    expect(screen.queryByText(/backend-issued/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/approval flows/i)).not.toBeInTheDocument();
    expect(await screen.findByAltText(/login qr code/i)).toHaveAttribute(
      "src",
      "data:image/png;base64,qr-login",
    );
    expect(controller.service.generateLoginQrCode).toHaveBeenCalledTimes(1);
    expect(controller.service.generateLoginQrCode).toHaveBeenCalledWith({
      purpose: "login",
    });
    expect(toDataUrlMock).toHaveBeenCalledWith(
      "sdkwork://auth/qr-login",
      expect.objectContaining({
        width: 320,
      }),
    );
  });

  it("uses backend QR image URLs directly instead of generating a local QR image", async () => {
    toDataUrlMock.mockClear();
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode: vi.fn().mockResolvedValue({
          qrContent: "sdkwork://auth/backend-image-fallback",
          sessionKey: "qr-backend-image-1",
          qrUrl: " https://cdn.sdkwork.ai/auth/qr-backend-image.png ",
        }),
        checkLoginQrCodeStatus: vi.fn().mockResolvedValue({
          status: "pending",
        }),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login"]}>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={{
                    loginMethods: ["password"],
                    oauthProviders: [],
                    qrLoginEnabled: true,
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByAltText(/login qr code/i)).toHaveAttribute(
      "src",
      "https://cdn.sdkwork.ai/auth/qr-backend-image.png",
    );
    expect(toDataUrlMock).not.toHaveBeenCalled();
  });

  it("defaults to the QR login rail when no app override disables it", async () => {
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode: vi.fn().mockResolvedValue({
          description: "Use your mobile app to continue",
          qrContent: "sdkwork://auth/default-qr-login",
          sessionKey: "qr-default-1",
          title: "Desktop QR Login",
          type: "app",
        }),
        checkLoginQrCodeStatus: vi.fn().mockResolvedValue({
          status: "pending",
        }),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login"]}>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={{
                    loginMethods: ["password"],
                    oauthProviders: [],
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByText("Scan to login")).toBeInTheDocument();
    expect(screen.queryByText("Desktop QR Login")).not.toBeInTheDocument();
    expect(await screen.findByAltText(/login qr code/i)).toHaveAttribute(
      "src",
      "data:image/png;base64,qr-login",
    );
    expect(controller.service.generateLoginQrCode).toHaveBeenCalledTimes(1);
    expect(toDataUrlMock).toHaveBeenCalledWith(
      "sdkwork://auth/default-qr-login",
      expect.objectContaining({
        width: 320,
      }),
    );
  });

  it("keeps the register QR rail and uses the non-QR product shell for forgot-password defaults", async () => {
    const generateLoginQrCode = vi.fn().mockResolvedValue({
      description: "Use your mobile app to continue",
      qrContent: "sdkwork://auth/default-secondary-qr-login",
      sessionKey: "qr-default-secondary-1",
      title: "Desktop QR Login",
      type: "app",
    });
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode,
        checkLoginQrCodeStatus: vi.fn().mockResolvedValue({
          status: "pending",
        }),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    const { container, unmount } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/register"]}>
          <Routes>
            <Route
              path="/auth/register"
              element={
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={{
                    loginMethods: ["password"],
                    oauthProviders: [],
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByAltText(/login qr code/i)).toHaveAttribute(
      "src",
      "data:image/png;base64,qr-login",
    );
    expect(container.innerHTML).toContain("max-w-6xl");
    expect(container.innerHTML).toContain("rounded-[32px]");
    expect(container.innerHTML).toContain("bg-white/92");
    expect(container.innerHTML).toContain("md:min-h-[720px]");
    expect(container.innerHTML).toContain("--sdkwork-auth-field-text-color");
    expect(container.innerHTML).toContain("bg-primary-500/10");
    expect(container.innerHTML).not.toContain("max-w-[1040px]");
    expect(container.innerHTML).not.toContain("rgba(55, 55, 55, 0.78)");
    expect(generateLoginQrCode).toHaveBeenCalledWith({
      purpose: "register",
    });

    unmount();

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/forgot-password"]}>
          <Routes>
            <Route
              path="/auth/forgot-password"
              element={
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={{
                    loginMethods: ["password"],
                    oauthProviders: [],
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /reset password/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByAltText(/login qr code/i)).not.toBeInTheDocument();
    expect(generateLoginQrCode).toHaveBeenCalledTimes(1);
  });

  it("renders the QR rail instead of legacy highlight panels for default login and register pages", async () => {
    const generateLoginQrCode = vi.fn().mockResolvedValue({
      description: "Use your mobile app to continue",
      qrContent: "sdkwork://auth/default-shared-qr-login",
      sessionKey: "qr-default-shared-1",
      title: "Desktop QR Login",
      type: "app",
    });
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode,
        checkLoginQrCodeStatus: vi.fn().mockResolvedValue({
          status: "pending",
        }),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    for (const initialEntry of [
      "/auth/login",
      "/auth/register",
    ]) {
      const { unmount } = render(
        <SdkworkThemeProvider defaultTheme="light">
          <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
              <Route
                path="/auth/*"
                element={
                  <SdkworkAuthPage
                    appearance={{
                      slots: {
                        AsideContainer: CapturedAsideContainer,
                      },
                    }}
                    controller={controller}
                    runtimeConfig={{
                      loginMethods: ["password"],
                      oauthProviders: [],
                    }}
                  />
                }
              />
            </Routes>
          </MemoryRouter>
        </SdkworkThemeProvider>,
      );

      expect(await screen.findByAltText(/login qr code/i)).toHaveAttribute(
        "src",
        "data:image/png;base64,qr-login",
      );
      expect(screen.getByTestId("auth-left-rail")).toHaveAttribute(
        "data-presentation",
        "raw",
      );

      unmount();
    }

    expect(generateLoginQrCode).toHaveBeenCalledTimes(2);
    expect(generateLoginQrCode).toHaveBeenNthCalledWith(1, {
      purpose: "login",
    });
    expect(generateLoginQrCode).toHaveBeenNthCalledWith(2, {
      purpose: "register",
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/forgot-password"]}>
          <Routes>
            <Route
              path="/auth/*"
              element={
                <SdkworkAuthPage
                  appearance={{
                    slots: {
                      AsideContainer: CapturedAsideContainer,
                    },
                  }}
                  controller={controller}
                  runtimeConfig={{
                    loginMethods: ["password"],
                    oauthProviders: [],
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /reset password/i,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByAltText(/login qr code/i)).not.toBeInTheDocument();
    expect(screen.getByTestId("auth-left-rail")).toHaveAttribute(
      "data-presentation",
      "panel",
    );
    expect(generateLoginQrCode).toHaveBeenCalledTimes(2);
  });

  it("keeps explicit non-QR app overrides available for incompatible contracts", () => {
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode: vi.fn(),
        checkLoginQrCodeStatus: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login"]}>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <SdkworkAuthPage
                  controller={controller}
                  runtimeConfig={{
                    leftRailMode: "highlights-only",
                    loginMethods: ["password"],
                    oauthProviders: [],
                    qrLoginEnabled: false,
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(screen.queryByText("Desktop QR Login")).not.toBeInTheDocument();
    expect(controller.service.generateLoginQrCode).not.toHaveBeenCalled();
  });

  it("lets host apps override auth theme tokens without replacing the shared UI", () => {
    const controller = createSdkworkAuthController({
      service: {
        generateLoginQrCode: vi.fn(),
        checkLoginQrCodeStatus: vi.fn(),
        getCurrentSession: vi.fn().mockResolvedValue(null),
        getCurrentUser: vi.fn().mockResolvedValue(null),
      },
    });

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login"]}>
          <Routes>
            <Route
              path="/auth/login"
              element={
                <SdkworkAuthPage
                  appearance={{
                    theme: {
                      contentTextColor: "#123456",
                      fieldTextColor: "#abcdef",
                      shellBackgroundColor: "rgb(1, 2, 3)",
                    },
                  }}
                  controller={controller}
                  runtimeConfig={{
                    leftRailMode: "highlights-only",
                    loginMethods: ["password"],
                    oauthProviders: [],
                    qrLoginEnabled: false,
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(container.innerHTML).toContain("--sdkwork-auth-content-text-color: #123456");
    expect(container.innerHTML).toContain("--sdkwork-auth-field-text-color: #abcdef");
    expect(container.innerHTML).toContain("rgb(1, 2, 3)");
  });

  it("provides a single IAM auth routes entry for minimal host integration", async () => {
    const getRuntime = vi.fn().mockResolvedValue({
      contextStore: {
        clear: vi.fn(),
      },
      service: {
        auth: {
          oauthAuthorizationUrls: {
            retrieve: vi.fn(),
          },
          oauthSessions: {
            create: vi.fn(),
          },
          passwordResetRequests: {
            create: vi.fn(),
          },
          passwordResets: {
            create: vi.fn(),
          },
          registrations: {
            create: vi.fn(),
          },
          sessions: {
            create: vi.fn(),
            current: {
              delete: vi.fn(),
              retrieve: vi.fn().mockRejectedValue(new Error("anonymous")),
            },
          },
          verificationCodes: {
            create: vi.fn(),
            verify: vi.fn(),
          },
        },
        openPlatform: {
          qrAuth: {
            sessions: {
              create: vi.fn().mockResolvedValue({
                qrContent: {
                  content: "sdkwork://auth/iam-routes-qr",
                  mode: "fallback_url",
                },
                sessionKey: "iam-routes-qr-1",
                status: "pending",
                title: "Desktop QR Login",
              }),
              retrieve: vi.fn().mockResolvedValue({
                sessionKey: "iam-routes-qr-1",
                status: "pending",
              }),
            },
          },
        },
        iam: {
          users: {
            current: {
              retrieve: vi.fn().mockRejectedValue(new Error("anonymous")),
            },
          },
        },
      },
      tokenStore: {
        get: vi.fn().mockResolvedValue(null),
      },
    });

    const { container } = render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login"]}>
          <Routes>
            <Route
              path="/auth/*"
              element={
                <SdkworkIamAuthRoutes
                  getRuntime={getRuntime}
                  homePath="/console"
                  runtimeConfig={{
                    loginMethods: ["password"],
                    oauthLoginEnabled: false,
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(await screen.findByText("Scan to login")).toBeInTheDocument();
    expect(screen.queryByText("Desktop QR Login")).not.toBeInTheDocument();
    expect(container.innerHTML).toContain("max-w-6xl");
    expect(container.innerHTML).toContain("rounded-[32px]");
    expect(container.innerHTML).toContain("bg-white/92");
    expect(container.innerHTML).toContain("sdkwork-iam-auth-routes");
    expect(container.innerHTML).toContain("fixed");
    expect(container.innerHTML).toContain("inset-0");
    expect(container.innerHTML).toContain("min-w-0");
    expect(container.innerHTML).toContain("shrink-0");
    expect(container.innerHTML).not.toContain("max-w-[1040px]");
    expect(container.innerHTML).not.toContain("lg:my-8");
    expect(getRuntime).toHaveBeenCalled();
  });

  it("renders IAM auth routes with Chinese auth copy and validation when host locale is Chinese", async () => {
    const getRuntime = vi.fn().mockResolvedValue({
      contextStore: {
        clear: vi.fn(),
      },
      service: {
        auth: {
          oauthAuthorizationUrls: {
            retrieve: vi.fn(),
          },
          oauthSessions: {
            create: vi.fn(),
          },
          passwordResetRequests: {
            create: vi.fn(),
          },
          passwordResets: {
            create: vi.fn(),
          },
          registrations: {
            create: vi.fn(),
          },
          sessions: {
            create: vi.fn(),
            current: {
              delete: vi.fn(),
              retrieve: vi.fn().mockRejectedValue(new Error("anonymous")),
            },
          },
          verificationCodes: {
            create: vi.fn(),
            verify: vi.fn(),
          },
        },
        openPlatform: {
          qrAuth: {
            sessions: {
              create: vi.fn().mockResolvedValue({
                qrContent: {
                  content: "sdkwork://auth/iam-routes-zh-qr",
                  mode: "fallback_url",
                },
                sessionKey: "iam-routes-zh-qr-1",
                status: "pending",
                title: "扫码登录",
              }),
              retrieve: vi.fn().mockResolvedValue({
                sessionKey: "iam-routes-zh-qr-1",
                status: "pending",
              }),
            },
          },
        },
        iam: {
          users: {
            current: {
              retrieve: vi.fn().mockRejectedValue(new Error("anonymous")),
            },
          },
        },
      },
      tokenStore: {
        get: vi.fn().mockResolvedValue(null),
      },
    });

    render(
      <SdkworkThemeProvider defaultTheme="light">
        <MemoryRouter initialEntries={["/auth/login"]}>
          <Routes>
            <Route
              path="/auth/*"
              element={
                <SdkworkIamAuthRoutes
                  getRuntime={getRuntime}
                  homePath="/console"
                  locale="zh"
                  runtimeConfig={{
                    loginMethods: ["password"],
                    oauthLoginEnabled: false,
                  }}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </SdkworkThemeProvider>,
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "\u6b22\u8fce\u56de\u6765",
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("\u8d26\u53f7")).toHaveAttribute(
      "placeholder",
      "\u7528\u6237\u540d\u3001\u624b\u673a\u53f7\u6216\u90ae\u7bb1",
    );
    expect(screen.getByAltText("\u767b\u5f55\u4e8c\u7ef4\u7801")).toBeInTheDocument();
    expect(screen.getByText("扫描二维码，快速登录")).toBeInTheDocument();
    expect(screen.queryByText("\u626b\u7801\u767b\u5f55")).not.toBeInTheDocument();
    expect(screen.queryByText(/后端签发/)).not.toBeInTheDocument();
    expect(screen.queryByText(/确认流程/)).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "\u767b\u5f55",
      }),
    );

    expect(
      await screen.findByText("\u8bf7\u8f93\u5165\u8d26\u53f7\u3002"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("\u8bf7\u8f93\u5165\u5bc6\u7801\u3002"),
    ).toBeInTheDocument();
  });
});
