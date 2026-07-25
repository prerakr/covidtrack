import StatCard from './StatCard.jsx';

/**
 * Grid of headline statistics for the current scope (global or a country).
 */
function StatCards({ summary, loading }) {
  const s = summary ?? {};
  const cards = [
    {
      label: 'Confirmed',
      value: s.confirmed,
      delta: s.todayConfirmed,
      accent: 'var(--c-confirmed)',
      caption: 'total cases',
    },
    {
      label: 'Active',
      value: s.active,
      accent: 'var(--c-active)',
      caption: 'currently infected',
    },
    {
      label: 'Recovered',
      value: s.recovered,
      delta: s.todayRecovered,
      accent: 'var(--c-recovered)',
      caption: 'total recoveries',
    },
    {
      label: 'Deaths',
      value: s.deaths,
      delta: s.todayDeaths,
      accent: 'var(--c-deaths)',
      caption: 'total deaths',
    },
    {
      label: 'Critical',
      value: s.critical,
      accent: 'var(--c-active)',
      caption: 'in critical condition',
    },
    {
      label: 'Tests',
      value: s.tests,
      accent: 'var(--c-tests)',
      caption: 'tests conducted',
    },
  ];

  return (
    <section className="cards" aria-label="Summary statistics">
      {cards.map((card) => (
        <StatCard key={card.label} loading={loading} {...card} />
      ))}
    </section>
  );
}

export default StatCards;
