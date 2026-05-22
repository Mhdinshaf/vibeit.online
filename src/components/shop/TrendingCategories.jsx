import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Headphones, Flame } from 'lucide-react';
import { getActiveCampaign } from '../../services/api';

const TrendingCategories = () => {
  // Fetch active campaign
  const { data: activeCampaign, isLoading } = useQuery({
    queryKey: ['campaigns/active'],
    queryFn: getActiveCampaign,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1, // Retry once on failure
    throwOnError: false, // Don't throw on error, let component handle it
  });

  const categoryImages = activeCampaign?.sections?.trendingCategories || [];

  // Fallback content
  const defaultCategories = [
    {
      id: 'tech',
      title: 'Tech Gadgets',
      badges: ['Electronic', 'Gadget'],
      image: '/hero_tech.png',
      actionLink: '/shop?category=Tech%20Gadgets',
      isPrimary: true,
      icon: Headphones,
    },
    {
      id: 'furniture',
      title: 'Furniture & Home',
      badge: 'Home',
      image: '/hero_home.png',
      actionLink: '/shop?category=Home%20Accessories',
    },
    {
      id: 'fashion',
      title: 'Fashion & Accessories',
      badge: 'Fashion',
      image: '/hero_luxury.png',
      actionLink: '/shop?category=Ladies%20Dresses',
    },
    {
      id: 'trending',
      title: 'Trending Items',
      badges: ['Trending', 'Hot'],
      icon: Flame,
      isPrimary: true,
      actionLink: '/shop?sort=trending',
    },
  ];

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96 bg-slate-200 rounded-3xl animate-pulse" />
        </div>
      </section>
    );
  }

  // Use dynamic content if available, otherwise use defaults
  const categories = categoryImages.length > 0 ? categoryImages : defaultCategories;

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Explore Trending Categories</h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium">Discover our best collections</p>
          </div>
          <Link to="/shop" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {/* Render categories */}
          {categories.map((category, idx) => {
            const Icon = category.icon;
            const badge = Array.isArray(category.badges) ? category.badges[0] : (category.badge || category.badges);

            if (category.isPrimary && idx === 0) {
              // Large primary card (left)
              return (
                <div
                  key={category.id || idx}
                  className="sm:col-span-1 lg:row-span-2 bg-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-auto sm:h-[400px] lg:h-full group overflow-hidden relative"
                >
                  <div className="absolute -top-8 -right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    {Icon ? <Icon className="w-32 h-32 sm:w-40 sm:h-40 text-white" /> : null}
                  </div>
                  <div className="relative z-10">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(category.badges) && category.badges.map((b, i) => (
                        <span key={i} className="bg-white/20 text-white px-4 py-1 rounded-full text-xs font-bold">
                          {b}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{category.title}</h3>
                  </div>
                  {category.image && (
                    <div className="relative z-10 flex justify-center my-4">
                      <img src={category.image} alt={category.title} className="max-h-32 sm:max-h-40 object-contain drop-shadow-lg" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                  <Link to={category.actionLink || '/shop'} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors w-fit relative z-10">
                    Explore product
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            }

            if (idx === 1 || idx === 2) {
              // Middle column cards
              return (
                <div key={category.id || idx} className={idx === 1 ? 'sm:col-span-1 space-y-4 lg:space-y-6' : ''}>
                  <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 hover:border-blue-500 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="bg-slate-100 text-slate-700 px-4 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                          {badge || 'Category'}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">{category.title}</h3>
                      </div>
                    </div>
                    {category.image && (
                      <div className="flex justify-center my-6 h-24 sm:h-32">
                        <img src={category.image} alt={category.title} className="max-h-full max-w-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                      </div>
                    )}
                    <Link to={category.actionLink || '/shop'} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors">
                      Explore product
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            }

            if (category.isPrimary && idx === 3) {
              // Large secondary card (right) - Trending
              return (
                <div
                  key={category.id || idx}
                  className="sm:col-span-1 lg:row-span-2 bg-yellow-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-auto sm:h-[400px] lg:h-full group overflow-hidden relative hover:shadow-lg transition-all"
                >
                  <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    {Icon ? <Icon className="w-40 h-40 sm:w-48 sm:h-48 text-slate-900" /> : null}
                  </div>
                  <div className="relative z-10">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(category.badges) && category.badges.map((b, i) => (
                        <span key={i} className="bg-slate-900/20 text-slate-900 px-4 py-1 rounded-full text-xs font-bold">
                          {b}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{category.title}</h3>
                  </div>
                  {category.image ? (
                    <div className="relative z-10 flex justify-center my-4">
                      <img src={category.image} alt={category.title} className="max-h-32 sm:max-h-40 object-contain drop-shadow-lg" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  ) : Icon && (
                    <div className="relative z-10 flex justify-center my-4">
                      <Icon className="w-24 sm:w-32 h-24 sm:h-32 text-slate-900 drop-shadow-lg" />
                    </div>
                  )}
                  <Link to={category.actionLink || '/shop'} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors w-fit relative z-10">
                    Explore product
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingCategories;
