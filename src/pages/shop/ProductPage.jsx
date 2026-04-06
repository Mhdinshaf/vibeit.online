import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Truck, Shield, Minus, Plus, ChevronRight } from 'lucide-react';
import { getProductById } from '../../services/api';
import { useCartStore } from '../../context/store';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  });

  const handleAddToCart = () => {
    if (!product) return;

    // Validate size selection if sizes exist
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    // Add to cart
    addItem(product, quantity, selectedSize);
    toast.success('Added to cart!');
    setAddedToCart(true);
  };

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQty = () => {
    if (quantity < product.stockQuantity) setQuantity(quantity + 1);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse aspect-square" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/2" />
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOnSale = product.discountPrice && product.discountPrice < product.originalPrice;
  const savings = isOnSale ? product.originalPrice - product.discountPrice : 0;
  const isOutOfStock = product.stockQuantity === 0;
  const images = product.images || ['/placeholder.jpg'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-50'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-4">
              <Link to="/shop" className="text-blue-600 hover:text-blue-700">
                Shop
              </Link>
              {product.category && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <Link
                    to={`/shop?category=${encodeURIComponent(product.category)}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {product.category}
                  </Link>
                </>
              )}
              {product.subcategory && (
                <>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">{product.subcategory}</span>
                </>
              )}
            </nav>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="mb-6">
              {isOnSale ? (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-blue-600">
                    රු{product.discountPrice.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    රු{product.originalPrice.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  රු{product.originalPrice.toLocaleString()}
                </span>
              )}
              {isOnSale && savings > 0 && (
                <span className="inline-block bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-sm font-semibold px-3 py-1 rounded-full">
                  You save රු{savings.toLocaleString()}
                </span>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6" />

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Choose Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector or Out of Stock */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Quantity
              </label>
              {isOutOfStock ? (
                <div className="inline-block bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 font-bold px-6 py-3 rounded-lg">
                  OUT OF STOCK
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQty}
                    className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold text-gray-900 dark:text-white w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQty}
                    disabled={quantity >= product.stockQuantity}
                    className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-600 dark:hover:border-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="btn-primary w-full mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ADD TO CART
            </button>

            {/* View Cart Button */}
            {addedToCart && (
              <Link to="/cart" className="btn-outline w-full block text-center">
                VIEW CART
              </Link>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 my-6" />

            {/* Product Details */}
            <div className="space-y-4">
              {product.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {product.brand && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Brand
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{product.brand}</p>
                </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {product.stockQuantity > 0 && product.stockQuantity < 10 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                  <p className="text-orange-800 dark:text-orange-400 text-sm font-medium">
                    Only {product.stockQuantity} left in stock!
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-6" />

            {/* Shipping Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Free delivery above රු2000
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Island-wide shipping available
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Quality Guaranteed
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    100% authentic products
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
