import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-[120] flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>

      {/* Cart Content Panel */}
      <div className="w-full max-w-md bg-white h-screen flex flex-col shadow-2xl animate-slide-in-right">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brandTeal" />
            <span className="text-lg font-bold text-gray-800">
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-300">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-base font-bold text-gray-700">Your Cart is Empty</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-[200px]">Start adding items from grocery, food, or shops to see them here.</p>
              <button 
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-brandTeal text-white text-sm font-semibold rounded-xl hover:bg-brandTeal/90 transition-colors shadow-sm"
              >
                Shop Now
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 rounded-xl border border-gray-100 hover:shadow-sm transition-all bg-white">
                {/* Image */}
                <div className="w-16 h-16 rounded-lg bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center text-xl">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    '📦'
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{item.store || 'PasaBUYan'}</p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold text-brandTeal">₱{item.price.toLocaleString()}</span>
                    
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-700">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50/50 transition-colors self-start"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Subtotal</span>
              <span className="text-xl font-extrabold text-gray-800">₱{subtotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Taxes and delivery fee will be calculated at checkout.</p>
            <button 
              onClick={() => alert('Checkout flow simulated!')}
              className="w-full py-3.5 bg-brandTeal text-white font-bold text-sm rounded-xl hover:bg-brandTeal/90 transition-all active:scale-[0.98] shadow-md shadow-brandTeal/10 text-center block"
            >
              Proceed to Checkout
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
