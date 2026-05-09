import tailwindcss from '@tailwindcss/vite';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'path';
import ts from 'typescript';
import {defineConfig, loadEnv, type Plugin, type ProxyOptions} from 'vite';

const TYPESCRIPT_SOURCE_PATTERN = /\.(?:ts|tsx|mts|cts)$/;
const SOURCE_MAP_PATTERN = /\n?\/\/# sourceMappingURL=.*$/;
const ENABLE_TYPESCRIPT_TRANSFORM_SOURCE_MAPS = false;
const importMetaHotPattern = /\bimport\.meta\.hot\b/g;
const nodeEnvPattern = /\b(?:globalThis\.|global\.)?process\.env\.NODE_ENV\b/g;
const processEnvPattern = /\b(?:globalThis\.|global\.)?process\.env\b/g;
const LOCAL_ROUTE_PACKAGE_PATTERN = /(?:^|\/)node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?sdkwork-claw-router-(?<packageName>[^/]+)\//;
const HTML_MODULE_SCRIPT_PATTERN = /<script\b(?=[^>]*\btype=["']module["'])(?=[^>]*\bsrc=["'][^"']+["'])[^>]*><\/script>/i;
const RUNTIME_ENV_SCRIPT_PATH = '/runtime-env.js';
const DEFAULT_PORTAL_DEV_PORT = 3901;
const require = createRequire(import.meta.url);
const portalPackageModuleCache = new Map<string, string | null>();

const PORTAL_RUNTIME_URL_ENV = [
  ['PORTAL_PUBLIC_API_BASE_URL', 'VITE_API_BASE_URL'],
  ['PORTAL_PUBLIC_APP_API_BASE_URL', 'VITE_CLAWROUTER_APP_API_BASE_URL'],
  ['PORTAL_PUBLIC_BACKEND_API_BASE_URL', 'VITE_CLAWROUTER_BACKEND_API_BASE_URL'],
] as const;

const PORTAL_RUNTIME_BOOLEAN_ENV = [
  ['PORTAL_PUBLIC_TOOL_API_ENABLED', 'VITE_TOOL_API_ENABLED'],
] as const;

function clawrouterNodeEnvTransform() {
  return {
    name: 'clawrouter-node-env-transform',
    enforce: 'pre' as const,
    apply: 'build' as const,
    transform(code: string) {
      nodeEnvPattern.lastIndex = 0;
      processEnvPattern.lastIndex = 0;
      if (!nodeEnvPattern.test(code) && !processEnvPattern.test(code)) {
        return null;
      }

      return {
        code: code
          .replace(nodeEnvPattern, JSON.stringify(process.env.NODE_ENV ?? 'production'))
          .replace(processEnvPattern, '{}'),
        map: null,
      };
    },
  };
}

function clawrouterImportMetaHotTransform() {
  return {
    name: 'clawrouter-import-meta-hot-transform',
    enforce: 'pre' as const,
    apply: 'build' as const,
    transform(code: string) {
      if (!importMetaHotPattern.test(code)) {
        return null;
      }

      return {
        code: code.replace(importMetaHotPattern, 'undefined'),
        map: null,
      };
    },
  };
}

function clawrouterRuntimeEnvPlugin(): Plugin {
  return {
    name: 'clawrouter-runtime-env',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?', 1)[0] !== RUNTIME_ENV_SCRIPT_PATH) {
          next();
          return;
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.end(buildPortalRuntimeEnvScript());
      });
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return injectPortalRuntimeEnvScript(html);
      },
    },
  };
}

function clawrouterTypeScriptTransform() {
  return {
    name: 'clawrouter-typescript-transform',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      const [filePath] = id.split('?');
      if (!TYPESCRIPT_SOURCE_PATTERN.test(filePath) || filePath.endsWith('.d.ts')) {
        return null;
      }

      const result = ts.transpileModule(code, {
        fileName: filePath,
        reportDiagnostics: true,
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
          jsxImportSource: 'react',
          experimentalDecorators: true,
          useDefineForClassFields: false,
          sourceMap: ENABLE_TYPESCRIPT_TRANSFORM_SOURCE_MAPS,
          inlineSources: ENABLE_TYPESCRIPT_TRANSFORM_SOURCE_MAPS,
        },
      });
      const error = result.diagnostics?.find(
        diagnostic => diagnostic.category === ts.DiagnosticCategory.Error,
      );
      if (error) {
        const message = ts.flattenDiagnosticMessageText(error.messageText, '\n');
        this.error(`TypeScript transform failed for ${filePath}: ${message}`);
      }

      return {
        code: result.outputText.replace(SOURCE_MAP_PATTERN, ''),
        map: ENABLE_TYPESCRIPT_TRANSFORM_SOURCE_MAPS && result.sourceMapText ? JSON.parse(result.sourceMapText) : null,
      };
    },
  };
}

