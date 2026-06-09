import { MapPin, X, Navigation } from 'lucide-react';
import { useState } from 'react';

export default function LocationModal({ isOpen, onClose, onSelectAddress }) {
  const [search, setSearch] = useState('');
  
  if (!isOpen) return null;

  const popularLocations = [
    'Manila, Metro Manila, Philippines',
    'Makati, Metro Manila, Philippines',
    'Taguig, Metro Manila, Philippines',
    'Quezon City, Metro Manila, Philippines',
    'Pasig, Metro Manila, Philippines',
    'Cebu City, Cebu, Philippines',
    'Davao City, Davao del Sur, Philippines'
  ];

  const filteredLocations = popularLocations.filter(loc => 
    loc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden mx-4 animate-slide-in-right md:animate-none md:scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Select Location</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search Location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brandTeal focus:bg-white transition-all"
            />
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          <div className="mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Popular Locations</span>
            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto no-scrollbar">
              {filteredLocations.map((loc, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onSelectAddress(loc);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-gray-50 text-gray-700 hover:text-brandTeal text-sm font-medium transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-brandTeal shrink-0" />
                  <span className="truncate">{loc}</span>
                </button>
              ))}
              {filteredLocations.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-400">
                  No locations found matching &quot;{search}&quot;
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
          <button
            onClick={() => {
              onSelectAddress('Manila, Metro Manila, Philippines');
              onClose();
            }}
            className="w-full py-3 bg-brandTeal text-white font-semibold text-sm rounded-xl hover:bg-brandTeal/90 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-brandTeal/10"
          >
            <Navigation className="w-4 h-4" />
            Use Current Location
          </button>
        </div>

      </div>
    </div>
  );
}
