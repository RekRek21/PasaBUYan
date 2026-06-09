import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PromoCarousel() {
  const scrollRef = useRef(null);

  const mainPromotions = [
    {
      id: 1,
      title: 'Back to School Made Simple',
      image: 'https://media.pickaroo.com/media/thumb/banners-hero/2026/6/5/oSJ2FuQBRjFYFHau7eQpRS_size_900x450.jpg',
      link: '#'
    },
    {
      id: 2,
      title: 'Bring Home a Filipino Feast',
      image: 'https://media.pickaroo.com/media/thumb/banners-hero/2026/6/5/Ze2pUp4wAaCfVj7wUyaVRM_size_900x450.jpg',
      link: '#'
    }
  ];

  const quickDeals = [
    { name: 'All-time Faves', image: 'https://media.pickaroo.com/media/thumb/promotion_banner/2026/5/18/H5N4fPJNsdnybfVQskjmth_size_800.jpg' },
    { name: 'Wholesome Eats', image: 'https://media.pickaroo.com/media/thumb/promotion_banner/2026/5/18/Pt3wZ2YieZTbyQKmpZfEr6_size_800.jpg' },
    { name: 'Meaty Goodness', image: 'https://media.pickaroo.com/media/thumb/promotion_banner/2026/5/18/K8hwHYRyTKymS8bN5e2YZs_size_800.jpg' },
    { name: 'Sweet Indulgence', image: 'https://media.pickaroo.com/media/thumb/promotion_banner/2026/5/18/LGiRhwq37Qb3g5BjKtjYdb_size_800.jpg' },
    { name: 'Thirst Quenchers', image: 'https://media.pickaroo.com/media/thumb/promotion_banner/2026/5/18/eiy3efRg6HQHHgKQ9cyhKJ_size_800.jpg' },
    { name: 'Satisfy Cravings', image: 'https://media.pickaroo.com/media/thumb/promotion_banner/2026/5/14/gGEN4xL2j9rbJkqbKtMKMS_size_800.jpg' }
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.7 
        : scrollLeft + clientWidth * 0.7;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="container mx-auto px-4 py-8">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">News & Promotions</h2>
        
        {/* Carousel controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 border border-gray-100 hover:border-brandTeal bg-white text-gray-600 hover:text-brandTeal rounded-xl shadow-sm transition-all active:scale-95"
            aria-label="Previous promo"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 border border-gray-100 hover:border-brandTeal bg-white text-gray-600 hover:text-brandTeal rounded-xl shadow-sm transition-all active:scale-95"
            aria-label="Next promo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Promo Banners Slider */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory mb-8 pb-2"
      >
        {mainPromotions.map((promo) => (
          <a 
            key={promo.id}
            href={promo.link}
            onClick={(e) => e.preventDefault()}
            className="flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] aspect-[2/1] rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 snap-start relative group"
          >
            <img 
              src={promo.image} 
              alt={promo.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Visual focus overlay */}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </a>
        ))}
      </div>

      {/* Circular Mini Badges Deals */}
      <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 border-t border-b border-gray-50">
        {quickDeals.map((deal, idx) => (
          <a
            key={idx}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert(`View deal: ${deal.name}`);
            }}
            className="flex-shrink-0 flex flex-col items-center gap-2 group text-center"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group-hover:border-brandTeal group-hover:shadow-md transition-all duration-300">
              <img 
                src={deal.image} 
                alt={deal.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
              />
            </div>
            <span className="text-[10px] font-bold text-gray-700 group-hover:text-brandTeal transition-colors">
              {deal.name}
            </span>
          </a>
        ))}
      </div>

    </section>
  );
}
