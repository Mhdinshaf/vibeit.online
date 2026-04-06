import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Upload, X, Check } from 'lucide-react';
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

  // Prefill form when product loads
  useEffect(() => {
    if (product?.data) {
      const p = product.data;
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
      setImageUrls(p.images || []);
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
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await uploadImages(formData);
      setImageUrls((prev) => [...prev, ...response.data.urls]);
      setImageFiles([]);
      setImagePreviewUrls([]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
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
  const handleSubmit = (e) => {
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
    if (imageUrls.length === 0) {
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
      images: imageUrls,
    };

    handleUpdateProduct(productData);
  };

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/products"
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Product</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter product title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="form-input"
                placeholder="Enter product description"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="form-input"
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                {Object.keys(CATEGORIES_WITH_SUBCATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subcategory
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="form-input"
                disabled={!formData.category}
              >
                <option value="">
                  {formData.category ? 'Select Subcategory' : 'Select category first'}
                </option>
                {formData.category &&
                  CATEGORIES_WITH_SUBCATEGORIES[formData.category].map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter brand name"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., trending, best-seller, new-arrival"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Separate tags with commas
              </p>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                      formData.sizes.includes(size)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Product */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Mark as Featured Product
              </label>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original Price (රු) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Discount Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Price (රු)
              </label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty for no sale
              </p>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
                min="0"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Images <span className="text-red-500">*</span>
              </label>
              
              {/* Existing Images */}
              {imageUrls.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Current Images:</p>
                  <div className="flex flex-wrap gap-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Existing ${index + 1}`}
                          className="w-24 h-24 rounded-lg object-cover border-2 border-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Input */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="form-input mb-3"
                disabled={imageFiles.length + imageUrls.length >= 5}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                Upload up to 5 images total (JPG, PNG, WEBP)
              </p>

              {/* New Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">New Images to Upload:</p>
                  <div className="flex flex-wrap gap-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
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
                  className="w-full px-4 py-3 bg-gray-800 dark:bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  {isUploading ? 'Uploading...' : 'Upload New Images'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/admin/products"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Updating...' : 'UPDATE PRODUCT'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;
