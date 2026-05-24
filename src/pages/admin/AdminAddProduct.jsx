import { useState, useRef, useEffect } from 'react';
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
import { getVariantType, SIZE_OPTIONS, COLOR_OPTIONS, COLOR_HEX, variantLabel } from '../../utils/categoryVariants';
import toast from 'react-hot-toast';

const CATEGORIES_WITH_SUBCATEGORIES = {
  'Tech Gadgets & Accessories': [
    'Smartphones & Tablets',
    'Mobile Accessories',
    'Power Banks & Portable Chargers',
    'Charging Cables & Adapters',
    'Earbuds, Headphones & Headsets',
    'Smart Watches & Fitness Bands',
    'Bluetooth Speakers & Audio',
    'Computer & Laptop Accessories',
    'Storage Devices',
    'Gaming Accessories',
    'Smart Home Devices',
    'Drones & Action Cameras',
    'Photography & Vlog Gear'
  ],
  'Home, Lifestyle & Appliances': [
    'Kitchenware',
    'Small Kitchen Appliances',
    'Bedding',
    'Wall Decor, Clocks & Paintings',
    'Home Lighting',
    'Storage & Organization',
    'Bathroom Accessories & Towels',
    'Cleaning Tools & Supplies',
    'Tools & Home Improvement',
    'Indoor Plants & Garden Accessories'
  ],
  'Beauty, Health & Personal Care': [
    'Skincare',
    'Makeup & Cosmetics',
    'Perfumes & Body Mists',
    'Hair Care',
    "Men's Grooming",
    "Women's Grooming",
    'Bath & Body',
    'Health & Wellness Monitors'
  ],
  "Women's Fashion & Accessories": [
    'Ladies Dresses',
    'Tops, Blouses & T-Shirts',
    'Jeans, Pants & Leggings',
    'Lingerie, Sleepwear & Loungewear',
    'Handbags, Totes & Purses',
    'Shoes, Flats & Heels',
    'Jewelry',
    'Sunglasses & Hair Accessories'
  ],
  "Men's Fashion & Accessories": [
    'Shirts',
    'T-Shirts & Polo Shirts',
    'Jeans, Trousers & Shorts',
    'Activewear & Gym Clothes',
    'Wallets & Belts',
    'Shoes, Sneakers & Sandals',
    'Caps & Hats',
    'Underwear & Socks',
    'Sunglasses'
  ],
  'Babies, Kids & Toys': [
    'Toys',
    'Kids Clothing',
    'Baby Care',
    'Feeding Essentials',
    'School Bags & Stationery',
    'Baby Gear'
  ],
  'Sports, Outdoors & Hobbies': [
    'Fitness & Gym Equipment',
    'Bicycle Parts & Accessories',
    'Camping & Hiking Gear',
    'Sports Equipment',
    'Musical Instruments & Accessories',
    'Art & Craft Supplies'
  ],
  'Automotive & Motorcycle Accessories': [
    'Motorcycle Accessories',
    'Car Interior Accessories',
    'Car Care & Cleaning Products',
    'Vehicle Electronics'
  ],
  'Office & Stationery': [
    'Office Supplies',
    'Stationery'
  ],
  'Torches & Portable Lighting': [
    'Rechargeable Torches',
    'Tactical & Heavy-Duty Torches',
    'Headlamps & Head Torches',
    'Camping Lanterns & Tents Lights',
    'Emergency Lights',
    'Mini & Keychain Torches',
    'Work Lights & Spotlights',
    'Solar Torches & Lights',
    'Bicycle Lights'
  ],
  'Groceries & Pet Supplies': [
    'Snacks & Beverages',
    'Tea & Coffee',
    'Pantry Essentials',
    'Pet Food & Treats',
    'Pet Accessories'
  ],
  'Hardware & DIY Tools': [
    'Power Tools',
    'Hand Tools',
    'Electrical & Wiring',
    'Plumbing Supplies',
    'Paints & Home DIY'
  ],
  'Gifts, Events & Party Supplies': [
    'Gift Boxes & Wrapping Paper',
    'Party Decorations',
    'Greeting Cards',
    'Customized & Personalized Gifts'
  ],
  'Watches & Jewelry': [
    "Men's Watches",
    "Women's Watches",
    'Smart Watches & Fitness Bands',
    'Couple Watches',
    'Fine & Fashion Jewelry'
  ],
  'Health & Medical Care': [
    'Vitamins & Supplements',
    'First Aid & Medical Supplies',
    'Mobility & Support Braces',
    'Massagers & Relaxation Devices'
  ],
  'Books, Music & Media': [
    'Educational & School Books',
    'Novels & Fiction',
    'Musical Instruments',
    'Vinyl Records & CDs'
  ],
  'Luggage & Travel Essentials': [
    'Suitcases & Trolley Bags',
    'Travel Adapters & Accessories',
    'Neck Pillows & Eye Masks'
  ]
};

