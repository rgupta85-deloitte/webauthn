import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

const app = express();
const PORT   = process.env.PORT   || 3001;
const RP_ID  = process.env.RP_ID  || 'localhost';
const RP_NAME = process.env.RP_NAME || 'WebAuthn Demo';
const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: ORIGIN }));
app.use(express.json());

// ── In-memory store ───────────────────────────────────────────────────────────
// username → { currentChallenge: string | null, credentials: StoredCredential[] }
const users = new Map();

function getOrCreateUser(username) {
  if (!users.has(username)) {
    users.set(username, { currentChallenge: null, credentials: [] });
  }
  return users.get(username);
}

// ── GET /user/:loginId/webauthn-status ────────────────────────────────────────
app.get('/user/:loginId/webauthn-status', (req, res) => {
  const { loginId } = req.params;
  const user = users.get(loginId);
  if (!user || user.credentials.length === 0) {
    return res.status(404).json({ message: 'User not found', registered: false });
  }
  res.json({ loginId, registered: true, hasCredential: true });
});

// ── POST /register/options ────────────────────────────────────────────────────
app.post('/register/options', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username is required' });

  const user = getOrCreateUser(username);

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userName: username,
    userDisplayName: username,
    attestationType: 'none',
    excludeCredentials: user.credentials.map((c) => ({
      id: c.id,
      transports: c.transports,
    })),
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      residentKey: 'required',
      userVerification: 'preferred',
      requireResidentKey: true,
    },
  });

  user.currentChallenge = options.challenge;
  res.json(options);
});

// ── POST /register/verify ─────────────────────────────────────────────────────
app.post('/register/verify', async (req, res) => {
  const { username, attResp } = req.body;
  const user = users.get(username);
  if (!user) return res.status(400).json({ verified: false, error: 'User not found' });

  try {
    const verification = await verifyRegistrationResponse({
      response: attResp,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential } = verification.registrationInfo;
      user.credentials.push({
        id: credential.id,
        publicKey: credential.publicKey,   // Uint8Array — kept in memory as-is
        counter: credential.counter,
        transports: attResp.response.transports ?? [],
      });
    }

    user.currentChallenge = null;
    res.json({ verified: verification.verified });
  } catch (err) {
    console.error('/register/verify error:', err.message);
    res.status(400).json({ verified: false, error: err.message });
  }
});

// ── POST /login/options ───────────────────────────────────────────────────────
app.post('/login/options', async (req, res) => {
  const { username } = req.body;
  const user = users.get(username);
  if (!user || user.credentials.length === 0) {
    return res.status(404).json({ error: 'User has no registered credentials' });
  }

  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials: user.credentials.map((c) => ({
      id: c.id,
      transports: c.transports,
    })),
    userVerification: 'preferred',
  });

  user.currentChallenge = options.challenge;
  res.json(options);
});

// ── POST /login/verify ────────────────────────────────────────────────────────
app.post('/login/verify', async (req, res) => {
  const { username, authResp } = req.body;
  const user = users.get(username);
  if (!user) return res.status(400).json({ verified: false, error: 'User not found' });

  const credential = user.credentials.find((c) => c.id === authResp.id);
  if (!credential) {
    return res.status(400).json({ verified: false, error: 'Credential not found' });
  }

  try {
    const verification = await verifyAuthenticationResponse({
      response: authResp,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      credential: {
        id: credential.id,
        publicKey: credential.publicKey,
        counter: credential.counter,
        transports: credential.transports,
      },
    });

    if (verification.verified) {
      // Update counter to prevent replay attacks
      credential.counter = verification.authenticationInfo.newCounter;
    }

    user.currentChallenge = null;
    res.json({ verified: verification.verified });
  } catch (err) {
    console.error('/login/verify error:', err.message);
    res.status(400).json({ verified: false, error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nWebAuthn server running`);
  console.log(`  URL    : http://127.0.0.1:${PORT}`);
  console.log(`  RP ID  : ${RP_ID}`);
  console.log(`  Origin : ${ORIGIN}\n`);
});
