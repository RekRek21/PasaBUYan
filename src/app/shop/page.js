'use client';

import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, SlidersHorizontal, ShoppingCart, ChevronDown, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ShopPage() {
  const { products, addToCart } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [showFilters, setShowFilters] = useState(false);

  // Derive unique categories
  const allCategories = useMemo(() => {
    let cats = products.map(p => p.category);
    if (filterType !== 'all') {
      cats = products.filter(p => p.type === filterType).map(p => p.category);
    }
    return Array.from(new Set(cats)).sort();
  }, [products, filterType]);

  // Filter + Search + Sort
  const filtered = useMemo(() => {
    let result = [...products];

    if (filterType !== 'all') {
      result = result.filter(p => p.type === filterType);
    }
    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.store?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'name-asc': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': result.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
    }

    return result;
  }, [products, filterType, filterCategory, search, sortBy]);

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      store: product.store || 'PasaBUYan',
      image: product.image
    });
  };

  const activeFilterCount = [filterType !== 'all', filterCategory !== 'all', search.trim().length > 0].filter(Boolean).length;

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
          {/* Type pills */}
          <div className="flex bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
            {[
              { value: 'all', label: 'All' },
              { value: 'grocery', label: 'Grocery' },
              { value: 'shops', label: 'Shops' }
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => { setFilterType(opt.value); setFilterCategory('all'); }}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  filterType === opt.value
                    ? 'bg-brandTeal text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

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
              onClick={() => { setSearch(''); setFilterType('all'); setFilterCategory('all'); }}
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
              onClick={() => { setSearch(''); setFilterType('all'); setFilterCategory('all'); }}
              className="mt-5 px-5 py-2.5 bg-brandTeal text-white text-xs font-bold rounded-xl hover:bg-brandTeal/90 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col bg-white rounded-2xl border border-gray-100 hover:border-brandTeal/30 hover:shadow-lg hover:shadow-brandTeal/5 transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
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

                  {/* Type badge */}
                  <span className={`absolute top-2.5 left-2.5 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-sm z-20 ${
                    product.type === 'grocery'
                      ? 'bg-emerald-500/80 text-white'
                      : 'bg-violet-500/80 text-white'
                  }`}>
                    {product.type}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 p-3.5 gap-1.5">
                  <span className="text-[9px] font-black text-brandTeal uppercase tracking-wider">{product.category}</span>
                  <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-brandTeal transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-medium truncate">{product.store || 'PasaBUYan'}</p>

                  {/* Price + Cart */}
                  <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-gray-50">
                    <span className="font-extrabold text-sm text-gray-800">₱{product.price.toLocaleString()}</span>
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
    </div>
  );
}
