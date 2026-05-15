import type { IamSessionResponse } from './iam-session-response';
import type { IamUserResponse } from './iam-user-response';

/** Iam login qr code status response schema exposed by Claw Router. */
export interface IamLoginQrCodeStatusResponse {
  /** Session field on iam login qr code status response. */
  session?: IamSessionResponse;
  /** Status field on iam login qr code status response. */
  status: 'pending' | 'scanned' | 'confirmed' | 'expired';
  /** Token field on iam login qr code status response. */
  token?: IamSessionResponse;
  /** User info field on iam login qr code status response. */
  userInfo?: IamUserResponse;
}
