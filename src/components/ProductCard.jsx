import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ id, name, price, category, imageUrl }) {
  return (
    <div className="group flex flex-col gap-3 pb-4 transition-all">
      <Link href={`/product/${id}`} className="relative aspect-square overflow-hidden bg-gray-100 rounded-lg mb-2">
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
        {imageUrl ? (
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </Link>
      
      <div className="flex flex-col gap-1 px-1">
        <div className="text-xs text-secondary uppercase tracking-wider">{category}</div>
        <Link href={`/product/${id}`} className="font-medium text-foreground hover:underline underline-offset-4 decoration-border">
          {name}
        </Link>
        <div className="flex items-center justify-between mt-1">
          <span className="font-medium">${price.toFixed(2)}</span>
          <button 
            className="p-1.5 rounded-full bg-background border border-border text-foreground hover:bg-foreground hover:text-background transition-colors active:scale-90"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
