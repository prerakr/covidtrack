import { useCallback, useEffect, useState } from 'react';

import Header from './components/Header.jsx';
import Scope from './components/Scope.jsx';
import CountryPicker from './components/CountryPicker.jsx';
import StatCards from './components/StatCards.jsx';
import TrendChart from './components/TrendChart.jsx';
import Footer from './components/Footer.jsx';

import { useTheme } from './hooks/useTheme.js';
import { fetchSummary, fetchTimeline, fetchCountries } from './api/covid.js';

function App() {
  const [theme, toggleTheme] = useTheme();

  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);

  const [summary, setSummary] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartError, setChartError] = useState(null);

  // Load the country list once on mount.
  useEffect(() => {
    let cancelled = false;
    fetchCountries()
      .then((list) => !cancelled && setCountries(list))
      .catch(() => {
        /* Non-fatal: the picker still offers "Global". */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Load the summary whenever the scope changes.
  const loadSummary = useCallback(async (scope) => {
    setLoading(true);
    setError(null);
    try {
      setSummary(await fetchSummary(scope));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load the historical timeline whenever the scope changes.
  const loadTimeline = useCallback(async (scope) => {
    setChartLoading(true);
    setChartError(null);
    try {
      setTimeline(await fetchTimeline(scope));
    } catch (err) {
      setChartError(err);
      setTimeline([]);
    } finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary(country);
    loadTimeline(country);
  }, [country, loadSummary, loadTimeline]);

  return (
    <div className="app">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <div className="toolbar">
        <Scope
          country={country}
          flag={summary?.flag}
          lastUpdate={summary?.lastUpdate}
        />
        <CountryPicker
          countries={countries}
          selected={country}
          onSelect={setCountry}
        />
      </div>

      {error ? (
        <section className="panel surface">
          <div className="error">
            <span className="error__icon" aria-hidden="true">
              ⚠️
            </span>
            <p>We couldn’t reach the COVID-19 data service.</p>
            <button
              type="button"
              className="error__retry"
              onClick={() => loadSummary(country)}
            >
              Try again
            </button>
          </div>
        </section>
      ) : (
        <StatCards summary={summary} loading={loading} />
      )}

      <TrendChart
        timeline={timeline}
        loading={chartLoading}
        error={chartError}
        onRetry={() => loadTimeline(country)}
      />

      <Footer />
    </div>
  );
}

export default App;