function resolvePortalDependency(specifier: string, configDir: string): string {
  return require.resolve(specifier, {paths: [configDir]});
}

function resolvePortalTransitiveDependency(specifier: string, parentPackage: string, configDir: string): string {
  const parentPackageJson = require.resolve(`${parentPackage}/package.json`, {paths: [configDir]});
  return require.resolve(specifier, {paths: [path.dirname(parentPackageJson)]});
}

function resolvePackageRootFromEntry(entryPath: string): string {
  let currentDir = path.dirname(entryPath);
  const rootDir = path.parse(currentDir).root;
  while (currentDir !== rootDir) {
    if (fs.existsSync(path.join(currentDir, 'package.json'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  throw new Error(`Unable to locate package root for ${entryPath}`);
}

function resolvePortalNestedDependency(specifier: string, parentEntryPath: string): string {
  return require.resolve(specifier, {paths: [resolvePackageRootFromEntry(parentEntryPath)]});
}

function clawrouterPortalWorkspaceDependencyResolver(
  configDir: string,
  workspaceDependencyRoots: string[],
): Plugin {
  return {
    name: 'clawrouter-portal-workspace-dependency-resolver',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!shouldResolvePortalWorkspaceDependency(source, importer, workspaceDependencyRoots)) {
        return null;
      }

      return resolvePortalPackageModule(source, configDir);
    },
  };
}

function shouldResolvePortalWorkspaceDependency(
  source: string,
  importer: string | undefined,
  workspaceDependencyRoots: string[],
): boolean {
  if (
    source.startsWith('.')
    || source.startsWith('/')
    || source.startsWith('\0')
    || source.includes('?')
  ) {
    return false;
  }

  if (isPortalOwnedBareDependency(source)) {
    return false;
  }

  const normalizedImporter = normalizePath(importer?.split('?', 1)[0] ?? '');
  if (
    normalizedImporter
    && workspaceDependencyRoots.some((root) => normalizedImporter.startsWith(`${normalizePath(root)}/`))
  ) {
    return true;
  }

  return false;
}

function isPortalOwnedBareDependency(source: string): boolean {
  return (
    source === 'qrcode'
    || source === 'react-hook-form'
    || source === 'react'
    || source.startsWith('react/')
    || source === 'react-dom'
    || source.startsWith('react-dom/')
    || source === 'react-router'
    || source.startsWith('react-router/')
    || source === 'react-router-dom'
    || source.startsWith('@sdkwork/')
    || source.startsWith('sdkwork-claw-router-')
  );
}

function normalizePath(value: string): string {
  return value.replaceAll('\\', '/').replace(/\/+$/, '');
}

function resolvePortalPackageModule(specifier: string, configDir: string): string | null {
  const cached = portalPackageModuleCache.get(specifier);
  if (cached !== undefined) {
    return cached;
  }

  const parsedSpecifier = parsePackageSpecifier(specifier);
  const packageJsonPath = resolvePortalPackageJson(parsedSpecifier.packageName, configDir);
  if (!packageJsonPath) {
    portalPackageModuleCache.set(specifier, null);
    return null;
  }

  const packageRoot = path.dirname(packageJsonPath);
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as {
    exports?: unknown;
    module?: string;
    main?: string;
  };
  const entry = parsedSpecifier.subpath
    ? readPackageImportEntry(packageJson.exports, `./${parsedSpecifier.subpath}`)
      ?? parsedSpecifier.subpath
    : readPackageImportEntry(packageJson.exports) ?? packageJson.module ?? packageJson.main ?? 'index.js';
  const resolved = path.resolve(packageRoot, entry);
  portalPackageModuleCache.set(specifier, resolved);
  return resolved;
}

function parsePackageSpecifier(specifier: string): { packageName: string; subpath: string } {
  const segments = specifier.split('/');
  if (specifier.startsWith('@')) {
    return {
      packageName: segments.slice(0, 2).join('/'),
      subpath: segments.slice(2).join('/'),
    };
  }
  return {
    packageName: segments[0],
    subpath: segments.slice(1).join('/'),
  };
}

function resolvePortalPackageJson(packageName: string, configDir: string): string | null {
  const directPath = path.join(configDir, 'node_modules', ...packageName.split('/'), 'package.json');
  if (fs.existsSync(directPath)) {
    return directPath;
  }

  const pnpmRoot = path.join(configDir, 'node_modules', '.pnpm');
  if (!fs.existsSync(pnpmRoot)) {
    return null;
  }

  const encodedPrefix = packageName.replace('/', '+');
  const candidates = fs.readdirSync(pnpmRoot)
    .filter((entry) => entry.startsWith(encodedPrefix.slice(0, Math.min(encodedPrefix.length, 24))))
    .sort();
  for (const candidate of candidates) {
    const packageJsonPath = path.join(pnpmRoot, candidate, 'node_modules', ...packageName.split('/'), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return packageJsonPath;
    }
  }
  for (const candidate of fs.readdirSync(pnpmRoot).sort()) {
    const packageJsonPath = path.join(pnpmRoot, candidate, 'node_modules', ...packageName.split('/'), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      return packageJsonPath;
    }
  }
  return null;
}

function readPackageImportEntry(exportsField: unknown, subpath = '.'): string | undefined {
  if (!exportsField || typeof exportsField !== 'object') {
    return undefined;
  }

  const rootExport = Object.prototype.hasOwnProperty.call(exportsField, subpath)
    ? (exportsField as Record<string, unknown>)[subpath]
    : exportsField;
  if (typeof rootExport === 'string') {
    return rootExport;
  }
  if (!rootExport || typeof rootExport !== 'object') {
    return undefined;
  }

  const importExport = (rootExport as Record<string, unknown>).import;
  if (typeof importExport === 'string') {
    return importExport;
  }
  if (importExport && typeof importExport === 'object') {
    const defaultExport = (importExport as Record<string, unknown>).default;
    if (typeof defaultExport === 'string') {
      return defaultExport;
    }
  }
  return undefined;
}

export default defineConfig(({mode}) => {
  const configDir = import.meta.dirname;
  const workspaceRoot = path.resolve(configDir, '../..');
  const appbaseRoot = path.resolve(configDir, '../../../sdkwork-appbase');
  const sdkworkUiRoot = path.resolve(configDir, '../../../sdkwork-ui');
  const htmlParseStringifyEntry = resolvePortalTransitiveDependency('html-parse-stringify', 'react-i18next', configDir);
  const reactRouterCookieEntry = resolvePortalTransitiveDependency('cookie', 'react-router', configDir);
  const reactRouterSetCookieParserEntry = resolvePortalTransitiveDependency('set-cookie-parser', 'react-router', configDir);
  const rechartsClsxEntry = resolvePortalTransitiveDependency('clsx', 'recharts', configDir);
  const rechartsDecimalEntry = resolvePortalTransitiveDependency('decimal.js-light', 'recharts', configDir);
  const rechartsEsToolkitRoot = resolvePackageRootFromEntry(resolvePortalTransitiveDependency('es-toolkit', 'recharts', configDir));
  const rechartsRoot = resolvePackageRootFromEntry(resolvePortalTransitiveDependency('recharts/package.json', 'recharts', configDir));
  const rechartsVictoryVendorRoot = resolvePackageRootFromEntry(resolvePortalTransitiveDependency('victory-vendor/package.json', 'recharts', configDir));
  loadEnv(mode, configDir, '');
  return {
    plugins: [
      clawrouterRuntimeEnvPlugin(),
      clawrouterNodeEnvTransform(),
      clawrouterImportMetaHotTransform(),
      clawrouterTypeScriptTransform(),
      clawrouterPortalWorkspaceDependencyResolver(configDir, [appbaseRoot, sdkworkUiRoot]),
      tailwindcss(),
    ],
    esbuild: false,
    keepProcessEnv: false,
    environments: {
      client: {
        keepProcessEnv: false,
      },
    },
    resolve: {
      preserveSymlinks: true,
      dedupe: [
        'react',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        'react-dom',
        'react-dom/client',
        'react-router',
        'react-router/dom',
        'react-router-dom',
      ],
      alias: [
        { find: '@sdkwork/appbase-pc-react', replacement: path.resolve(appbaseRoot, 'packages/pc-react/foundation/sdkwork-appbase-pc-react/src/index.ts') },
        { find: '@sdkwork/auth-pc-react', replacement: path.resolve(appbaseRoot, 'packages/pc-react/identity/sdkwork-auth-pc-react/src/index.ts') },
        { find: '@sdkwork/auth-runtime-pc-react', replacement: path.resolve(appbaseRoot, 'packages/pc-react/identity/sdkwork-auth-runtime-pc-react/src/index.ts') },
        { find: '@sdkwork/clawrouter-app-sdk', replacement: path.resolve(configDir, '../../sdks/clawrouter-app-sdk/src/index.ts') },
        { find: '@sdkwork/clawrouter-backend-sdk', replacement: path.resolve(configDir, '../../sdks/clawrouter-backend-sdk/src/index.ts') },
        { find: '@sdkwork/core-pc-react', replacement: path.resolve(configDir, 'src/auth/corePcReactCompat.ts') },
        { find: '@sdkwork/host-pc-react', replacement: path.resolve(appbaseRoot, 'packages/pc-react/host/sdkwork-host-pc-react/src/index.ts') },
        { find: '@sdkwork/host-tauri-pc-react', replacement: path.resolve(appbaseRoot, 'packages/pc-react/host/sdkwork-host-tauri-pc-react/src/index.ts') },
        { find: '@sdkwork/ui-pc-react/theme', replacement: path.resolve(sdkworkUiRoot, 'sdkwork-ui-pc-react/src/theme/index.ts') },
        { find: '@sdkwork/ui-pc-react', replacement: path.resolve(sdkworkUiRoot, 'sdkwork-ui-pc-react/src/index.ts') },
        { find: 'clsx', replacement: rechartsClsxEntry },
        { find: 'cookie', replacement: reactRouterCookieEntry },
        { find: 'decimal.js-light', replacement: rechartsDecimalEntry },
        { find: /^es-toolkit\/(.+)$/, replacement: path.join(rechartsEsToolkitRoot, '$1.js') },
        { find: 'html-parse-stringify', replacement: htmlParseStringifyEntry },
        { find: 'qrcode', replacement: resolvePortalDependency('qrcode/lib/browser.js', configDir) },
        { find: 'react-hook-form', replacement: path.resolve(sdkworkUiRoot, 'sdkwork-ui-pc-react/node_modules/react-hook-form/dist/index.esm.mjs') },
        { find: 'react-router/dom', replacement: path.resolve(configDir, 'node_modules/react-router/dist/development/dom-export.mjs') },
        { find: 'react-router', replacement: path.resolve(configDir, 'node_modules/react-router/dist/development/index.mjs') },
        { find: 'react-router-dom', replacement: path.resolve(configDir, 'node_modules/react-router-dom/dist/index.mjs') },
        { find: /^recharts$/, replacement: path.join(rechartsRoot, 'es6', 'index.js') },
        { find: 'set-cookie-parser', replacement: reactRouterSetCookieParserEntry },
        { find: 'use-sync-external-store/shim/with-selector', replacement: path.resolve(configDir, 'src/auth/useSyncExternalStoreWithSelectorCompat.ts') },
        { find: 'use-sync-external-store/shim', replacement: path.resolve(configDir, 'src/auth/useSyncExternalStoreShimCompat.ts') },
        { find: /^victory-vendor\/(.+)$/, replacement: path.join(rechartsVictoryVendorRoot, 'es', '$1.js') },
        { find: 'void-elements', replacement: resolvePortalNestedDependency('void-elements', htmlParseStringifyEntry) },
        { find: '@', replacement: path.resolve(configDir, '.') },
      ],
    },
    server: {
      host: resolvePortalDevHost(process.env),
      port: resolvePortalDevPort(process.env),
      strictPort: true,
      fs: {
        allow: [
          configDir,
          workspaceRoot,
          appbaseRoot,
          sdkworkUiRoot,
        ],
      },
      proxy: resolvePortalDevProxy(process.env),
      // Disable HMR in automated product smoke runs when file watching is noisy.
      hmr: process.env.CLAWROUTER_HMR_DISABLED !== 'true',
    },
    build: {
      target: 'esnext',
      minify: false,
      commonjsOptions: {
        transformMixedEsModules: true,
        requireReturnsDefault: 'auto',
        defaultIsModuleExports: 'auto',
      },
      rollupOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes('use client')) {
            return;
          }
          defaultHandler(warning);
        },
        output: {
          manualChunks(id) {
            if (id.includes('commonjsHelpers')) {
              return 'vendor-react';
            }
            const normalizedId = id.replaceAll('\\', '/');
            const routePackageMatch = normalizedId.match(LOCAL_ROUTE_PACKAGE_PATTERN);
            if (routePackageMatch) {
              return routePackageMatch.groups?.packageName;
            }
            if (!id.includes('node_modules')) {
              return undefined;
            }
            if (
              id.includes('node_modules/react/')
              || id.includes('node_modules/react-dom/')
              || id.includes('node_modules/scheduler/')
              || id.includes('node_modules/react-is/')
              || id.includes('node_modules/use-sync-external-store/')
            ) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run/')) {
              return 'vendor-router';
            }
            if (id.includes('node_modules/lucide-react/')) {
              return 'vendor-icons';
            }
            return 'vendor';
          },
        },
      },
    },
    optimizeDeps: {
      exclude: [
        'sdkwork-claw-router-api-reference',
        'sdkwork-claw-router-sdk-reference',
      ],
      include: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        'react-dom/client',
        'react-i18next',
        'i18next',
        'html-parse-stringify',
        'void-elements',
        'recharts',
      ],
      needsInterop: [
        'react',
        'react-dom',
        'html-parse-stringify',
        'void-elements',
        'es-toolkit/compat/get',
      ],
      esbuildOptions: {
        target: 'esnext',
        jsx: 'automatic',
        jsxImportSource: 'react',
      },
    },
  };
});

