'use client';

import { useApp } from '../../../context/AppContext';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, MapPin, Receipt, ArrowRight, Printer } from 'lucide-react';

export default function ReceiptPage() {
  const { id } = useParams();
  const router = useRouter();
  const { orders } = useApp();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orders.length > 0) {
      const found = orders.find(o => o.id === id);
      if (found) {
        setOrder(found);
      }
    }
  }, [id, orders]);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-16 h-16 border-4 border-gray-100 border-t-brandTeal rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium">Retrieving your receipt...</p>
      </div>
    );
  }

  const orderDate = new Date(order.date).toLocaleString('en-PH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl animate-fade-in relative z-10 print:py-0 print:px-0 print:max-w-none">
      
      {/* Success Header */}
      <div className="text-center mb-8 space-y-3 print:hidden">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">Order Confirmed!</h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Thank you for shopping with pasaBUYan. We're getting your items ready for delivery.
        </p>
      </div>

      {/* The Receipt "Paper" */}
      <div className="bg-white rounded-t-3xl rounded-b-xl shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden print:shadow-none print:border-none print:rounded-none">
        
        {/* Receipt top pattern */}
        <div className="h-3 w-full bg-brandTeal flex print:hidden" style={{ background: 'repeating-linear-gradient(45deg, #0f766e, #0f766e 10px, #115e59 10px, #115e59 20px)' }}></div>

        <div className="p-8 sm:p-10 print:p-0">
          
          <div className="flex items-start justify-between border-b border-dashed border-gray-200 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-brandTeal mb-1">
                <Receipt className="w-5 h-5" />
                <span className="font-black tracking-wider uppercase text-sm">pasaBUYan</span>
              </div>
              <p className="text-xs text-gray-400 font-medium mt-1">Official E-Receipt</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
              <p className="text-sm font-mono font-bold text-gray-800">{order.id}</p>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Date & Time</p>
              <p className="text-sm font-medium text-gray-800">{orderDate}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery Address</p>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brandTeal flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-gray-800 leading-tight">{order.location}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 border-t border-b border-dashed border-gray-200 py-6">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Order Items ({order.items.length})</h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-6 font-bold text-gray-400 text-sm">{item.quantity}x</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{item.name}</p>
                    <p className="text-[10px] text-gray-400">{item.store}</p>
                  </div>
                  <div className="text-sm font-extrabold text-gray-800">
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Subtotal</span>
              <span className="text-gray-800 font-bold">₱{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Delivery Fee</span>
              <span className="text-gray-800 font-bold">₱{(order.deliveryFee || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Service Fee</span>
              <span className="text-gray-800 font-bold">₱{(order.serviceFee || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t-2 border-gray-800">
            <span className="text-base font-black text-gray-800 uppercase tracking-wider">Total</span>
            <span className="text-2xl font-black text-brandTeal">₱{order.total.toLocaleString()}</span>
          </div>

        </div>

        {/* Receipt zig-zag bottom */}
        <div className="h-4 w-full bg-gray-50 print:hidden" style={{ backgroundImage: 'radial-gradient(circle at 10px 0, transparent 10px, white 11px)', backgroundSize: '20px 20px', backgroundRepeat: 'repeat-x', transform: 'rotate(180deg)' }}></div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
        <button 
          onClick={() => window.print()}
          className="flex-1 sm:flex-none px-6 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print Receipt
        </button>
        <Link 
          href="/"
          className="flex-1 sm:flex-none px-8 py-3.5 bg-brandTeal text-white font-extrabold text-sm rounded-xl hover:bg-brandTeal/90 transition-all shadow-lg shadow-brandTeal/20 flex items-center justify-center gap-2 active:scale-95"
        >
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
