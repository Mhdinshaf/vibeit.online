import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../context/store';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const NON_SELECTABLE_SIZES = new Set(['free size', 'freesize', 'one size', 'onesize', 'standard', 'default', 'none', 'n/a', 'null', 'undefined', 'no size']);

  // Handle image - supports both imageUrls (DB field) and images (virtual/alias)
  // NOTE: After $facet aggregation, Mongoose virtuals don't execute,
  // so we must check both imageUrls and images to be safe.
  const getImageUrl = (product) => {
    // Try imageUrls first (actual DB field), then images (virtual)
    const arr = product?.imageUrls || product?.images || [];
    const first = Array.isArray(arr) ? arr[0] : arr;
    if (!first) return null;
    if (typeof first === 'string') return first;
    if (first?.url) return first.url;
    return null;
  };

  // Safe Cloudinary optimization: only transform if URL is a plain upload
  // (no existing transformations in the path already)
  const getOptimizedImageUrl = (url) => {
    if (!url) return null;
    if (!url.includes('res.cloudinary.com')) return url;
    // If URL already has transformations (e.g., /upload/w_400,... or /upload/f_auto,...)
    // skip to avoid double-transforming
    if (/\/upload\/[a-z]/.test(url)) return url;
    // Safe to add transformations
    return url.replace('/upload/', '/upload/f_auto,q_auto:eco,w_500,h_500,c_limit/');
  };

  const rawImageUrl = getImageUrl(product);
  const imageUrl = getOptimizedImageUrl(rawImageUrl);

  const isOnSale = product.discountPrice && product.discountPrice < product.originalPrice;
  const isOutOfStock = product.stockQuantity === 0;
  const normalizedSizes = (product.sizes || [])
    .map((size) => String(size || '').trim())
    .filter(Boolean);
  const selectableSizes = normalizedSizes.filter((size) => !NON_SELECTABLE_SIZES.has(size.toLowerCase()));
  const requiresSizeSelection = selectableSizes.length > 1;
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
    <article className="group flex flex-col h-full rounded-xl border border-slate-200/80 dark:border-slate-700/70 bg-white dark:bg-slate-900/70 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
      <Link to={`/product/${product._id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-5">
          <img
            src={imageUrl}
            alt={product.name || product.title || 'Product'}
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              // If optimized URL fails, fall back to original URL
              if (rawImageUrl && e.target.src !== rawImageUrl) {
                e.target.src = rawImageUrl;
              }
            }}
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-105"
          />

          {isOnSale && (
            <div className="absolute top-3 right-3">
              <span className="rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white text-[11px] font-bold px-3 py-1.5 shadow-lg">
                -{discountPercent}%
              </span>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-slate-900 dark:bg-slate-700 text-white font-bold text-xs uppercase tracking-wide px-4 py-2 rounded-xl">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.isFeatured && (
              <span className="text-[10px] uppercase tracking-[0.1em] bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 font-bold px-2 py-0.5 rounded-sm border border-rose-100 dark:border-rose-800">
                Featured
              </span>
            )}
            {product.subcategory && (
              <span className="text-[10px] uppercase tracking-[0.1em] bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold px-2 py-0.5 rounded-sm border border-blue-100 dark:border-blue-800">
                {product.subcategory}
              </span>
            )}
            {product.tags && product.tags.slice(0, 1).map((tag, i) => (
              <span key={i} className="text-[10px] uppercase tracking-[0.1em] bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-sm border border-slate-200 dark:border-slate-700">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>

          <div className="mt-auto flex items-center gap-2">
            {isOnSale ? (
              <>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  රු{product.discountPrice?.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  රු{product.originalPrice?.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                රු{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        {isOutOfStock ? (
          <button
            disabled
            className="w-full rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-sm font-semibold px-4 py-2.5 cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : requiresSizeSelection ? (
          <Link
            to={`/product/${product._id}`}
            className="flex items-center justify-center w-full rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2.5 transition-colors duration-200"
          >
            Select Options
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 transition-colors duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to cart
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
