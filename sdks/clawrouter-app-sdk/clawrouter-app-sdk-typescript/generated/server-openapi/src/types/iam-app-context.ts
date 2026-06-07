/** Iam app context schema exposed by Claw Router. */
export interface IamAppContext {
  /** App id field on iam app context. */
  appId: string;
  /** Auth level field on iam app context. */
  authLevel: 'anonymous' | 'password' | 'mfa' | 'system';
  /** Data scope field on iam app context. */
  dataScope: string[];
  /** Deployment mode field on iam app context. */
  deploymentMode: 'saas' | 'local' | 'private';
  /** Environment field on iam app context. */
  environment: 'dev' | 'test' | 'prod';
  /** Organization id field on iam app context. */
  organizationId?: string;
  /** Permission scope field on iam app context. */
  permissionScope: string[];
  /** Session id field on iam app context. */
  sessionId: string;
  /** Tenant id field on iam app context. */
  tenantId: string;
  /** User id field on iam app context. */
  userId: string;
}
