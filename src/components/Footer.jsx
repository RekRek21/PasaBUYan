import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-0 mt-16">
      <div className="container mx-auto px-4">

        {/* Top Branding Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 items-start">
          <div className="md:col-span-4">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-black tracking-tighter text-brandTeal">pasa<span className="text-black">BUYan</span></span>
            </Link>
            <h4 className="text-base font-extrabold text-gray-800 mb-2">Your one-stop online delivery companion</h4>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Order groceries, meals, pantry essentials, gadgets, and boutique gifts from PasaBUYan and get them delivered to your doorstep in one hour.
            </p>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Customer Service */}
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Customer Service</h5>
              <div className="space-y-3">
                <a
                  href="mailto:support@pasabuyan.com"
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-brandTeal font-medium transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="truncate">support@pasabuyan.com</span>
                </a>
              </div>
            </div>

            {/* Discover */}
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Discover</h5>
              <ul className="space-y-2.5 text-sm text-gray-600 font-medium">
                <li><Link href="#" className="hover:text-brandTeal transition-colors">Groceries</Link></li>
                <li><Link href="#" className="hover:text-brandTeal transition-colors">Stores</Link></li>
              </ul>
            </div>

            {/* Learn More */}
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Learn More</h5>
              <ul className="space-y-2.5 text-sm text-gray-600 font-medium">
                <li><Link href="#" className="hover:text-brandTeal transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-brandTeal transition-colors">Stories & Blog</Link></li>
                <li><Link href="#" className="hover:text-brandTeal transition-colors">FAQs</Link></li>
                <li><Link href="#" className="hover:text-brandTeal transition-colors">Join the Team</Link></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Follow Us</h5>
              <div className="flex items-center gap-3 mb-6">
                <a href="#" className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-white hover:bg-[#1877F2] transition-all flex items-center justify-center" aria-label="Facebook">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-white hover:bg-[#1DA1F2] transition-all flex items-center justify-center" aria-label="Twitter">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-white hover:bg-[#E1306C] transition-all flex items-center justify-center" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-white hover:bg-[#FF0000] transition-all flex items-center justify-center" aria-label="Youtube">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-gray-100 py-6 mt-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-black transition-colors">Terms & Conditions</Link>
            <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
          </div>
          <div>
            © {new Date().getFullYear()} PASABUYAN. All Rights Reserved
          </div>
        </div>
      </div>

    </footer>
  );
}
