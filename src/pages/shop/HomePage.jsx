import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import {
  Truck, Shield, Headphones, ArrowRight, Zap, Award, ShoppingBag,
} from 'lucide-react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';
import SectionHeader from '../../components/shop/SectionHeader';
import HeroSection from '../../components/shop/HeroSection';

const HomePage = () => {
  const { data: featuredProducts, isLoading, isError } = useQuery({
    queryKey: ['homepage-products'],
    queryFn: () => getProducts({ limit: 20 }),
    staleTime: 10 * 60 * 1000,
  });

  const brands = [
    { name: 'Apple',   iconUrl: 'https://cdn.simpleicons.org/apple',   invertDark: true },
    { name: 'Nike',    iconUrl: 'https://cdn.simpleicons.org/nike',    invertDark: true },
    { name: 'Samsung', iconUrl: 'https://cdn.simpleicons.org/samsung', invertDark: true },
    { name: 'Dior',    iconUrl: 'https://cdn.simpleicons.org/dior',    invertDark: true },
    { name: 'Adidas',  iconUrl: 'https://cdn.simpleicons.org/adidas',  invertDark: true },
  ];

  // Collection cards with real photos from Unsplash
  const collections = [
    {
      title: 'Tech Paradise',
      description: 'Latest gadgets & electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
      tag: 'Electronics',
      accent: '#2563eb',
    },
    {
      title: 'Fashion Forward',
      description: 'Trendy clothing & accessories',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
      tag: 'Fashion',
      accent: '#0f172a',
    },
    {
      title: 'Home Essentials',
      description: 'Make your space beautiful',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
      tag: 'Home',
      accent: '#0ea5e9',
    },
  ];

  return (
    <div className="overflow-x-hidden bg-white">
      <Helmet>
        <title>VIBEIT - Shop Fashion, Tech &amp; Home Online in Sri Lanka | Free Delivery</title>
        <meta name="description" content="Shop online at VIBEIT Sri Lanka. Premium fashion, tech gadgets, home essentials & more. Cash on delivery available across Sri Lanka. Free gifts on orders above රු5000!" />
        <meta name="keywords" content="online shopping, fashion, tech gadgets, home accessories, Sri Lanka, VIBEIT" />
        <meta property="og:title" content="VIBEIT - Shop Fashion, Tech & Home Online in Sri Lanka" />
        <meta property="og:description" content="Sri Lanka's modern online store. Fashion, tech gadgets, home essentials & more. Free delivery & cash on delivery available." />
        <meta property="og:image" content="https://vibeitlk.vercel.app/og-image.jpg" />
        <meta property="og:url" content="https://vibeitlk.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VIBEIT - Shop Premium Products Online" />
        <meta name="twitter:description" content="Fashion, tech gadgets, home essentials & more. Free delivery & cash on delivery across Sri Lanka." />
        <meta name="theme-color" content="#1c5bdb" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "VIBEIT",
            "image": "https://vibeitlk.vercel.app/logo.png",
            "description": "Online shopping store in Sri Lanka offering fashion, tech gadgets, and home essentials",
            "address": { "@type": "PostalAddress", "addressCountry": "LK", "addressLocality": "Colombo" },
            "telephone": "+94753979659",
            "email": "vibeit@gmail.com",
            "url": "https://vibeitlk.vercel.app",
            "priceRange": "$$",
            "areaServed": "LK"
          })}
        </script>
      </Helmet>

      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Special Collections (photo cards) ── */}
      <section className="py-10 sm:py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600 mb-1">Curated for you</p>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Special Collections</h2>
            </div>
            <Link to="/shop" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 3-column on sm+, single column on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {collections.map((col, idx) => (
              <Link
                key={idx}
                to="/shop"
                className="group relative rounded-2xl overflow-hidden h-56 sm:h-64 lg:h-72 shadow-sm hover:shadow-xl transition-all duration-300 block"
              >
                {/* Photo */}
                <img
                  src={col.image}
                  alt={col.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Tag pill */}
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold text-white bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 rounded-full">
                    {col.tag}
                  </span>
                </div>

                {/* Content at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">{col.title}</h3>
                  <p className="text-xs text-slate-200 mb-3">{col.description}</p>
                  <span className="inline-flex items-center gap-2 bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Shop now <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Marquee ── */}
      <section className="py-8 sm:py-10 overflow-hidden border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
          <SectionHeader title="Official Brand Stores" subtitle="Verified Sellers" linkTo="/shop" />
        </div>
        <div className="relative flex w-full overflow-hidden group py-2">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[...Array(2)].map((_, groupIdx) => (
              <div key={groupIdx} className="flex gap-3 sm:gap-4 pr-3 sm:pr-4 items-center">
                {brands.map((brand, idx) => (
                  <Link
                    key={`${groupIdx}-${idx}`}
                    to={`/shop?search=${encodeURIComponent(brand.name)}`}
                    className="bg-white rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center gap-3 shadow-sm border border-slate-200 hover:border-blue-500 transition-colors w-28 sm:w-36 flex-shrink-0 group"
                  >
                    <div className="w-12 h-12 flex items-center justify-center">
                      <img src={brand.iconUrl} alt={brand.name} width={48} height={48} loading="lazy" decoding="async"
                        className={`max-w-full max-h-full object-contain transition-transform group-hover:scale-110 ${brand.invertDark ? 'dark:invert' : ''}`} />
                    </div>
                    <p className="text-xs font-bold text-slate-700 text-center group-hover:text-blue-600 transition-colors uppercase tracking-wider">{brand.name}</p>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Fresh Arrivals with Premium Finish" subtitle="Featured Collection" linkTo="/shop" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-100 border border-slate-200 rounded-xl animate-pulse" style={{ aspectRatio: '3/4' }} />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-12 border border-slate-200 rounded-xl bg-slate-50">
                <Shield className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-bold">Unable to load products</p>
              </div>
            ) : featuredProducts?.products?.length > 0 ? (
              featuredProducts.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 border border-slate-200 rounded-xl bg-slate-50">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-bold">No products available yet</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Limited Time Deals ── */}
      <section className="py-10 sm:py-14 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-orange-500" />
            <SectionHeader title="Limited Time Deals" subtitle="Special Offers" linkTo="/shop" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 border border-slate-200 rounded-xl animate-pulse" style={{ aspectRatio: '3/4' }} />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-12 border border-slate-200 rounded-xl bg-slate-50">
                <Award className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-bold">Unable to load offers</p>
              </div>
            ) : featuredProducts?.products?.length > 0 ? (
              featuredProducts.products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 border border-slate-200 rounded-xl bg-slate-50">
                <p className="text-slate-600 font-bold">No offers available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Why VIBEIT ── */}
      <section className="py-14 sm:py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600 mb-3">Why customers return</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Why Shop with VIBEIT?</h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Built for speed, safety, and a premium buying experience from the first click to the final delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {[
              { icon: Truck, title: 'Island-wide Delivery', desc: 'Fast, reliable shipping across Sri Lanka' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'Carefully selected authentic products' },
              { icon: Headphones, title: 'Real-time Support', desc: 'Quick help anytime, anywhere' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-slate-900 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold mb-2 uppercase tracking-wider">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
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
