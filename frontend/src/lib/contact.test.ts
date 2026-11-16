import { describe, expect, it } from 'vitest';
import { isValidPhone } from './contact';

describe('isValidPhone', () => {
  it('accepts Brazilian formats', () => {
    expect(isValidPhone('(61) 99999-0000')).toBe(true);
    expect(isValidPhone('+55 61 99999-0000')).toBe(true);
    expect(isValidPhone('  (61) 99999-0000  ')).toBe(true);
  });

  it('rejects junk, short, long and empty values', () => {
    expect(isValidPhone('abc')).toBe(false);
    expect(isValidPhone('1234567')).toBe(false);
    expect(isValidPhone('+'.padEnd(22, '1'))).toBe(false);
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone('   ')).toBe(false);
  });
});
