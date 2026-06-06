import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Truck, Shield, Headphones, ArrowRight, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';
import HeroSection from '../../components/shop/HeroSection';

/* ── Horizontal scroll carousel wrapper ── */
const HScrollRow = ({ children, id }) => {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };
  return (
    <div className="relative group">
      {/* Prev arrow */}
      <button
        onClick={() => scroll(-1)}
        aria-label="Scroll left"
        className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
      >
        <ChevronLeft className="w-4 h-4 text-slate-700" />
      </button>
      {/* Scrollable row */}
      <div
        ref={ref}
        id={id}
        className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-4"
      >
        {children}
      </div>
      {/* Next arrow */}
      <button
        onClick={() => scroll(1)}
        aria-label="Scroll right"
        className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-50"
      >
        <ChevronRight className="w-4 h-4 text-slate-700" />
      </button>
    </div>
  );
};

/* ── Section title with blue underline accent ── */
const SectionTitle = ({ label, title, linkTo, linkText = 'View all' }) => (
  <div className="flex items-end justify-between mb-6 sm:mb-8">
    <div>
      {label && <p className="text-xs font-bold tracking-[0.18em] uppercase text-blue-600 mb-1.5">{label}</p>}
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 relative inline-block">
        {title}
        <span className="absolute -bottom-1.5 left-0 right-0 h-[3px] bg-blue-600 rounded-full" />
      </h2>
    </div>
    {linkTo && (
      <Link to={linkTo} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors flex-shrink-0 ml-4">
        {linkText} <ArrowRight className="w-4 h-4" />
      </Link>
    )}
  </div>
);

