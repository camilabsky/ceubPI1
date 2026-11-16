// Mesmo formato aceito pelo backend (backend/userContact.js).
const PHONE_PATTERN = /^\+?[0-9 ()-]{8,20}$/;

export function isValidPhone(value: string): boolean {
  const telefone = value.trim();
  return telefone.length <= 24 && PHONE_PATTERN.test(telefone);
}
