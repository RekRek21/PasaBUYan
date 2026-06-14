'use client';

import { useApp } from '../../../context/AppContext';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Minus, Plus, Heart, ShieldCheck, Truck, ChevronUp } from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(p => p?.id?.toString() === id);
      if (found) {
        setProduct(found);
      } else {
        // If not found, maybe redirect or show error
      }
    }
  }, [id, products]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-gray-100 border-t-brandTeal rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium">Loading product details...</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        store: product.store || 'S&R Membership Shopping, General Trias Cavite',
        image: product.image
      });
    }

    // Visual feedback
    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 600);
  };

  const displayImg = product.image;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl animate-fade-in">
      {/* Breadcrumb / Back Navigation */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brandTeal mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </Link>

      <div className="bg-white rounded-[2rem] border border-gray-100 p-4 md:p-8 shadow-2xl shadow-gray-100/50">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          {/* Left Column: Image Area */}
          <div className="w-full md:w-1/2 flex-shrink-0">
            <div className="relative aspect-square w-full bg-gray-50 rounded-[1.5rem] overflow-hidden group">
              {/* Subtle background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-brandTeal/5 to-transparent mix-blend-multiply pointer-events-none" />

              {displayImg ? (
                <img
                  src={displayImg}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                  <span className="text-6xl">📦</span>
                  <span className="text-xs font-medium">No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details Area */}
          <div className="w-full md:w-1/2 flex flex-col justify-center py-4">

            {/* Category Pill */}
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-brandTeal/10 text-brandTeal text-[10px] font-black uppercase tracking-widest">
                {product.category}
              </span>
            </div>

            {/* Title & Store */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-tight mb-2 tracking-tight">
              {product.name}
            </h1>
            <p className="text-sm font-medium text-gray-500 mb-6 flex items-center gap-2">
              <span className="text-gray-400">Sold by</span>
              <span className="text-gray-700 font-bold px-2 py-1 bg-gray-50 rounded-lg border border-gray-100">{product.store || 'S&R Membership Shopping, General Trias Cavite'}</span>
            </p>

            {/* Price */}
            <div className="mb-8">
              <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
                ₱{(product.price || 0).toLocaleString()}
              </span>
            </div>

            {/* Actions Area */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 pt-8 border-t border-gray-100">

              {/* Quantity Selector */}
              <div className="flex items-center bg-gray-50 rounded-2xl p-2 border border-gray-100">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl bg-white text-gray-600 flex items-center justify-center hover:text-brandTeal hover:shadow-sm transition-all shadow-gray-200/50"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-extrabold text-gray-800 text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-xl bg-white text-gray-600 flex items-center justify-center hover:text-brandTeal hover:shadow-sm transition-all shadow-gray-200/50"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 rounded-2xl font-extrabold text-sm transition-all ${isAdding
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-[0.98]'
                  : 'bg-brandTeal text-white shadow-xl shadow-brandTeal/20 hover:bg-brandTeal/90 hover:shadow-brandTeal/30 active:scale-[0.98]'
                  }`}
              >
                <ShoppingCart className={`w-5 h-5 ${isAdding ? 'animate-bounce' : ''}`} />
                <span>{isAdding ? 'Added to Cart!' : `Add to Cart — ₱${(product.price * quantity).toLocaleString()}`}</span>
              </button>

              {/* Wishlist Button */}
              <button className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-50">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span className="text-[11px] font-bold text-gray-600">Guaranteed Fresh & Authentic</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-50">
                <Truck className="w-5 h-5 text-blue-500" />
                <span className="text-[11px] font-bold text-gray-600">Fast Local Delivery</span>
              </div>
            </div>

          </div>
        </div>
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