const SIZE_OPTIONS_UNUSED = null; // imported from categoryVariants
void SIZE_OPTIONS_UNUSED;

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  // Validation constants
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

  // Helper function to validate file
  const validateFile = (file) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `${file.name} exceeds 5MB limit` };
    }
    
    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { valid: false, error: `${file.name} must be PNG, JPG, or WEBP` };
    }
    
    // Check file extension as backup
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return { valid: false, error: `${file.name} has invalid extension` };
    }
    
    return { valid: true };
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    originalPrice: '',
    discountPrice: '',
    stockQuantity: '',
    weightGrams: '1000',
    brand: '',
    sizes: [],
    tags: '',
    isFeatured: false,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Cleanup preview URLs on component unmount
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls]);

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

    // Validate each file
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      const validation = validateFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        invalidFiles.push(validation.error);
      }
    });

    // Show error for any invalid files
    if (invalidFiles.length > 0) {
      toast.error(invalidFiles[0]);
      return;
    }

    if (validFiles.length === 0) return;

    // Create preview URLs for valid files
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...validFiles]);
    setImagePreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviewUrls((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
    // Clear imageUrls when manually removing images to ensure fresh state
    setImageUrls([]);
  };

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
      
      // Extract URLs from response - can be array or object with urls property
      let uploadedUrls = [];
      if (response && response.urls && Array.isArray(response.urls)) {
        uploadedUrls = response.urls;
      } else if (Array.isArray(response)) {
        // If response is array of objects with url property
        uploadedUrls = response.map(item => item.url || item).filter(Boolean);
      } else if (response && response.data && Array.isArray(response.data)) {
        uploadedUrls = response.data;
      } else {
        uploadedUrls = [];
      }
      
      if (uploadedUrls.length === 0) {
        toast.error('No URLs returned from upload');
        return null;
      }
      setImageUrls(uploadedUrls);
      
      // Clean up file state and preview URLs after successful upload
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setImageFiles([]);
      setImagePreviewUrls([]);
      toast.success('Images uploaded successfully');
      return uploadedUrls;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Upload failed';
      toast.error(errorMsg);
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
      title: formData.title,
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory,
      originalPrice: Number(formData.originalPrice),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      stockQuantity: Number(formData.stockQuantity) || 0,
      weightGrams: Number(formData.weightGrams) || 1000,
      weightKg: Number(formData.weightGrams) / 1000 || 1, // Store both for legacy compatibility if needed
      brand: formData.brand,
      sizes: formData.sizes,
      tags: formData.tags ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
      isFeatured: formData.isFeatured,
      imageUrls: finalImageUrls,
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

                  <div>
                    <label className={labelClasses}>
                      Weight (grams)
                    </label>
                    <input
                      type="number"
                      name="weightGrams"
                      value={formData.weightGrams}
                      onChange={handleChange}
                      className={inputClasses}
                      placeholder="1000"
                      min="0"
                      step="any"
                    />
                    <p className="text-xs text-gray-400 mt-2">1st 1000g = රු500 · each extra 1000g = රු150</p>
                  </div>
                </div>
              </div>

              {/* Variants Card — category aware */}
              {(() => {
                const vType = getVariantType(formData.category);
                if (vType === 'none' || !formData.category) return null;
                const label = variantLabel(vType);
                const options = vType === 'sizes' ? SIZE_OPTIONS : COLOR_OPTIONS;
                return (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Tag className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-bold text-blue-900">{label}</h2>
                    </div>

                    {vType === 'sizes' && (
                      <div className="flex flex-wrap gap-3">
                        {options.map((s) => (
                          <button key={s} type="button" onClick={() => toggleSize(s)}
                            className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                              formData.sizes.includes(s)
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                            }`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                    {vType === 'colors' && (
                      <div className="flex flex-wrap gap-3">
                        {options.map((c) => {
                          const selected = formData.sizes.includes(c);
                          const hex = COLOR_HEX[c];
                          const isGradient = hex?.startsWith('linear');
                          return (
                            <button key={c} type="button" onClick={() => toggleSize(c)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 ${
                                selected
                                  ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-sm'
                                  : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-blue-300'
                              }`}>
                              <span className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                                style={isGradient ? { background: hex } : { backgroundColor: hex }} />
                              {c}
                              {selected && <Check className="w-3 h-3 text-blue-600" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <p className="text-xs text-gray-400 mt-4">
                      {vType === 'sizes' ? 'Select all available sizes' : 'Select all available colours'}
                    </p>
                  </div>
                );
              })()}
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
                  disabled={imageFiles.length === 0 || isUploading}
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
