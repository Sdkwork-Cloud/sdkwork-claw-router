import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  SdkworkI18nProvider,
  assertSdkworkCatalogLocaleParity,
  createSdkworkMessageCatalog,
  normalizeSdkworkLocale,
  useSdkworkModuleMessages,
} from "../src";

interface DemoMessages {
  common: {
    cancel: string;
    submit: string;
  };
  validation: {
    required: string;
  };
}

const demoCatalog = createSdkworkMessageCatalog<DemoMessages>({
  defaultLocale: "en-US",
  locales: {
    "en-US": {
      common: {
        cancel: "Cancel",
        submit: "Submit",
      },
      validation: {
        required: "Required.",
      },
    },
    "zh-CN": {
      common: {
        cancel: "取消",
        submit: "提交",
      },
      validation: {
        required: "必填。",
      },
    },
  },
  namespace: "test.demo",
});

function DemoPanel() {
  const messages = useSdkworkModuleMessages(demoCatalog);
  return (
    <section>
      <button type="button">{messages.common.submit}</button>
      <p>{messages.validation.required}</p>
    </section>
  );
}

describe("sdkwork-i18n-pc-react", () => {
  it("normalizes locale input into SDKWork supported locale ids", () => {
    expect(normalizeSdkworkLocale("zh")).toBe("zh-CN");
    expect(normalizeSdkworkLocale("zh-Hans-CN")).toBe("zh-CN");
    expect(normalizeSdkworkLocale("en")).toBe("en-US");
    expect(normalizeSdkworkLocale("fr-FR")).toBe("en-US");
    expect(normalizeSdkworkLocale(undefined)).toBe("en-US");
  });

  it("creates a catalog that merges overrides without mutating the base locale", () => {
    const catalog = createSdkworkMessageCatalog<DemoMessages>({
      defaultLocale: "en-US",
      locales: demoCatalog.locales,
      namespace: "test.demo",
      overrides: {
        "zh-CN": {
          common: {
            submit: "确认提交",
          },
        },
      },
    });

    expect(catalog.resolveMessages("zh-CN").common.submit).toBe("确认提交");
    expect(demoCatalog.resolveMessages("zh-CN").common.submit).toBe("提交");
    expect(catalog.resolveMessages("zh-CN").common.cancel).toBe("取消");
  });

  it("asserts that every locale has the same message key tree", () => {
    expect(() => assertSdkworkCatalogLocaleParity(demoCatalog)).not.toThrow();

    const brokenCatalog = createSdkworkMessageCatalog({
      defaultLocale: "en-US",
      locales: {
        "en-US": {
          common: {
            submit: "Submit",
          },
        },
        "zh-CN": {
          common: {},
        },
      },
      namespace: "test.broken",
    });

    expect(() => assertSdkworkCatalogLocaleParity(brokenCatalog)).toThrow(
      "test.broken: locale zh-CN is missing message key common.submit",
    );
  });

  it("provides typed module messages through the global SDKWork i18n provider", () => {
    render(
      <SdkworkI18nProvider catalogs={[demoCatalog]} locale="zh-CN">
        <DemoPanel />
      </SdkworkI18nProvider>,
    );

    expect(screen.getByRole("button", { name: "提交" })).toBeInTheDocument();
    expect(screen.getByText("必填。")).toBeInTheDocument();
  });

  it("falls back to the catalog default locale when no provider is mounted", () => {
    render(<DemoPanel />);

    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
    expect(screen.getByText("Required.")).toBeInTheDocument();
  });
});