function resolvePortalDevHost(env: NodeJS.ProcessEnv = process.env): string {
  const rawHost = env.HOST?.trim();
  if (rawHost === undefined || rawHost === '') {
    return '127.0.0.1';
  }
  if (
    rawHost.includes('/')
    || rawHost.includes('\\')
    || rawHost.includes('?')
    || rawHost.includes('#')
    || rawHost.includes('\r')
    || rawHost.includes('\n')
  ) {
    throw new Error(`HOST must be a hostname or IP address, received: ${rawHost}`);
  }
  return rawHost;
}

function resolvePortalDevPort(env: NodeJS.ProcessEnv = process.env): number {
  const rawPort = env.PORT?.trim();
  if (rawPort === undefined || rawPort === '') {
    return DEFAULT_PORTAL_DEV_PORT;
  }

  const port = Number.parseInt(rawPort, 10);
  if (!Number.isInteger(port) || String(port) !== rawPort || port < 1 || port > 65535) {
    throw new Error(`PORT must be an integer between 1 and 65535, received: ${rawPort}`);
  }
  return port;
}

function resolvePortalDevProxy(env: NodeJS.ProcessEnv = process.env): Record<string, string | ProxyOptions> {
  const gatewayTarget = resolvePortalDevProxyTarget(
    env.PORTAL_DEV_PROXY_GATEWAY_TARGET,
    'PORTAL_DEV_PROXY_GATEWAY_TARGET',
  );
  const backendApiTarget = resolvePortalDevProxyTarget(
    env.PORTAL_DEV_PROXY_BACKEND_API_TARGET,
    'PORTAL_DEV_PROXY_BACKEND_API_TARGET',
  );
  const appApiTarget = resolvePortalDevProxyTarget(
    env.PORTAL_DEV_PROXY_APP_API_TARGET,
    'PORTAL_DEV_PROXY_APP_API_TARGET',
  );

  return {
    '/openapi/schema-tabs.json': portalDevProxyOptions(gatewayTarget),
    '/openapi.json': portalDevProxyOptions(gatewayTarget),
    '/v1': portalDevProxyOptions(gatewayTarget),
    '/backend/v3/api': portalDevProxyOptions(backendApiTarget),
    '/app/v3/api': portalDevProxyOptions(appApiTarget),
  };
}

