import { describe, expect, it } from 'vitest';
import { LOCATION_PROMPT_DISMISSED_KEY, isLocationPromptDismissed, dismissLocationPrompt, shouldShowLocationPrompt } from './locationPrompt';

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
  it('uses the agreed localStorage key', () => {
    expect(LOCATION_PROMPT_DISMISSED_KEY).toBe('couve:explore-location-prompt-dismissed');
  });

  it('remembers dismissal', () => {
    expect(isLocationPromptDismissed()).toBe(false);
    dismissLocationPrompt();
    expect(localStorage.getItem('couve:explore-location-prompt-dismissed')).toBe('1');
    expect(isLocationPromptDismissed()).toBe(true);
  });
});
