'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const INITIAL_PRODUCTS = [
  // Grocery
  { id: 101, name: 'S&R Chocolate Chip Cookies', price: 399, category: 'Grocery & Markets', store: 'S&R - Circuit Makati', type: 'grocery', image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/MkKawAwSLfHoB7gNmybaPU_catalog.png' },
  { id: 102, name: 'Landmark Fresh Salmon Fillet (500g)', price: 580, category: 'Fresh Goods', store: 'Landmark - Makati', type: 'grocery', image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/bxj3J4oPCikquNJFoZNZc2_catalog.png' },
  { id: 103, name: 'Robinsons Fresh Red Apples (1kg)', price: 180, category: 'Fresh Goods', store: 'Robinsons Supermarket', type: 'grocery', image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/bxj3J4oPCikquNJFoZNZc2_catalog.png' },
  { id: 104, name: 'The Marketplace Virgin Olive Oil 500ml', price: 420, category: 'Specialty Grocery', store: 'The Marketplace', type: 'grocery', image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/9FDXDojJeAPtwBYHTHLeFR_catalog.png' },
  { id: 105, name: 'Arla Whipping Cream 1L', price: 285, category: 'Grocery & Markets', store: 'Landmark - Makati', type: 'grocery', image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/MkKawAwSLfHoB7gNmybaPU_catalog.png' },
  { id: 106, name: 'San Miguel Pale Pilsen (6-pack)', price: 360, category: 'Alcohol', store: 'S&R - Circuit Makati', type: 'grocery', image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/SkDiTjCCJ2wtg2qHbwqTyy_catalog.png' },
  
  // Shops
  { id: 301, name: 'Minimalist LED Desk Lamp', price: 890, category: 'Home & Kitchen', store: 'Big Box PH', type: 'shops', image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/aEARpYnKd8GmrtkjpKWfge_catalog.png' },
  { id: 302, name: 'Matte Black Fountain Pen', price: 180, category: 'Lifestyle & Variety', store: 'Lifestyle & Variety', type: 'shops', image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/YgigVtPtBQMMUPzhEPaDsu_catalog.png' },
  { id: 303, name: 'Organic Lavender Hand Soap 250ml', price: 250, category: 'Beauty & Personal Care', store: 'Catchy Beauty PH', type: 'shops', image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/agzg4Ds2XLQewN32iZYqNR_catalog.png' },
  { id: 304, name: 'Drypers Wee Wee Dry Large (50pcs)', price: 650, category: 'Pet Care', store: 'Drypers', type: 'shops', image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/aHXmH6ztN3V6gZ9UaLUrNz_catalog.png' },
  { id: 305, name: 'Premium Ceramic Flower Pot', price: 380, category: 'Flowers & Plants', store: 'Flowers & Plants', type: 'shops', image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/goUbhLC6ssGYZiNzisNkUK_catalog.png' },
  { id: 306, name: 'Wireless Bluetooth Earbuds', price: 1250, category: 'Gadgets & Electronics', store: 'Big Box PH', type: 'shops', image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/5QQGM7uQZ2KoMeULY88stP_catalog.png' }
];

export function AppProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState('Manila, Metro Manila, Philippines');
  const [cartItems, setCartItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin & Products Catalog State
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isAdmin, setIsAdmin] = useState(false);

  // Add item to cart helper
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    // Auto-open cart to give positive visual feedback
    setCartOpen(true);
  };

  // Update item quantity in cart
  const updateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Add a product to the catalog
  const addCatalogProduct = (product) => {
    setProducts((prev) => [product, ...prev]);
  };

  // Delete a product from the catalog
  const deleteCatalogProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Update an existing product in the catalog
  const updateCatalogProduct = (updatedProduct) => {
    setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
  };

  // Delete all products from the catalog
  const clearAllProducts = () => {
    setProducts([]);
  };

  return (
    <AppContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        sidebarOpen,
        setSidebarOpen,
        cartOpen,
        setCartOpen,
        locationOpen,
        setLocationOpen,
        searchQuery,
        setSearchQuery,
        products,
        addCatalogProduct,
        updateCatalogProduct,
        deleteCatalogProduct,
        clearAllProducts,
        isAdmin,
        setIsAdmin
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
