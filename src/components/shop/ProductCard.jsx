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
    <article className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-colors duration-200 overflow-hidden flex flex-col h-full rounded-lg">
      <Link to={`/product/${product._id}`} className="flex-1 flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-white dark:bg-slate-700 p-4">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-300 group-hover:scale-105"
          />

          {isOnSale && (
            <div className="absolute top-3 right-3">
              <span className="rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-bold px-3 py-1.5 shadow-lg">
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
          <h3 className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2 mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>

          <div className="mt-auto pt-2 flex items-center gap-2">
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
            className="w-full rounded-md bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 text-sm font-semibold px-4 py-2 cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : requiresSizeSelection ? (
          <Link
            to={`/product/${product._id}`}
            className="flex items-center justify-center w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 transition-colors duration-200"
          >
            Select Options
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 transition-colors duration-200"
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
