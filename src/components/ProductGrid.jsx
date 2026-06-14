'use client';

import Fuse from 'fuse.js';
import { useMemo } from 'react';
import ProductCard from './ProductCard';
import { useApp } from '../context/AppContext';

export default function ProductGrid({ activeCategory, onClearFilter }) {
  const { searchQuery, products, isAdmin, deleteCatalogProduct } = useApp();

  // Fuzzy search using Fuse.js
  const fuse = useMemo(() => new Fuse(products, {
    keys: ['name', 'store', 'category'],
    threshold: 0.35,      // 0 = exact, 1 = match anything
    minMatchCharLength: 2,
    ignoreLocation: true, // search across the whole string, not just the start
  }), [products]);

  // Filter products by selected category and search query
  const filteredProducts = useMemo(() => {
    // 1. Filter by search query if present (fuzzy)
    if (searchQuery) {
      return fuse.search(searchQuery).map(r => r.item);
    }

    // 2. Filter by selected category
    if (activeCategory) {
      return products.filter(p => p.category === activeCategory);
    }

    // 3. Fallback to all products
    return products;
  }, [searchQuery, activeCategory, products, fuse]);

  const isRecommended = !searchQuery && !activeCategory;
  const displayProducts = isRecommended ? filteredProducts.slice(0, 10) : filteredProducts;

  return (
    <section className="py-8 container mx-auto px-4 border-t border-gray-100 mt-6">
      
      {/* Title */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
            {searchQuery 
              ? `Search Results for "${searchQuery}"` 
              : activeCategory 
                ? activeCategory 
                : 'Recommended for You'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {searchQuery 
              ? `Found ${filteredProducts.length} items`
              : `Explore items from our verified stores`}
          </p>
        </div>
        
        {/* Clear filter action */}
        {(activeCategory || searchQuery) && (
          <button 
            onClick={onClearFilter}
            className="text-xs font-bold text-brandTeal hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {displayProducts.map((product, index) => (
          <ProductCard key={product.id || `fallback-${index}`} {...product} />
        ))}
      </div>

      {/* Empty State */}
      {displayProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-50 max-w-md mx-auto my-8">
          <span className="text-4xl">🔍</span>
          <h3 className="text-base font-bold text-gray-700 mt-4">No Products Found</h3>
          <p className="text-xs text-gray-400 mt-1">Try refining your search terms or choosing another category.</p>
        </div>
      )}

    </section>
  );
}
