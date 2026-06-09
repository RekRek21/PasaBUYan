import Link from 'next/link';
import { ShoppingCart, Search, Menu, MapPin, ChevronDown, Smartphone } from 'lucide-react';

export default function Header({
  onOpenSidebar,
  onOpenCart,
  onOpenLocation,
  selectedLocation,
  cartCount,
  searchQuery,
  onSearchChange
}) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm transition-all border-b border-gray-100">

      {/* Main Header Row */}
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Left: Mobile Burger and Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 -ml-2 text-gray-700 hover:text-brandTeal hover:bg-gray-50 rounded-xl transition-all"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="block">
            <span className="text-xl font-extrabold tracking-tighter text-brandTeal">pasa<span className="text-black">BUY</span>an</span>
          </Link>
        </div>

        {/* Center-Left: Location Selector (Desktop) */}
        <button
          onClick={onOpenLocation}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 text-gray-700 hover:text-brandTeal transition-all max-w-[200px]"
        >
          <MapPin className="w-4 h-4 text-brandTeal shrink-0" />
          <span className="text-xs font-semibold truncate">
            {selectedLocation || 'Select Address'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        </button>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <input
            type="text"
            placeholder="what do you want?"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brandTeal focus:bg-white transition-all text-gray-700 font-medium"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Button (only visible when search input is hidden) */}
          <button className="sm:hidden p-2 text-gray-700 hover:text-brandTeal hover:bg-gray-50 rounded-xl transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Location Selector Button */}
          <button
            onClick={onOpenLocation}
            className="md:hidden p-2 text-gray-700 hover:text-brandTeal hover:bg-gray-50 rounded-xl transition-colors"
            title={selectedLocation || 'Select Address'}
          >
            <MapPin className="w-5 h-5 text-brandTeal" />
          </button>

          {/* Desktop Account Login */}
          <button
            onClick={() => alert('Log In flow!')}
            className="hidden md:block text-sm font-bold text-gray-700 hover:text-brandTeal transition-colors px-3 py-2 rounded-xl"
          >
            Log in
          </button>

          {/* Shop All Link */}
          <Link
            href="/shop"
            className="hidden md:block text-xs font-bold text-white bg-brandTeal hover:bg-brandTeal/90 px-3.5 py-2 rounded-xl transition-all"
          >
            Shop All
          </Link>

          {/* Cart Icon Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="p-2.5 text-gray-700 hover:text-brandTeal hover:bg-gray-50 rounded-xl relative transition-all active:scale-95"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brandRed text-white text-[10px] font-bold flex items-center justify-center border-2 border-white animate-fade-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>

    </header>
  );
}
