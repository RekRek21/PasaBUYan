import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tighter mb-4 inline-block">
              pasaBUYan
            </Link>
            <p className="text-secondary text-sm mb-6 max-w-xs">
              Curated minimal essentials for modern living. Designed for simplicity and functionality.
            </p>
            <div className="flex items-center gap-4 text-sm font-medium">
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
              <a href="#" className="hover:text-foreground transition-colors">Facebook</a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-3 text-sm text-secondary">
              <li><Link href="#" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">New Arrivals</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Featured</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-secondary">
              <li><Link href="#" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-secondary mb-4">Subscribe for updates on new collections and exclusive offers.</p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-3 py-2 bg-transparent border border-border rounded-md text-sm focus:outline-none focus:border-foreground transition-colors"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-foreground text-background font-medium text-sm rounded-md hover:bg-foreground/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border text-xs text-secondary">
          <p>&copy; {new Date().getFullYear()} PasaBUYan. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
