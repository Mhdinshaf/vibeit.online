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
    <article className="group rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      style={{ 
        backgroundColor: '#fff',
        borderColor: '#67BAF4'
      }}>
      <Link to={`/product/${product._id}`}>
        <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: '#FAFAFA' }}>
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {isOnSale && (
            <div className="absolute top-3 right-3">
              <span className="rounded-full text-white text-xs font-semibold px-3 py-1.5"
                style={{ backgroundColor: '#1E466B' }}>
                -{discountPercent}%
              </span>
            </div>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-semibold text-xs uppercase tracking-wide px-4 py-2 rounded-full"
                style={{ backgroundColor: '#1E466B' }}>
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 md:p-5">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.14em] font-medium mb-2"
            style={{ color: '#1E466B' }}>
            {product.category}
          </p>

          <h3 className="text-sm sm:text-base font-semibold line-clamp-2 mb-3 leading-snug"
            style={{ color: '#0D0D0D' }}>
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-1">
            {isOnSale ? (
              <>
                <span className="text-lg font-semibold" style={{ color: '#0D0D0D' }}>
                  රු{product.discountPrice?.toLocaleString()}
                </span>
                <span className="text-sm line-through" style={{ color: '#67BAF4' }}>
                  රු{product.originalPrice?.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold" style={{ color: '#0D0D0D' }}>
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
            className="w-full rounded-xl text-sm font-medium px-4 py-3 cursor-not-allowed"
            style={{ 
              backgroundColor: '#FAFAFA',
              color: '#67BAF4'
            }}
          >
            Not available
          </button>
        ) : requiresSizeSelection ? (
          <Link
            to={`/product/${product._id}`}
            className="flex items-center justify-center gap-2 w-full rounded-xl border px-4 py-3 text-white text-sm font-medium transition-colors"
            style={{
              backgroundColor: '#1E466B',
              borderColor: '#1E466B'
            }}
          >
            Select size
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-full rounded-xl border px-4 py-3 text-white text-sm font-medium transition-colors group/btn"
            style={{
              backgroundColor: '#1E466B',
              borderColor: '#1E466B'
            }}
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
