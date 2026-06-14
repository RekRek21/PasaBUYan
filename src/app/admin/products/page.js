'use client';

import { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { ArrowLeft, Search, Trash2, Package, Filter, Grid3X3, List, PlusCircle, ShieldAlert, Edit2, X } from 'lucide-react';
import Link from 'next/link';

export default function AllProductsPage() {
  const { products, isAdmin, setIsAdmin, deleteCatalogProduct, clearAllProducts, updateCatalogProduct } = useApp();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [sortBy, setSortBy] = useState('name-asc');

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);

  // Derive unique categories from the live catalog
  const allCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats).sort();
  }, [products]);

  // Filter + Search + Sort
  const filtered = useMemo(() => {
    let result = [...products];

    // Category filter
    if (filterCategory !== 'all') {
      result = result.filter(p => p.category === filterCategory);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.store?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [products, filterCategory, search, sortBy]);

  const handleDelete = (product) => {
    if (confirm(`Delete "${product.name}" from the catalog?`)) {
      deleteCatalogProduct(product.id);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.price) {
      alert("Name and price are required.");
      return;
    }
    updateCatalogProduct({
      ...editingProduct,
      price: parseFloat(editingProduct.price)
    });
    setEditingProduct(null);
  };

  // Access gate
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full bg-white border border-red-100 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-fade-in">
          <span className="text-5xl">🛡️</span>
          <h2 className="text-xl font-extrabold text-gray-800">Admin Access Restricted</h2>
          <p className="text-xs text-gray-400">
            Enable Admin Mode to view and manage the full product catalog.
          </p>
          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={() => setIsAdmin(true)}
              className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-red-500/10 active:scale-95"
            >
              Enable Admin Mode & Unlock
            </button>
            <Link
              href="/"
              className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-sm rounded-xl transition-all border border-gray-100 block text-center"
            >
              Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl relative">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brandTeal mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">

        {/* ── Header ────────────────────────────────────────── */}
        <div className="p-8 pb-6 border-b border-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brandTeal/5 flex items-center justify-center text-brandTeal">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-gray-800 tracking-tight">All Products</h1>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {products.length} total products in the catalog
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (products.length === 0) {
                    alert('The catalog is already empty.');
                    return;
                  }
                  if (confirm(`Are you sure you want to delete ALL ${products.length} products? This cannot be undone.`)) {
                    clearAllProducts();
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-500 font-bold text-xs rounded-xl hover:bg-red-500 hover:text-white border border-red-100 transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Delete All
              </button>

              <Link
                href="/admin/add-product"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-brandTeal text-white font-bold text-xs rounded-xl hover:bg-brandTeal/90 transition-all shadow-sm active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                Add Product
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <span className="text-lg font-extrabold text-gray-800">{products.length}</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Total Products</p>
            </div>
            <div className="bg-emerald-50/50 rounded-xl p-3 text-center">
              <span className="text-lg font-extrabold text-emerald-600">{allCategories.length}</span>
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-wider mt-0.5">Categories</p>
            </div>
          </div>
        </div>

        {/* ── Toolbar ───────────────────────────────────────── */}
        <div className="px-8 py-4 border-b border-gray-50 flex flex-col md:flex-row md:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, store, or category…"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brandTeal focus:bg-white transition-all text-gray-700 font-medium"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
          </div>

          <div className="flex items-center gap-2 flex-wrap">            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[11px] focus:outline-none focus:border-brandTeal focus:bg-white transition-all text-gray-600 font-bold max-w-[180px]"
            >
              <option value="all">All Categories</option>
              {allCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[11px] focus:outline-none focus:border-brandTeal focus:bg-white transition-all text-gray-600 font-bold"
            >
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="price-asc">Price Low–High</option>
              <option value="price-desc">Price High–Low</option>
            </select>

            {/* View mode toggle */}
            <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden ml-auto">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2.5 transition-colors ${viewMode === 'table' ? 'bg-white text-brandTeal shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                title="Table view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-white text-brandTeal shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                title="Grid view"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────── */}
        <div className="p-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-4xl">📦</span>
              <h3 className="text-sm font-bold text-gray-600 mt-4">No products match your filters</h3>
              <p className="text-[10px] text-gray-400 mt-1">Try adjusting search or filter criteria</p>
            </div>
          ) : viewMode === 'table' ? (
            /* ═══ TABLE VIEW ═══ */
            <div className="border border-gray-100 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider w-10">ID</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Image</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Product Name</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-wider">Store</th>
                      <th className="px-4 py-3 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-3 text-[10px] font-mono text-gray-400">{product.id}</td>
                        <td className="px-4 py-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">📦</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold text-gray-700 group-hover:text-brandTeal transition-colors">{product.name}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-extrabold text-gray-800">₱{product.price.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-bold text-brandTeal bg-brandTeal/5 px-2 py-0.5 rounded-full">{product.category}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-medium text-gray-500">{product.store || '—'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ═══ GRID VIEW ═══ */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-100 rounded-2xl p-3 hover:border-brandTeal/30 hover:shadow-lg hover:shadow-brandTeal/5 transition-all group relative"
                >
                  {/* Actions */}
                  <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="p-1.5 bg-blue-50 hover:bg-blue-500 text-blue-500 hover:text-white rounded-lg transition-all shadow-sm"
                      title="Edit"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="p-1.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Image */}
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">📦</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-gray-700 line-clamp-2 leading-tight group-hover:text-brandTeal transition-colors">{product.name}</h4>
                    <p className="text-[10px] text-gray-400 truncate">{product.store || '—'}</p>
                    <div className="flex items-center justify-between pt-1.5 border-t border-gray-50 mt-1.5">
                      <span className="text-xs font-extrabold text-gray-800">₱{product.price.toLocaleString()}</span>
                      <span className="text-[9px] font-bold text-brandTeal bg-brandTeal/5 px-1.5 py-0.5 rounded-full truncate max-w-[80px]">{product.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Result count footer */}
          {filtered.length > 0 && (
            <p className="text-center text-[10px] text-gray-400 font-medium mt-6">
              Showing {filtered.length} of {products.length} products
            </p>
          )}
        </div>
      </div>

      {/* ── Edit Modal ────────────────────────────────────── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-gray-800">Edit Product</h3>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <form id="edit-product-form" onSubmit={handleEditSubmit} className="space-y-4">
                {/* Image Preview & URL Input */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    {editingProduct.image ? (
                      <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📦</div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-wider">Image URL</label>
                    <input
                      type="url"
                      value={editingProduct.image || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-700 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-wider">Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-700 font-medium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-wider">Price (PHP)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                      min="1"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-700 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-700 font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-wider">Store</label>
                  <input
                    type="text"
                    value={editingProduct.store || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, store: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-700 font-medium"
                  />
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-product-form"
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 active:scale-95 flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