function portalDevProxyOptions(target: string): ProxyOptions {
  return {
    target,
    changeOrigin: true,
    secure: true,
    ws: false,
  };
}

function resolvePortalDevProxyTarget(value: string | undefined, name: string): string {
  const fallbackByName: Record<string, string> = {
    PORTAL_DEV_PROXY_GATEWAY_TARGET: 'http://127.0.0.1:18080',
    PORTAL_DEV_PROXY_BACKEND_API_TARGET: 'http://127.0.0.1:18081',
    PORTAL_DEV_PROXY_APP_API_TARGET: 'http://127.0.0.1:18082',
  };
  const target = value?.trim() || fallbackByName[name];
  if (!target) {
    throw new Error(`${name} is not configured`);
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    throw new Error(`${name} must be an HTTP/HTTPS origin`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`${name} must be an HTTP/HTTPS origin`);
  }
  if ((parsed.pathname && parsed.pathname !== '/') || parsed.search || parsed.hash) {
    throw new Error(`${name} must be an origin without path, query, or hash`);
  }
  return parsed.origin;
}

function resolvePortalRuntimeEnv(env: NodeJS.ProcessEnv = process.env): Record<string, string> {
  const runtimeEnv: Record<string, string> = {};

  for (const [sourceName, targetName] of PORTAL_RUNTIME_URL_ENV) {
    const value = resolvePortalPublicUrl(env[sourceName], sourceName);
    if (value !== undefined) {
      runtimeEnv[targetName] = value;
    }
  }

  for (const [sourceName, targetName] of PORTAL_RUNTIME_BOOLEAN_ENV) {
    const value = resolveBooleanEnv(env[sourceName], sourceName);
    if (value !== undefined) {
      runtimeEnv[targetName] = String(value);
    }
  }

  return runtimeEnv;
}

