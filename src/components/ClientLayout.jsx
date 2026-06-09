'use client';

import Header from './Header';
import Footer from './Footer';
import SidebarMenu from './SidebarMenu';
import LocationModal from './LocationModal';
import CartDrawer from './CartDrawer';
import { useApp } from '../context/AppContext';

export default function ClientLayout({ children }) {
  const {
    selectedLocation,
    setSelectedLocation,
    cartItems,
    updateCartQuantity,
    removeFromCart,
    sidebarOpen,
    setSidebarOpen,
    cartOpen,
    setCartOpen,
    locationOpen,
    setLocationOpen,
    searchQuery,
    setSearchQuery,
    isAdmin,
    setIsAdmin
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {/* Global Admin Banner */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs font-bold py-2 px-4 flex items-center justify-between shadow-md relative z-[150] animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="animate-pulse">🛡️</span>
            <span>ADMIN ACCESS ENABLED — Catalog operations and item deletions unlocked.</span>
          </div>
          <button
            onClick={() => setIsAdmin(false)}
            className="bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase transition-colors"
          >
            Disable
          </button>
        </div>
      )}

      {/* Global Header */}
      <Header 
        onOpenSidebar={() => setSidebarOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        onOpenLocation={() => setLocationOpen(true)}
        selectedLocation={selectedLocation}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Mobile Drawer Menu */}
      <SidebarMenu 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Location Modal */}
      <LocationModal 
        isOpen={locationOpen}
        onClose={() => setLocationOpen(false)}
        onSelectAddress={setSelectedLocation}
      />

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
