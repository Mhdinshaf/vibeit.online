import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Truck, Shield, Minus, Plus, ChevronRight, ShoppingCart, Check, Package, Star, RefreshCw, Sparkles } from 'lucide-react';
import { getProductById } from '../../services/api';
import { useCartStore } from '../../context/store';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const NON_SELECTABLE_SIZES = new Set(['free size', 'freesize', 'one size', 'onesize', 'standard', 'default']);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: productResponse, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  });

  // Handle nested data structure - API may return { data: product } or product directly
  const product = productResponse?.data || productResponse;
  const normalizedSizes = (product?.sizes || [])
    .map((size) => String(size || '').trim())
    .filter(Boolean);
  const selectableSizes = normalizedSizes.filter((size) => !NON_SELECTABLE_SIZES.has(size.toLowerCase()));
  const requiresSizeSelection = selectableSizes.length > 0;
  const defaultCartSize = normalizedSizes[0] || '';

  const handleAddToCart = () => {
    if (!product) return;

    // Validate size selection only for products that truly need explicit size choice
    if (requiresSizeSelection && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    // Add to cart
    const sizeForCart = requiresSizeSelection ? selectedSize : defaultCartSize;
    addItem(product, quantity, sizeForCart);
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-white rounded-2xl animate-pulse aspect-square border border-gray-100" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-white rounded-xl animate-pulse border border-gray-100" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-3/4" />
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse w-1/2" />
              <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Product Not Found
          </h2>
          <p className="text-gray-500 mb-8 max-w-md">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-200"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOnSale = product.discountPrice && product.discountPrice < product.originalPrice;
  const savings = isOnSale ? product.originalPrice - product.discountPrice : 0;
  const discountPercent = isOnSale ? Math.round((savings / product.originalPrice) * 100) : 0;
  const isOutOfStock = product.stockQuantity === 0;
  
  // Helper to get image URL (handles both string and object formats)
  const getImageUrl = (img) => {
    if (!img) return '/placeholder.jpg';
    if (typeof img === 'string') return img;
    if (img.url) return img.url;
    return '/placeholder.jpg';
  };
  
  const rawImages = product.images || [];
  const images = rawImages.length > 0 ? rawImages.map(getImageUrl) : ['/placeholder.jpg'];

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 overflow-x-clip">
      <Helmet>
        <title>{product?.name} - Buy at VIBEIT Sri Lanka</title>
        <meta name="description" content={`Buy ${product?.name} at VIBEIT. ${product?.description ? product.description.substring(0, 120) : 'Premium quality product'} - Cash on delivery available across Sri Lanka.`} />
        <meta property="og:title" content={product?.name} />
        <meta property="og:description" content={product?.description || 'Premium quality product at VIBEIT'} />
        <meta property="og:image" content={images[0]} />
        <meta property="og:url" content={`https://vibeitlk.vercel.app/product/${id}`} />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product?.name,
            "description": product?.description,
            "image": images,
            "price": product?.price || product?.originalPrice,
            "priceCurrency": "LKR",
            "availability": isOutOfStock ? "OutOfStock" : "InStock",
            "url": `https://vibeitlk.vercel.app/product/${id}`
          })}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8 bg-white rounded-xl px-4 py-3 border border-slate-200 shadow-sm">
          <Link to="/" className="text-slate-500 hover:text-slate-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <Link to="/shop" className="text-slate-500 hover:text-slate-900 transition-colors">
            Shop
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <Link
                to={`/shop?category=${encodeURIComponent(product.category)}`}
                className="text-slate-500 hover:text-slate-900 transition-colors"
              >
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-900 font-semibold line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
             <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
              {isOnSale && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                    -{discountPercent}% OFF
                  </div>
                </div>
              )}
              {product.isFeatured && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </div>
                </div>
              )}
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-slate-900 ring-2 ring-slate-200 shadow-sm'
                        : 'border-slate-200 hover:border-slate-400'
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
            {/* Brand */}
            {product.brand && (
               <p className="text-slate-600 font-medium text-sm mb-2">{product.brand}</p>
            )}

            {/* Title */}
             <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
               {product.name}
             </h1>

            {/* Pricing */}
            <div className="mb-6">
              {isOnSale ? (
                <div className="flex items-center gap-4 mb-2">
                   <span className="text-4xl font-semibold text-slate-900">
                     රු{(product.discountPrice || 0).toLocaleString()}
                   </span>
                   <span className="text-xl text-slate-400 line-through">
                    රු{(product.originalPrice || 0).toLocaleString()}
                  </span>
                </div>
              ) : (
                 <span className="text-4xl font-semibold text-slate-900">
                  රු{(product.originalPrice || 0).toLocaleString()}
                </span>
              )}
              {isOnSale && savings > 0 && (
               <div className="mt-2">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                    <Sparkles className="w-4 h-4" />
                    You save රු{savings.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

             <div className="border-t border-slate-200 my-6" />

            {/* Size Selector */}
             {requiresSizeSelection && (
               <div className="mb-6">
                 <label className="block text-sm font-semibold text-slate-900 mb-3">
                   Select Size
                 </label>
                 <div className="flex flex-wrap gap-2">
                   {selectableSizes.map((size) => (
                     <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all duration-300 ${
                        selectedSize === size
                           ? 'bg-slate-900 text-white border-slate-900'
                           : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:text-slate-900'
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
               <label className="block text-sm font-semibold text-slate-900 mb-3">
                Quantity
              </label>
              {isOutOfStock ? (
                 <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 font-semibold px-6 py-3 rounded-xl">
                  <Package className="w-5 h-5" />
                  OUT OF STOCK
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQty}
                   className="w-12 h-12 flex items-center justify-center border border-slate-200 rounded-xl hover:border-slate-900 hover:bg-slate-100 transition-colors"
                  >
                     <Minus className="w-5 h-5 text-slate-700" />
                  </button>
                   <span className="text-xl font-semibold text-slate-900 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQty}
                    disabled={quantity >= product.stockQuantity}
                     className="w-12 h-12 flex items-center justify-center border border-slate-200 rounded-xl hover:border-slate-900 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     <Plus className="w-5 h-5 text-slate-700" />
                  </button>
                  {product.stockQuantity < 10 && product.stockQuantity > 0 && (
                     <span className="text-sm text-amber-600 font-medium ml-2">
                       Only {product.stockQuantity} left!
                     </span>
                  )}
                </div>
              )}
            </div>

             <div className="rounded-2xl border border-slate-200 bg-white p-4 mb-3 shadow-sm">
               <p className="text-xs uppercase tracking-[0.14em] font-semibold text-slate-500 mb-3">Ready to buy</p>
               <div className="flex items-center justify-between mb-4">
                 <span className="text-sm text-slate-600">Items total</span>
                 <span className="text-lg font-semibold text-slate-900">
                   රු{(Number(product.discountPrice || product.originalPrice || 0) * quantity).toLocaleString()}
                 </span>
               </div>
               <button
                 onClick={handleAddToCart}
                 disabled={isOutOfStock}
                 className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 <ShoppingCart className="w-5 h-5" />
                 Add to cart
               </button>
             </div>

             {addedToCart && (
               <Link
                 to="/cart"
                 className="w-full flex items-center justify-center gap-2 border border-slate-900 text-slate-900 font-semibold py-4 rounded-xl hover:bg-slate-100 transition-colors"
               >
                 <Check className="w-5 h-5" />
                 View cart
               </Link>
             )}

             <div className="border-t border-slate-200 my-6" />

            {/* Product Details */}
            <div className="space-y-4 mb-6">
              {product.description && (
                 <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                   <h3 className="text-sm font-semibold text-slate-900 mb-2">
                     Description
                   </h3>
                   <p className="text-slate-600 text-sm leading-relaxed">
                     {product.description}
                   </p>
                 </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div>
                   <h3 className="text-sm font-semibold text-slate-900 mb-2">
                     Tags
                   </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                         className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Info Cards */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                 <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                   <Truck className="w-5 h-5 text-slate-700" />
                 </div>
                 <p className="text-xs font-semibold text-slate-900">Free Shipping</p>
                 <p className="text-xs text-slate-500">Above රු5000</p>
               </div>
               <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                 <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                   <Shield className="w-5 h-5 text-emerald-600" />
                 </div>
                 <p className="text-xs font-semibold text-slate-900">100% Authentic</p>
                 <p className="text-xs text-slate-500">Quality Guaranteed</p>
               </div>
               <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                 <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                   <RefreshCw className="w-5 h-5 text-amber-600" />
                 </div>
                 <p className="text-xs font-semibold text-slate-900">Easy Returns</p>
                 <p className="text-xs text-slate-500">7 Day Policy</p>
               </div>
               <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                 <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                   <Package className="w-5 h-5 text-purple-600" />
                 </div>
                 <p className="text-xs font-semibold text-slate-900">Fast Delivery</p>
                 <p className="text-xs text-slate-500">Island Wide</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
