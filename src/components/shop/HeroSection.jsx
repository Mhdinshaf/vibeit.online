import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveCampaign } from '../../services/api';

// Normalize hex color — add '#' if missing (e.g. 'ffd73c' → '#ffd73c')
const normalizeColor = (c) => {
  if (!c) return null;
  if (c.startsWith('#')) return c;
  if (/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(c)) return '#' + c;
  return null;
};

const renderWithHighlight = (text = '', highlight = '', color) => {
  if (!highlight || !text) return text;
  const safeColor = normalizeColor(color) || '#ffd700';
  const parts = text.split(highlight);
  if (parts.length === 1) return text;
  return parts.reduce((acc, part, idx) => {
    if (idx === parts.length - 1) return acc.concat(part);
    return acc.concat(part, <span key={idx} style={{ color: safeColor }}>{highlight}</span>);
  }, []);
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

  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((idx) => {
    if (isTransitioning || idx === activeSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSlide(idx);
      setIsTransitioning(false);
    }, 300);
  }, [activeSlide, isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((activeSlide + 1) % heroImages.length);
  }, [activeSlide, heroImages.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((activeSlide - 1 + heroImages.length) % heroImages.length);
  }, [activeSlide, heroImages.length, goToSlide]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length, nextSlide]);

  // Reset slide index when campaign changes
  useEffect(() => { setActiveSlide(0); }, [activeCampaign]);

  const defaultContent = {
    title: 'Your One-Stop Shop for Everything You Need!',
    description: 'Shop premium products at unbeatable prices with fast delivery across Sri Lanka.',
    image: '/hero_fashion.png',
    promos: [
      { title: 'Premium Fashion', subtitle: 'Up to 40% OFF', bgGradient: 'bg-yellow-400', textColor: 'text-slate-900', actionText: 'Shop now', actionBg: 'bg-blue-600 hover:bg-blue-700', actionTextColor: 'text-white', actionLink: '/shop' },
      { title: 'Tech Gadgets', subtitle: 'Latest Collection', bgGradient: 'bg-blue-600', textColor: 'text-white', actionText: 'Explore', actionBg: 'bg-white hover:bg-slate-100', actionTextColor: 'text-blue-600', actionLink: '/shop' },
    ],
  };

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-100 rounded-3xl overflow-hidden h-[520px] animate-pulse" />
        </div>
      </section>
    );
  }

  if (!activeCampaign || heroImages.length === 0) {
    return <DefaultHeroSection defaultContent={defaultContent} />;
  }

  const slide = heroImages[activeSlide] || heroImages[0];
  const total = heroImages.length;

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-100 rounded-3xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">

            {/* ── Left Column ── */}
            <div className="space-y-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">

              {/* Slide counter badge */}
              {total > 1 && (
                <div className="flex items-center gap-2 w-fit">
                  <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                    {activeSlide + 1} / {total}
                  </span>
                </div>
              )}

              {/* Title with optional highlight */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 transition-opacity duration-300"
                style={{ opacity: isTransitioning ? 0 : 1 }}
              >
                {renderWithHighlight(
                  slide.title || defaultContent.title,
                  slide.highlightText,
                  slide.highlightColor
                )}
              </h1>

              {/* Description */}
              <p
                className="text-base sm:text-lg text-gray-600 font-medium transition-opacity duration-300"
                style={{ opacity: isTransitioning ? 0 : 1 }}
              >
                {slide.description || defaultContent.description}
              </p>

              {/* Action button */}
              {slide.actionLink && (
                <div className="transition-opacity duration-300" style={{ opacity: isTransitioning ? 0 : 1 }}>
                  <Link
                    to={slide.actionLink}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-6 py-3 rounded-full text-sm font-bold transition-colors shadow-md hover:shadow-lg"
                  >
                    {slide.actionText || 'Explore'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Navigation dots + arrows */}
              {total > 1 && (
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={prevSlide}
                    className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-700" />
                  </button>

                  <div className="flex items-center gap-2">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`rounded-full transition-all duration-300 ${
                          idx === activeSlide
                            ? 'w-6 h-2.5 bg-slate-900'
                            : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="w-9 h-9 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              )}
            </div>

            {/* ── Right Column — Hero image ── */}
            <div className="relative h-[360px] sm:h-[460px] lg:h-auto lg:min-h-[520px] overflow-hidden">
              {heroImages.map((img, idx) => (
                <img
                  key={img._id || img._tempId || idx}
                  src={img.imageUrl || defaultContent.image}
                  alt={img.title || `Slide ${idx + 1}`}
                  fetchPriority={idx === 0 ? 'high' : 'low'}
                  decoding="async"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    idx === activeSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={(e) => { e.target.src = defaultContent.image; }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ── Default (no active campaign) ──────────────────────────────
const DefaultHeroSection = ({ defaultContent }) => (
  <section className="py-12 sm:py-16 lg:py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-100 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
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
          <div className="relative h-[360px] sm:h-[460px] lg:h-auto lg:min-h-[520px] overflow-hidden">
            <img src={defaultContent.image} alt="Hero" fetchPriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
