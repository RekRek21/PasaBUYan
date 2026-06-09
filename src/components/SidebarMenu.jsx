import { useState } from 'react';
import { X, ChevronDown, ChevronUp, Sparkles, BookOpen, HelpCircle, Mail, Briefcase, Info, ShieldAlert, Plus, Trash2, RefreshCw, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';

export default function SidebarMenu({ isOpen, onClose }) {
  const [expandedSection, setExpandedSection] = useState(null);
  const { isAdmin, setIsAdmin, addCatalogProduct, clearCart } = useApp();

  if (!isOpen) return null;

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const menuCategories = {
    groceries: {
      title: 'Groceries',
      items: [
        { name: 'Grocery & Markets', desc: 'Supermarket, Christmas Baskets' },
        { name: 'Specialty Grocery', desc: 'Gourmet items' },
        { name: 'Alcohol', desc: 'Wines & liquors' },
        { name: 'Int\'l Selections', desc: 'Korean, Japanese grocers' },
        { name: 'Fresh Goods', desc: 'Fruits & veggies' },
        { name: 'Meat & Deli', desc: 'Meats & seafood' }
      ]
    },
    shops: {
      title: 'Shops & Lifestyle',
      items: [
        { name: 'Gadgets & Electronics', desc: 'Accessories' },
        { name: 'Hardware', desc: 'Home improvement' },
        { name: 'Pet Care', desc: 'Pet foods & toys' },
        { name: 'Beauty & Personal Care', desc: 'Skincare' },
        { name: 'Clothing & Apparel', desc: 'Fashion essentials' },
        { name: 'Home & Kitchen', desc: 'Appliances & decor' }
      ]
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex justify-start bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>

      {/* Drawer panel */}
      <div className="w-full max-w-xs bg-white h-screen flex flex-col shadow-2xl animate-slide-in-left">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold tracking-tighter text-brandTeal">pasa<span className="text-black">BUY</span>an</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable menu content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 no-scrollbar">
          
          {/* User Account / Log In */}
          <div className="bg-gray-50 rounded-2xl p-4 text-center">
            <h4 className="text-sm font-bold text-gray-800 mb-1">My Account</h4>
            <p className="text-xs text-gray-400 mb-4">Log in to track orders and save addresses</p>
            <button 
              onClick={() => alert('Log In flow!')}
              className="w-full py-2.5 bg-brandTeal text-white font-semibold text-sm rounded-xl hover:bg-brandTeal/90 transition-colors"
            >
              Log In
            </button>
          </div>

          {/* Shop All Products Link */}
          <Link
            href="/shop"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 bg-brandTeal/5 hover:bg-brandTeal text-brandTeal hover:text-white font-bold text-sm rounded-2xl border border-brandTeal/20 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            Shop All Products
          </Link>

          {/* Admin Operations Section (Temp) */}
          <div className="border border-red-100 bg-red-50/10 rounded-2xl p-4">
            <button
              onClick={() => toggleSection('admin')}
              className="w-full flex items-center justify-between font-bold text-xs text-red-600 hover:text-red-700 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Operations (Temp)</span>
              </div>
              {expandedSection === 'admin' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedSection === 'admin' && (
              <div className="mt-4 space-y-3 pt-3 border-t border-red-100/30">
                {/* Admin Mode Toggle */}
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-red-100/20">
                  <span className="text-xs font-semibold text-gray-700">Admin Mode</span>
                  <button
                    onClick={() => setIsAdmin(!isAdmin)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isAdmin 
                        ? 'bg-red-500 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {isAdmin ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                {/* Operations */}
                <div className="space-y-2">
                  <Link
                    href="/admin/add-product"
                    onClick={onClose}
                    className="w-full py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Open Add Product Page</span>
                  </Link>

                  <Link
                    href="/admin/products"
                    onClick={onClose}
                    className="w-full py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors text-center cursor-pointer"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>View All Products</span>
                  </Link>

                  <button
                    onClick={() => {
                      const newProd = {
                        id: Date.now(),
                        name: '✨ Premium Gold Caviar (50g)',
                        price: 4500,
                        category: 'Specialty Grocery',
                        store: 'The Marketplace',
                        type: 'grocery',
                        image: 'https://media.pickaroo.com/media/thumb/merchant_categories/2022/7/29/9FDXDojJeAPtwBYHTHLeFR_catalog.png'
                      };
                      addCatalogProduct(newProd);
                      alert('Added "Premium Gold Caviar" to the catalog! Scroll down to see it.');
                    }}
                    className="w-full py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Add Mock Product</span>
                  </button>

                  <button
                    onClick={() => {
                      clearCart();
                      alert('Cart cleared successfully.');
                    }}
                    className="w-full py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Active Cart</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAdmin(false);
                      alert('Admin settings reset.');
                    }}
                    className="w-full py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Settings</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <hr className="border-gray-100" />

          {/* Browse Categories */}
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-3">Browse Categories</span>
            <div className="space-y-2">
              {Object.entries(menuCategories).map(([key, section]) => {
                const isExpanded = expandedSection === key;
                return (
                  <div key={key} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(key)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-left transition-colors ${
                        isExpanded ? 'bg-gray-50/50 text-brandTeal' : 'text-gray-700 hover:bg-gray-50/50'
                      }`}
                    >
                      <span>{section.title}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {isExpanded && (
                      <div className="bg-gray-50/30 px-4 py-2 border-t border-gray-50 divide-y divide-gray-100">
                        {section.items.map((item, idx) => (
                          <div key={idx} className="py-2 hover:text-brandTeal cursor-pointer" onClick={() => {
                            alert(`Navigate to ${item.name}`);
                            onClose();
                          }}>
                            <p className="text-xs font-semibold text-gray-700 hover:text-brandTeal">{item.name}</p>
                            {item.desc && <p className="text-[10px] text-gray-400 mt-0.5">{item.desc}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Information Links */}
          <div className="space-y-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Information</span>
            
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-brandTeal font-medium transition-colors">
                <Info className="w-4 h-4 text-gray-400" />
                <span>About Us</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-brandTeal font-medium transition-colors">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span>Stories</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-brandTeal font-medium transition-colors">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span>FAQs</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-brandTeal font-medium transition-colors">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>Contact Us</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-brandTeal font-medium transition-colors">
                <Briefcase className="w-4 h-4 text-gray-400" />
                <span>Join Us</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-6 border-t border-gray-100 text-center bg-gray-50 text-[10px] text-gray-400">
          pasaBUYan Delivery v1.0.0
        </div>

      </div>
    </div>
  );
}
