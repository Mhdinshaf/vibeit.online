import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { getActiveCampaign } from '../../services/api';

// Normalize hex color — add '#' if missing (e.g. 'ffd73c' → '#ffd73c')
const normalizeColor = (c) => {
  if (!c) return null;
  if (c.startsWith('#')) return c;
  if (/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(c)) return '#' + c;
  return null;
};

// Render text with a highlighted substring colored inline
const renderWithHighlight = (text = '', highlight = '', color) => {
  if (!highlight || !text) return text;
  const safeColor = normalizeColor(color) || '#000000';
  const parts = text.split(highlight);
  if (parts.length === 1) return text;
  return parts.reduce((acc, part, idx) => {
    if (idx === parts.length - 1) return acc.concat(part);
    return acc.concat(part, <span key={idx} style={{ color: safeColor }}>{highlight}</span>);
  }, []);
};

// Resolve a background: supports Tailwind class (e.g. 'bg-yellow-400') or hex color
const resolvePromoBackground = (bgGradient, fallbackClass) => {
  if (!bgGradient) return { bgClass: fallbackClass, bgStyle: {} };
  if (bgGradient.startsWith('#') || bgGradient.startsWith('rgb')) {
    return { bgClass: '', bgStyle: { backgroundColor: bgGradient } };
  }
  return { bgClass: bgGradient, bgStyle: {} };
};

const HeroSection = () => {
  const { data: activeCampaign, isLoading } = useQuery({
    queryKey: ['campaigns/active'],
    queryFn: getActiveCampaign,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    throwOnError: false,
  });

  const heroImages = activeCampaign?.sections?.hero || [];

  // Default fallback content shown when no CMS campaign is active
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
        actionLink: '/shop',
      },
      {
        title: 'Tech Gadgets',
        subtitle: 'Latest Collection',
        bgGradient: 'bg-blue-600',
        textColor: 'text-white',
        actionText: 'Explore',
        actionBg: 'bg-white hover:bg-slate-100',
        actionTextColor: 'text-blue-600',
        actionLink: '/shop',
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

  if (!activeCampaign || heroImages.length === 0) {
    return <DefaultHeroSection defaultContent={defaultContent} />;
  }

  const primaryImage = heroImages[0];

  // Promo cards = images at index 1 and 2 (NOT the primary hero image)
  const promoImages = heroImages.slice(1, 3);
  // Fill up to 2 promo cards: use CMS images first, then default fallbacks
  const promoCards = [
    promoImages[0] || null,
    promoImages[1] || null,
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-100 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
            {/* Left Column - Dynamic Content */}
            <div className="space-y-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
                {renderWithHighlight(
                  primaryImage.title || defaultContent.title,
                  primaryImage.highlightText,
                  primaryImage.highlightColor
                )}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-medium">
                {primaryImage.description || defaultContent.description}
              </p>

              {/* Promo Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {promoCards.map((promo, idx) => {
                  const fallback = defaultContent.promos[idx];

                  if (!promo) {
                    return (
                      <div
                        key={`default-${idx}`}
                        className={`${fallback.bgGradient} rounded-2xl p-4 sm:p-6 flex flex-col justify-between h-32 sm:h-40 hover:shadow-lg transition-all`}
                      >
                        <div>
                          <h3 className={`text-sm sm:text-base font-bold ${fallback.textColor} mb-1`}>{fallback.title}</h3>
                          <p className={`text-xs font-semibold ${fallback.textColor}`}>{fallback.subtitle}</p>
                        </div>
                        <Link to={fallback.actionLink || '/shop'} className={`inline-flex items-center gap-2 ${fallback.actionBg} ${fallback.actionTextColor} px-3 py-2 rounded-full text-xs font-bold transition-colors w-fit`}>
                          {fallback.actionText}<ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    );
                  }

                  const { bgClass, bgStyle } = resolvePromoBackground(promo.bgGradient, fallback.bgGradient);
                  const textColorClass = promo.textColor || fallback.textColor;

                  return (
                    <div
                      key={promo._id || promo._tempId || idx}
                      className={`${bgClass} rounded-2xl p-4 sm:p-6 flex flex-col justify-between h-32 sm:h-40 hover:shadow-lg transition-all`}
                      style={bgStyle}
                    >
                      <div>
                        <h3 className={`text-sm sm:text-base font-bold ${textColorClass} mb-1 line-clamp-2`}>{promo.title || fallback.title}</h3>
                        <p className={`text-xs font-semibold ${textColorClass} line-clamp-1`}>{promo.description || promo.subtitle || fallback.subtitle}</p>
                      </div>
                      <Link
                        to={promo.actionLink || fallback.actionLink || '/shop'}
                        className={`inline-flex items-center gap-2 ${promo.actionBg || fallback.actionBg} ${promo.actionTextColor || fallback.actionTextColor} px-3 py-2 rounded-full text-xs font-bold transition-colors w-fit`}
                      >
                        {promo.actionText || fallback.actionText || 'Explore'}<ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Hero Image: fixed height container so image always fills */}
            <div className="relative h-[360px] sm:h-[460px] lg:h-auto lg:min-h-[520px] overflow-hidden">
              <img
                src={primaryImage.imageUrl || defaultContent.image}
                alt={primaryImage.title || 'Hero'}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
                onError={(e) => { e.target.src = defaultContent.image; }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DefaultHeroSection = ({ defaultContent }) => (
  <section className="py-12 sm:py-16 lg:py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-100 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Left column */}
          <div className="space-y-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
              Your <span className="text-blue-600">One-Stop</span> <span className="text-blue-600">Shop</span> for Everything You Need!
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-medium">{defaultContent.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {defaultContent.promos.map((promo, idx) => (
                <div key={idx} className={`${promo.bgGradient} rounded-2xl p-4 sm:p-6 flex flex-col justify-between h-32 sm:h-40 hover:shadow-lg transition-all`}>
                  <div>
                    <h3 className={`text-sm sm:text-base font-bold ${promo.textColor} mb-1`}>{promo.title}</h3>
                    <p className={`text-xs font-semibold ${promo.textColor}`}>{promo.subtitle}</p>
                  </div>
                  <Link to={promo.actionLink || '/shop'} className={`inline-flex items-center gap-2 ${promo.actionBg} ${promo.actionTextColor} px-3 py-2 rounded-full text-xs font-bold transition-colors w-fit`}>
                    {promo.actionText}<ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
          {/* Right column: image always fills — object-cover with absolute inset */}
          <div className="relative h-[360px] sm:h-[460px] lg:h-auto lg:min-h-[520px] overflow-hidden">
            <img
              src={defaultContent.image}
              alt="Hero"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
