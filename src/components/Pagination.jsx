import Icon from './Icon.jsx';

function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('…');
    result.push(p);
  });
  return result;
}

/** `page` is 1-based. */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Catalogue pages">
      <button type="button" className="pagination__btn" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
        <Icon name="arrowLeft" size={16} />
      </button>
      {pageList(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="pagination__gap" aria-hidden="true">…</span>
        ) : (
          <button
            type="button"
            key={p}
            className={`pagination__btn${p === page ? ' is-current' : ''}`}
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className="pagination__btn" onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
        <Icon name="arrowRight" size={16} />
      </button>
    </nav>
  );
}
