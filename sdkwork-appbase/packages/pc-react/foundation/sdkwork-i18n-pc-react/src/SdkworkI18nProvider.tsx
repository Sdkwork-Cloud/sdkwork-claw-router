import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import i18next, {
  type i18n as I18nInstance,
  type Resource,
} from "i18next";
import {
  I18nextProvider,
} from "react-i18next";
import {
  cloneSdkworkMessageTree,
  normalizeSdkworkLocale,
  type SdkworkLocale,
  type SdkworkMessageCatalog,
  type SdkworkMessageTree,
} from "./catalog.ts";

export interface SdkworkI18nValue {
  catalogs: Record<string, SdkworkMessageCatalog>;
  i18n: I18nInstance;
  locale: SdkworkLocale;
  resolveMessages<TMessages extends SdkworkMessageTree>(
    catalog: SdkworkMessageCatalog<TMessages>,
  ): TMessages;
}

export interface SdkworkI18nProviderProps extends PropsWithChildren {
  catalogs?: readonly SdkworkMessageCatalog[];
  locale?: string | null;
}

const SdkworkI18nContext = createContext<SdkworkI18nValue | null>(null);

function createSdkworkI18nInstance(
  catalogs: readonly SdkworkMessageCatalog[],
  locale: SdkworkLocale,
): I18nInstance {
  const instance = i18next.createInstance();
  const resources = catalogs.reduce<Resource>(
    (accumulator, catalog) => {
      for (const currentLocale of Object.keys(catalog.locales) as SdkworkLocale[]) {
        accumulator[currentLocale] = {
          ...(accumulator[currentLocale] ?? {}),
          [catalog.namespace]: catalog.locales[currentLocale],
        };
      }

      return accumulator;
    },
    {},
  );

  void instance.init({
    defaultNS: catalogs[0]?.namespace,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
    lng: locale,
    resources,
  });

  return instance;
}

export function SdkworkI18nProvider({
  catalogs = [],
  children,
  locale,
}: SdkworkI18nProviderProps) {
  const resolvedLocale = normalizeSdkworkLocale(locale);
  const catalogsKey = catalogs.map((catalog) => catalog.namespace).join("\u001f");
  const value = useMemo<SdkworkI18nValue>(() => {
    const catalogsByNamespace = Object.fromEntries(
      catalogs.map((catalog) => [catalog.namespace, catalog]),
    );
    const i18n = createSdkworkI18nInstance(catalogs, resolvedLocale);

    return {
      catalogs: catalogsByNamespace,
      i18n,
      locale: resolvedLocale,
      resolveMessages<TMessages extends SdkworkMessageTree>(
        catalog: SdkworkMessageCatalog<TMessages>,
      ) {
        const registeredCatalog = catalogsByNamespace[catalog.namespace] as
          | SdkworkMessageCatalog<TMessages>
          | undefined;
        return cloneSdkworkMessageTree(
          (registeredCatalog ?? catalog).resolveMessages(resolvedLocale),
        );
      },
    };
  }, [catalogs, catalogsKey, resolvedLocale]);

  return (
    <SdkworkI18nContext.Provider value={value}>
      <I18nextProvider i18n={value.i18n}>{children}</I18nextProvider>
    </SdkworkI18nContext.Provider>
  );
}

export function useSdkworkI18n(): SdkworkI18nValue | null {
  return useContext(SdkworkI18nContext);
}

export function useSdkworkModuleMessages<TMessages extends SdkworkMessageTree>(
  catalog: SdkworkMessageCatalog<TMessages>,
): TMessages {
  const context = useSdkworkI18n();
  if (!context) {
    return catalog.resolveMessages(catalog.defaultLocale);
  }

  return context.resolveMessages(catalog);
}
