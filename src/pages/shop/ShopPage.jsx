import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, ChevronRight, ChevronDown, Package, SlidersHorizontal, Home, Smartphone, Flame, Watch, Droplets, Sparkles, Gift, Bike, Shirt, Briefcase } from 'lucide-react';
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="mb-6 pb-6 border-b border-slate-100">
        <h4 className="font-semibold text-slate-900 mb-4">Price Range</h4>
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setParam('minPrice', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-900 focus:bg-white transition-colors"
            />
          </div>
          <div className="flex items-center text-slate-400">—</div>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setParam('maxPrice', e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-slate-900 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 mb-4">Categories</h4>
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    isSelected
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  >
                    <span className="flex items-center gap-2">
                      <cat.icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      <span className="font-medium">{cat.name}</span>
                    </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-2 space-y-1">
                    {cat.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => onSubcategorySelect(cat.name, sub)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            subcategory === sub
                              ? 'bg-slate-100 text-slate-900 font-semibold'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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
    const getPriceValue = (product) => Number(product?.price ?? 0);

    if (sort === 'price-asc') {
      return products.sort((a, b) => getPriceValue(a) - getPriceValue(b));
    }

    if (sort === 'price-desc') {
      return products.sort((a, b) => getPriceValue(b) - getPriceValue(a));
    }

    return products;
  }, [data?.products, sort]);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-clip">
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
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">
            {category || 'Shop All Products'}
          </h1>
          {subcategory && (
            <p className="text-slate-600 text-lg mt-2">{subcategory}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="hidden lg:block w-72 flex-shrink-0">
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
            <nav className="flex flex-wrap items-center gap-2 text-sm mb-5 sm:mb-6 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
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
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Filter className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Filters</span>
                </button>

                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
                  <Package className="w-4 h-4 text-slate-600" />
                  <p className="text-sm font-medium text-slate-700">
                    {isLoading ? 'Loading...' : `${data?.total || 0} products`}
                  </p>
                </div>
              </div>

              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:border-slate-900 transition-colors cursor-pointer"
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
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square bg-slate-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 rounded w-1/2" />
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
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
                    <button
                      onClick={() => setParam('page', String(Math.max(1, Number(page) - 1)))}
                      disabled={Number(page) <= 1}
                      className="px-5 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-slate-600">
                      Page <span className="text-slate-900 font-semibold">{page}</span> of {data.totalPages}
                    </span>
                    <button
                      onClick={() => setParam('page', String(Number(page) + 1))}
                      disabled={Number(page) >= data.totalPages}
                      className="px-5 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white font-medium px-6 py-3 rounded-xl hover:bg-slate-700 transition-colors"
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
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-slate-50 z-50 overflow-y-auto lg:hidden shadow-2xl border-l border-slate-200">
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
