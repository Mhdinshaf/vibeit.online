import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Truck, Shield, Headphones, ArrowRight } from 'lucide-react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';

const HomePage = () => {
  const { data: featuredProducts, isLoading, isError } = useQuery({
    queryKey: ['homepage-products'],
    queryFn: () => getProducts({ limit: 8 }),
  });

  return (
    <div style={{ backgroundColor: '#FAFAFA' }} className="overflow-x-clip">
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

      <section className="relative isolate overflow-hidden" style={{ backgroundColor: '#FAFAFA' }}>
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `linear-gradient(135deg, #1E466B 0%, #67BAF4 100%)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="inline-flex items-center rounded-full border-2 px-3 py-1 text-xs sm:text-sm tracking-wide font-medium"
                style={{ borderColor: '#1E466B', color: '#1E466B', backgroundColor: '#67BAF4' }}>
                Modern essentials, delivered fast across Sri Lanka
              </p>

              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight"
                style={{ color: '#0D0D0D' }}>
                A cleaner way to shop
                <span className="block" style={{ color: '#67BAF4' }}>fashion, tech, and home picks.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed"
                style={{ color: '#0D0D0D' }}>
                Discover premium products curated with quality in mind. Smooth checkout, trusted support, and a shopping experience built for speed on every device.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3">
                <Link
                  to="/shop"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-white font-medium transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: '#1E466B' }}
                >
                  Shop now
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl"
                style={{ backgroundColor: '#67BAF4' }}>
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop"
                  alt="Premium shopping experience"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <p className="text-xs tracking-[0.15em] font-semibold uppercase"
                style={{ color: '#1E466B' }}>Featured collection</p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight"
                style={{ color: '#0D0D0D' }}>
                Fresh arrivals with a premium finish
              </h2>
              <p className="mt-2 max-w-2xl"
                style={{ color: '#0D0D0D' }}>
                Modern product cards with clear spacing and mobile-friendly layouts.
              </p>
            </div>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: '#1E466B' }}
            >
              View all products
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="border rounded-2xl animate-pulse"
                  style={{ aspectRatio: '1/1.4', backgroundColor: '#fff', borderColor: '#67BAF4' }}
                />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#67BAF4' }}>
                  <Shield className="w-8 h-8" style={{ color: '#1E466B' }} />
                </div>
                <p className="mb-2" style={{ color: '#0D0D0D' }}>Unable to load products right now.</p>
                <p className="text-sm" style={{ color: '#1E466B' }}>Please make sure the backend server is running.</p>
              </div>
            ) : featuredProducts?.products && featuredProducts.products.length > 0 ? (
              featuredProducts.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p style={{ color: '#0D0D0D' }}>No products available yet. Check back soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { icon: Truck, title: 'Island-wide Delivery', desc: 'Fast shipping across Sri Lanka' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'Carefully selected authentic products' },
              { icon: Headphones, title: 'Real-time Support', desc: 'Quick help when you need it' },
            ].map((item, index) => (
              <article
                key={index}
                className="rounded-2xl border p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
                style={{ 
                  backgroundColor: '#fff',
                  borderColor: '#67BAF4'
                }}
              >
                <div className="w-11 h-11 rounded-xl text-white flex items-center justify-center"
                  style={{ backgroundColor: '#1E466B' }}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold" style={{ color: '#0D0D0D' }}>{item.title}</h2>
                  <p className="mt-1 text-sm" style={{ color: '#1E466B' }}>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
