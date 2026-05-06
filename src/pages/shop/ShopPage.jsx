import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, ChevronRight, ChevronLeft, ChevronDown, Package, SlidersHorizontal, Home, Smartphone, Flame, Watch, Droplets, Sparkles, Gift, Bike, Shirt, Briefcase } from 'lucide-react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';

const CATEGORIES = [
  { name: 'Home Accessories', icon: Home, subcategories: ['Kitchenware', 'Bedding', 'Wall Decor', 'Storage', 'Lighting'] },
  { name: 'Tech Gadgets', icon: Smartphone, subcategories: ['Mobile Accessories', 'Earbuds', 'Smart Watches', 'Chargers', 'Cables'] },
  { name: 'Trending Items', icon: Flame, subcategories: ['Viral Products', 'New Arrivals', 'Best Sellers', 'Limited Edition'] },
  { name: 'Watches', icon: Watch, subcategories: ['Men Watches', 'Women Watches', 'Smart Watches', 'Luxury', 'Casual'] },
  { name: 'Creams and Skincare', icon: Droplets, subcategories: ['Face Cream', 'Body Lotion', 'Sunscreen', 'Serums', 'Moisturizers'] },
  { name: 'Perfumes', icon: Sparkles, subcategories: ['Men Perfume', 'Women Perfume', 'Unisex', 'Gift Sets', 'Body Mist'] },
  { name: 'Toys', icon: Gift, subcategories: ['Educational Toys', 'Action Figures', 'Board Games', 'Outdoor Toys', 'Baby Toys'] },
  { name: 'Bicycle Parts', icon: Bike, subcategories: ['Tyres', 'Chains', 'Pedals', 'Helmets', 'Accessories'] },
  { name: 'Ladies Dresses', icon: Shirt, subcategories: ['Casual Wear', 'Party Wear', 'Office Wear', 'Traditional', 'Maxi Dresses'] },
  { name: 'Gents Clothing', icon: Briefcase, subcategories: ['T-Shirts', 'Trousers', 'Shirts', 'Shorts', 'Formal Wear'] },
];

const FilterPanel = ({ searchParams, setParam, clearFilters, onSubcategorySelect }) => {
  const [expandedCategory, setExpandedCategory] = useState(searchParams.get('category') || null);
  
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  return (
    <div className="bg-white rounded-lg p-5 sm:p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-slate-700" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Filters</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="mb-6 pb-6 border-b border-slate-100">
        <h4 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Price Range</h4>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setParam('minPrice', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center text-slate-400">—</div>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setParam('maxPrice', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Categories</h4>
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                  >
                    <span className="flex items-center gap-2">
                      <cat.icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{cat.name}</span>
                    </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-slate-100 pl-2">
                    {cat.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => onSubcategorySelect(cat.name, sub)}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                            subcategory === sub
                              ? 'text-blue-600 font-semibold'
                              : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
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

  const handleSubcategorySelect = (nextCategory, nextSubcategory) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('category', nextCategory);
    newParams.set('subcategory', nextSubcategory);
    newParams.delete('page');
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const sortedProducts = useMemo(() => {
    const products = Array.isArray(data?.products) ? [...data.products] : [];
    const getPriceValue = (product) => {
      if (product?.discountPrice) return Number(product.discountPrice);
      if (product?.originalPrice) return Number(product.originalPrice);
      return Number(product?.price ?? 0);
    };

    if (sort === 'price-asc') {
      return products.sort((a, b) => getPriceValue(a) - getPriceValue(b));
    }

    if (sort === 'price-desc') {
      return products.sort((a, b) => getPriceValue(b) - getPriceValue(a));
    }

    return products;
  }, [data, sort]);

  return (
    <div className="min-h-screen overflow-x-clip transition-colors">
      <Helmet>
        <title>Shop All Products | VIBEIT - Fashion, Tech & Home</title>
        <meta name="description" content="Browse all products at VIBEIT. Find fashion, tech gadgets, home essentials and more. Filter by category, price, and more. Fast delivery across Sri Lanka." />
        <meta property="og:title" content="Shop All Products | VIBEIT" />
        <meta property="og:description" content="Browse our complete collection of fashion, tech gadgets, and home essentials." />
        <meta property="og:url" content="https://vibeitlk.vercel.app/shop" />
      </Helmet>
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-xs uppercase tracking-[0.16em] font-semibold text-slate-500 mb-2">Shop collection</p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            {category || 'Shop All Products'}
          </h1>
          {subcategory && (
            <p className="text-slate-600 text-lg mt-2">{subcategory}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          <aside className="hidden md:block lg:w-72 md:w-60 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                searchParams={searchParams}
                setParam={setParam}
                clearFilters={clearFilters}
                onSubcategorySelect={handleSubcategorySelect}
              />
            </div>
          </aside>

          <div className="flex-1">
            <nav className="flex flex-wrap items-center gap-2 text-sm mb-5 sm:mb-6 border-b border-slate-100 py-3">
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? 'text-slate-900 font-semibold'
                        : 'text-slate-500'
                    }
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                <Filter className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Filters</span>
                </button>

                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md">
                  <Package className="w-4 h-4 text-slate-600" />
                  <p className="text-sm font-medium text-slate-700">{isLoading ? 'Loading...' : `${data?.total || 0} products`}
                  </p>
                </div>
              </div>

              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-slate-200 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square bg-slate-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-4 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {data.totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => {
                        const newPage = Math.max(1, Number(page) - 1);
                        setParam('page', String(newPage));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={Number(page) <= 1}
                      className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    
                    <div className="flex items-center gap-1 sm:gap-2">
                      {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === data.totalPages || (p >= Number(page) - 1 && p <= Number(page) + 1))
                        .reduce((acc, p, i, arr) => {
                          if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, idx) => p === '...' ? (
                          <span key={`ellipsis-${idx}`} className="px-1 sm:px-2 py-1 text-slate-400">...</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => {
                              setParam('page', String(p));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                              Number(page) === p
                                ? 'bg-blue-600 text-white border border-blue-600 shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {p}
                          </button>
                        ))
                      }
                    </div>

                    <button
                      onClick={() => {
                        const newPage = Math.min(data.totalPages, Number(page) + 1);
                        setParam('page', String(newPage));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={Number(page) >= data.totalPages}
                      className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 border-b border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500 mb-6 text-sm">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-2.5 rounded-md hover:bg-blue-700 transition-colors"
                >
                Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-80 sm:w-96 max-w-[85vw] bg-white dark:bg-[#050b18] z-50 overflow-y-auto md:hidden shadow-2xl border-l border-slate-200 dark:border-slate-700">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 hover:bg-white rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              <FilterPanel
                searchParams={searchParams}
                setParam={setParam}
                clearFilters={clearFilters}
                onSubcategorySelect={handleSubcategorySelect}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopPage;


