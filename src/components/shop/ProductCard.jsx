import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCartStore } from '../../context/store';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  // Handle image - could be string URL or object with url property
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    if (typeof img === 'string') return img;
    if (img.url) return img.url;
    return '/placeholder.jpg';
  };

  const isOnSale = product.discountPrice && product.discountPrice < product.originalPrice;
  const isOutOfStock = product.stockQuantity === 0;
  const hasSizes = product.sizes && product.sizes.length > 0;
  const discountPercent = isOnSale 
    ? Math.round((1 - product.discountPrice / product.originalPrice) * 100) 
    : 0;

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
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-500 overflow-hidden">
      <Link to={`/product/${product._id}`}>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Sale Badge */}
          {isOnSale && (
            <div className="absolute top-3 right-3">
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                -{discountPercent}%
              </span>
            </div>
          )}

          {/* Quick View Button */}
          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
            <div className="bg-white/90 backdrop-blur-sm text-gray-700 p-2 rounded-full shadow-lg hover:bg-white transition-colors">
              <Eye className="w-4 h-4" />
            </div>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-gray-900 text-white font-bold text-sm uppercase tracking-wider px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs uppercase text-blue-600 font-semibold mb-1.5 tracking-wider">
            {product.category}
          </p>

          {/* Title */}
          <h3 className="font-bold text-gray-900 line-clamp-2 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300">
            {product.name}
          </h3>

          {/* Pricing */}
          <div className="flex items-center gap-2 mb-4">
            {isOnSale ? (
              <>
                <span className="text-lg font-bold text-blue-600">
                  රු{product.discountPrice?.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  රු{product.originalPrice?.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
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
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md shadow-blue-200/50 hover:shadow-lg hover:shadow-blue-300/50"
          >
            SELECT SIZE
          </Link>
        ) : isOutOfStock ? (
          <button
            disabled
            className="w-full bg-gray-100 text-gray-400 font-semibold text-sm px-4 py-3 rounded-xl cursor-not-allowed"
          >
            NOT AVAILABLE
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md shadow-blue-200/50 hover:shadow-lg hover:shadow-blue-300/50 group/btn"
          >
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            ADD TO CART
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
