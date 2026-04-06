import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, ChevronRight, ChevronDown, Package, SlidersHorizontal, Sparkles } from 'lucide-react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';

const CATEGORIES = [
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

const FilterPanel = ({ searchParams, setParam, clearFilters }) => {
  const [expandedCategory, setExpandedCategory] = useState(searchParams.get('category') || null);
  
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <h4 className="font-semibold text-gray-900 mb-4">Price Range</h4>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setParam('minPrice', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:bg-white focus:ring-0 transition-all"
            />
          </div>
          <div className="flex items-center text-gray-400">—</div>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setParam('maxPrice', e.target.value)}
              className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:bg-white focus:ring-0 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">Categories</h4>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isExpanded = expandedCategory === cat.name;
            const isSelected = category === cat.name;

            return (
              <div key={cat.name}>
                <button
                  onClick={() => {
                    if (isSelected) {
                      setParam('category', '');
                      setParam('subcategory', '');
                      setExpandedCategory(null);
                    } else {
                      setParam('category', cat.name);
                      setParam('subcategory', '');
                      setExpandedCategory(cat.name);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-200'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{cat.emoji}</span>
                    <span className="font-medium">{cat.name}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Subcategories */}
                {isExpanded && (
                  <div className="ml-4 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setParam('category', cat.name);
                          setParam('subcategory', sub);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          subcategory === sub
                            ? 'bg-blue-100 text-blue-700 font-semibold'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '';
  const page = searchParams.get('page') || '1';

  const { data, isLoading } = useQuery({
    queryKey: ['products', category, subcategory, search, minPrice, maxPrice, sort, page],
    queryFn: () => getProducts({ category, subcategory, search, minPrice, maxPrice, sort, page }),
  });

  const setParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset page when filters change
    if (key !== 'page') {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  // Breadcrumb
  const breadcrumbs = ['All Products'];
  if (category) breadcrumbs.push(category);
  if (subcategory) breadcrumbs.push(subcategory);

  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-blue-200" />
            <span className="text-blue-200 font-medium">Explore Our Collection</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {category || 'Shop All Products'}
          </h1>
          {subcategory && (
            <p className="text-blue-100 text-lg">{subcategory}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                searchParams={searchParams}
                setParam={setParam}
                clearFilters={clearFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-gray-300" />}
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-500'
                    }
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  <Filter className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-semibold text-gray-700">Filters</span>
                </button>

                {/* Results Count */}
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                  <Package className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-700">
                    {isLoading ? 'Loading...' : `${data?.total || 0} products`}
                  </p>
                </div>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:border-blue-500 focus:ring-0 transition-all cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.products && data.products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {data.products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <button
                      onClick={() => setParam('page', String(Math.max(1, Number(page) - 1)))}
                      disabled={Number(page) <= 1}
                      className="px-5 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-600">
                      Page <span className="text-blue-600 font-bold">{page}</span> of {data.totalPages}
                    </span>
                    <button
                      onClick={() => setParam('page', String(Number(page) + 1))}
                      disabled={Number(page) >= data.totalPages}
                      className="px-5 py-2.5 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-200"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-gray-50 z-50 overflow-y-auto lg:hidden shadow-2xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 hover:bg-white rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <FilterPanel
                searchParams={searchParams}
                setParam={setParam}
                clearFilters={clearFilters}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopPage;