function buildPortalRuntimeEnvScript(runtimeEnv = resolvePortalRuntimeEnv()): string {
  const serializedEnv = JSON.stringify(runtimeEnv)
    .replace(/</g, '\\u003C')
    .replace(/>/g, '\\u003E')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  return `window.__CLAWROUTER_ENV__ = Object.freeze(${serializedEnv});\n`;
}

function injectPortalRuntimeEnvScript(html: string): string {
  const scriptTag = `<script type="module" src="${RUNTIME_ENV_SCRIPT_PATH}"></script>`;
  if (html.includes(scriptTag)) {
    return html;
  }
  if (!HTML_MODULE_SCRIPT_PATTERN.test(html)) {
    throw new Error('Portal index.html must contain a module script');
  }
  return html.replace(HTML_MODULE_SCRIPT_PATTERN, `${scriptTag}\n    $&`);
}

function resolvePortalPublicUrl(value: string | undefined, name: string): string | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }

  const trimmed = value.trim();
  if (
    trimmed.includes('\r')
    || trimmed.includes('\n')
    || trimmed.includes('\\')
    || trimmed.includes('"')
    || trimmed.includes("'")
  ) {
    throw new Error(`${name} must be an HTTP/HTTPS URL or root-relative path`);
  }

  if (trimmed.startsWith('/')) {
    if (trimmed.startsWith('//') || trimmed.includes('?') || trimmed.includes('#')) {
      throw new Error(`${name} must be an HTTP/HTTPS URL or root-relative path`);
    }
    return trimmed;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error(`${name} must be an HTTP/HTTPS URL or root-relative path`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`${name} must be an HTTP/HTTPS URL or root-relative path`);
  }
  if (parsed.search || parsed.hash) {
    throw new Error(`${name} must be an HTTP/HTTPS URL or root-relative path`);
  }
  return trimmed.replace(/\/+$/, '');
}

function resolveBooleanEnv(value: string | undefined, name: string): boolean | undefined {
  if (value === undefined || value.trim() === '') {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) {
    return true;
  }
  if (['0', 'false', 'no', 'off'].includes(normalized)) {
    return false;
  }
  throw new Error(`Invalid ${name} value`);
}
