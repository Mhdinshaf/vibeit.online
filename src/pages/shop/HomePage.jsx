import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Truck, Shield, Headphones, ArrowRight, ChevronLeft, ChevronRight, Gift, Zap, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';

const HomePage = () => {
  const { data: featuredProducts, isLoading, isError } = useQuery({
    queryKey: ['homepage-products'],
    queryFn: () => getProducts({ limit: 8 }),
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
    <div className="bg-white dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-x-clip">
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
        <meta name="theme-color" content="#1E466B" />
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
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-blue-50 via-blue-25 to-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        {/* Light mode background */}
        <div className="absolute inset-0 opacity-40 dark:opacity-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(30, 107, 184, 0.5), transparent 50%), 
                              radial-gradient(circle at 80% 40%, rgba(59, 130, 246, 0.4), transparent 50%)`,
          }}
        />
        
        {/* Dark mode background with cyan/blue accents */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.2), transparent 50%), 
                              radial-gradient(circle at 80% 40%, rgba(59, 130, 246, 0.2), transparent 50%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left Content */}
            <div className="z-10">
              <div className="inline-flex items-center rounded-full border-2 border-blue-500 dark:border-cyan-400 bg-blue-100 dark:bg-slate-800/60 px-4 py-2.5 text-xs sm:text-sm font-bold tracking-wide text-blue-700 dark:text-cyan-300 mb-8">
                Modern essentials, delivered fast
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mb-6">
                A cleaner way to shop
                <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 dark:from-cyan-400 dark:via-blue-300 dark:to-cyan-300 bg-clip-text text-transparent mt-3">
                  fashion, tech & home
                </span>
              </h1>

              <p className="text-lg sm:text-xl leading-relaxed text-slate-700 dark:text-slate-200 mb-10 font-semibold">
                Discover premium products curated with quality in mind. Smooth checkout, trusted support, and a shopping experience built for speed on every device.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  to="/shop"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 hover:bg-blue-600 dark:bg-blue-800 dark:hover:bg-blue-900 px-8 py-4 text-white font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Shop now
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-blue-500 dark:border-blue-600 bg-transparent dark:bg-transparent px-8 py-4 text-blue-600 dark:text-blue-300 font-bold text-lg transition-all duration-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:shadow-lg"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* Right Image Carousel */}
            <div className="relative">
              {/* Main Image with Border */}
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-800 dark:to-slate-700 ring-4 ring-white dark:ring-slate-700">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 dark:bg-slate-950/95 hover:bg-white dark:hover:bg-slate-900 p-3 rounded-full transition-all backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-110"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-7 h-7 text-slate-900 dark:text-cyan-400 font-bold" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 dark:bg-slate-950/95 hover:bg-white dark:hover:bg-slate-900 p-3 rounded-full transition-all backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-110"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-7 h-7 text-slate-900 dark:text-cyan-400 font-bold" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 backdrop-blur-md ${
                        index === currentSlide
                          ? 'bg-blue-500 dark:bg-cyan-400 w-8 shadow-lg'
                          : 'bg-white/70 dark:bg-slate-500/70 hover:bg-white/90 dark:hover:bg-slate-400/90'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-5 -left-5 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-2xl border-2 border-blue-100 dark:border-slate-700 max-w-xs hover:shadow-3xl transition-shadow hover:-translate-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Free Island-wide Delivery</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">On orders over රු2,500</p>
              </div>

              <div className="absolute -top-5 -right-5 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-2xl border-2 border-blue-100 dark:border-slate-700 max-w-xs hover:shadow-3xl transition-shadow hover:-translate-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">100% Authentic</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Quality guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-18 sm:py-20 lg:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 sm:mb-16">
            <div>
              <p className="text-xs tracking-[0.2em] font-black text-blue-600 dark:text-cyan-400 uppercase mb-4">Featured collection</p>
              <h2 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-5">
                Fresh arrivals with premium finish
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl font-semibold leading-relaxed">
                Handpicked products with clear spacing and mobile-friendly layouts designed for the perfect shopping experience.
              </p>
            </div>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors whitespace-nowrap"
            >
              View all
              <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl animate-pulse"
                  style={{ aspectRatio: '1/1.4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-28">
                <div className="w-28 h-28 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-14 h-14 text-slate-400 dark:text-slate-600" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-3 text-2xl font-black">Unable to load products</p>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-semibold">Please make sure the backend server is running.</p>
              </div>
            ) : featuredProducts?.products && featuredProducts.products.length > 0 ? (
              featuredProducts.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-28">
                <p className="text-slate-600 dark:text-slate-300 text-2xl font-black">No products available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Offer Items Section */}
      <section className="py-18 sm:py-20 lg:py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 sm:mb-16">
            <div>
              <p className="text-xs tracking-[0.2em] font-black text-blue-600 dark:text-cyan-400 uppercase mb-4 flex items-center gap-2"><Gift className="w-4 h-4" /> Special Offers</p>
              <h2 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-5">
                Limited time deals
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl font-semibold leading-relaxed">
                Grab amazing discounts on selected products before they're gone. Hurry, limited stock available!
              </p>
            </div>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors whitespace-nowrap"
            >
              View all deals
              <ArrowRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl animate-pulse"
                  style={{ aspectRatio: '1/1.4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-28">
                <div className="w-28 h-28 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-14 h-14 text-slate-400 dark:text-slate-600" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-3 text-2xl font-black">Unable to load offers</p>
              </div>
            ) : featuredProducts?.products && featuredProducts.products.length > 0 ? (
              featuredProducts.products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-28">
                <p className="text-slate-600 dark:text-slate-300 text-2xl font-black">No offers available right now!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-18 sm:py-20 lg:py-24 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-600 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
        {/* Dark mode glow effect */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(34, 211, 238, 0.1), transparent 70%)`,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black text-white mb-5">Why Shop with VIBEIT?</h2>
            <p className="text-blue-100 dark:text-cyan-200 text-xl font-bold">Experience the best online shopping in Sri Lanka</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: 'Island-wide Delivery',
                desc: 'Fast, reliable shipping to all corners of Sri Lanka',
              },
              {
                icon: Shield,
                title: 'Quality Guaranteed',
                desc: 'Carefully selected authentic products only',
              },
              {
                icon: Headphones,
                title: 'Real-time Support',
                desc: 'Quick help when you need it, anytime anywhere',
              },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="relative bg-white/20 dark:bg-white/5 backdrop-blur-xl rounded-3xl border-2 border-white/50 dark:border-cyan-400/30 p-10 text-white hover:bg-white/30 dark:hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group"
                >
                  <div className="text-6xl mb-6 transform group-hover:scale-125 transition-transform duration-300">
                    <IconComponent className="w-16 h-16" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">{item.title}</h3>
                  <p className="text-blue-50 dark:text-cyan-100 leading-relaxed text-lg font-semibold">{item.desc}</p>
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

