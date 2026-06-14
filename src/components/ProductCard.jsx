import Link from 'next/link';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProductCard({ id, name, price, category, imageUrl, image, store }) {
  const { addToCart, isAdmin, deleteCatalogProduct } = useApp();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      name,
      price,
      store: store || 'S&R Membership Shopping, General Trias Cavite',
      image: imageUrl || image
    });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${name}" from the catalog?`)) {
      deleteCatalogProduct(id);
    }
  };

  const displayImg = imageUrl || image;

  return (
    <div className="group flex flex-col gap-3 pb-4 transition-all bg-white rounded-2xl border border-gray-100 hover:border-brandTeal/30 hover:shadow-lg hover:shadow-brandTeal/5 p-3 duration-300 relative">
      {isAdmin && (
        <button
          onClick={handleDelete}
          className="absolute top-5 right-5 z-20 p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all duration-200 border border-red-100 shadow-sm active:scale-95 hover:scale-105"
          title="Delete from Catalog"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
      
      <Link 
        href={`/product/${id}`} 
        className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl mb-1 flex items-center justify-center text-3xl select-none"
      >
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        {displayImg ? (
          <img 
            src={displayImg} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            📦
          </div>
        )}
      </Link>
      
      <div className="flex flex-col gap-1 px-1">
        <div className="text-[10px] font-black text-brandTeal uppercase tracking-wider">{category}</div>
        <Link href={`/product/${id}`} className="hover:text-brandTeal transition-colors">
          <h4 className="font-bold text-xs text-gray-800 line-clamp-1">
            {name}
          </h4>
        </Link>
        <div className="text-[10px] text-gray-400 font-medium truncate mb-1">{store || 'S&R Membership Shopping, General Trias Cavite'}</div>
        <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-50">
          <span className="font-extrabold text-sm text-gray-800">₱{(price || 0).toLocaleString()}</span>
          <button 
            onClick={handleAddToCart}
            className="p-2 rounded-xl bg-brandTeal text-white hover:bg-brandTeal/90 transition-all active:scale-90 shadow-sm"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
