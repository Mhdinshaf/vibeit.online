import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import {
  Truck, Shield, Headphones, ArrowRight, ChevronLeft, ChevronRight, Gift, Zap, Award,
  ShoppingBag, Shirt, Watch, Home, Sparkles, ShoppingCart, Footprints, Package,
  Heart, Star, Laptop, TrendingUp, Flame, Clock
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
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
      alt: 'Premium shopping experience',
    },
    {
      url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&h=600&fit=crop',
      alt: 'Fashion collections',
    },
    {
      url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
      alt: 'Tech gadgets',
    },
    {
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
      alt: 'Premium products',
    },
  ];

  const categories = [
    { name: 'Electronics', icon: Laptop, color: 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20' },
    { name: 'Fashion', icon: Shirt, color: 'from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-800/20' },
    { name: 'Watches', icon: Watch, color: 'from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20' },
    { name: 'Home', icon: Home, color: 'from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20' },
    { name: 'Luxury', icon: Sparkles, color: 'from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20' },
    { name: 'Hot Deals', icon: Flame, color: 'from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20' },
    { name: 'Shoes', icon: Footprints, color: 'from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20' },
    { name: 'Gifts', icon: Gift, color: 'from-rose-100 to-rose-50 dark:from-rose-900/30 dark:to-rose-800/20' },
  ];

  const promotionalBanners = [
    {
      title: 'Tech Paradise',
      description: 'Latest gadgets & electronics',
      icon: Laptop,
      bgGradient: 'from-blue-500 via-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800',
      textColor: 'text-white'
    },
    {
      title: 'Fashion Forward',
      description: 'Trendy clothing & accessories',
      icon: Shirt,
      bgGradient: 'from-pink-500 via-purple-600 to-purple-700 dark:from-purple-900 dark:to-purple-800',
      textColor: 'text-white'
    },
    {
      title: 'Home Essentials',
      description: 'Make your space beautiful',
      icon: Home,
      bgGradient: 'from-green-500 via-emerald-600 to-teal-700 dark:from-green-900 dark:to-emerald-800',
      textColor: 'text-white'
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="bg-white dark:bg-[#050b18] overflow-x-hidden transition-all">
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

      {/* Hero Section with Carousel */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Carousel */}
          <div className="relative mb-6 sm:mb-8 rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg bg-gradient-to-br from-slate-200 dark:from-slate-800">
            <div className="relative aspect-video lg:aspect-auto lg:h-72 overflow-hidden">
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

              {/* Carousel Controls */}
              <button
                onClick={prevSlide}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 p-2 sm:p-3 rounded-full transition-all backdrop-blur-sm shadow-lg hover:shadow-xl"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900 dark:text-cyan-400" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 p-2 sm:p-3 rounded-full transition-all backdrop-blur-sm shadow-lg hover:shadow-xl"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-900 dark:text-cyan-400" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 backdrop-blur-md ${
                      index === currentSlide
                        ? 'bg-orange-500 dark:bg-orange-400 w-6 sm:w-8 shadow-lg'
                        : 'bg-white/60 dark:bg-slate-400/60 hover:bg-white/80 dark:hover:bg-slate-300/80'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Promo Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Featured Product Spotlight */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-900 dark:to-blue-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs sm:text-sm font-semibold opacity-90">Featured</p>
                  <h3 className="text-sm sm:text-base font-bold">New Arrivals</h3>
                </div>
                <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-orange-400 text-orange-400" />
              </div>
              <p className="text-xs sm:text-sm opacity-90">Premium collection available now</p>
            </div>

            {/* Sale Promotion Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-900 dark:to-red-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs sm:text-sm font-semibold opacity-90">Limited</p>
                  <h3 className="text-sm sm:text-base font-bold">Up to 50% Off</h3>
                </div>
                <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-200" />
              </div>
              <p className="text-xs sm:text-sm opacity-90">Best deals this season</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-4 sm:py-6 lg:py-8 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Explore Popular Categories" subtitle="Shop by Category" linkTo="/shop" />

          {/* Horizontal Scroll Categories */}
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scrollbar-hide">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/shop?category=${category.name.toLowerCase()}`}
                  className={`flex flex-col items-center gap-2 flex-shrink-0 transition-all duration-300 group`}
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110`}>
                    <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-slate-700 dark:text-slate-200" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 text-center whitespace-nowrap">
                    {category.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Today's Best Deals Section */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <SectionHeader title="Today's Best Deals For You!" subtitle="Limited Time" linkTo="/shop" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"
                  style={{ aspectRatio: '3/4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-8">
                <Shield className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">Unable to load deals</p>
              </div>
            ) : featuredProducts?.products && featuredProducts.products.length > 0 ? (
              featuredProducts.products.slice(0, 5).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold">No deals available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Promotional Banners Section */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3">Special Collections</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {promotionalBanners.map((banner, idx) => {
              const IconComponent = banner.icon;
              return (
                <Link
                  key={idx}
                  to="/shop"
                  className={`bg-gradient-to-br ${banner.bgGradient} rounded-xl sm:rounded-2xl h-40 sm:h-48 flex items-end p-4 sm:p-6 group overflow-hidden relative`}
                >
                  <div className="absolute top-0 right-0 opacity-20 group-hover:opacity-30 transition-opacity">
                    <IconComponent className="w-20 h-20 sm:w-24 sm:h-24" />
                  </div>
                  <div className="relative z-10">
                    <h4 className={`text-sm sm:text-base font-bold mb-1 ${banner.textColor}`}>{banner.title}</h4>
                    <p className={`text-xs sm:text-sm opacity-90 mb-3 ${banner.textColor}`}>{banner.description}</p>
                    <button className={`text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${banner.textColor} bg-white/20 hover:bg-white/30 transition-colors`}>
                      Shop now
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Official Brand Stores Section */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Official Brand Stores" subtitle="Verified Sellers" linkTo="/shop" />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { name: 'Tech Hub', icon: Laptop, color: 'from-blue-100 to-blue-50' },
              { name: 'Fashion Plus', icon: Shirt, color: 'from-pink-100 to-pink-50' },
              { name: 'Home & Living', icon: Home, color: 'from-green-100 to-green-50' },
              { name: 'Premium Watch', icon: Watch, color: 'from-purple-100 to-purple-50' },
              { name: 'Luxury Goods', icon: Sparkles, color: 'from-yellow-100 to-yellow-50' },
              { name: 'Outlet Store', icon: ShoppingCart, color: 'from-red-100 to-red-50' },
            ].map((brand, idx) => {
              const IconComponent = brand.icon;
              return (
                <Link
                  key={idx}
                  to="/shop"
                  className={`bg-gradient-to-br ${brand.color} dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all group`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/50 dark:bg-slate-600/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 dark:text-slate-200" />
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">{brand.name}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Fresh Arrivals with Premium Finish" subtitle="Featured Collection" linkTo="/shop" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"
                  style={{ aspectRatio: '3/4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-12">
                <Shield className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-300 font-semibold">Unable to load products</p>
              </div>
            ) : featuredProducts?.products && featuredProducts.products.length > 0 ? (
              featuredProducts.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600 dark:text-slate-300 font-semibold">No products available yet</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Limited Time Deals Section */}
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-orange-500" />
            <SectionHeader title="Limited Time Deals" subtitle="Special Offers" linkTo="/shop" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"
                  style={{ aspectRatio: '3/4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-12">
                <Award className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-300 font-semibold">Unable to load offers</p>
              </div>
            ) : featuredProducts?.products && featuredProducts.products.length > 0 ? (
              featuredProducts.products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-600 dark:text-slate-300 font-semibold">No offers available</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-6 sm:py-8 lg:py-10 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Why Shop with VIBEIT?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
                  className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 dark:border-cyan-400/20 p-4 sm:p-6 text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all group"
                >
                  <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 mb-3 group-hover:scale-125 transition-transform" />
                  <h3 className="text-base sm:text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm opacity-90">{item.desc}</p>
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
