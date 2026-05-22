import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center justify-center text-center bg-[#ffffff]">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-background to-background"></div>

      <img
        src="/assets/index_img.png"
        alt="Index Image"
        className="w-full h-auto top-0 mb-10 object-cover"
      />

      <div className="flex flex-col sm:flex-row items-center gap-4 px-4 pb-20 md:pb-32">
        <Link
          href="/products"
          className="h-12 px-8 flex items-center justify-center bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-all active:scale-95"
        >
          Shop Collection
        </Link>
        <Link
          href="/about"
          className="h-12 px-8 flex items-center justify-center bg-transparent border border-border text-foreground rounded-md font-medium hover:bg-gray-50 transition-all active:scale-95"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
}
