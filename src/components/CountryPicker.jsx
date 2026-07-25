import { useEffect, useMemo, useRef, useState } from 'react';

const GLOBAL_OPTION = { name: 'Global', code: '', flag: '' };

/**
 * Accessible, searchable country dropdown. Filters an in-memory list as the
 * user types and reports the selected country name (empty string = global).
 */
function CountryPicker({ countries, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  const options = useMemo(
    () => [GLOBAL_OPTION, ...countries],
    [countries]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((c) => c.name.toLowerCase().includes(q));
  }, [options, query]);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  const currentLabel = selected || 'Global';

  function choose(country) {
    onSelect(country.name === 'Global' ? '' : country.name);
    setQuery('');
    setOpen(false);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter' && open && filtered[activeIndex]) {
      event.preventDefault();
      choose(filtered[activeIndex]);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="picker" ref={containerRef}>
      <input
        type="text"
        className="picker__input"
        role="combobox"
        aria-expanded={open}
        aria-controls="country-listbox"
        aria-autocomplete="list"
        placeholder={`Search countries — ${currentLabel}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      <span className="picker__caret" aria-hidden="true">
        ▼
      </span>

      {open && (
        <ul className="picker__list" id="country-listbox" role="listbox">
          {filtered.length === 0 && (
            <li className="picker__empty">No countries match “{query}”.</li>
          )}
          {filtered.map((country, index) => (
            <li key={country.name} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className="picker__option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(country)}
              >
                {country.flag ? (
                  <img src={country.flag} alt="" loading="lazy" />
                ) : (
                  <span aria-hidden="true">🌍</span>
                )}
                {country.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CountryPicker;
