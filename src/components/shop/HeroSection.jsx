import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { getActiveCampaign } from '../../services/api';

const HeroSection = () => {
  // Fetch active campaign
  const { data: activeCampaign, isLoading } = useQuery({
    queryKey: ['campaigns/active'],
    queryFn: getActiveCampaign,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1, // Retry once on failure
    throwOnError: false, // Don't throw on error, let component handle it
  });

  const heroImages = activeCampaign?.sections?.hero || [];

  // Fallback content
  const defaultContent = {
    title: 'Your One-Stop Shop for Everything You Need!',
    description: 'Shop premium products at unbeatable prices with fast delivery across Sri Lanka.',
    promos: [
      {
        title: 'Premium Fashion',
        subtitle: 'Up to 40% OFF',
        bgGradient: 'bg-yellow-400',
        textColor: 'text-slate-900',
        actionText: 'Shop now',
        actionBg: 'bg-blue-600 hover:bg-blue-700',
        actionTextColor: 'text-white',
      },
      {
        title: 'Tech Gadgets',
        subtitle: 'Latest Collection',
        bgGradient: 'bg-blue-600',
        textColor: 'text-white',
        actionText: 'Explore',
        actionBg: 'bg-white hover:bg-slate-100',
        actionTextColor: 'text-blue-600',
      },
    ],
    image: '/hero_fashion.png',
  };

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-100 rounded-3xl overflow-hidden h-96 animate-pulse" />
        </div>
      </section>
    );
  }

  // If no active campaign, show default
  if (!activeCampaign || heroImages.length === 0) {
    return <DefaultHeroSection defaultContent={defaultContent} />;
  }

  // Show first hero image or use a carousel
  const primaryImage = heroImages[0];

  // helper: render text with highlighted substring
  const renderWithHighlight = (text = '', highlight = '', color) => {
    if (!highlight) return text;
    const safeColor = color || '#000000';
    // split by highlight (case-sensitive)
    const parts = text.split(highlight);
    if (parts.length === 1) return text;
    return parts.reduce((acc, part, idx) => {
      if (idx === parts.length - 1) return acc.concat(part);
      return acc.concat(part, /* highlight */ <span key={idx} style={{ color: safeColor }}>{highlight}</span>);
    }, []);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-100 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 sm:p-12 lg:p-16">
            {/* Left Column - Dynamic Content */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                {primaryImage.title || defaultContent.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-medium">
                {primaryImage.description || defaultContent.description}
              </p>

              {/* Promo Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(() => {
                  // promo items should NOT include the primary hero (index 0)
                  const promoItems = heroImages.slice(1, 3); // take up to 2 promos after the primary
                  const filled = promoItems.concat(defaultContent.promos).slice(0, 2);
                  return filled.map((promo, idx) => {
                    const fallbackPromo = defaultContent.promos[idx];
                    const textColorClass = promo.textColor || fallbackPromo?.textColor || '';
                    return (
                      <div
                        key={promo._id || promo._tempId || idx}
                        className={`${promo.bgGradient || fallbackPromo?.bgGradient} rounded-2xl p-4 sm:p-6 flex flex-col justify-between h-32 sm:h-40 group hover:shadow-lg transition-all`}
                      >
                        <div>
                          <h3 className={`text-sm sm:text-base font-bold ${textColorClass} mb-1`}>
                            {renderWithHighlight(promo.title || fallbackPromo?.title || '', promo.highlightText, promo.highlightColor)}
                          </h3>
                          <p className={`text-xs font-semibold ${textColorClass}`}>
                            {renderWithHighlight(promo.description || promo.subtitle || fallbackPromo?.subtitle || '', promo.highlightText, promo.highlightColor)}
                          </p>
                        </div>
                        <Link
                          to={promo.actionLink || fallbackPromo?.actionLink || '/shop'}
                          className={`inline-flex items-center gap-2 ${promo.actionBg || fallbackPromo?.actionBg || 'bg-blue-600 hover:bg-blue-700 text-white'} px-3 py-2 rounded-full text-xs font-bold transition-colors w-fit`}
                        >
                          {promo.actionText || fallbackPromo?.actionText || 'Explore'}
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Right Column - Hero Image */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-sm lg:max-w-none">
                <img
                  src={primaryImage.imageUrl || defaultContent.image}
                  alt={primaryImage.title || 'Hero'}
                  className="w-full h-auto object-contain drop-shadow-xl transform lg:scale-110 lg:translate-x-8 transition-transform hover:scale-105 lg:hover:scale-125"
                  onError={(e) => {
                    e.target.src = defaultContent.image;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DefaultHeroSection = ({ defaultContent }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-100 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-8 sm:p-12 lg:p-16">
            {/* Left Column */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Your <span className="text-blue-600">One-Stop</span> <span className="text-blue-600">Shop</span> for Everything You Need!
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-medium">
                {defaultContent.description}
              </p>

              {/* Promo Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {defaultContent.promos.map((promo, idx) => (
                  <div
                    key={idx}
                    className={`${promo.bgGradient} rounded-2xl p-4 sm:p-6 flex flex-col justify-between h-32 sm:h-40 group hover:shadow-lg transition-all`}
                  >
                    <div>
                      <h3 className={`text-sm sm:text-base font-bold ${promo.textColor} mb-1`}>
                        {promo.title}
                      </h3>
                      <p className={`text-xs font-semibold ${promo.textColor}`}>
                        {promo.subtitle}
                      </p>
                    </div>
                    <button className={`inline-flex items-center gap-2 ${promo.actionBg} ${promo.actionTextColor} px-3 py-2 rounded-full text-xs font-bold transition-colors w-fit`}>
                      {promo.actionText}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-sm lg:max-w-none">
                <img
                  src={defaultContent.image}
                  alt="Person with yellow shopping bags"
                  className="w-full h-auto object-contain drop-shadow-xl transform lg:scale-110 lg:translate-x-8 transition-transform hover:scale-105 lg:hover:scale-125"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
