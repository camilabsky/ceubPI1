import { describe, expect, it } from 'vitest';
import { locationPromptKey, isLocationPromptDismissed, dismissLocationPrompt, shouldShowLocationPrompt } from './locationPrompt';

describe('shouldShowLocationPrompt', () => {
  const cases: Array<[boolean, boolean, boolean, boolean, boolean]> = [
    // hasToken, hasPosition, profileHasCity, dismissed, expected
    [true, false, false, false, true],
    [false, false, false, false, false],
    [true, true, false, false, false],
    [true, false, true, false, false],
    [true, false, false, true, false],
  ];
  it.each(cases)('token=%s position=%s city=%s dismissed=%s → %s', (hasToken, hasPosition, profileHasCity, dismissed, expected) => {
    expect(shouldShowLocationPrompt({ hasToken, hasPosition, profileHasCity, dismissed })).toBe(expected);
  });
});

describe('dismissal storage', () => {
  it('keys the dismissal by account', () => {
    expect(locationPromptKey(42)).toBe('couve:explore-location-prompt-dismissed:42');
  });

  it('remembers dismissal for that account only', () => {
    expect(isLocationPromptDismissed(1)).toBe(false);
    dismissLocationPrompt(1);
    expect(localStorage.getItem('couve:explore-location-prompt-dismissed:1')).toBe('1');
    expect(isLocationPromptDismissed(1)).toBe(true);
    expect(isLocationPromptDismissed(2)).toBe(false);
  });

  it('never counts as dismissed without an account', () => {
    dismissLocationPrompt(undefined);
    expect(isLocationPromptDismissed(undefined)).toBe(false);
    expect(localStorage.length).toBe(0);
  });
});
