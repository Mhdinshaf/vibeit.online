import { Link } from 'react-router-dom';
import { useCartStore } from '../../context/store';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  const isOnSale = product.discountPrice && product.discountPrice < product.originalPrice;
  const isOutOfStock = product.stockQuantity === 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) return;

    addItem(product, 1, '');
    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
      position: 'bottom-right',
    });
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product._id}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Sale Badge */}
          {isOnSale && <span className="badge-sale">SALE</span>}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-white font-bold text-lg uppercase tracking-wider">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1 tracking-wide">
            {product.category}
          </p>

          {/* Title */}
          <h3 className="font-bold uppercase text-sm text-gray-900 dark:text-white line-clamp-2 mb-2 leading-tight">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="mb-3">
            {isOnSale ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 line-through">
                  රු{product.originalPrice?.toLocaleString()}
                </span>
                <span className="text-lg font-bold text-blue-600">
                  රු{product.discountPrice?.toLocaleString()}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                රු{product.originalPrice?.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Button */}
      <div className="px-4 pb-4">
        {hasSizes ? (
          <Link
            to={`/product/${product._id}`}
            className="block w-full text-center bg-blue-600 text-white font-bold uppercase text-sm px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            SELECT SIZE
          </Link>
        ) : isOutOfStock ? (
          <button
            disabled
            className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold uppercase text-sm px-4 py-3 rounded-lg cursor-not-allowed"
          >
            NOT AVAILABLE
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white font-bold uppercase text-sm px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ADD TO CART
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
