import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, ChevronRight, ChevronLeft, ChevronDown, Package, SlidersHorizontal, Home, Smartphone, Flame, Watch, Droplets, Sparkles, Gift, Bike, Shirt, Briefcase, Car, BookOpen, Heart, Wrench, Activity, Headphones, Plane, ShoppingBag } from 'lucide-react';
import { getProducts } from '../../services/api';
import ProductCard from '../../components/shop/ProductCard';

const CATEGORIES = [
  { name: 'Tech Gadgets & Accessories', icon: Smartphone, subcategories: ['Smartphones & Tablets', 'Mobile Accessories', 'Power Banks & Portable Chargers', 'Charging Cables & Adapters', 'Earbuds, Headphones & Headsets', 'Smart Watches & Fitness Bands', 'Bluetooth Speakers & Audio', 'Computer & Laptop Accessories', 'Storage Devices', 'Gaming Accessories', 'Smart Home Devices', 'Drones & Action Cameras', 'Photography & Vlog Gear'] },
  { name: 'Home, Lifestyle & Appliances', icon: Home, subcategories: ['Kitchenware', 'Small Kitchen Appliances', 'Bedding', 'Wall Decor, Clocks & Paintings', 'Home Lighting', 'Storage & Organization', 'Bathroom Accessories & Towels', 'Cleaning Tools & Supplies', 'Tools & Home Improvement', 'Indoor Plants & Garden Accessories'] },
  { name: 'Beauty, Health & Personal Care', icon: Heart, subcategories: ['Skincare', 'Makeup & Cosmetics', 'Perfumes & Body Mists', 'Hair Care', "Men's Grooming", "Women's Grooming", 'Bath & Body', 'Health & Wellness Monitors'] },
  { name: "Women's Fashion & Accessories", icon: Shirt, subcategories: ['Ladies Dresses', 'Tops, Blouses & T-Shirts', 'Jeans, Pants & Leggings', 'Lingerie, Sleepwear & Loungewear', 'Handbags, Totes & Purses', 'Shoes, Flats & Heels', 'Jewelry', 'Sunglasses & Hair Accessories'] },
  { name: "Men's Fashion & Accessories", icon: Briefcase, subcategories: ['Shirts', 'T-Shirts & Polo Shirts', 'Jeans, Trousers & Shorts', 'Activewear & Gym Clothes', 'Wallets & Belts', 'Shoes, Sneakers & Sandals', 'Caps & Hats', 'Underwear & Socks', 'Sunglasses'] },
  { name: 'Babies, Kids & Toys', icon: Gift, subcategories: ['Toys', 'Kids Clothing', 'Baby Care', 'Feeding Essentials', 'School Bags & Stationery', 'Baby Gear'] },
  { name: 'Sports, Outdoors & Hobbies', icon: Bike, subcategories: ['Fitness & Gym Equipment', 'Bicycle Parts & Accessories', 'Camping & Hiking Gear', 'Sports Equipment', 'Musical Instruments & Accessories', 'Art & Craft Supplies'] },
  { name: 'Automotive & Motorcycle Accessories', icon: Car, subcategories: ['Motorcycle Accessories', 'Car Interior Accessories', 'Car Care & Cleaning Products', 'Vehicle Electronics'] },
  { name: 'Office & Stationery', icon: BookOpen, subcategories: ['Office Supplies', 'Stationery'] },
  { name: 'Torches & Portable Lighting', icon: Flame, subcategories: ['Rechargeable Torches', 'Tactical & Heavy-Duty Torches', 'Headlamps & Head Torches', 'Camping Lanterns & Tents Lights', 'Emergency Lights', 'Mini & Keychain Torches', 'Work Lights & Spotlights', 'Solar Torches & Lights', 'Bicycle Lights'] },
  { name: 'Groceries & Pet Supplies', icon: ShoppingBag, subcategories: ['Snacks & Beverages', 'Tea & Coffee', 'Pantry Essentials', 'Pet Food & Treats', 'Pet Accessories'] },
  { name: 'Hardware & DIY Tools', icon: Wrench, subcategories: ['Power Tools', 'Hand Tools', 'Electrical & Wiring', 'Plumbing Supplies', 'Paints & Home DIY'] },
  { name: 'Gifts, Events & Party Supplies', icon: Sparkles, subcategories: ['Gift Boxes & Wrapping Paper', 'Party Decorations', 'Greeting Cards', 'Customized & Personalized Gifts'] },
  { name: 'Watches & Jewelry', icon: Watch, subcategories: ["Men's Watches", "Women's Watches", 'Smart Watches & Fitness Bands', 'Couple Watches', 'Fine & Fashion Jewelry'] },
  { name: 'Health & Medical Care', icon: Activity, subcategories: ['Vitamins & Supplements', 'First Aid & Medical Supplies', 'Mobility & Support Braces', 'Massagers & Relaxation Devices'] },
  { name: 'Books, Music & Media', icon: Headphones, subcategories: ['Educational & School Books', 'Novels & Fiction', 'Musical Instruments', 'Vinyl Records & CDs'] },
  { name: 'Luggage & Travel Essentials', icon: Plane, subcategories: ['Suitcases & Trolley Bags', 'Travel Adapters & Accessories', 'Neck Pillows & Eye Masks'] },
];

const FilterPanel = ({ searchParams, setParam, setParams, clearFilters, onSubcategorySelect }) => {
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const expandedCategory = category || null;

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
                      setParams({ category: '', subcategory: '' });
                    } else {
                      setParams({ category: cat.name, subcategory: '' });
                    }
                  }}
                  className={`w-full flex items-start justify-between px-3 py-2.5 rounded-md text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                  >
                    <span className="flex items-start gap-3 text-left flex-1 pr-3">
                      <cat.icon className={`w-4 h-4 shrink-0 mt-[2px] ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="leading-snug">{cat.name}</span>
                    </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 mt-[2px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="ml-4 mt-1 mb-2 space-y-1 border-l-2 border-slate-100 pl-2">
                    {cat.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => onSubcategorySelect(cat.name, sub)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm leading-snug transition-colors ${
                            subcategory === sub
                              ? 'text-blue-600 font-semibold bg-blue-50/50'
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

  const setParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    if (!Object.prototype.hasOwnProperty.call(updates, 'page')) {
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
                setParams={setParams}
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

                {true && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-10 pb-8">
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
                      {Array.from({ length: data.pages || 1 }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === (data.pages || 1) || (p >= Number(page) - 1 && p <= Number(page) + 1))
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
                        const newPage = Math.min(data.pages, Number(page) + 1);
                        setParam('page', String(newPage));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={Number(page) >= data.pages}
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
          <div className="fixed inset-y-0 right-0 w-80 sm:w-96 max-w-[85vw] bg-white dark:bg-slate-900 z-50 overflow-y-auto md:hidden shadow-2xl border-l border-slate-200 dark:border-slate-700">
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
                setParams={setParams}
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
