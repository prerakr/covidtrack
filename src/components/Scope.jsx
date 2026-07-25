import { formatTimestamp } from '../utils/format.js';

/**
 * Shows the active scope (Global or a country, with flag) and last-updated time.
 */
function Scope({ country, flag, lastUpdate }) {
  const updated = formatTimestamp(lastUpdate);
  return (
    <div className="scope">
      {country && flag ? (
        <img className="scope__flag" src={flag} alt="" />
      ) : (
        <span className="scope__globe" aria-hidden="true">
          🌍
        </span>
      )}
      <div>
        <div className="scope__label">{country || 'Global'}</div>
        {updated && (
          <div className="scope__updated">Last updated {updated}</div>
        )}
      </div>
    </div>
  );
}

export default Scope;
