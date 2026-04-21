// ── API response shapes ──────────────────────────────────────────────────────

export interface WebAuthnStatusResponse {
  loginId?: string;
  message?: string;
  registered: boolean;
  hasCredential?: boolean;
}

export interface RegisterOptionsResponse {
  challenge: string;
  rp: { name: string; id: string };
  user: { id: string; name: string; displayName: string };
  pubKeyCredParams: Array<{ alg: number; type: 'public-key' }>;
  timeout: number;
  attestation: string;
  excludeCredentials: Array<{ id: string; type: 'public-key'; transports?: AuthenticatorTransport[] }>;
  authenticatorSelection: {
    authenticatorAttachment?: AuthenticatorAttachment;
    residentKey?: ResidentKeyRequirement;
    userVerification?: UserVerificationRequirement;
    requireResidentKey?: boolean;
  };
  extensions: Record<string, unknown>;
}

export interface LoginOptionsResponse {
  rpId: string;
  challenge: string;
  allowCredentials: Array<{
    id: string;
    type: 'public-key';
    transports: AuthenticatorTransport[];
  }>;
  timeout: number;
  userVerification: UserVerificationRequirement;
}

export interface VerifyResponse {
  verified: boolean;
}

// ── Page / form state ────────────────────────────────────────────────────────

export interface UserCredentials {
  corpId: string;
  loginId: string;
}

export type PreLoginStep =
  | 'IDLE'
  | 'CHECKING_STATUS'
  | 'DEVICE_NOT_REGISTERED'
  | 'REGISTER_OTP_ENTRY'
  | 'REGISTERING'
  | 'SUCCESS_REGISTERED'
  | 'OTP_ENTRY'
  | 'SUCCESS_OTP'
  | 'AUTHENTICATING'
  | 'SUCCESS_LOGIN'
  | 'ERROR';
