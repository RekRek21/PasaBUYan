'use client';

import { useApp } from '../../context/AppContext';
import Link from 'next/link';
import { Package, Clock, Receipt, ChevronRight, ShoppingBag } from 'lucide-react';

export default function OngoingOrdersPage() {
  const { orders } = useApp();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-fade-in min-h-[70vh]">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight flex items-center gap-3">
          <Package className="w-8 h-8 text-brandTeal" />
          Ongoing Orders
        </h1>
        <p className="text-sm text-gray-500 mt-2">Track and manage your active deliveries from pasaBUYan.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-lg shadow-gray-200/20">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">No Ongoing Orders</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
            You don't have any active orders right now. Explore the storefront to find great items!
          </p>
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brandTeal text-white font-bold text-sm rounded-xl hover:bg-brandTeal/90 transition-all shadow-md shadow-brandTeal/20"
          >
            Start Shopping
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const date = new Date(order.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
            const time = new Date(order.date).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg shadow-gray-200/30 hover:border-brandTeal/30 transition-colors group">
                
                {/* Card Header */}
                <div className="bg-gray-50/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-brandTeal flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Order #{order.id}</p>
                      <p className="text-sm font-bold text-gray-700">{date} at {time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1.5 border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Processing
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  
                  {/* Items Summary */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex -space-x-4">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm z-10 relative" style={{ zIndex: 10 - idx }}>
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">📦</div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm z-0 relative">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 line-clamp-1">
                        {order.items[0].name} {order.items.length > 1 && `and ${order.items.length - 1} other items`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.items.reduce((acc, item) => acc + item.quantity, 0)} total items</p>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-medium mb-0.5">Total Amount</p>
                      <p className="text-xl font-black text-brandTeal">₱{order.total.toLocaleString()}</p>
                    </div>
                    <Link 
                      href={`/receipt/${order.id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-brandTeal hover:text-white text-gray-600 text-xs font-bold rounded-xl transition-all border border-gray-100 hover:border-brandTeal"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      View Receipt
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
