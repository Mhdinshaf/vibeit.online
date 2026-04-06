import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Truck, Shield, Headphones, ChevronRight, ChevronDown } from 'lucide-react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';

const HomePage = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const { data: newArrivals, isLoading: loadingNew, isError: errorNew } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => getProducts({ limit: 8 }),
  });

  const { data: trending, isLoading: loadingTrending, isError: errorTrending } = useQuery({
    queryKey: ['trending-products'],
    queryFn: () => getProducts({ featured: true, limit: 4 }),
  });

  const categories = [
    {
      name: 'Home Accessories',
      emoji: '🏠',
      subcategories: ['Kitchenware', 'Bedding', 'Wall Decor', 'Storage', 'Lighting'],
    },
    {
      name: 'Tech Gadgets',
      emoji: '📱',
      subcategories: ['Mobile Accessories', 'Earbuds', 'Smart Watches', 'Chargers', 'Cables'],
    },
    {
      name: 'Trending Items',
      emoji: '🔥',
      subcategories: ['Viral Products', 'New Arrivals', 'Best Sellers', 'Limited Edition'],
    },
    {
      name: 'Watches',
      emoji: '⌚',
      subcategories: ['Men Watches', 'Women Watches', 'Smart Watches', 'Luxury', 'Casual'],
    },
    {
      name: 'Creams and Skincare',
      emoji: '🧴',
      subcategories: ['Face Cream', 'Body Lotion', 'Sunscreen', 'Serums', 'Moisturizers'],
    },
    {
      name: 'Perfumes',
      emoji: '🌸',
      subcategories: ['Men Perfume', 'Women Perfume', 'Unisex', 'Gift Sets', 'Body Mist'],
    },
    {
      name: 'Toys',
      emoji: '🧸',
      subcategories: ['Educational Toys', 'Action Figures', 'Board Games', 'Outdoor Toys', 'Baby Toys'],
    },
    {
      name: 'Bicycle Parts',
      emoji: '🚲',
      subcategories: ['Tyres', 'Chains', 'Pedals', 'Helmets', 'Accessories'],
    },
    {
      name: 'Ladies Dresses',
      emoji: '👗',
      subcategories: ['Casual Wear', 'Party Wear', 'Office Wear', 'Traditional', 'Maxi Dresses'],
    },
    {
      name: 'Gents Clothing',
      emoji: '👔',
      subcategories: ['T-Shirts', 'Trousers', 'Shirts', 'Shorts', 'Formal Wear'],
    },
  ];

  const toggleCategory = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your Vibe
            </h1>
            <p className="text-gray-200 text-lg md:text-xl mb-8 leading-relaxed">
              Sri Lanka's modern online store for fashion, tech gadgets, home essentials and more delivered to your door.
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
      <section className="bg-gray-100 dark:bg-gray-800 py-12">
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
                Latest Products
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                Explore our latest collection of premium products handpicked for you.
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              VIEW ALL
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loadingNew ? (
              // Skeleton Loading
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
                  style={{ aspectRatio: '1/1.4' }}
                />
              ))
            ) : errorNew ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Unable to load products at the moment.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Please make sure the backend server is running.
                </p>
              </div>
            ) : newArrivals?.products && newArrivals.products.length > 0 ? (
              newArrivals.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No products available yet. Check back soon!
                </p>
              </div>
            )}
          </div>

          <Link
            to="/shop"
            className="md:hidden flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors mt-6"
          >
            VIEW ALL
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Shop by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Find everything you need in one place
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category) => (
              <div key={category.name} className="col-span-2 md:col-span-1">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="group w-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center hover:border-blue-600 dark:hover:border-blue-600 hover:shadow-md transition-all"
                >
                  <div className="text-6xl mb-4">{category.emoji}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-600 transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                    {category.subcategories.length} items
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedCategory === category.name ? 'rotate-180' : ''
                      }`}
                    />
                  </p>
                </button>

                {/* Expanded Subcategories */}
                {expandedCategory === category.name && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`/shop?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-600 text-sm text-gray-700 dark:text-gray-200 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-white dark:bg-gray-900">
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

      {/* Trending This Week */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-2">
              TRENDING THIS WEEK
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Popular Right Now
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loadingTrending ? (
              // Skeleton Loading
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                  style={{ aspectRatio: '1/1.4' }}
                />
              ))
            ) : errorTrending ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Unable to load trending products.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Please make sure the backend server is running.
                </p>
              </div>
            ) : trending?.products && trending.products.length > 0 ? (
              trending.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No trending products available yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
