export default function Hero() {
  return (
    <section className="relative w-full h-[320px] md:h-[400px] overflow-hidden flex items-center bg-gray-50 border-b border-gray-100">
      
      {/* Background Banner Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 hover:scale-[1.01]"
        style={{ 
          backgroundImage: `url('https://media.pickaroo.com/media/web-banner-desktop-image/2026/5/14/HGWKjd3EzfzzXxvetxif6G.jpg')`,
        }}
      >
        {/* Soft overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 text-white">
        <div className="max-w-xl space-y-4 animate-fade-in">
          
          <span className="inline-block bg-black text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
            ⚡ On-Demand Delivery
          </span>

          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-sm text-left">
            pick all the best groceries<br/>in one click
          </h1>

          <p className="text-base md:text-lg font-semibold text-gray-100 drop-shadow-sm text-left flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            delivered to your doorstep in 1 hour
          </p>

        </div>
      </div>

    </section>
  );
}
