'use client';

import { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { useSearchParams } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Search, SlidersHorizontal, ShoppingCart, ChevronDown, X, ArrowLeft, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function ShopPage() {
  const { products, addToCart } = useApp();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStore, setFilterStore] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [showFilters, setShowFilters] = useState(false);

  // Sync URL params into state — wait for products to load so store names are available
  useEffect(() => {
    const q = searchParams.get('q');
    const store = searchParams.get('store');
    if (q) setSearch(q);
    if (store && products.length > 0) {
      // Find the exact store name from product data (case-insensitive match)
      const allProductStores = [...new Set(products.map(p => p.store).filter(Boolean))];
      const exactMatch = allProductStores.find(
        s => s.toLowerCase().trim() === store.toLowerCase().trim()
              || s.toLowerCase().includes(store.toLowerCase().trim())
              || store.toLowerCase().includes(s.toLowerCase().trim())
      );
      // Use the exact product store name so the <select> dropdown highlights it
      setFilterStore(exactMatch || store);
    }
  }, [searchParams, products]);

  // Derive unique categories
  const allCategories = useMemo(() => {
    let cats = products.map(p => p.category);
    return Array.from(new Set(cats)).sort();
  }, [products]);

  // Derive unique stores
  const allStores = useMemo(() => {
    let stores = products.map(p => p.store || 'S&R Membership Shopping, General Trias Cavite');
    return Array.from(new Set(stores)).sort();
  }, [products]);

  // Fuse.js instance for fuzzy searching
  const fuse = useMemo(() => new Fuse(products, {
    keys: ['name', 'store', 'category'],
    threshold: 0.35,
    minMatchCharLength: 2,
    ignoreLocation: true,
  }), [products]);

  // Filter + Search + Sort
  const filtered = useMemo(() => {
    let result = [...products];

    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
    }
    if (filterStore !== 'all') {
      const normalizedFilter = filterStore.toLowerCase().trim();
      result = result.filter(p => {
        const storeName = (p.store || '').toLowerCase().trim();
        return storeName === normalizedFilter || storeName.includes(normalizedFilter) || normalizedFilter.includes(storeName);
      });
    }
    if (search.trim()) {
      // Fuzzy search on the already-filtered subset
      const subFuse = new Fuse(result, {
        keys: ['name', 'store', 'category'],
        threshold: 0.35,
        minMatchCharLength: 2,
        ignoreLocation: true,
      });
      result = subFuse.search(search.trim()).map(r => r.item);
    }

    if (!search.trim()) {
      switch (sortBy) {
        case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
        case 'price-asc': result.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
        case 'price-desc': result.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
      }
    }

    return result;
  }, [products, filterCategory, filterStore, search, sortBy, fuse]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      store: product.store || 'S&R Membership Shopping, General Trias Cavite',
      image: product.image
    });
  };

  const activeFilterCount = [filterCategory !== 'all', filterStore !== 'all', search.trim().length > 0].filter(Boolean).length;

  return (
    <div className="bg-gray-50/30 min-h-screen">

      {/* ── Hero Banner ────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-brandTeal via-teal-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-bold mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Shop All Products</h1>
          <p className="text-sm text-white/70 mt-2 max-w-md">
            Browse the complete PasaBUYan catalog — groceries, specialty items, and shop brands all in one place.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mt-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, stores, categories…"
              className="w-full pl-11 pr-10 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all font-medium"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-4 h-4" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* ── Filter Bar ───────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 mb-8">

          {/* Category dropdown */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:border-brandTeal transition-all shadow-sm cursor-pointer"
            >
              <option value="all">All Categories</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Store dropdown */}
          <div className="relative">
            <select
              value={filterStore}
              onChange={(e) => setFilterStore(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:border-brandTeal transition-all shadow-sm cursor-pointer"
            >
              <option value="all">All Stores</option>
              {allStores.map(store => (
                <option key={store} value={store}>{store}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:border-brandTeal transition-all shadow-sm cursor-pointer"
            >
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Active filter count + clear */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setSearch(''); setFilterCategory('all'); setFilterStore('all'); }}
              className="text-[10px] font-bold text-brandTeal hover:underline transition-colors"
            >
              Clear filters ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Result count */}
        <p className="text-xs text-gray-400 mb-6 font-medium">
          Showing <span className="font-bold text-gray-600">{filtered.length}</span> of {products.length} products
        </p>

        {/* ── Product Grid ─────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 max-w-md mx-auto">
            <span className="text-5xl">🔍</span>
            <h3 className="text-sm font-bold text-gray-600 mt-5">No products found</h3>
            <p className="text-[11px] text-gray-400 mt-1.5 max-w-xs mx-auto">Try adjusting your search or filters to discover what you&apos;re looking for.</p>
            <button
              onClick={() => { setSearch(''); setFilterCategory('all'); setFilterStore('all'); }}
              className="mt-5 px-5 py-2.5 bg-brandTeal text-white text-xs font-bold rounded-xl hover:bg-brandTeal/90 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filtered.map((product, index) => (
              <div
                key={product.id || `fallback-${index}`}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:border-brandTeal/30 hover:shadow-lg hover:shadow-brandTeal/5 transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <Link href={`/product/${product.id}`} className="relative aspect-square bg-gray-50 overflow-hidden block">
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">📦</div>
                  )}
                </Link>

                {/* Info */}
                <div className="flex flex-col flex-1 p-3.5 gap-1.5">
                  <span className="text-[9px] font-black text-brandTeal uppercase tracking-wider">{product.category}</span>
                  <Link href={`/product/${product.id}`}>
                    <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-brandTeal transition-colors">
                      {product.name}
                    </h4>
                  </Link>
                  <p className="text-[10px] text-gray-400 font-medium truncate">{product.store || 'S&R Membership Shopping, General Trias Cavite'}</p>

                  {/* Price + Cart */}
                  <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-gray-50">
                    <span className="font-extrabold text-sm text-gray-800">₱{(product.price || 0).toLocaleString()}</span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2.5 rounded-xl bg-brandTeal text-white hover:bg-brandTeal/90 transition-all active:scale-90 shadow-sm"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 z-50 p-3 bg-gray-900 text-white rounded-2xl shadow-xl shadow-gray-900/20 hover:bg-brandTeal transition-all duration-300 opacity-100 translate-y-0"
        aria-label="Back to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </div>
  );
}
