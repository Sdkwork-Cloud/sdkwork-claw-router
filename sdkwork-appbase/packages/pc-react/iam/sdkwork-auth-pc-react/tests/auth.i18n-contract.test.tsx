import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { SdkworkI18nProvider } from "@sdkwork/i18n-pc-react";
import { SdkworkThemeProvider } from "@sdkwork/ui-pc-react/theme";
import {
  SDKWORK_AUTH_I18N_CATALOG,
  SdkworkAuthPage,
  assertSdkworkAuthI18nCatalogParity,
  createSdkworkAuthController,
  type SdkworkAuthPageProps,
} from "../src";

function createTestController() {
  return createSdkworkAuthController({
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
}

describe("sdkwork-auth-pc-react i18n contract", () => {
  it("exports a complete IAM auth namespace catalog", () => {
    expect(SDKWORK_AUTH_I18N_CATALOG.namespace).toBe("iam.auth");
    expect(() => assertSdkworkAuthI18nCatalogParity()).not.toThrow();
    expect(SDKWORK_AUTH_I18N_CATALOG.resolveMessages("en-US").qr.defaultDescription).not.toMatch(
      /backend-issued|approval flows/i,
    );
    expect(SDKWORK_AUTH_I18N_CATALOG.resolveMessages("zh-CN").qr.defaultDescription).not.toMatch(
      /后端签发|确认流程/,
    );
    expect(SDKWORK_AUTH_I18N_CATALOG.resolveMessages("zh-CN").callback.failedTitle).toBe(
      "第三方登录失败",
    );
    expect(SDKWORK_AUTH_I18N_CATALOG.resolveMessages("zh-CN").oauth.providerHintTemplate).toBe(
      "",
    );
    expect(SDKWORK_AUTH_I18N_CATALOG.resolveMessages("zh-CN").service.startOAuthFailed).toBe(
      "第三方登录暂时无法启动。",
    );
  });

  it("renders auth copy from the global SDKWork i18n provider", async () => {
    render(
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
                    controller={createTestController()}
                    runtimeConfig={{
                      loginMethods: ["password", "emailCode"],
                      oauthProviders: ["github"],
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

  it("does not expose legacy locale or messages props on the auth page", () => {
    const validProps = {
      basePath: "/auth",
      runtimeConfig: {
        loginMethods: ["password"],
        qrLoginEnabled: false,
      },
    } satisfies SdkworkAuthPageProps;

    expect(validProps.basePath).toBe("/auth");

    const legacyProps = {
      locale: "zh-CN",
      messages: {
        login: {
          title: "旧标题",
        },
      },
    };

    expect("locale" in legacyProps).toBe(true);
    expect("messages" in legacyProps).toBe(true);
    type LegacyPropKeys = Extract<keyof SdkworkAuthPageProps, "locale" | "messages">;
    const noLegacyProps: LegacyPropKeys extends never ? true : false = true;
    expect(noLegacyProps).toBe(true);
  });
});
