import { useEffect, useState } from 'react';

const STORAGE_KEY = 'covidtrack-theme';

function getInitialTheme() {
  const stored = window.localStorage?.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  const prefersLight = window.matchMedia?.(
    '(prefers-color-scheme: light)'
  ).matches;
  return prefersLight ? 'light' : 'dark';
}

/**
 * Manage the light/dark theme, persisting the choice and reflecting it on
 * the document root via a `data-theme` attribute.
 * @returns {[string, () => void]} Current theme and a toggle function.
 */
export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage?.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return [theme, toggleTheme];
}
