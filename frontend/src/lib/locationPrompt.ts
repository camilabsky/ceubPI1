const LOCATION_PROMPT_DISMISSED_PREFIX = 'couve:explore-location-prompt-dismissed';

type AccountId = number | string | null | undefined;

export function locationPromptKey(userId: number | string): string {
  return `${LOCATION_PROMPT_DISMISSED_PREFIX}:${userId}`;
}

export function shouldShowLocationPrompt({ hasToken, hasPosition, profileHasCity, dismissed }: {
  hasToken: boolean;
  hasPosition: boolean;
  profileHasCity: boolean;
  dismissed: boolean;
}): boolean {
  return hasToken && !hasPosition && !profileHasCity && !dismissed;
}

export function isLocationPromptDismissed(userId: AccountId): boolean {
  if (userId === null || userId === undefined) return false;
  try { return localStorage.getItem(locationPromptKey(userId)) === '1'; } catch { return false; }
}

export function dismissLocationPrompt(userId: AccountId): void {
  if (userId === null || userId === undefined) return;
  try { localStorage.setItem(locationPromptKey(userId), '1'); } catch { /* sem localStorage: o card só some nesta visita */ }
}
