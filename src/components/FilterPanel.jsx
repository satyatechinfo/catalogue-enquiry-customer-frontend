import { useState } from 'react';
import Icon from './Icon.jsx';
import { BUDGET_BANDS } from '../utils/constants.js';

/** Controlled filter sidebar. `values` and the callbacks come from the URL query string. */
export default function FilterPanel({ categories = [], occasions = [], values, onChange, onClear, activeCount }) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="filters" aria-label="Catalogue filters">
      <button
        type="button"
        className="filters__toggle"
        aria-expanded={open}
        aria-controls="filter-groups"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="filter" size={18} /> Filters{activeCount > 0 && <span className="badge">{activeCount}</span>}
      </button>

      <div id="filter-groups" className={`filters__groups${open ? ' is-open' : ''}`}>
        <fieldset>
          <legend>Category</legend>
          <label className="radio">
            <input type="radio" name="category" checked={!values.category} onChange={() => onChange({ category: '' })} />
            <span>All categories</span>
          </label>
          {categories.map((c) => (
            <label className="radio" key={c.id}>
              <input type="radio" name="category" checked={values.category === c.slug} onChange={() => onChange({ category: c.slug })} />
              <span>{c.name}</span>
            </label>
          ))}
        </fieldset>

        <div className="filters__group">
          <label htmlFor="filter-occasion" className="filters__label">Occasion</label>
          <select id="filter-occasion" value={values.occasion} onChange={(e) => onChange({ occasion: e.target.value })}>
            <option value="">All occasions</option>
            {occasions.map((o) => (
              <option key={o.id} value={o.slug}>{o.name}</option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend>Budget per unit</legend>
          <label className="radio">
            <input type="radio" name="budget" checked={!values.budget} onChange={() => onChange({ budget: '' })} />
            <span>Any budget</span>
          </label>
          {BUDGET_BANDS.map((b) => (
            <label className="radio" key={b.value}>
              <input type="radio" name="budget" checked={values.budget === b.value} onChange={() => onChange({ budget: b.value })} />
              <span>{b.label}</span>
            </label>
          ))}
        </fieldset>

        <button type="button" className="btn btn--secondary btn--sm filters__clear" onClick={onClear} disabled={activeCount === 0}>
          Clear all filters
        </button>
      </div>
    </aside>
  );
}
