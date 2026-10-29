import Icon from './Icon.jsx';

/** Number stepper. `value` may be '' while the visitor is typing. */
export default function QuantityInput({ id, label = 'Quantity', value, onChange, min = 1, max = 100000, step = 1, error, compact = false }) {
  const numeric = Number(value) || 0;
  const set = (next) => onChange(Math.min(max, Math.max(1, next)));
  return (
    <div className={`quantity${compact ? ' quantity--compact' : ''}${error ? ' field--invalid' : ''}`}>
      {!compact && <label htmlFor={id}>{label}</label>}
      <div className="quantity__control">
        <button type="button" onClick={() => set(numeric - step)} aria-label={`Decrease ${label.toLowerCase()}`} disabled={numeric <= 1}>
          <Icon name="minus" size={16} />
        </button>
        <input
          id={id}
          name={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          aria-label={compact ? label : undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
        <button type="button" onClick={() => set(numeric + step)} aria-label={`Increase ${label.toLowerCase()}`} disabled={numeric >= max}>
          <Icon name="plus" size={16} />
        </button>
      </div>
      {error && <p className="field__error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}
