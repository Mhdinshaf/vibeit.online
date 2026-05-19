import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import {
  Truck,
  Shield,
  Headphones,
  ArrowRight,
  Gift,
  Zap,
  Award,
  ShoppingBag,
  Shirt,
  Watch,
  Home,
  Sparkles,
  ShoppingCart,
  Package,
  Star,
  Laptop,
  Flame,
  Clock,
  Briefcase,
  Droplets
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';
import SectionHeader from '../../components/shop/SectionHeader';
import StarRating from '../../components/shop/StarRating';

const HomePage = () => {
  const { data: featuredProducts, isLoading, isError } = useQuery({
    queryKey: ['homepage-products'],
    queryFn: () => getProducts({ limit: 20 }),
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    {
      url: '/hero_fashion.png',
      alt: 'Premium fashion experience',
    },
    {
      url: '/hero_tech.png',
      alt: 'Tech gadgets and devices',
    },
    {
      url: '/hero_home.png',
      alt: 'Luxury home accessories',
    },
    {
      url: '/hero_luxury.png',
      alt: 'Premium watches and perfumes',
    },
  ];

  const categories = [
    { name: 'Tech Gadgets', icon: Laptop, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'Ladies Dresses', icon: Shirt, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'Gents Clothing', icon: Briefcase, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'Home Accessories', icon: Home, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'Watches', icon: Watch, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'Trending Items', icon: Flame, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'Creams and Skincare', icon: Droplets, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'Toys', icon: Gift, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  ];

  const promotionalBanners = [
    {
      title: 'Tech Paradise',
      description: 'Latest gadgets & electronics',
      icon: Laptop,
      bgGradient: 'bg-blue-600',
      textColor: 'text-white'
    },
    {
      title: 'Fashion Forward',
      description: 'Trendy clothing & accessories',
      icon: Shirt,
      bgGradient: 'bg-slate-900',
      textColor: 'text-white'
    },
    {
      title: 'Home Essentials',
      description: 'Make your space beautiful',
      icon: Home,
      bgGradient: 'bg-blue-50',
      textColor: 'text-slate-900'
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-x-hidden bg-white">
      <Helmet>
        <title>VIBEIT - Shop Fashion, Tech & Home Online in Sri Lanka | Free Delivery</title>
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
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "LK",
              "addressLocality": "Colombo"
            },
            "telephone": "+94753979659",
            "email": "vibeit@gmail.com",
            "url": "https://vibeitlk.vercel.app",
            "priceRange": "$$",
            "areaServed": "LK"
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="absolute -top-24 right-[-10%] h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-[-10%] h-72 w-72 rounded-full bg-slate-200/60 blur-3xl" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 text-blue-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
                <Sparkles className="w-4 h-4" />
                Premium Marketplace
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
                Discover modern shopping made effortless in Sri Lanka.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                Curated fashion, tech, and home essentials with reliable delivery, secure payments, and real-time support. Shop with confidence and style.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-bold uppercase tracking-wider shadow-sm transition-all"
                >
                  Start Shopping
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop?category=Trending%20Items"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white hover:border-blue-500 text-slate-700 px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all"
                >
                  View Hot Deals
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: '48h delivery', sub: 'Island-wide' },
                  { icon: Shield, label: 'Secure checkout', sub: 'COD + cards' },
                  { icon: Headphones, label: '24/7 support', sub: 'Live help' },
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.label} className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 flex items-center gap-3 shadow-sm">
                      <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500 font-semibold">{item.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  4.9/5 customer ratings
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  10K+ verified deliveries
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white">
                <div className="relative aspect-[16/10] sm:aspect-[21/9] lg:h-[420px] overflow-hidden">
                  {heroImages.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={image.alt}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 hidden sm:flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-slate-700 shadow-md backdrop-blur">
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                    24-hour dispatch
                  </div>
                  <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-slate-700 shadow-md backdrop-blur">
                    <ShoppingBag className="w-4 h-4 text-blue-600" />
                    Premium quality picks
                  </div>
                </div>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-white w-10 shadow-sm'
                          : 'bg-white/60 hover:bg-white w-2.5'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-6 sm:py-8 lg:py-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Explore Popular Categories" subtitle="Shop by Category" linkTo="/shop" />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/shop?category=${encodeURIComponent(category.name)}`}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-4 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center border border-slate-200 transition-all duration-300 ${category.color} group-hover:border-blue-500 group-hover:shadow-sm`}>
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 text-center group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Today's Best Deals Section */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <SectionHeader title="Today's Best Deals For You!" subtitle="Limited Time" linkTo="/shop" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-100 border border-slate-200 rounded-xl animate-pulse"
                  style={{ aspectRatio: '3/4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-8 border border-slate-200 rounded-xl bg-slate-50">
                <Shield className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 text-sm font-bold">Unable to load deals</p>
              </div>
            ) : featuredProducts?.products && featuredProducts.products.length > 0 ? (
              featuredProducts.products.slice(0, 5).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 border border-slate-200 rounded-md bg-slate-50">
                <p className="text-slate-600 text-sm font-bold">No deals available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Promotional Banners Section */}
      <section className="py-8 sm:py-10 lg:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 uppercase tracking-wider">Special Collections</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {promotionalBanners.map((banner, idx) => {
              const IconComponent = banner.icon;
              return (
                <Link
                  key={idx}
                  to={`/shop`}
                  className={`${banner.bgGradient} rounded-2xl h-44 sm:h-52 flex items-end p-5 sm:p-6 group overflow-hidden relative shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200`}
                >
                  <div className={`absolute -top-6 -right-6 opacity-15 group-hover:opacity-25 transition-opacity ${banner.textColor}`}>
                    <IconComponent className="w-24 h-24 sm:w-28 sm:h-28" />
                  </div>
                  <div className="relative z-10">
                    <h4 className={`text-sm sm:text-base font-bold mb-1 ${banner.textColor}`}>{banner.title}</h4>
                    <p className={`text-xs sm:text-sm font-medium mb-4 ${banner.textColor === 'text-white' ? 'text-slate-200' : 'text-slate-600'}`}>{banner.description}</p>
                    <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full ${banner.textColor === 'text-white' ? 'bg-white text-slate-900' : 'bg-blue-600 text-white'} transition-colors`}>
                      Shop now
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Official Brand Stores Section */}
      <section className="py-8 sm:py-10 lg:py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Official Brand Stores" subtitle="Verified Sellers" linkTo="/shop" />

          {/* Marquee Wrapper */}
          <div className="relative flex w-full overflow-hidden group py-2">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, groupIdx) => (
                <div key={groupIdx} className="flex gap-3 sm:gap-4 pr-3 sm:pr-4 items-center">
                  {[
                    { name: 'Apple', iconUrl: 'https://cdn.simpleicons.org/apple', invertDark: true },
                    { name: 'Nike', iconUrl: 'https://cdn.simpleicons.org/nike', invertDark: true },
                    { name: 'Samsung', iconUrl: 'https://cdn.simpleicons.org/samsung', invertDark: true },
                    { name: 'Dior', iconUrl: 'https://cdn.simpleicons.org/dior', invertDark: true },
                    { name: 'Adidas', iconUrl: 'https://cdn.simpleicons.org/adidas', invertDark: true },
                    { name: 'Apple', iconUrl: 'https://cdn.simpleicons.org/apple', invertDark: true },
                    { name: 'Nike', iconUrl: 'https://cdn.simpleicons.org/nike', invertDark: true },
                    { name: 'Samsung', iconUrl: 'https://cdn.simpleicons.org/samsung', invertDark: true },
                    { name: 'Dior', iconUrl: 'https://cdn.simpleicons.org/dior', invertDark: true },
                    { name: 'Adidas', iconUrl: 'https://cdn.simpleicons.org/adidas', invertDark: true },
                  ].map((brand, idx) => (
                    <Link
                      key={`${groupIdx}-${idx}`}
                      to={`/shop?search=${encodeURIComponent(brand.name)}`}
                      className="bg-white dark:bg-slate-800 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-4 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors duration-200 group w-32 sm:w-40 flex-shrink-0"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
                        <img 
                          src={brand.iconUrl} 
                          alt={brand.name} 
                          className={`max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110 ${brand.invertDark ? 'dark:invert' : ''}`} 
                        />
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors uppercase tracking-wider">{brand.name}</p>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Fresh Arrivals with Premium Finish" subtitle="Featured Collection" linkTo="/shop" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-100 border border-slate-200 rounded-xl animate-pulse"
                  style={{ aspectRatio: '3/4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-12 border border-slate-200 rounded-xl bg-slate-50">
                <Shield className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-bold">Unable to load products</p>
              </div>
            ) : featuredProducts?.products && featuredProducts.products.length > 0 ? (
              featuredProducts.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 border border-slate-200 rounded-md bg-slate-50">
                <p className="text-slate-600 font-bold">No products available yet</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Limited Time Deals Section */}
      <section className="py-8 sm:py-10 lg:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-orange-500" />
            <SectionHeader title="Limited Time Deals" subtitle="Special Offers" linkTo="/shop" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-100 border border-slate-200 rounded-xl animate-pulse"
                  style={{ aspectRatio: '3/4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-12 border border-slate-200 rounded-xl bg-slate-50">
                <Award className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-bold">Unable to load offers</p>
              </div>
            ) : featuredProducts?.products && featuredProducts.products.length > 0 ? (
              featuredProducts.products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 border border-slate-200 rounded-md bg-slate-50">
                <p className="text-slate-600 font-bold">No offers available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-600 mb-3">Why customers return</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Why Shop with VIBEIT?</h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">
              Built for speed, safety, and a premium buying experience from the first click to the final delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Truck,
                title: 'Island-wide Delivery',
                desc: 'Fast, reliable shipping across Sri Lanka',
              },
              {
                icon: Shield,
                title: 'Quality Guaranteed',
                desc: 'Carefully selected authentic products',
              },
              {
                icon: Headphones,
                title: 'Real-time Support',
                desc: 'Quick help anytime, anywhere',
              },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-50 rounded-2xl border border-slate-200 p-8 text-slate-900 hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 uppercase tracking-wider">{item.title}</h3>
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
