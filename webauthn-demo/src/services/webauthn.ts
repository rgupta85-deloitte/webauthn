import {
  startRegistration,
  startAuthentication,
  type PublicKeyCredentialCreationOptionsJSON,
  type PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/browser';
import {
  getRegisterOptions,
  verifyRegistration,
  getLoginOptions,
  verifyLogin,
} from './api';

export async function registerDevice(username: string): Promise<void> {
  const options = await getRegisterOptions(username);

  // Patch empty displayName — Chrome throws NotAllowedError when it is ""
  if (!options.user.displayName) {
    options.user.displayName = username;
  }

  const attResp = await startRegistration({
    optionsJSON: options as PublicKeyCredentialCreationOptionsJSON,
  });

  const result = await verifyRegistration(username, attResp);
  if (!result.verified) {
    throw new Error('Registration verification failed on the server.');
  }
}

export async function authenticateDevice(username: string): Promise<void> {
  const options = await getLoginOptions(username);

  const authResp = await startAuthentication({
    optionsJSON: options as PublicKeyCredentialRequestOptionsJSON,
  });

  const result = await verifyLogin(username, authResp);
  if (!result.verified) {
    throw new Error('Authentication verification failed on the server.');
  }
}
