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
    <div className="min-h-screen bg-white py-6 sm:py-8 overflow-x-clip">
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
        <nav className="flex items-center gap-2 text-xs sm:text-sm mb-6 pb-4 border-b border-gray-100">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column - Image Gallery (7 columns) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4 md:gap-6">
            
            {/* Thumbnail Gallery (Vertical on Desktop, Horizontal on Mobile) */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto scrollbar-hide py-1 md:w-20 md:flex-shrink-0">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-blue-600 border-2'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-contain bg-white" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 relative rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center">
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
                className="w-full h-full object-contain max-h-[500px]"
              />
            </div>
          </div>

          {/* Right Column - Product Details (5 columns) */}
          <div className="lg:col-span-5 lg:sticky lg:top-8 lg:self-start">
            {/* Brand */}
            {product.brand && (
               <p className="text-slate-600 font-medium text-sm mb-2">{product.brand}</p>
            )}

            {/* Title */}
             <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
               {product.name}
             </h1>

            {/* Pricing */}
            <div className="mb-6 flex flex-wrap items-baseline gap-3">
              {isOnSale ? (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    Rs {product.originalPrice?.toLocaleString()}
                  </span>
                  <span className="text-3xl font-bold text-red-600">
                    Rs {product.discountPrice?.toLocaleString()}
                  </span>
                  <span className="bg-[#cc0000] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Save {discountPercent}%
                  </span>
                </>
              ) : (
                 <span className="text-3xl font-bold text-gray-900">
                  Rs {product.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-sm text-gray-500 ml-2">4.89 (360 reviews)</span>
            </div>

             <div className="border-t border-gray-100 my-6" />

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
                      className={`px-4 py-2 rounded-md border font-semibold transition-all duration-200 ${
                        selectedSize === size
                           ? 'bg-blue-600 text-white border-blue-600'
                           : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector or Out of Stock */}
            <div className="mb-6 flex gap-4">
              {isOutOfStock ? (
                 <div className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-500 font-bold px-6 py-3.5 rounded-md">
                  OUT OF STOCK
                </div>
              ) : (
                <>
                  <div className="flex items-center border border-gray-300 rounded-md bg-white">
                    <button
                      onClick={decreaseQty}
                     className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                       <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                     <span className="text-base font-semibold text-gray-900 w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={increaseQty}
                      disabled={quantity >= product.stockQuantity}
                       className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                       <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors py-3 px-6 flex items-center justify-center gap-2"
                  >
                    Add to cart
                  </button>
                </>
              )}
            </div>

            {product.stockQuantity < 10 && product.stockQuantity > 0 && (
               <p className="text-sm text-red-600 font-semibold mb-6">
                 Hurry! Only {product.stockQuantity} items left in stock.
               </p>
            )}

            {addedToCart && (
              <Link
                to="/cart"
                className="w-full flex items-center justify-center gap-2 border-2 border-gray-900 text-gray-900 font-bold py-3 rounded-md hover:bg-gray-50 transition-colors mb-6"
              >
                <Check className="w-5 h-5" />
                View cart
              </Link>
            )}

             <div className="border-t border-gray-100 my-6" />

            {/* Product Details */}
            <div className="space-y-4 mb-6">
              {product.description && (
                 <div className="bg-white">
                   <h3 className="text-base font-bold text-gray-900 mb-2">
                     Description
                   </h3>
                   <div className="border-b border-gray-100 mb-4 w-12"></div>
                   <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                     {product.description}
                   </p>
                 </div>
              )}

              {product.tags && product.tags.length > 0 && (
                <div className="mt-6">
                   <h3 className="text-sm font-semibold text-gray-900 mb-2">
                     Tags
                   </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                         className="inline-block bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Info Cards */}
            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
               <div className="flex items-center gap-3">
                 <Truck className="w-5 h-5 text-gray-400" />
                 <div>
                   <p className="text-sm font-semibold text-gray-900">Shipping</p>
                   <p className="text-xs text-gray-500">Calculated at checkout</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <Shield className="w-5 h-5 text-gray-400" />
                 <div>
                   <p className="text-sm font-semibold text-gray-900">Warranty</p>
                   <p className="text-xs text-gray-500">Authentic products</p>
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
