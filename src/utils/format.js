// Number / date formatting helpers shared across the UI.

const numberFormatter = new Intl.NumberFormat('en-US');

/** Format an integer with thousands separators. Nullish → "—". */
export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return numberFormatter.format(Math.round(value));
}

/** Compact large numbers, e.g. 1_234_567 → "1.2M". Nullish → "—". */
export function formatCompact(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/** Prefix a delta with an explicit sign, e.g. 42 → "+42". */
export function formatDelta(value) {
  if (!value) return null;
  const sign = value > 0 ? '+' : '';
  return `${sign}${numberFormatter.format(value)}`;
}

/** Format a millisecond epoch timestamp into a readable local string. */
export function formatTimestamp(ms) {
  if (!ms) return null;
  return new Date(ms).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}
