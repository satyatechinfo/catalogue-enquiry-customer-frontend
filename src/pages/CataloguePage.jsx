import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FilterPanel from "../components/FilterPanel.jsx";
import Pagination from "../components/Pagination.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Icon from "../components/Icon.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import {
  EmptyState,
  ErrorState,
  ProductGridSkeleton,
} from "../components/StateViews.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { useDebouncedValue } from "../hooks/useDebouncedValue.js";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import {
  fetchCategories,
  fetchOccasions,
  fetchProducts,
} from "../services/catalogueService.js";
import { BUDGET_BANDS, PAGE_SIZE, SORT_OPTIONS } from "../utils/constants.js";

export default function CataloguePage() {
  const [params, setParams] = useSearchParams();
  const filters = {
    category: params.get("category") || "",
    occasion: params.get("occasion") || "",
    budget: params.get("budget") || "",
    q: params.get("q") || "",
    sort: params.get("sort") || "featured",
    page: Math.max(1, parseInt(params.get("page") || "1", 10) || 1),
  };

  useDocumentMeta({
    title: "Corporate Gift Catalogue",
    description:
      "Browse corporate gifts and personalised merchandise across drinkware, apparel, work essentials and wellness. Filter by occasion and budget.",
    path: "/catalogue",
  });

  const update = (changes, { resetPage = true, replace = false } = {}) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (key === "sort" && value === "featured") ||
        (key === "page" && value === 1)
      )
        next.delete(key);
      else next.set(key, String(value));
    });
    if (resetPage && !("page" in changes)) next.delete("page");
    setParams(next, { replace });
  };

  // Search box: local text, pushed to the URL after a short pause.
  const [searchText, setSearchText] = useState(filters.q);
  const debouncedSearch = useDebouncedValue(searchText, 350);
  useEffect(() => setSearchText(filters.q), [filters.q]);
  useEffect(() => {
    if (debouncedSearch.trim() !== filters.q)
      update({ q: debouncedSearch.trim() }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const categories = useAsync(({ signal }) => fetchCategories({ signal }), []);
  const occasions = useAsync(({ signal }) => fetchOccasions({ signal }), []);
  const products = useAsync(
    ({ signal }) =>
      fetchProducts(
        {
          category: filters.category,
          occasion: filters.occasion,
          budget: filters.budget,
          search: filters.q,
          sort: filters.sort,
          page: filters.page - 1,
          size: PAGE_SIZE,
        },
        { signal }
      ),
    [
      filters.category,
      filters.occasion,
      filters.budget,
      filters.q,
      filters.sort,
      filters.page,
    ]
  );

  const result = products.data;
  useEffect(() => {
    if (result && result.totalPages > 0 && filters.page > result.totalPages)
      update({ page: result.totalPages }, { resetPage: false, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const activeCount = ["category", "occasion", "budget", "q"].filter(
    (k) => filters[k]
  ).length;
  const clearAll = () => {
    setSearchText("");
    setParams(filters.sort !== "featured" ? { sort: filters.sort } : {});
  };

  const activeLabels = [
    filters.category &&
      categories.data?.find((c) => c.slug === filters.category)?.name,
    filters.occasion &&
      occasions.data?.find((o) => o.slug === filters.occasion)?.name,
    filters.budget &&
      BUDGET_BANDS.find((b) => b.value === filters.budget)?.label,
    filters.q && `“${filters.q}”`,
  ].filter(Boolean);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="Catalogue"
            title="Corporate gifts & personalised merchandise"
            text="Filter by category, occasion and budget, then send an enquiry for the products you like."
          />
        </div>
      </section>

      <section className="section section--tight">
        <div className="container catalogue">
          <FilterPanel
            categories={categories.data || []}
            occasions={occasions.data || []}
            values={filters}
            onChange={update}
            onClear={clearAll}
            activeCount={activeCount}
          />

          <div className="catalogue__main">
            <div className="toolbar">
              <div className="search">
                <label htmlFor="catalogue-search" className="visually-hidden">
                  Search products
                </label>
                <Icon name="search" size={18} />
                <input
                  id="catalogue-search"
                  type="search"
                  placeholder="Search products, e.g. bottle, hamper, notebook"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div className="sort">
                <label htmlFor="catalogue-sort">Sort by</label>
                <select
                  id="catalogue-sort"
                  value={filters.sort}
                  onChange={(e) =>
                    update({ sort: e.target.value }, { resetPage: false })
                  }
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p className="results-summary" aria-live="polite">
              {products.loading && !result && "Loading products…"}
              {result &&
                `${result.totalElements} ${
                  result.totalElements === 1 ? "product" : "products"
                }`}
              {result &&
                activeLabels.length > 0 &&
                ` for ${activeLabels.join(" · ")}`}
              {activeCount > 0 && (
                <button
                  type="button"
                  className="text-button"
                  onClick={clearAll}
                >
                  Clear filters
                </button>
              )}
            </p>

            {products.loading && !result && (
              <ProductGridSkeleton count={PAGE_SIZE} />
            )}
            {products.error && (
              <ErrorState
                title="We couldn't load the catalogue"
                message={products.error.message}
                onRetry={products.reload}
              />
            )}
            {result && result.content.length === 0 && (
              <EmptyState
                title="No products match your filters"
                message="Try a different search term, or remove some filters to see more of the collection."
                actionLabel="Clear all filters"
                onAction={clearAll}
              />
            )}
            {result && result.content.length > 0 && (
              <div
                className={`product-grid${
                  products.loading ? " is-updating" : ""
                }`}
                aria-busy={products.loading}
              >
                {result.content.map((p, i) => (
                  <ProductCard key={p.id} product={p} eager={i < 3} />
                ))}
              </div>
            )}
            {result && (
              <Pagination
                page={filters.page}
                totalPages={result.totalPages}
                onChange={(p) => {
                  update({ page: p }, { resetPage: false });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
