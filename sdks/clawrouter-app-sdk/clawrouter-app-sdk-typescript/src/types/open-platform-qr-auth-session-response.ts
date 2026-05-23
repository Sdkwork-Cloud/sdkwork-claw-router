import type { IamSessionResponse } from './iam-session-response';
import type { IamUserResponse } from './iam-user-response';

/** Open platform qr auth session response schema exposed by Claw Router. */
export interface OpenPlatformQrAuthSessionResponse {
  /** Completed at field on open platform qr auth session response. */
  completedAt?: string | null;
  /** Created at field on open platform qr auth session response. */
  createdAt: string;
  /** Default account id field on open platform qr auth session response. */
  defaultAccountId?: string | null;
  /** Default account type field on open platform qr auth session response. */
  defaultAccountType?: 'official_account' | 'mini_app' | null;
  /** Default entry id field on open platform qr auth session response. */
  defaultEntryId?: string | null;
  /** Default provider field on open platform qr auth session response. */
  defaultProvider?: 'wechat' | 'alipay' | 'douyin' | 'baidu' | 'kuaishou' | 'feishu' | null;
  /** Expires at field on open platform qr auth session response. */
  expiresAt: string;
  /** Fallback url field on open platform qr auth session response. */
  fallbackUrl: string;
  /** Id field on open platform qr auth session response. */
  id: string;
  /** Purpose field on open platform qr auth session response. */
  purpose: 'login' | 'register';
  /** Qr content field on open platform qr auth session response. */
  qrContent: Record<string, unknown>;
  /** Scanned at field on open platform qr auth session response. */
  scannedAt?: string | null;
  /** Session field on open platform qr auth session response. */
  session?: IamSessionResponse;
  /** Session key field on open platform qr auth session response. */
  sessionKey: string;
  /** Status field on open platform qr auth session response. */
  status: 'pending' | 'scanned' | 'completed' | 'expired' | 'cancelled';
  /** Token field on open platform qr auth session response. */
  token?: IamSessionResponse;
  /** Updated at field on open platform qr auth session response. */
  updatedAt: string;
  /** User info field on open platform qr auth session response. */
  userInfo?: IamUserResponse;
}
