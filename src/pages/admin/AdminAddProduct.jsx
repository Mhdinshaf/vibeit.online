import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Check, 
  Package, 
  DollarSign, 
  FolderOpen, 
  Image as ImageIcon,
  Sparkles,
  Tag,
  Layers,
  Star
} from 'lucide-react';
import { createProduct, uploadImages } from '../../services/api';
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

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

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

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
      subcategory: '',
    }));
  };

  const toggleSize = (size) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUploadImages = async () => {
    if (imageFiles.length === 0) {
      toast.error('Please select images first');
      return null;
    }
    setIsUploading(true);
    try {
      const formDataObj = new FormData();
      imageFiles.forEach((file) => formDataObj.append('images', file));
      const response = await uploadImages(formDataObj);
      const urls = response.urls || response.data?.urls || response;
      const uploadedUrls = Array.isArray(urls) ? urls : [];
      setImageUrls(uploadedUrls);
      toast.success('Images uploaded successfully');
      return uploadedUrls;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const { mutate: handleCreateProduct, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product added successfully');
      navigate('/admin/products');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create product');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error('Product title is required'); return; }
    if (!formData.category) { toast.error('Category is required'); return; }
    if (!formData.originalPrice) { toast.error('Original price is required'); return; }

    let finalImageUrls = imageUrls;
    if (imageUrls.length === 0 && imageFiles.length > 0) {
      const uploadedUrls = await handleUploadImages();
      if (!uploadedUrls || uploadedUrls.length === 0) {
        toast.error('Failed to upload images. Please try again.');
        return;
      }
      finalImageUrls = uploadedUrls;
    } else if (imageUrls.length === 0 && imageFiles.length === 0) {
      toast.error('Please select at least one product image');
      return;
    }

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
      tags: formData.tags ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
      isFeatured: formData.isFeatured,
      images: finalImageUrls,
    };
    handleCreateProduct(productData);
  };

  // Reusable styled input classes
  const inputClasses = "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-blue-50/30 hover:border-gray-300";
  const selectClasses = "w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-800 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-blue-50/30 hover:border-gray-300 appearance-none cursor-pointer";
  const labelClasses = "block text-sm font-semibold text-blue-900 mb-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/products"
            className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Add New Product</h1>
            <p className="text-gray-500 mt-1">Fill in the details to create a new product listing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-blue-900">Basic Information</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className={labelClasses}>
                      Product Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="Enter a compelling product title"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className={`${inputClasses} resize-none`}
                      placeholder="Describe your product in detail..."
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="e.g., Nike, Apple, Samsung"
                    />
                  </div>
                </div>
              </div>

              {/* Categorization Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-blue-900">Categorization</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClasses}>
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleCategoryChange}
                        className={selectClasses}
                        required
                      >
                        <option value="" disabled>Select Category</option>
                        {Object.keys(CATEGORIES_WITH_SUBCATEGORIES).map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Subcategory</label>
                    <div className="relative">
                      <select
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        className={`${selectClasses} ${!formData.category ? 'opacity-60 cursor-not-allowed' : ''}`}
                        disabled={!formData.category}
                      >
                        <option value="">{formData.category ? 'Select Subcategory' : 'Select category first'}</option>
                        {formData.category && CATEGORIES_WITH_SUBCATEGORIES[formData.category].map((subcat) => (
                          <option key={subcat} value={subcat}>{subcat}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <label className={labelClasses}>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </div>
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className={inputClasses}
                    placeholder="trending, best-seller, new-arrival"
                  />
                  <p className="text-xs text-gray-400 mt-2">Separate multiple tags with commas</p>
                </div>
              </div>

              {/* Pricing & Stock Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-blue-900">Pricing & Stock</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className={labelClasses}>
                      Original Price (රු) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">රු</span>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className={`${inputClasses} pl-10`}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Sale Price (රු)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">රු</span>
                      <input
                        type="number"
                        name="discountPrice"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        className={`${inputClasses} pl-10`}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Leave empty for no sale</p>
                  </div>

                  <div>
                    <label className={labelClasses}>
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Variants Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Layers className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-blue-900">Available Sizes</h2>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {SIZE_OPTIONS.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                        formData.sizes.includes(size)
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                          : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4">Select all sizes available for this product</p>
              </div>
            </div>

            {/* Right Column - Images & Featured */}
            <div className="space-y-6">
              {/* Product Images Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-blue-900">Product Images</h2>
                </div>

                {/* Drag & Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    imageFiles.length >= 5
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      : 'border-blue-300 bg-blue-50/50 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={imageFiles.length >= 5}
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900">Click to upload</p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  {imageFiles.length}/5 images selected
                </p>

                {/* Image Previews */}
                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full aspect-square rounded-xl object-cover border-2 border-gray-100"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={handleUploadImages}
                  disabled={imageFiles.length === 0 || isUploading || imageUrls.length > 0}
                  className="w-full mt-4 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  {isUploading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : imageUrls.length > 0 ? (
                    <>
                      <Check className="w-5 h-5" />
                      Uploaded
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload to Cloud
                    </>
                  )}
                </button>

                {/* Upload Success */}
                {imageUrls.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 text-green-700 font-medium">
                      <Check className="w-5 h-5" />
                      {imageUrls.length} image{imageUrls.length > 1 ? 's' : ''} uploaded successfully
                    </div>
                  </div>
                )}
              </div>

              {/* Featured Product Card */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Star className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold">Featured Product</h2>
                </div>
                <p className="text-blue-100 text-sm mb-4">
                  Featured products appear on the homepage and get more visibility.
                </p>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-white/30 rounded-full peer-checked:bg-white transition-colors" />
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-6 peer-checked:bg-blue-600" />
                  </div>
                  <span className="font-medium">Mark as Featured</span>
                </label>
              </div>

              {/* Quick Tips Card */}
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-blue-900">Quick Tips</h2>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Use high-quality images with good lighting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Write detailed, compelling descriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Set competitive pricing for better sales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Add relevant tags for better searchability</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                <span className="text-red-500">*</span> indicates required fields
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="/admin/products"
                  className="px-8 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isPending || isUploading}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg shadow-blue-200"
                >
                  {isPending || isUploading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {isUploading ? 'Uploading...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
