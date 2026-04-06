import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, ChevronRight, ChevronDown } from 'lucide-react';
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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Price Range</h4>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setParam('minPrice', e.target.value)}
            className="form-input flex-1 !py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setParam('maxPrice', e.target.value)}
            className="form-input flex-1 !py-2 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h4>
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.emoji}</span>
                    <span className="font-medium">{cat.name}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Subcategories */}
                {isExpanded && (
                  <div className="ml-4 mt-2 space-y-1">
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setParam('category', cat.name);
                          setParam('subcategory', sub);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
                          subcategory === sub
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
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
  const breadcrumbs = ['All'];
  if (category) breadcrumbs.push(category);
  if (subcategory) breadcrumbs.push(subcategory);

  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <FilterPanel
              searchParams={searchParams}
              setParam={setParam}
              clearFilters={clearFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-600 dark:text-gray-400'
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
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters</span>
                </button>

                {/* Results Count */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isLoading ? 'Loading...' : `${data?.total || 0} products found`}
                </p>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="form-input !w-auto !py-2 text-sm"
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"
                    style={{ aspectRatio: '1/1.4' }}
                  />
                ))}
              </div>
            ) : data?.products && data.products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {data.products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setParam('page', String(Math.max(1, Number(page) - 1)))}
                      disabled={Number(page) <= 1}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                      Page {page} of {data.totalPages}
                    </span>
                    <button
                      onClick={() => setParam('page', String(Number(page) + 1))}
                      disabled={Number(page) >= data.totalPages}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
                  No products found
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear Filters
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
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white dark:bg-gray-900 z-50 overflow-y-auto lg:hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
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
