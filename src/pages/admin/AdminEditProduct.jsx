import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Upload, X, Check, Package, Tag, DollarSign, Layers, Cloud, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { getProductById, updateProduct, uploadImages } from '../../services/api';
import toast from 'react-hot-toast';

const CATEGORIES_WITH_SUBCATEGORIES = {
  'Home Accessories': ['Kitchenware', 'Bedding', 'Wall Decor', 'Storage', 'Lighting'],
  'Tech Gadgets': ['Mobile Accessories', 'Earbuds', 'Smart Watches', 'Chargers', 'Cables'],
  'Trending Items': ['Viral Products', 'New Arrivals', 'Best Sellers', 'Limited Edition'],
  'Watches': ['Men Watches', 'Women Watches', 'Smart Watches', 'Luxury', 'Casual'],
  'Creams and Skincare': ['Face Cream', 'Body Lotion', 'Sunscreen', 'Serums', 'Moisturizers'],
  'Perfumes': ['Men Perfume', 'Women Perfume', 'Unisex', 'Gift Sets', 'Body Mist'],
  'Toys': ['Educational Toys', 'Action Figures', 'Board Games', 'Outdoor Toys', 'Baby Toys'],
  'Bicycle Parts': ['Tyres', 'Chains', 'Pedals', 'Helmets', 'Accessories'],
  'Ladies Dresses': ['Casual Wear', 'Party Wear', 'Office Wear', 'Traditional', 'Maxi Dresses'],
  'Gents Clothing': ['T-Shirts', 'Trousers', 'Shirts', 'Shorts', 'Formal Wear'],
};

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

// Premium Section Card Component
const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    {children}
  </div>
);

