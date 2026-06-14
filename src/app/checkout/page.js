'use client';

import { useApp } from '../../context/AppContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Loader2, CreditCard, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, selectedLocation, checkout, setLocationOpen, deliveryFee, serviceFee } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If cart is empty, redirect to shop
  useEffect(() => {
    if (cartItems.length === 0 && !isProcessing && !isSuccess) {
      router.push('/shop');
    }
  }, [cartItems, router, isProcessing, isSuccess]);

  if (cartItems.length === 0) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee + serviceFee;

  const handlePlaceOrder = async () => {
    if (!selectedLocation || selectedLocation.trim() === '') {
      alert("Please select a delivery location before placing your order.");
      setLocationOpen(true);
      return;
    }

    setIsProcessing(true);
    
    // Simulate a slight delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const orderId = await checkout();
    
    if (orderId) {
      setIsSuccess(true);
      router.push(`/receipt/${orderId}`);
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl animate-fade-in">
      
      {/* Header */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-brandTeal mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shopping</span>
      </Link>
      
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight mb-8 flex items-center gap-3">
        <CreditCard className="w-8 h-8 text-brandTeal" />
        Order Confirmation
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Review details */}
        <div className="flex-1 space-y-6">
          
          {/* Delivery Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brandTeal" />
              Delivery Address
            </h2>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              {selectedLocation ? (
                <p className="text-sm font-medium text-gray-700 leading-relaxed">{selectedLocation}</p>
              ) : (
                <div className="flex flex-col items-start gap-2">
                  <p className="text-sm font-bold text-red-500 flex items-center gap-2">
                    <span>⚠️</span> No delivery location selected
                  </p>
                  <button 
                    onClick={() => setLocationOpen(true)}
                    className="text-xs font-bold text-brandTeal hover:underline"
                  >
                    Set Location Now
                  </button>
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-2 italic">* Delivery address can be updated in the header menu</p>
            </div>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brandTeal" />
              Order Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
            
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-16 h-16 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 text-xl">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : '📦'}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.store}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs font-bold text-gray-500">Qty: {item.quantity}</span>
                      <span className="text-sm font-bold text-gray-800">₱{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg shadow-gray-200/50 sticky top-24">
            <h2 className="text-lg font-bold text-gray-800 mb-6">Payment Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="text-gray-800 font-bold">₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Delivery Fee</span>
                <span className="text-gray-800 font-bold">₱{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Service Fee</span>
                <span className="text-gray-800 font-bold">₱{serviceFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4 border-t border-b border-gray-100 mb-6">
              <span className="text-base font-black text-gray-800 uppercase tracking-wider">Total</span>
              <span className="text-2xl font-black text-brandTeal">₱{total.toLocaleString()}</span>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing || !selectedLocation}
              className={`w-full flex items-center justify-center py-4 text-white font-extrabold text-sm rounded-xl transition-all active:scale-[0.98] shadow-md ${!selectedLocation ? 'bg-gray-300 shadow-none cursor-not-allowed' : 'bg-brandTeal hover:bg-brandTeal/90 shadow-brandTeal/20 disabled:opacity-75 disabled:active:scale-100'}`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing Order...
                </>
              ) : (
                'Confirm & Place Order'
              )}
            </button>
            
            <p className="text-[10px] text-gray-400 text-center mt-4">
              By placing your order, you agree to pasaBUYan's Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