/* ── Main Page ── */
const HomePage = () => {
  const { data: featuredProducts, isLoading } = useQuery({
    queryKey: ['homepage-products'],
    queryFn: () => getProducts({ limit: 20 }),
    staleTime: 10 * 60 * 1000,
  });

  const products = featuredProducts?.products || [];

  const brands = [
    { name: 'Apple', iconUrl: 'https://cdn.simpleicons.org/apple', invertDark: true, verified: true },
    { name: 'Nike', iconUrl: 'https://cdn.simpleicons.org/nike', invertDark: true, verified: true },
    { name: 'Samsung', iconUrl: 'https://cdn.simpleicons.org/samsung', invertDark: true, verified: true },
    { name: 'Dior', iconUrl: 'https://cdn.simpleicons.org/dior', invertDark: true, verified: false },
    { name: 'Adidas', iconUrl: 'https://cdn.simpleicons.org/adidas', invertDark: true, verified: true },
    { name: 'Sony', iconUrl: 'https://cdn.simpleicons.org/sony', invertDark: true, verified: true },
    { name: 'Gucci', iconUrl: 'https://cdn.simpleicons.org/gucci', invertDark: true, verified: true },
    { name: 'H&M', iconUrl: 'https://cdn.simpleicons.org/h-and-m', invertDark: true, verified: false },
    { name: 'Zara', iconUrl: 'https://cdn.simpleicons.org/zara', invertDark: true, verified: false },
    { name: 'Microsoft', iconUrl: 'https://cdn.simpleicons.org/microsoft', invertDark: true, verified: true },
    { name: 'LG', iconUrl: 'https://cdn.simpleicons.org/lg', invertDark: true, verified: false },
    { name: 'Huawei', iconUrl: 'https://cdn.simpleicons.org/huawei', invertDark: true, verified: false },
    { name: 'Lenovo', iconUrl: 'https://cdn.simpleicons.org/lenovo', invertDark: true, verified: true },
    { name: 'Panasonic', iconUrl: 'https://cdn.simpleicons.org/panasonic', invertDark: true, verified: false },
    { name: 'Puma', iconUrl: 'https://cdn.simpleicons.org/puma', invertDark: true, verified: true },
  ];

  return (
    <div className="overflow-x-hidden bg-white">
      <Helmet>
        <title>VIBEIT - Shop Fashion, Tech &amp; Home Online in Sri Lanka | Free Delivery</title>
        <meta name="description" content="Shop online at VIBEIT Sri Lanka. Premium fashion, tech gadgets, home essentials & more. Cash on delivery available across Sri Lanka." />
        <meta name="keywords" content="online shopping, fashion, tech gadgets, home accessories, Sri Lanka, VIBEIT" />
        <meta property="og:title" content="VIBEIT - Shop Fashion, Tech & Home Online in Sri Lanka" />
        <meta property="og:description" content="Sri Lanka's modern online store. Fashion, tech gadgets, home essentials & more." />
        <meta property="og:image" content="https://vibeitlk.vercel.app/og-image.jpg" />
        <meta property="og:url" content="https://vibeitlk.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#1c5bdb" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org", "@type": "LocalBusiness", "name": "VIBEIT",
            "image": "https://vibeitlk.vercel.app/logo.png",
            "description": "Online shopping store in Sri Lanka",
            "address": { "@type": "PostalAddress", "addressCountry": "LK", "addressLocality": "Colombo" },
            "telephone": "+94753979659", "email": "vibeit@gmail.com",
            "url": "https://vibeitlk.vercel.app", "priceRange": "$$", "areaServed": "LK"
          })}
        </script>
      </Helmet>

      {/* ── Hero Carousel ── */}
      <HeroSection />

      {/* ── Promo strip ── */}
      <div className="bg-blue-600 text-white py-2.5 overflow-hidden">
        <div className="flex w-max animate-marquee">
          {[...Array(3)].map((_, gi) => (
            <div key={gi} className="flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12 text-xs sm:text-sm font-semibold whitespace-nowrap">
              <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Island-wide Delivery</span>
              <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Quality Guaranteed</span>
              <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Flash Deals Every Day</span>
              <span className="flex items-center gap-2"><Headphones className="w-4 h-4" /> 24/7 Support</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category Grid (asymmetric — simplytek style) ── */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle label="Browse by category" title="Popular Categories" linkTo="/shop" />

          {/* Desktop: 1 tall left + 2×2 right. Mobile: horizontal scroll */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[160px] sm:auto-rows-[180px] gap-3 sm:gap-4">

            {/* Tall card — spans 2 rows on sm+ */}
            <Link to={`/shop?category=${encodeURIComponent("Women's Fashion & Accessories")}`} className="group relative rounded-2xl overflow-hidden row-span-2 col-span-1">
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80" alt="Fashion"
                loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block mb-1">Trending</span>
                <h3 className="text-lg font-bold text-white">Fashion</h3>
                <p className="text-xs text-slate-200 mt-0.5">Clothing & accessories</p>
              </div>
            </Link>

            {/* Wide top card */}
            <Link to={`/shop?category=${encodeURIComponent("Tech Gadgets & Accessories")}`} className="group relative rounded-2xl overflow-hidden col-span-1 sm:col-span-2 lg:col-span-3">
              <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&q=80" alt="Electronics"
                loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider block mb-1">Latest Tech</span>
                <h3 className="text-base sm:text-lg font-bold text-white">Tech Gadgets</h3>
              </div>
            </Link>

            {/* Two smaller cards on the right bottom */}
            <Link to={`/shop?category=${encodeURIComponent("Home, Lifestyle & Appliances")}`} className="group relative rounded-2xl overflow-hidden col-span-1">
              <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" alt="Home & Living"
                loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-sm font-bold text-white">Home & Living</h3>
              </div>
            </Link>

            <Link to={`/shop?category=${encodeURIComponent("Beauty, Health & Personal Care")}`} className="group relative rounded-2xl overflow-hidden col-span-1 sm:col-span-1 lg:col-span-2">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80" alt="Accessories"
                loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-sm font-bold text-white">Beauty & Health</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── New Arrivals (horizontal scroll on mobile) ── */}
      <section className="py-10 sm:py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle label="Just dropped" title="New Arrivals" linkTo="/shop" />
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="bg-slate-200 rounded-xl animate-pulse" style={{ aspectRatio: '3/4' }} />)}
            </div>
          ) : products.length > 0 ? (
            <HScrollRow id="new-arrivals">
              {products.map((p) => (
                <div key={p._id} className="flex-shrink-0 w-44 sm:w-auto">
                  <ProductCard product={p} />
                </div>
              ))}
            </HScrollRow>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-500 font-semibold">No products yet</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Full-width promo banner (simplytek parallax style) ── */}
      <section className="relative overflow-hidden h-48 sm:h-64 lg:h-72">
        <img
          src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1400&q=80"
          alt="Promo"
          className="absolute inset-0 w-full h-full object-cover scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-transparent" />
        <div className="relative h-full flex flex-col justify-center px-8 sm:px-16 lg:px-24 max-w-7xl mx-auto">
          <p className="text-blue-200 text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">Limited offer</p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Up to <span className="text-yellow-400">40% OFF</span><br className="sm:hidden" /> This Week
          </h2>
          <Link to="/shop" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold text-sm px-6 py-2.5 rounded-full hover:bg-blue-50 transition-colors w-fit shadow-lg">
            Shop Deals <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Best Sellers (horizontal scroll on mobile) ── */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle label="Customer favourites" title="Best Sellers" linkTo="/shop" />
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-slate-200 rounded-xl animate-pulse" style={{ aspectRatio: '3/4' }} />)}
            </div>
          ) : products.length > 0 ? (
            <HScrollRow id="best-sellers">
              {products.slice(0, 8).map((p) => (
                <div key={p._id} className="flex-shrink-0 w-44 sm:w-auto">
                  <ProductCard product={p} />
                </div>
              ))}
            </HScrollRow>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-500 font-semibold">No products yet</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Brand logos ── */}
      <section className="py-10 sm:py-14 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Brands" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brands.map((brand, idx) => (
              <Link key={idx} to={`/shop?search=${encodeURIComponent(brand.name)}`}
                style={{ animationDelay: `${idx * 80}ms` }}
                className="brand-card relative bg-white/60 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/40 p-4 sm:p-5 flex flex-col items-center gap-3 group">
                {brand.verified && (
                  <span className="verified-badge" role="img" aria-label="Verified seller" title="Verified seller">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" stroke="#059669" />
                    </svg>
                  </span>
                )}
                <img src={brand.iconUrl} alt={brand.name} width={56} height={56} loading="lazy" decoding="async"
                  className={`w-12 h-12 sm:w-14 sm:h-14 object-contain transition-transform ${brand.invertDark ? 'dark:invert' : ''}`} />
                <span className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-100 text-center">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why VIBEIT ── */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600 mb-3">Why customers return</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why Shop with VIBEIT?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Truck, title: 'Island-wide Delivery', desc: 'Fast, reliable shipping across Sri Lanka' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'Carefully selected authentic products' },
              { icon: Headphones, title: 'Real-time Support', desc: 'Quick help anytime, anywhere' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-8 hover:border-blue-400 hover:shadow-md transition-all flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold mb-2 text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
