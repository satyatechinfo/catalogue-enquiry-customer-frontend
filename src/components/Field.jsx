/**
 * Accessible form control with label, hint and field-level error message.
 * `as` is 'input' (default), 'select' or 'textarea'.
 */
export default function Field({ as = 'input', id, label, required = false, error, hint, className = '', children, ...rest }) {
  const Control = as;
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${error ? ' field--invalid' : ''} ${className}`.trim()}>
      <label htmlFor={id}>
        {label}
        {required && <span className="field__required" aria-hidden="true"> *</span>}
      </label>
      <Control id={id} name={id} aria-invalid={error ? 'true' : undefined} aria-describedby={describedBy} aria-required={required || undefined} {...rest}>
        {children}
      </Control>
      {hint && !error && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field__error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}
