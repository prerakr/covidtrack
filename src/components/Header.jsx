function Header({ theme, onToggleTheme }) {
  const isDark = theme === 'dark';
  return (
    <header className="header">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">
          🦠
        </span>
        <div>
          <h1 className="brand__title">CovidTrack</h1>
          <p className="brand__subtitle">Global COVID-19 statistics dashboard</p>
        </div>
      </div>

      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
        {isDark ? 'Light' : 'Dark'}
      </button>
    </header>
  );
}

export default Header;
