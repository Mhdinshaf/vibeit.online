import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../context/store';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const NON_SELECTABLE_SIZES = new Set(['free size', 'freesize', 'one size', 'onesize', 'standard', 'default']);

  // Handle image - could be string URL or object with url property
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    if (typeof img === 'string') return img;
    if (img.url) return img.url;
    return '/placeholder.jpg';
  };

  const isOnSale = product.discountPrice && product.discountPrice < product.originalPrice;
  const isOutOfStock = product.stockQuantity === 0;
  const normalizedSizes = (product.sizes || [])
    .map((size) => String(size || '').trim())
    .filter(Boolean);
  const selectableSizes = normalizedSizes.filter((size) => !NON_SELECTABLE_SIZES.has(size.toLowerCase()));
  const requiresSizeSelection = selectableSizes.length > 0;
  const defaultCartSize = normalizedSizes[0] || '';
  const discountPercent = isOnSale 
    ? Math.round((1 - product.discountPrice / product.originalPrice) * 100) 
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) return;

    addItem(product, 1, defaultCartSize);
    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
      position: 'bottom-right',
    });
  };

  return (
    <article className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <Link to={`/product/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {isOnSale && (
            <div className="absolute top-3 right-3">
              <span className="rounded-full bg-slate-900 text-white text-xs font-semibold px-3 py-1.5">
                -{discountPercent}%
              </span>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-slate-900 text-white font-semibold text-xs uppercase tracking-wide px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 font-medium mb-2">
            {product.category}
          </p>

          <h3 className="text-base font-semibold text-slate-900 line-clamp-2 mb-3 leading-snug">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-1">
            {isOnSale ? (
              <>
                <span className="text-lg font-semibold text-slate-900">
                  රු{product.discountPrice?.toLocaleString()}
                </span>
                <span className="text-sm text-slate-400 line-through">
                  රු{product.originalPrice?.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-slate-900">
                රු{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        {isOutOfStock ? (
          <button
            disabled
            className="w-full rounded-xl bg-slate-100 text-slate-400 text-sm font-medium px-4 py-3 cursor-not-allowed"
          >
            Not available
          </button>
        ) : requiresSizeSelection ? (
          <Link
            to={`/product/${product._id}`}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-white text-sm font-medium transition-colors hover:bg-slate-700"
          >
            Select size
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-white text-sm font-medium transition-colors hover:bg-slate-700 group/btn"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Add to cart
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
