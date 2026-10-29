import Icon from './Icon.jsx';
import Button from './Button.jsx';

export function Spinner({ label = 'Loading' }) {
  return (
    <span className="spinner" role="status" aria-label={label}>
      <span className="spinner__ring" aria-hidden="true" />
    </span>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="product-grid" aria-busy="true" aria-live="polite">
      <span className="visually-hidden">Loading products</span>
      {Array.from({ length: count }, (_, i) => (
        <div className="product-card product-card--skeleton" key={i} aria-hidden="true">
          <div className="skeleton skeleton--image" />
          <div className="product-card__body">
            <div className="skeleton skeleton--line skeleton--short" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--medium" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, message, actionLabel, onAction, actionTo }) {
  return (
    <div className="state-view" role="status">
      <span className="state-view__icon"><Icon name="search" size={28} /></span>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && (actionTo ? <Button to={actionTo} variant="secondary">{actionLabel}</Button> : <Button variant="secondary" onClick={onAction}>{actionLabel}</Button>)}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="state-view state-view--error" role="alert">
      <span className="state-view__icon"><Icon name="alert" size={28} /></span>
      <h3>{title}</h3>
      <p>{message || 'We could not load this content. Please try again.'}</p>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="page-loader"><Spinner label="Loading page" /></div>
  );
}
