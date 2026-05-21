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
  Droplets,
  Heart,
  BarChart3,
  AlertCircle
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
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-100 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 sm:p-12 lg:p-16">
              {/* Left Column */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  Your{' '}
                  <span className="text-blue-600">One-Stop</span>
                  {' '}
                  <span className="text-blue-600">Shop</span>
                  {' '}
                  for Everything You Need!
                </h1>
                <p className="text-base sm:text-lg text-gray-600 font-medium">
                  Shop premium products at unbeatable prices with fast delivery across Sri Lanka.
                </p>

                {/* Promo Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Premium Fashion */}
                  <div className="bg-yellow-400 rounded-2xl p-4 sm:p-6 flex flex-col justify-between h-32 sm:h-40 group hover:shadow-lg transition-all">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">Premium Fashion</h3>
                      <p className="text-xs text-slate-800 font-semibold">Up to 40% OFF</p>
                    </div>
                    <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-full text-xs font-bold transition-colors w-fit">
                      Shop now
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Card 2: Tech Deals */}
                  <div className="bg-blue-600 rounded-2xl p-4 sm:p-6 flex flex-col justify-between h-32 sm:h-40 group hover:shadow-lg transition-all">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white mb-1">Tech Gadgets</h3>
                      <p className="text-xs text-blue-100 font-semibold">Latest Collection</p>
                    </div>
                    <button className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-blue-600 px-3 py-2 rounded-full text-xs font-bold transition-colors w-fit">
                      Explore
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-sm lg:max-w-none">
                  <img
                    src="/hero_fashion.png"
                    alt="Person with yellow shopping bags"
                    className="w-full h-auto object-contain drop-shadow-xl transform lg:scale-110 lg:translate-x-8 transition-transform hover:scale-105 lg:hover:scale-125"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Trending Categories (Bento Grid) */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Explore Trending Categories</h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium">Discover our best collections</p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {/* Large Dark Card (Left) */}
            <div className="sm:col-span-1 lg:row-span-2 bg-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-auto sm:h-[400px] lg:h-full group overflow-hidden relative">
              <div className="absolute -top-8 -right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Headphones className="w-32 h-32 sm:w-40 sm:h-40 text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-white/20 text-white px-4 py-1 rounded-full text-xs font-bold">Electronic</span>
                  <span className="bg-white/20 text-white px-4 py-1 rounded-full text-xs font-bold">Gadget</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Tech Gadgets</h3>
              </div>
              <div className="relative z-10 flex justify-center my-4">
                <img src="/hero_tech.png" alt="Headphones" className="max-h-32 sm:max-h-40 object-contain drop-shadow-lg" />
              </div>
              <Link to="/shop?category=Tech%20Gadgets" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors w-fit">
                Explore product
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Middle Column (Stacked) */}
            <div className="sm:col-span-1 space-y-4 lg:space-y-6">
              {/* Furniture & Home */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 hover:border-blue-500 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="bg-slate-100 text-slate-700 px-4 py-1 rounded-full text-xs font-bold mb-2 inline-block">Home</span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">Furniture & Home</h3>
                  </div>
                </div>
                <div className="flex justify-center my-6 h-24 sm:h-32">
                  <img src="/hero_home.png" alt="Home furniture" className="max-h-full max-w-full object-contain" />
                </div>
                <Link to="/shop?category=Home%20Accessories" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors">
                  Explore product
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Fashion & Accessories */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 hover:border-blue-500 hover:shadow-lg transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="bg-slate-100 text-slate-700 px-4 py-1 rounded-full text-xs font-bold mb-2 inline-block">Fashion</span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">Fashion & Accessories</h3>
                  </div>
                </div>
                <div className="flex justify-center my-6 h-24 sm:h-32">
                  <img src="/hero_luxury.png" alt="Fashion items" className="max-h-full max-w-full object-contain" />
                </div>
                <Link to="/shop?category=Ladies%20Dresses" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors">
                  Explore product
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Tall Right Card (Yellow) - Trending Items */}
            <div className="sm:col-span-1 lg:row-span-2 bg-yellow-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-auto sm:h-[400px] lg:h-full group overflow-hidden relative hover:shadow-lg transition-all">
              <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Flame className="w-40 h-40 sm:w-48 sm:h-48 text-slate-900" />
              </div>
              <div className="relative z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-slate-900/20 text-slate-900 px-4 py-1 rounded-full text-xs font-bold">Trending</span>
                  <span className="bg-slate-900/20 text-slate-900 px-4 py-1 rounded-full text-xs font-bold">Hot</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Trending Items</h3>
              </div>
              <div className="relative z-10 flex justify-center my-4">
                <Zap className="w-24 sm:w-32 h-24 sm:h-32 text-slate-900 drop-shadow-lg" />
              </div>
              <Link to="/shop?category=Trending%20Items" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors w-fit">
                Explore product
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product of The Month */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Product of The Month</h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium">Handpicked bestsellers</p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-slate-200 bg-white animate-pulse">
                  <div className="aspect-square bg-slate-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-6 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-12 border border-slate-200 rounded-xl bg-slate-50">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 font-bold">Unable to load products</p>
              </div>
            ) : featuredProducts?.products && featuredProducts.products.length > 0 ? (
              featuredProducts.products.slice(0, 4).map((product, idx) => {
                const pastelBgs = ['bg-blue-100', 'bg-pink-100', 'bg-green-100', 'bg-yellow-100'];
                const bg = pastelBgs[idx % 4];
                return (
                  <div key={product._id} className="group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
                    {/* Top Image Area */}
                    <div className={`${bg} relative aspect-square overflow-hidden flex items-center justify-center p-4`}>
                      {/* Popular Tag */}
                      <div className="absolute top-3 left-3 bg-yellow-400 text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                        Popular
                      </div>

                      {/* Action Buttons (Top Right) */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center transition-all shadow-sm hover:scale-110">
                          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-sm hover:scale-110">
                          <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {/* Product Image */}
                      <img
                        src={product.image || '/hero_tech.png'}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Bottom Details Area */}
                    <div className="bg-white p-4 sm:p-5">
                      <p className="text-blue-600 font-bold text-lg sm:text-xl mb-2">
                        ${product.price?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-slate-600 text-xs sm:text-sm font-medium truncate mb-3 leading-snug">
                        {product.name || 'Product Name'}
                      </p>
                      <Link
                        to={`/shop`}
                        className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-colors"
                      >
                        Buy now
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 border border-slate-200 rounded-md bg-slate-50">
                <p className="text-slate-600 font-bold">No products available</p>
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
