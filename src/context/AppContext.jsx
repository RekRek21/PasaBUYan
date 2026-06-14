'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLoadScript } from '@react-google-maps/api';

const AppContext = createContext();

const libraries = ['places'];

export function AppProvider({ children }) {
  const { isLoaded: isGoogleLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [recentLocations, setRecentLocations] = useState([]);
  
  const addRecentLocation = (loc) => {
    setRecentLocations(prev => {
      const filtered = prev.filter(l => l !== loc);
      return [loc, ...filtered].slice(0, 5);
    });
  };
  const [cartItems, setCartItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  
  // Admin & Products Catalog State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Delivery & Service Fee Configuration
  const [distanceKm, setDistanceKm] = useState(0); 
  const [deliveryFee, setDeliveryFee] = useState(100);

  const currentSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const serviceFee = currentSubtotal <= 5000 
    ? currentSubtotal * 0.10 
    : (5000 * 0.10) + ((currentSubtotal - 5000) * 0.05);

  useEffect(() => {
    if (!selectedLocation || !isGoogleLoaded || !window.google) {
      setDistanceKm(0);
      setDeliveryFee(100);
      return;
    }

    const service = new window.google.maps.DistanceMatrixService();
    const origin = "S&R Membership Shopping, General Trias Cavite"; // Default origin

    service.getDistanceMatrix({
      origins: [origin],
      destinations: [selectedLocation],
      travelMode: 'DRIVING',
    }, (response, status) => {
      if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
        const distMeters = response.rows[0].elements[0].distance.value;
        const km = distMeters / 1000;
        setDistanceKm(km);
        setDeliveryFee(km <= 10 ? 100 : 100 + Math.ceil(km - 10) * 5);
      } else {
        console.warn("Distance calculation failed, using fallback.", status);
        setDistanceKm(12.5); // Fallback
        setDeliveryFee(115);
      }
    });
  }, [selectedLocation, isGoogleLoaded]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products with pagination to bypass the 1000 row limit
        let allProductsData = [];
        let from = 0;
        const step = 1000;
        let hasMore = true;

        while (hasMore) {
          const { data, error } = await supabase.from('Products').select('*').range(from, from + step - 1);
          if (error) throw error;
          
          if (data && data.length > 0) {
            allProductsData = [...allProductsData, ...data];
            from += step;
            if (data.length < step) hasMore = false;
          } else {
            hasMore = false;
          }
        }
        
        console.log(`Fetched ${allProductsData.length} products`);
        
        if (allProductsData.length > 0) {
          const mappedProducts = allProductsData.map(p => ({
            id: p.Number,
            name: p.product_name,
            store: p.store_name,
            price: p.price,
            image: p.image,
            category: p.category
          }));
          setProducts(mappedProducts);
        }

        // Fetch orders
        const { data: oData, error: oError } = await supabase.from('Orders').select('*');
        if (oError) throw oError;
        if (oData) {
          const mappedOrders = oData.map(o => {
            let parsedItems = [];
            try {
              parsedItems = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
            } catch (e) {
              parsedItems = [];
            }
            return {
              id: `ORD-${o.id}`,
              items: parsedItems,
              subtotal: o.subtotal,
              deliveryFee: o.service_fee,
              total: o.total,
              location: o.location,
              date: new Date().toISOString() // Fallback since created_at is missing from schema
            };
          });
          // Sort descending by id just in case
          mappedOrders.sort((a, b) => b.id.localeCompare(a.id));
          setOrders(mappedOrders);
        }
      } catch (err) {
        console.error("Error fetching from Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const [isAdmin, setIsAdmin] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ message: '', id: 0 });

  const showToast = (message) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => {
      setToast(prev => prev.id === id ? { message: '', id: 0 } : prev);
    }, 3000);
  };

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
    showToast(`Added to cart: ${item.name}`);
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

  // Checkout function
  const checkout = async () => {
    if (cartItems.length === 0) return null;

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal + deliveryFee + serviceFee;
    const numericOrderId = Date.now();
    const orderIdStr = `ORD-${numericOrderId.toString().slice(-6)}`;

    // Insert to Supabase
    const { error } = await supabase.from('Orders').insert([{
      id: numericOrderId,
      items: JSON.stringify(cartItems),
      subtotal: subtotal,
      service_fee: serviceFee,
      delivery_fee: deliveryFee, // Added delivery_fee if it exists in DB, otherwise we just pack it in total
      total: total,
      location: selectedLocation
    }]);

    if (error) {
      console.error("Checkout failed:", error);
      showToast("Checkout failed. Please try again.");
      return null;
    }

    const newOrder = {
      id: orderIdStr,
      items: [...cartItems],
      subtotal,
      deliveryFee,
      serviceFee,
      total,
      location: selectedLocation,
      date: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setCartOpen(false);
    return orderIdStr;
  };

  // Add a product to the catalog
  const addCatalogProduct = async (product) => {
    const insertData = {
      Number: product.id,
      product_name: product.name,
      store_name: product.store,
      price: product.price,
      image: product.image,
      category: product.category
    };

    const { error } = await supabase.from('Products').insert([insertData]);
    if (!error) {
      setProducts((prev) => [product, ...prev]);
    } else {
      console.error("Error inserting product:", error);
      showToast("Error adding product");
    }
  };

  // Delete a product from the catalog
  const deleteCatalogProduct = async (id) => {
    const { error } = await supabase.from('Products').delete().eq('Number', id);
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      console.error("Error deleting product:", error);
      showToast("Error deleting product");
    }
  };

  // Update an existing product in the catalog
  const updateCatalogProduct = async (updatedProduct) => {
    const updateData = {
      product_name: updatedProduct.name,
      store_name: updatedProduct.store,
      price: updatedProduct.price,
      image: updatedProduct.image,
      category: updatedProduct.category
    };

    const { error } = await supabase.from('Products').update(updateData).eq('Number', updatedProduct.id);
    if (!error) {
      setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
    } else {
      console.error("Error updating product:", error);
      showToast("Error updating product");
    }
  };

  // Delete all products from the catalog
  const clearAllProducts = async () => {
    const { error } = await supabase.from('Products').delete().neq('Number', 0); // deletes everything assuming number != 0
    if (!error) {
      setProducts([]);
    } else {
      console.error("Error clearing products:", error);
      showToast("Error clearing catalog");
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        recentLocations,
        addRecentLocation,
        cartItems,
        addToCart,
        updateCartQuantity,
        toast,
        showToast,
        removeFromCart,
        clearCart,
        checkout,
        orders,
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
        setIsAdmin,
        distanceKm,
        deliveryFee,
        serviceFee,
        isGoogleLoaded,
        selectedCoordinates,
        setSelectedCoordinates
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