// Premium Input Component
const PremiumInput = ({ label, required, hint, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-blue-500">*</span>}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400"
    />
    {hint && <p className="text-xs text-gray-500 mt-1.5">{hint}</p>}
  </div>
);

// Premium Select Component
const PremiumSelect = ({ label, required, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-blue-500">*</span>}
    </label>
    <select
      {...props}
      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-gray-900"
    >
      {children}
    </select>
  </div>
);

// Premium Textarea Component
const PremiumTextarea = ({ label, required, hint, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-blue-500">*</span>}
    </label>
    <textarea
      {...props}
      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-0 transition-all duration-300 text-gray-900 placeholder-gray-400 resize-none"
    />
    {hint && <p className="text-xs text-gray-500 mt-1.5">{hint}</p>}
  </div>
);

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch existing product
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id),
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    originalPrice: '',
    discountPrice: '',
    stockQuantity: '',
    brand: '',
    sizes: [],
    tags: '',
    isFeatured: false,
  });

  // Image state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Helper to get image URL (handles both string and object formats)
  const getImageUrl = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return img;
    if (img.url) return img.url;
    return null;
  };

  // Prefill form when product loads
  useEffect(() => {
    // getProductById returns response.data directly, so product is the actual product object
    const p = product?.data || product;
    if (p && p.name) {
      setFormData({
        title: p.name || '',
        description: p.description || '',
        category: p.category || '',
        subcategory: p.subcategory || '',
        originalPrice: p.originalPrice || '',
        discountPrice: p.discountPrice || '',
        stockQuantity: p.stockQuantity || '',
        brand: p.brand || '',
        sizes: p.sizes || [],
        tags: p.tags?.join(', ') || '',
        isFeatured: p.isFeatured || false,
      });
      // Handle images - normalize to URL strings
      if (p.images && p.images.length > 0) {
        const normalizedUrls = p.images.map(img => getImageUrl(img)).filter(Boolean);
        setImageUrls(normalizedUrls);
      }
    }
  }, [product]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
      subcategory: '', // Reset subcategory
    }));
  };

  // Handle size toggle
  const toggleSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + imageFiles.length + imageUrls.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Generate preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  // Remove new image preview
  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]); // Clean up memory
      return prev.filter((_, i) => i !== index);
    });
  };

  // Remove existing image URL
  const removeExistingImage = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload images to cloud
  const handleUploadImages = async () => {
    if (imageFiles.length === 0) {
      toast.error('Please select images first');
      return null;
    }

    setIsUploading(true);
    try {
      const formDataObj = new FormData();
      imageFiles.forEach((file) => {
        formDataObj.append('images', file);
      });

      const response = await uploadImages(formDataObj);
      // uploadImages returns response.data, so access urls directly
      const urls = response.urls || response.data?.urls || response;
      const uploadedUrls = Array.isArray(urls) ? urls : [];
      
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
      setImageFiles([]);
      setImagePreviewUrls([]);
      toast.success('Images uploaded successfully');
      return uploadedUrls;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Update product mutation
  const { mutate: handleUpdateProduct, isPending } = useMutation({
    mutationFn: (data) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast.success('Product updated successfully');
      navigate('/admin/products');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update product');
    },
  });

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Product title is required');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    if (!formData.originalPrice) {
      toast.error('Original price is required');
      return;
    }

    // Check if images need to be uploaded
    let finalImageUrls = [...imageUrls];
    
    if (imageFiles.length > 0) {
      // New images selected but not uploaded yet - upload them now
      const uploadedUrls = await handleUploadImages();
      if (uploadedUrls && uploadedUrls.length > 0) {
        finalImageUrls = [...imageUrls, ...uploadedUrls];
      }
    }
    
    if (finalImageUrls.length === 0) {
      toast.error('Please upload at least one product image');
      return;
    }

    // Prepare data
    const productData = {
      name: formData.title,
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory,
      originalPrice: Number(formData.originalPrice),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      stockQuantity: Number(formData.stockQuantity) || 0,
      brand: formData.brand,
      sizes: formData.sizes,
      tags: formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
      isFeatured: formData.isFeatured,
      images: finalImageUrls,
    };

    handleUpdateProduct(productData);
  };

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200 animate-pulse">
            <Package className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-500 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/products"
              className="p-2.5 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-500 mt-0.5">Update product information</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Premium Editor</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info Section */}
              <SectionCard icon={Package} title="Basic Information">
                <div className="space-y-5">
                  <PremiumInput
                    label="Product Title"
                    required
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter product title"
                  />
                  <PremiumTextarea
                    label="Description"
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe your product..."
                  />
                  <PremiumInput
                    label="Brand"
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Enter brand name"
                  />
                </div>
              </SectionCard>

              {/* Categorization Section */}
              <SectionCard icon={Layers} title="Categorization">
                <div className="space-y-5">
                  <PremiumSelect
                    label="Category"
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleCategoryChange}
                  >
                    <option value="" disabled>Select Category</option>
                    {Object.keys(CATEGORIES_WITH_SUBCATEGORIES).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </PremiumSelect>

                  <PremiumSelect
                    label="Subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    disabled={!formData.category}
                  >
                    <option value="">
                      {formData.category ? 'Select Subcategory' : 'Select category first'}
                    </option>
                    {formData.category &&
                      CATEGORIES_WITH_SUBCATEGORIES[formData.category].map((subcat) => (
                        <option key={subcat} value={subcat}>{subcat}</option>
                      ))}
                  </PremiumSelect>

                  <PremiumInput
                    label="Tags"
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="trending, best-seller, new-arrival"
                    hint="Separate tags with commas"
                  />
                </div>
              </SectionCard>

              {/* Sizes Section */}
              <SectionCard icon={Tag} title="Available Sizes">
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-5 py-2.5 rounded-xl border-2 font-medium transition-all duration-300 ${
                        formData.sizes.includes(size)
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 border-blue-600 text-white shadow-lg shadow-blue-200'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {formData.sizes.includes(size) && <Check className="w-4 h-4 inline mr-1" />}
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">Click to toggle size availability</p>
              </SectionCard>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Pricing Section */}
              <SectionCard icon={DollarSign} title="Pricing & Stock">
                <div className="space-y-5">
                  <PremiumInput
                    label="Original Price (රු)"
                    required
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  <PremiumInput
                    label="Discount Price (රු)"
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    hint="Leave empty for no discount"
                  />
                  <PremiumInput
                    label="Stock Quantity"
                    required
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />

                  {/* Featured Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div>
                      <p className="font-medium text-gray-900">Featured Product</p>
                      <p className="text-xs text-gray-500 mt-0.5">Display on homepage</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </SectionCard>

              {/* Images Section */}
              <SectionCard icon={ImageIcon} title="Product Images">
                {/* Current Images */}
                {imageUrls.length > 0 && (
                  <div className="mb-5">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Current Images ({imageUrls.length}/5)
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="w-full aspect-square rounded-xl object-cover border-2 border-green-400 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 shadow-lg"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-md">
                            ✓
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Input Zone */}
                <div className="mb-4">
                  <label className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                    imageFiles.length + imageUrls.length >= 5
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={imageFiles.length + imageUrls.length >= 5}
                    />
                    <Cloud className={`w-10 h-10 mx-auto mb-3 ${
                      imageFiles.length + imageUrls.length >= 5 ? 'text-gray-300' : 'text-blue-400'
                    }`} />
                    <p className={`font-medium ${
                      imageFiles.length + imageUrls.length >= 5 ? 'text-gray-400' : 'text-gray-700'
                    }`}>
                      {imageFiles.length + imageUrls.length >= 5 
                        ? 'Maximum images reached' 
                        : 'Click to add more images'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {5 - imageUrls.length - imageFiles.length} slots remaining • JPG, PNG, WEBP
                    </p>
                  </label>
                </div>

                {/* New Image Previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      New Images to Upload ({imagePreviewUrls.length})
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full aspect-square rounded-xl object-cover border-2 border-amber-400 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-300 shadow-lg"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-md">
                            new
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                {imageFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={handleUploadImages}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold py-3.5 rounded-xl hover:from-gray-900 hover:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Uploading to Cloud...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Upload {imageFiles.length} New Image{imageFiles.length > 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                )}
              </SectionCard>
            </div>
          </div>

          {/* Submit Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Link
              to="/admin/products"
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending || isUploading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-200"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  UPDATE PRODUCT
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditProduct;
