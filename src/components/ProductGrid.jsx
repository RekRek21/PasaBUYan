'use client';

import ProductCard from './ProductCard';
import { useApp } from '../context/AppContext';

export default function ProductGrid({ activeTab, activeCategory, onClearFilter }) {
  const { searchQuery, products, isAdmin, deleteCatalogProduct } = useApp();

  // Filter products by tab, selected category, and search query
  const filteredProducts = products.filter(product => {
    // 1. Filter by search query if present
    if (searchQuery) {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             product.store.toLowerCase().includes(searchQuery.toLowerCase());
    }

    // 2. Filter by selected category (takes priority)
    if (activeCategory) {
      return product.category === activeCategory;
    }

    // 3. Fallback to active tab
    return product.type === activeTab;
  });

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-50 max-w-md mx-auto my-8">
          <span className="text-4xl">🔍</span>
          <h3 className="text-base font-bold text-gray-700 mt-4">No Products Found</h3>
          <p className="text-xs text-gray-400 mt-1">Try refining your search terms or choosing another category.</p>
        </div>
      )}

    </section>
  );
}
