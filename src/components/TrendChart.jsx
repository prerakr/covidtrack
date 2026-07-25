import { useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

import { formatCompact, formatNumber } from '../utils/format.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const MODES = [
  { id: 'cumulative', label: 'Cumulative' },
  { id: 'daily', label: 'Daily new' },
];

/** Convert a cumulative series into day-over-day deltas (never negative). */
function toDaily(series) {
  return series.map((point, i) =>
    i === 0 ? 0 : Math.max(point - series[i - 1], 0)
  );
}

/** Read the current theme's text colour so the chart matches light/dark. */
function themeColors() {
  const styles = getComputedStyle(document.documentElement);
  return {
    text: styles.getPropertyValue('--text-muted').trim() || '#9aa6bd',
    grid: styles.getPropertyValue('--border').trim() || 'rgba(255,255,255,0.09)',
  };
}

function TrendChart({ timeline, loading, error, onRetry }) {
  const [mode, setMode] = useState('cumulative');

  const chartData = useMemo(() => {
    if (!timeline || timeline.length === 0) return null;

    const labels = timeline.map((p) => p.date);
    let confirmed = timeline.map((p) => p.confirmed);
    let deaths = timeline.map((p) => p.deaths);

    if (mode === 'daily') {
      confirmed = toDaily(confirmed);
      deaths = toDaily(deaths);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Confirmed',
          data: confirmed,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.18)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: 'Deaths',
          data: deaths,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.14)',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    };
  }, [timeline, mode]);

  const options = useMemo(() => {
    const colors = themeColors();
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: colors.text, usePointStyle: true, boxWidth: 8 },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.dataset.label}: ${formatNumber(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: colors.text, maxTicksLimit: 8 },
          grid: { display: false },
        },
        y: {
          ticks: {
            color: colors.text,
            callback: (value) => formatCompact(value),
          },
          grid: { color: colors.grid },
        },
      },
    };
  }, []);

  return (
    <section className="panel surface">
      <div className="panel__head">
        <h2 className="panel__title">Historical trend</h2>
        <div className="segmented" role="group" aria-label="Chart mode">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart__canvas">
        {error ? (
          <div className="error">
            <span className="error__icon" aria-hidden="true">
              📉
            </span>
            <p>Couldn’t load the historical data.</p>
            <button type="button" className="error__retry" onClick={onRetry}>
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="skeleton" style={{ height: '100%', borderRadius: 12 }} />
        ) : chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="error">
            <span className="error__icon" aria-hidden="true">
              🗓️
            </span>
            <p>No historical data available for this selection.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default TrendChart;
