import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Truck, Shield, Headphones, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';

const HomePage = () => {
  const { data: featuredProducts, isLoading, isError } = useQuery({
    queryKey: ['homepage-products'],
    queryFn: () => getProducts({ limit: 8 }),
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero carousel images - high quality shopping/lifestyle images
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
    <div className="bg-white dark:bg-slate-950 overflow-x-clip">
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
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-blue-50 via-blue-25 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30 dark:opacity-50"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(30, 70, 107, 0.4), transparent 50%), 
                                radial-gradient(circle at 80% 50%, rgba(103, 186, 244, 0.3), transparent 50%)`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="z-10">
              <div className="inline-flex items-center rounded-full border-2 border-blue-500 dark:border-blue-400 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide text-blue-700 dark:text-blue-200 mb-6">
                ✨ Modern essentials, delivered fast
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white mb-4">
                A cleaner way to shop
                <span className="block bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
                  fashion, tech & home
                </span>
              </h1>

              <p className="text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-slate-300 mb-8">
                Discover premium products curated with quality in mind. Smooth checkout, trusted support, and a shopping experience built for speed on every device.
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  to="/shop"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500 px-8 py-4 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  🛍️ Shop now
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-8 py-4 text-slate-700 dark:text-slate-200 font-semibold transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* Right Image Carousel */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-700 dark:to-slate-800">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 p-2 rounded-full transition-all backdrop-blur-sm"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6 text-slate-900 dark:text-white" />
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 p-2 rounded-full transition-all backdrop-blur-sm"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6 text-slate-900 dark:text-white" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
                        index === currentSlide
                          ? 'bg-blue-500 dark:bg-blue-400 w-8'
                          : 'bg-white/60 dark:bg-slate-400/60 hover:bg-white/80 dark:hover:bg-slate-300/80'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-700 max-w-xs">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Free Island-wide Delivery</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">On orders over රු2,500</p>
              </div>

              <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-100 dark:border-slate-700 max-w-xs">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">100% Authentic</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Quality guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-14 sm:py-16 lg:py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <p className="text-xs tracking-[0.15em] font-semibold text-blue-600 dark:text-blue-400 uppercase mb-2">✨ Featured collection</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                Fresh arrivals with premium finish
              </h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
                Handpicked products with clear spacing and mobile-friendly layouts designed for the perfect shopping experience.
              </p>
            </div>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 text-base font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              View all products
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl animate-pulse"
                  style={{ aspectRatio: '1/1.4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-20">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-2 text-lg font-semibold">Unable to load products</p>
                <p className="text-slate-500 dark:text-slate-400">Please make sure the backend server is running.</p>
              </div>
            ) : featuredProducts?.products && featuredProducts.products.length > 0 ? (
              featuredProducts.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-600 dark:text-slate-300 text-lg">No products available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-14 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Why Shop with VIBEIT?</h2>
            <p className="text-blue-100 text-lg">Experience the best online shopping in Sri Lanka</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: '🚚 Island-wide Delivery',
                desc: 'Fast, reliable shipping to all corners of Sri Lanka',
                color: 'bg-white/20',
              },
              {
                icon: Shield,
                title: '✓ Quality Guaranteed',
                desc: 'Carefully selected authentic products only',
                color: 'bg-white/20',
              },
              {
                icon: Headphones,
                title: '📞 Real-time Support',
                desc: 'Quick help when you need it, anytime anywhere',
                color: 'bg-white/20',
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`${item.color} backdrop-blur-md rounded-3xl border border-white/30 p-8 text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-105`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/30 text-white flex items-center justify-center mb-4 text-2xl">
                  {item.title.split(' ')[0]}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title.split(' ').slice(1).join(' ')}</h3>
                <p className="text-blue-100 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
