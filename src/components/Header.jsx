import Link from 'next/link';
import { ShoppingCart, Search, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-[#FFFFFF] backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Mobile Menu */}
        <button className="md:hidden p-2 -ml-2 text-foreground/70 hover:text-foreground transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <Link href="/" className="block">
          {/* Logo Image Placeholder */}
          <img src="/assets/header_logo.png" alt="header_logo" className='h-12'></img>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-medium text-foreground/80">
          <Link href="/products" className="hover:text-foreground transition-colors">SHOP</Link>
          <Link href="/categories" className="hover:text-foreground transition-colors">CATEGORIES</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">ABOUT</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-foreground/70 hover:text-foreground transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 text-foreground/70 hover:text-foreground transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-black"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
