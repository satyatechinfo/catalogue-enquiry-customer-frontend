// DEVELOPMENT-ONLY fallback. Loaded dynamically, and only when VITE_ENABLE_DEV_FALLBACK=true,
// the app is running under `vite dev` and the real API cannot be reached.
// It mirrors the read endpoints of the Spring Boot API using a copy of the seed catalogue.
// Enquiries are never faked: submitting always requires the real backend.
import seed from './catalogue.json';

const categories = seed.categories.map((c, i) => ({ id: i + 1, ...c }));
const occasions = seed.occasions.map((o, i) => ({ id: i + 1, ...o }));

const products = seed.products.map((p, i) => ({
  id: i + 1,
  sku: p.sku,
  name: p.name,
  slug: p.slug,
  imageUrl: p.image,
  category: categories.find((c) => c.slug === p.category),
  shortDescription: p.shortDescription,
  description: p.description,
  minPrice: p.minPrice,
  maxPrice: p.maxPrice,
  minOrderQuantity: p.minOrderQuantity,
  featured: p.featured,
  displayOrder: p.displayOrder,
  occasions: p.occasions.map((slug) => occasions.find((o) => o.slug === slug)),
  customisationOptions: p.customisationOptions,
}));

const bands = {
  'under-500': [null, 500],
  '500-1500': [500, 1500],
  '1500-3000': [1500, 3000],
  'above-3000': [3000, null],
};

const sorters = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || a.displayOrder - b.displayOrder,
  'price-asc': (a, b) => a.minPrice - b.minPrice,
  'price-desc': (a, b) => b.maxPrice - a.maxPrice,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  newest: (a, b) => b.id - a.id,
};

export async function fetchProducts({ category, occasion, budget, search, featured, page = 0, size = 9, sort = 'featured' } = {}) {
  let list = products.filter((p) => {
    if (category && p.category.slug !== category) return false;
    if (occasion && !p.occasions.some((o) => o.slug === occasion)) return false;
    if (budget && bands[budget]) {
      const [lower, upper] = bands[budget];
      if (upper !== null && p.minPrice > upper) return false;
      if (lower !== null && p.maxPrice < lower) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (![p.name, p.shortDescription, p.sku].some((v) => v.toLowerCase().includes(q))) return false;
    }
    if (featured !== undefined && featured !== null && p.featured !== featured) return false;
    return true;
  });
  list = [...list].sort(sorters[sort] || sorters.featured);
  const start = page * size;
  return {
    content: list.slice(start, start + size),
    page,
    size,
    totalElements: list.length,
    totalPages: Math.ceil(list.length / size),
  };
}

export async function fetchProduct(id) {
  const product = products.find((p) => p.id === Number(id));
  if (!product) {
    const { ApiError } = await import('../services/api.js');
    throw new ApiError({ status: 404, message: `Product ${id} was not found.` });
  }
  return product;
}

export const fetchCategories = async () => categories;
export const fetchOccasions = async () => occasions;
