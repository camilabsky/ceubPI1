export const LOCATION_PROMPT_DISMISSED_KEY = 'couve:explore-location-prompt-dismissed';

export function shouldShowLocationPrompt({ hasToken, hasPosition, profileHasCity, dismissed }: {
  hasToken: boolean;
  hasPosition: boolean;
  profileHasCity: boolean;
  dismissed: boolean;
}): boolean {
  return hasToken && !hasPosition && !profileHasCity && !dismissed;
}

export function isLocationPromptDismissed(): boolean {
  try { return localStorage.getItem(LOCATION_PROMPT_DISMISSED_KEY) === '1'; } catch { return false; }
}

export function dismissLocationPrompt(): void {
  try { localStorage.setItem(LOCATION_PROMPT_DISMISSED_KEY, '1'); } catch { /* sem localStorage: o card só some nesta visita */ }
}
