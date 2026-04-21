import { API_BASE_URL } from '../config';
import type {
  WebAuthnStatusResponse,
  RegisterOptionsResponse,
  LoginOptionsResponse,
  VerifyResponse,
} from '../types';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/browser';

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function checkWebAuthnStatus(
  loginId: string
): Promise<WebAuthnStatusResponse> {
  const res = await fetch(`${API_BASE_URL}/user/${encodeURIComponent(loginId)}/webauthn-status`);
  const text = await res.text();
  let data: WebAuthnStatusResponse;
  try {
    data = JSON.parse(text) as WebAuthnStatusResponse;
  } catch {
    throw new Error(`Server error (HTTP ${res.status}). Is the backend running?`);
  }
  // Server returns 404 with { registered: false } for unknown users — treat as valid
  if (typeof data.registered === 'boolean') {
    return data;
  }
  throw new Error(`HTTP ${res.status}`);
}

export function getRegisterOptions(username: string): Promise<RegisterOptionsResponse> {
  return post<RegisterOptionsResponse>('/register/options', { username });
}

export function verifyRegistration(
  username: string,
  attResp: RegistrationResponseJSON
): Promise<VerifyResponse> {
  return post<VerifyResponse>('/register/verify', { username, attResp });
}

export function getLoginOptions(username: string): Promise<LoginOptionsResponse> {
  return post<LoginOptionsResponse>('/login/options', { username });
}

export function verifyLogin(
  username: string,
  authResp: AuthenticationResponseJSON
): Promise<VerifyResponse> {
  return post<VerifyResponse>('/login/verify', { username, authResp });
}
