interface MockUser {
  corpId: string;
  loginId: string;
}

const MOCK_USERS: MockUser[] = [
  { corpId: 'SITCORP16', loginId: 'MAKER1' },
  { corpId: 'SITCORP16', loginId: 'MAKER2' },
  { corpId: 'SITCORP16', loginId: 'CHECKER1' },
];

export function validateCredentials(corpId: string, loginId: string): boolean {
  return MOCK_USERS.some(
    (u) =>
      u.corpId.toUpperCase() === corpId.toUpperCase() &&
      u.loginId.toUpperCase() === loginId.toUpperCase()
  );
}
