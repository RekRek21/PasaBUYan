import { CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-[320px] md:h-[400px] overflow-hidden flex items-center bg-gray-50 border-b border-gray-100">

      {/* Background Banner Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 hover:scale-[1.04]"
        style={{
          backgroundImage: `url('/assets/index_img.png')`,
        }}
      >
        {/* Soft overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700/55 via-gray-100/20 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 md:px-8 relative z-10 text-white">
        <div className="max-w-xl animate-fade-in flex flex-col">
          <div className="mt-0 z-10 relative space-y-6">
            <p className="text-l md:text-2xl text-[#F8F9FA] drop-shadow-md text-left flex items-center gap-4">
              <CheckCircle2 className="w-7 h-7 md:w-9 md:h-9 text-brandTeal bg-white rounded-full shrink-0 shadow-sm" />
              Select your preferred supermarket
            </p>
            <p className="text-l md:text-2xl text-[#F8F9FA] drop-shadow-md text-left flex items-center gap-4">
              <CheckCircle2 className="w-7 h-7 md:w-9 md:h-9 text-brandTeal bg-white rounded-full shrink-0 shadow-sm" />
              Add-to-Cart your grocery needs
            </p>
            <p className="text-l md:text-2xl text-[#F8F9FA] drop-shadow-md text-left flex items-center gap-4">
              <CheckCircle2 className="w-7 h-7 md:w-9 md:h-9 text-brandTeal bg-white rounded-full shrink-0 shadow-sm" />
              <span>Delivered straight to your door by pasaBUYan</span>
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}
