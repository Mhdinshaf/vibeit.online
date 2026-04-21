import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Truck, Shield, Headphones, ChevronRight, ChevronDown, Sparkles, ArrowRight, Star } from 'lucide-react';
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
    { name: 'Home Accessories', emoji: '🏠', subcategories: ['Kitchenware', 'Bedding', 'Wall Decor', 'Storage', 'Lighting'] },
    { name: 'Tech Gadgets', emoji: '📱', subcategories: ['Mobile Accessories', 'Earbuds', 'Smart Watches', 'Chargers', 'Cables'] },
    { name: 'Trending Items', emoji: '🔥', subcategories: ['Viral Products', 'New Arrivals', 'Best Sellers', 'Limited Edition'] },
    { name: 'Watches', emoji: '⌚', subcategories: ['Men Watches', 'Women Watches', 'Smart Watches', 'Luxury', 'Casual'] },
    { name: 'Creams and Skincare', emoji: '🧴', subcategories: ['Face Cream', 'Body Lotion', 'Sunscreen', 'Serums', 'Moisturizers'] },
    { name: 'Perfumes', emoji: '🌸', subcategories: ['Men Perfume', 'Women Perfume', 'Unisex', 'Gift Sets', 'Body Mist'] },
    { name: 'Toys', emoji: '🧸', subcategories: ['Educational Toys', 'Action Figures', 'Board Games', 'Outdoor Toys', 'Baby Toys'] },
    { name: 'Bicycle Parts', emoji: '🚲', subcategories: ['Tyres', 'Chains', 'Pedals', 'Helmets', 'Accessories'] },
    { name: 'Ladies Dresses', emoji: '👗', subcategories: ['Casual Wear', 'Party Wear', 'Office Wear', 'Traditional', 'Maxi Dresses'] },
    { name: 'Gents Clothing', emoji: '👔', subcategories: ['T-Shirts', 'Trousers', 'Shirts', 'Shorts', 'Formal Wear'] },
  ];

  const toggleCategory = (categoryName) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <div className="bg-white">
      {/* Premium Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" />
        
        {/* Animated decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-transparent rounded-full" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-blue-200 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Premium Quality Products</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                Perfect Vibe
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
              Sri Lanka's modern online store for fashion, tech gadgets, home essentials and more — delivered to your door.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/shop" 
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
              >
                SHOP NOW
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300"
              >
                VIEW COLLECTION
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Premium Trust Badges */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: 'Island-wide Delivery', desc: 'Fast shipping across Sri Lanka', color: 'blue' },
              { icon: Shield, title: 'Quality Guaranteed', desc: '100% authentic products', color: 'blue' },
              { icon: Headphones, title: 'WhatsApp Support', desc: 'Quick customer assistance', color: 'blue' },
            ].map((item, index) => (
              <div 
                key={index}
                className="group flex items-center gap-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                <Star className="w-4 h-4 fill-blue-600" />
                NEW ARRIVALS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Latest Products
              </h2>
              <p className="text-gray-500 max-w-2xl">
                Explore our latest collection of premium products handpicked for you.
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
            >
              VIEW ALL
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loadingNew ? (
              [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl animate-pulse"
                  style={{ aspectRatio: '1/1.4' }}
                />
              ))
            ) : errorNew ? (
              <div className="col-span-full text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-2">Unable to load products at the moment.</p>
                <p className="text-sm text-gray-400">Please make sure the backend server is running.</p>
              </div>
            ) : newArrivals?.products && newArrivals.products.length > 0 ? (
              newArrivals.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500">No products available yet. Check back soon!</p>
              </div>
            )}
          </div>

          <Link
            to="/shop"
            className="md:hidden flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors mt-8 group"
          >
            VIEW ALL
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Shop by Category
            </h2>
            <p className="text-gray-500">Find everything you need in one place</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {categories.map((category) => (
              <div key={category.name} className="col-span-2 md:col-span-1">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="group w-full bg-white border-2 border-gray-100 rounded-2xl p-6 text-center hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.emoji}</div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    {category.subcategories.length} items
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        expandedCategory === category.name ? 'rotate-180' : ''
                      }`}
                    />
                  </p>
                </button>

                {/* Expanded Subcategories */}
                {expandedCategory === category.name && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-gray-100 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-wrap gap-2">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`/shop?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(sub)}`}
                          className="px-3 py-1.5 bg-gray-50 text-sm text-gray-600 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300"
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Pay on Delivery Available</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Cash on Delivery
              </h2>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
                Shop with confidence and pay when you receive your order at your doorstep across Sri Lanka.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg group"
              >
                SHOP NOW
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trending This Week */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
              🔥 TRENDING THIS WEEK
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Popular Right Now
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loadingTrending ? (
              [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-2xl animate-pulse"
                  style={{ aspectRatio: '1/1.4' }}
                />
              ))
            ) : errorTrending ? (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500 mb-2">Unable to load trending products.</p>
                <p className="text-sm text-gray-400">Please make sure the backend server is running.</p>
              </div>
            ) : trending?.products && trending.products.length > 0 ? (
              trending.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-500">No trending products available yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
