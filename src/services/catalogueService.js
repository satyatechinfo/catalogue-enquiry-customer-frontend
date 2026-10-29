import client from "./api.js";
import { config } from "../config.js";
import { fallbackState } from "../dev/fallbackState.js";

async function withDevFallback(call, fallbackName, ...args) {
  try {
    return await call();
  } catch (error) {
    if (config.devFallback && error.isNetworkError) {
      const fallback = await import("../dev/fallbackApi.js");
      fallbackState.activate();
      return fallback[fallbackName](...args);
    }
    throw error;
  }
}

const clean = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    )
  );

/** params: category, occasion, budget, search, featured, page (0-based), size, sort */
export function fetchProducts(params = {}, { signal } = {}) {
  return withDevFallback(
    async () =>
      (await client.get("/products", { params: clean(params), signal })).data,
    "fetchProducts",
    params
  );
}

export function fetchProduct(id, { signal } = {}) {
  return withDevFallback(
    async () => (await client.get(`/products/${id}`, { signal })).data,
    "fetchProduct",
    id
  );
}

export function fetchCategories({ signal } = {}) {
  return withDevFallback(
    async () => (await client.get("/categories", { signal })).data,
    "fetchCategories"
  );
}

export function fetchOccasions({ signal } = {}) {
  return withDevFallback(
    async () => (await client.get("/occasions", { signal })).data,
    "fetchOccasions"
  );
}
