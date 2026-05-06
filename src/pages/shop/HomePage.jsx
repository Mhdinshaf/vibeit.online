import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import {
  Truck, Shield, Headphones, ArrowRight, ChevronLeft, ChevronRight, Gift, Zap, Award,
  ShoppingBag, Shirt, Watch, Home, Sparkles, ShoppingCart, Footprints, Package,
  Heart, Star, Laptop, TrendingUp, Flame, Clock, Briefcase, Droplets
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  return (
    <div className="overflow-x-hidden">
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
      <section className="relative overflow-hidden bg-white py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            
            {/* Main Carousel - spans 3 columns on large screens */}
            <div className="lg:col-span-3 relative rounded-md overflow-hidden shadow-sm border border-slate-200 bg-white">
              <div className="relative aspect-[21/9] sm:aspect-[21/9] lg:h-[400px] overflow-hidden">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full transition-all backdrop-blur-sm shadow-sm"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-slate-800 p-2 rounded-full transition-all backdrop-blur-sm shadow-sm"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-blue-600 w-8 shadow-sm'
                          : 'bg-white/70 hover:bg-white'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Side Promo Banners - 1 column on large screens */}
            <div className="hidden lg:flex flex-col gap-4">
              <Link to="/shop" className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-md p-6 flex flex-col justify-center border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">Featured</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">New Arrivals</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Discover the latest premium tech.</p>
              </Link>
              
              <Link to="/shop" className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-md p-6 flex flex-col justify-center border border-blue-200 dark:border-blue-800/50 hover:border-blue-500 dark:hover:border-blue-400 transition-colors group">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">Special Offer</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Up to 50% Off</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">On selected smart devices.</p>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-4 sm:py-6 lg:py-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Explore Popular Categories" subtitle="Shop by Category" linkTo="/shop" />

          {/* Horizontal Scroll Categories */}
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scrollbar-hide sm:justify-center">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/shop?category=${encodeURIComponent(category.name)}`}
                  className={`flex flex-col items-center gap-2 flex-shrink-0 transition-all duration-300 group`}
                >
                  <div className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700/50 transition-all duration-300 ${category.color} group-hover:border-blue-500 dark:group-hover:border-blue-400 group-hover:shadow-md`}>
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 text-center whitespace-nowrap group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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
                  className="bg-slate-100 border border-slate-200 rounded-md animate-pulse"
                  style={{ aspectRatio: '3/4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-8 border border-slate-200 rounded-md bg-slate-50">
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
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 uppercase tracking-wider">Special Collections</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {promotionalBanners.map((banner, idx) => {
              const IconComponent = banner.icon;
              return (
                <Link
                  key={idx}
                  to={`/shop`}
                  className={`${banner.bgGradient} rounded-md h-40 sm:h-48 flex items-end p-4 sm:p-6 group overflow-hidden relative shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200`}
                >
                  <div className={`absolute top-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity ${banner.textColor}`}>
                    <IconComponent className="w-20 h-20 sm:w-24 sm:h-24" />
                  </div>
                  <div className="relative z-10">
                    <h4 className={`text-sm sm:text-base font-bold mb-1 ${banner.textColor}`}>{banner.title}</h4>
                    <p className={`text-xs sm:text-sm font-medium mb-3 ${banner.textColor === 'text-white' ? 'text-slate-200' : 'text-slate-600'}`}>{banner.description}</p>
                    <button className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-md ${banner.textColor === 'text-white' ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-colors`}>
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
      <section className="py-6 sm:py-8 lg:py-10 overflow-hidden">
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
                    { name: 'Rolex', iconUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Rolex_logo.svg', invertDark: false },
                    { name: 'Dior', iconUrl: 'https://cdn.simpleicons.org/dior', invertDark: true },
                    { name: 'Adidas', iconUrl: 'https://cdn.simpleicons.org/adidas', invertDark: true },
                    { name: 'Apple', iconUrl: 'https://cdn.simpleicons.org/apple', invertDark: true },
                    { name: 'Nike', iconUrl: 'https://cdn.simpleicons.org/nike', invertDark: true },
                    { name: 'Samsung', iconUrl: 'https://cdn.simpleicons.org/samsung', invertDark: true },
                    { name: 'Rolex', iconUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b3/Rolex_logo.svg', invertDark: false },
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
      <section className="py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Fresh Arrivals with Premium Finish" subtitle="Featured Collection" linkTo="/shop" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-100 border border-slate-200 rounded-md animate-pulse"
                  style={{ aspectRatio: '3/4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-12 border border-slate-200 rounded-md bg-slate-50">
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
                  className="bg-slate-100 border border-slate-200 rounded-md animate-pulse"
                  style={{ aspectRatio: '3/4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-12 border border-slate-200 rounded-md bg-slate-50">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-10 text-center uppercase tracking-wider">Why Shop with VIBEIT?</h2>

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
                  className="bg-slate-50 rounded-md border border-slate-200 p-8 text-slate-900 hover:border-blue-500 transition-colors flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center mb-6">
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
