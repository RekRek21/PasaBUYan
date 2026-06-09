import { useState } from 'react';
import { Store, Star, Clock } from 'lucide-react';

export default function CategoriesTabs({ onSelectCategory, onSelectBrand }) {
  const [activeTab, setActiveTab] = useState('grocery');

  const tabData = [
    { id: 'grocery', label: 'Stores', icon: Store },
  ];

  const trendingStores = [
    {
      name: 'S&R - Circuit Makati',
      image: 'https://media.pickaroo.com/media/thumb/merchant_logos/2020/11/13/9QVAtk6tkskQ2X2i5aHyEk_size_400.jpg',
      rating: 4.8,
      deliveryTime: '45-60 mins',
      tag: 'Supermarket'
    },
    {
      name: 'Landmark - Makati',
      image: 'https://media.pickaroo.com/media/thumb/merchant_logos/2021/6/2/GArJEpZokwYeC3Em67JqAA_size_400.jpg',
      rating: 4.7,
      deliveryTime: '45-60 mins',
      tag: 'Supermarket'
    },
    {
      name: 'Robinsons Supermarket',
      image: 'https://media.pickaroo.com/media/thumb/merchant_logos/2020/11/19/fyLtWDN5YCo5bK5a7TJG5T_size_400.jpg',
      rating: 4.6,
      deliveryTime: '45-60 mins',
      tag: 'Supermarket'
    },
    {
      name: 'The Marketplace',
      image: 'https://media.pickaroo.com/media/thumb/merchant_logos/2021/9/6/jZr24Lq4QesPrDcVy6D8F6_size_400.jpg',
      rating: 4.9,
      deliveryTime: '30-45 mins',
      tag: 'Premium Grocery'
    },
    {
      name: 'Shopwise - Sta. Rosa',
      image: 'https://media.pickaroo.com/media/thumb/merchant_logos/2022/6/3/MNcCisbfkpBM6Jd7kcA3Br_size_400.jpg',
      rating: 4.5,
      deliveryTime: '60-75 mins',
      tag: 'Supermarket'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Category Tabs Header */}
      <div className="flex justify-center border-b border-gray-100 mb-8 max-w-lg mx-auto">
        {tabData.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold border-b-2 transition-all duration-300 relative ${isActive
                ? 'border-brandTeal text-brandTeal scale-[1.03]'
                : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brandTeal animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>

      {/* Stores Grid Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 animate-fade-in">
        {trendingStores.map((store, idx) => (
          <div
            key={idx}
            onClick={() => onSelectBrand && onSelectBrand(store.name, 'grocery')}
            className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-gray-100 hover:border-brandTeal/30 hover:shadow-lg hover:shadow-brandTeal/5 bg-white cursor-pointer transition-all duration-300 group hover:-translate-y-0.5"
          >
            {/* Store Logo */}
            <div className="w-12 h-12 rounded-xl border border-gray-50 bg-gray-50 flex-shrink-0 overflow-hidden transition-transform group-hover:scale-105">
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'; // hide if broken
                }}
              />
            </div>

            {/* Store Text */}
            <div className="min-w-0 flex-1">
              <span className="text-[8px] font-black text-brandTeal bg-brandTeal/5 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                {store.tag}
              </span>
              <h3 className="text-xs font-bold text-gray-800 leading-tight group-hover:text-brandTeal transition-colors truncate mt-1">
                {store.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-[9px] font-bold text-gray-400">
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{store.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{store.deliveryTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
