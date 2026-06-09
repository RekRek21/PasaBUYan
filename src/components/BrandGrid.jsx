import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BrandGrid({ onSelectBrand }) {
  const newScrollRef = useRef(null);

  const newBrands = [
    {
      name: 'Big Scoop',
      desc: 'Leading ice cream supplier in Metro Manila, specializing in delicious food service scoops.',
      image: 'https://media.pickaroo.com/media/thumb/merchant_logos/2026/2/16/krGzuQWdo26efxYaxTPNVZ_catalog.jpg'
    },
    {
      name: 'Drypers',
      desc: 'Trusted premium diaper brand keeping your baby dry and comfortable all day.',
      image: 'https://media.pickaroo.com/media/thumb/merchant_logos/2025/10/23/a5gdni77tvKkwNmRwjuCSg_catalog.jpg'
    },
    {
      name: 'Big Box PH',
      desc: 'Wholesale household goods and organizer boxes for smart minimal home space.',
      image: 'https://media.pickaroo.com/media/thumb/merchant_logos/2025/10/23/2sq3wY6rN8yYASyUbRY2K2_catalog.jpg'
    },
    {
      name: 'Catchy Beauty PH',
      desc: 'Handpicked cosmetics, Korean beauty products and trending skincare brands.',
      image: 'https://media.pickaroo.com/media/thumb/merchant_logos/2025/10/22/SztyjRkbVAS7yug9oziypc_catalog.jpg'
    },
    {
      name: 'Summer Vibes Cafe',
      desc: 'Escpresso drinks, cold brew, tropical fresh mocktails, and pica-pica platters.',
      image: 'https://media.pickaroo.com/media/thumb/merchant_logos/2022/7/21/LngXfEJameTsY5WnsmPdw5_catalog.jpg'
    }
  ];

  const scroll = (ref, direction) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.7 
        : scrollLeft + clientWidth * 0.7;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      
      {/* Section: New Brands */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">New Brands</h2>
            <p className="text-xs text-gray-400 mt-1">Discover recently launched merchants and shops on our portal</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => scroll(newScrollRef, 'left')}
              className="p-2 border border-gray-100 hover:border-brandTeal bg-white text-gray-600 hover:text-brandTeal rounded-xl shadow-sm transition-all active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scroll(newScrollRef, 'right')}
              className="p-2 border border-gray-100 hover:border-brandTeal bg-white text-gray-600 hover:text-brandTeal rounded-xl shadow-sm transition-all active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div 
          ref={newScrollRef}
          className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-3"
        >
          {newBrands.map((brand, idx) => (
            <div 
              key={idx}
              onClick={() => onSelectBrand(brand.name, 'shops')}
              className="flex-shrink-0 w-[75vw] sm:w-[55vw] md:w-[38vw] lg:w-[26vw] bg-white rounded-2xl border border-gray-100 hover:border-brandTeal/30 hover:shadow-lg hover:shadow-brandTeal/5 cursor-pointer transition-all duration-300 snap-start p-4 flex gap-4 items-start group"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-50 flex-shrink-0 bg-gray-50">
                <img src={brand.image} alt={brand.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-800 truncate group-hover:text-brandTeal transition-colors">
                  {brand.name}
                </h3>
                <p className="text-[10px] text-gray-400 font-medium line-clamp-3 mt-1 leading-normal">
                  {brand.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
