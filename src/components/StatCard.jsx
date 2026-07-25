import { useCountUp } from '../hooks/useCountUp.js';
import { formatNumber, formatDelta } from '../utils/format.js';

/**
 * A single animated statistic card.
 * @param {object} props
 * @param {string} props.label   - Metric name.
 * @param {number} props.value   - Metric value.
 * @param {number} [props.delta] - Today's change (optional).
 * @param {string} props.accent  - CSS colour token for the accent stripe.
 * @param {string} props.caption - Short descriptive caption.
 * @param {boolean} [props.loading]
 */
function StatCard({ label, value, delta, accent, caption, loading }) {
  const animated = useCountUp(loading ? 0 : value ?? 0);
  const deltaText = formatDelta(delta);

  return (
    <article className="card surface" style={{ '--accent': accent }}>
      <div className="card__head">
        <span className="card__label">{label}</span>
        <span className="card__dot" aria-hidden="true" />
      </div>

      {loading ? (
        <>
          <div className="skeleton skeleton--value" />
          <div className="skeleton skeleton--meta" />
        </>
      ) : (
        <>
          <div className="card__value">{formatNumber(animated)}</div>
          <div className="card__meta">
            {deltaText && <span className="card__delta">{deltaText} today</span>}
            <span>{caption}</span>
          </div>
        </>
      )}
    </article>
  );
}

export default StatCard;
