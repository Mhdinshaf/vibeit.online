import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Truck, Shield, Headphones, ChevronRight } from 'lucide-react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getProducts({ limit: 4 }),
  });

  const categories = [
    { name: 'Jackets', emoji: '🧥', value: 'Jackets' },
    { name: 'Gloves', emoji: '🧤', value: 'Gloves' },
    { name: 'Boots', emoji: '👢', value: 'Boots' },
    { name: 'Riding Gear', emoji: '🏍️', value: 'Riding Gear' },
    { name: 'Accessories', emoji: '🎒', value: 'Accessories' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-4">
              THE VIBE OF SHOPPING
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your Vibe
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
              Sri Lanka's modern online store for fashion, gear, and lifestyle products delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary">
                SHOP NOW
              </Link>
              <Link to="/shop" className="btn-outline !border-white !text-white hover:!bg-white hover:!text-gray-900">
                VIEW COLLECTION
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Island-wide Delivery</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fast shipping across Sri Lanka</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Quality Guaranteed</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">100% authentic products</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">WhatsApp Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Quick customer assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-2">
                NEW ARRIVALS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Gear for the Road Ahead
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                Explore our latest collection of premium products handpicked for you.
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              VIEW ALL PRODUCTS
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {isLoading ? (
              // Skeleton Loading
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
                  style={{ aspectRatio: '1/1.4' }}
                />
              ))
            ) : (
              data?.products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>

          <Link
            to="/shop"
            className="md:hidden flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors mt-6"
          >
            VIEW ALL PRODUCTS
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get Ready for Cash on Delivery
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Shop with confidence and pay when you receive your order at your doorstep.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-white text-blue-600 font-bold uppercase tracking-wider px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-2">
              SHOP BY CATEGORY
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Find What You Need
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.value}
                to={`/shop?category=${encodeURIComponent(category.value)}`}
                className="group border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-blue-600 dark:hover:border-blue-600 transition-all"
              >
                <div className="text-5xl mb-4">{category.emoji}</div>
                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
