import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveCampaign } from '../../services/api';

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

const defaultContent = {
  title: 'Your One-Stop Shop for Everything You Need!',
  description: 'Shop premium products at unbeatable prices with fast delivery across Sri Lanka.',
  image: '/hero_fashion.png',
  promos: [
    { title: 'Premium Fashion', subtitle: 'Up to 40% OFF', bgGradient: 'bg-yellow-400', textColor: 'text-slate-900', actionText: 'Shop now', actionBg: 'bg-blue-600 hover:bg-blue-700', actionTextColor: 'text-white', actionLink: '/shop' },
    { title: 'Tech Gadgets', subtitle: 'Latest Collection', bgGradient: 'bg-blue-600', textColor: 'text-white', actionText: 'Explore', actionBg: 'bg-white hover:bg-slate-100', actionTextColor: 'text-blue-600', actionLink: '/shop' },
  ],
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
  const total = heroImages.length;

  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((idx) => {
    if (isTransitioning || idx === activeSlide) return;
    setIsTransitioning(true);
    setTimeout(() => { setActiveSlide(idx); setIsTransitioning(false); }, 300);
  }, [activeSlide, isTransitioning]);

  const nextSlide = useCallback(() => goToSlide((activeSlide + 1) % total), [activeSlide, total, goToSlide]);
  const prevSlide = useCallback(() => goToSlide((activeSlide - 1 + total) % total), [activeSlide, total, goToSlide]);

  // Auto-advance
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [total, nextSlide]);

  useEffect(() => { setActiveSlide(0); }, [activeCampaign]);

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-100 rounded-3xl overflow-hidden h-[480px] animate-pulse" />
        </div>
      </section>
    );
  }

  if (!activeCampaign || total === 0) {
    return <DefaultHeroSection />;
  }

  const slide = heroImages[activeSlide] || heroImages[0];

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Outer card — relative so arrows can be positioned on its left/right edges */}
        <div className="relative bg-gray-100 rounded-3xl overflow-hidden">

          {/* ── Left Arrow — pinned to left edge, vertically centred ── */}
          {total > 1 && (
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-md flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}

          {/* ── Right Arrow — pinned to right edge, vertically centred ── */}
          {total > 1 && (
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 shadow-md flex items-center justify-center hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">

            {/* ── Image column — TOP on mobile (order-first), RIGHT on desktop ── */}
            <div className="relative h-64 sm:h-80 lg:h-auto lg:min-h-[520px] overflow-hidden order-first lg:order-last">
              {heroImages.map((img, idx) => (
                <img
                  key={img._id || img._tempId || idx}
                  src={img.imageUrl || defaultContent.image}
                  alt={img.title || `Slide ${idx + 1}`}
                  fetchPriority={idx === 0 ? 'high' : 'low'}
                  decoding="async"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'}`}
                  onError={(e) => { e.target.src = defaultContent.image; }}
                />
              ))}
            </div>

            {/* ── Text column — BOTTOM on mobile, LEFT on desktop ── */}
            <div className="flex flex-col justify-center space-y-5 p-6 sm:p-10 lg:p-16 order-last lg:order-first">
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 transition-opacity duration-300"
                style={{ opacity: isTransitioning ? 0 : 1 }}
              >
                {renderWithHighlight(slide.title || defaultContent.title, slide.highlightText, slide.highlightColor)}
              </h1>

              <p
                className="text-base sm:text-lg text-gray-600 font-medium transition-opacity duration-300"
                style={{ opacity: isTransitioning ? 0 : 1 }}
              >
                {slide.description || defaultContent.description}
              </p>

              {slide.actionLink && (
                <div className="transition-opacity duration-300" style={{ opacity: isTransitioning ? 0 : 1 }}>
                  <Link
                    to={slide.actionLink}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-6 py-3 rounded-full text-sm font-bold transition-colors shadow-md"
                  >
                    {slide.actionText || 'Explore'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Dots only — no arrows, no counter */}
              {total > 1 && (
                <div className="flex items-center gap-2 pt-1">
                  {heroImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        idx === activeSlide ? 'w-6 h-2.5 bg-slate-900' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Default Hero (no active campaign) ── */
const DefaultHeroSection = () => (
  <section className="py-12 sm:py-16 lg:py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-100 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Image top on mobile */}
          <div className="relative h-64 sm:h-80 lg:h-auto lg:min-h-[520px] overflow-hidden order-first lg:order-last">
            <img src={defaultContent.image} alt="Hero" fetchPriority="high" decoding="async"
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          {/* Text bottom on mobile */}
          <div className="flex flex-col justify-center space-y-6 p-6 sm:p-10 lg:p-16 order-last lg:order-first">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900">
              Your <span className="text-blue-600">One-Stop</span> <span className="text-blue-600">Shop</span> for Everything You Need!
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-medium">{defaultContent.description}</p>
            <div className="grid grid-cols-2 gap-4">
              {defaultContent.promos.map((promo, idx) => (
                <div key={idx} className={`${promo.bgGradient} rounded-2xl p-4 flex flex-col justify-between h-32 hover:shadow-lg transition-all`}>
                  <div>
                    <h3 className={`text-sm font-bold ${promo.textColor} mb-1`}>{promo.title}</h3>
                    <p className={`text-xs font-semibold ${promo.textColor}`}>{promo.subtitle}</p>
                  </div>
                  <Link to={promo.actionLink || '/shop'} className={`inline-flex items-center gap-1 ${promo.actionBg} ${promo.actionTextColor} px-3 py-1.5 rounded-full text-xs font-bold transition-colors w-fit`}>
                    {promo.actionText}<ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
