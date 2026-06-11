export const RELEASE_ENVIRONMENT_CONTRACT = Object.freeze({
  version: 2,
  exampleFile: '.env.release.example',
  localFile: '.env.release.local',
  requiredReleaseEnv: Object.freeze([
    'SDKWORK_CLAW_POSTGRES_TEST_DATABASE_URL',
  ]),
  requiredPortalPublicEnv: Object.freeze([
    'PORTAL_PUBLIC_API_BASE_URL',
    'PORTAL_PUBLIC_APP_API_BASE_URL',
    'PORTAL_PUBLIC_BACKEND_API_BASE_URL',
    'PORTAL_PUBLIC_TOOL_API_ENABLED',
  ]),
  optionalPortalPublicEnv: Object.freeze([
    'PORTAL_PUBLIC_SDK_BASE_URL',
    'PORTAL_PUBLIC_OPEN_API_BASE_URL',
    'PORTAL_PUBLIC_APPBASE_BACKEND_API_BASE_URL',
  ]),
});
