import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Check, X, Gift, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { uploadImages } from '../../services/api';

const API_URL = import.meta.env.VITE_API_URL;

const PromotionalOfferManager = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    discount: '',
    category: '',
    validFrom: '',
    validTo: '',
    isActive: true,
  });

  // Fetch promotions
  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/promotions`);
      return res.data;
    },
  });

  // Create/Update promotion mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingId) {
        const res = await axios.put(`${API_URL}/promotions/${editingId}`, data);
        return res.data;
      } else {
        const res = await axios.post(`${API_URL}/promotions`, data);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      resetForm();
      toast.success(editingId ? 'Offer updated successfully' : 'Offer created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to save offer');
    },
  });

  // Delete promotion mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${API_URL}/promotions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Offer deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete offer');
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      discount: '',
      category: '',
      validFrom: '',
      validTo: '',
      isActive: true,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (promotion) => {
    setFormData({
      title: promotion.title,
      description: promotion.description,
      imageUrl: promotion.imageUrl,
      discount: promotion.discount,
      category: promotion.category || '',
      validFrom: promotion.validFrom?.split('T')[0] || '',
      validTo: promotion.validTo?.split('T')[0] || '',
      isActive: promotion.isActive,
    });
    setEditingId(promotion._id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image exceeds 5MB limit');
      return;
    }

    setIsUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('images', file);
      const response = await uploadImages(formDataObj);
      
      let uploadedUrl = '';
      if (response && response.urls && Array.isArray(response.urls)) {
        uploadedUrl = response.urls[0];
      } else if (Array.isArray(response)) {
        uploadedUrl = response[0]?.url || response[0];
      } else if (response && response.data && Array.isArray(response.data)) {
        uploadedUrl = response.data[0];
      }
      
      if (!uploadedUrl) {
        throw new Error('No URL returned from upload');
      }

      setFormData(prev => ({ ...prev, imageUrl: uploadedUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Promotional Offers</h3>
          <p className="text-sm text-slate-500 mt-1">Create and manage promotional banners</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Offer
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              name="title"
              placeholder="Offer Title *"
              value={formData.title}
              onChange={handleChange}
              required
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            <input
              type="number"
              name="discount"
              placeholder="Discount (%)"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <textarea
            name="description"
            placeholder="Description *"
            value={formData.description}
            onChange={handleChange}
            required
            rows="2"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <div className="flex gap-4 items-center">
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={handleChange}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="flex-shrink-0">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/jpeg,image/png,image/webp" 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors inline-flex items-center gap-2 border border-slate-300 disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Upload Photo
              </button>
            </div>
          </div>

          {formData.imageUrl && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="max-h-40 object-contain mx-auto"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          )}

          <input
            type="text"
            name="category"
            placeholder="Category (optional, e.g., Fashion, Electronics)"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Valid From</label>
              <input
                type="date"
                name="validFrom"
                value={formData.validFrom}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Valid To</label>
              <input
                type="date"
                name="validTo"
                value={formData.validTo}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 border-slate-300 rounded focus:ring-2 focus:ring-blue-600 cursor-pointer"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
              Active on storefront
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {saveMutation.isPending ? 'Saving...' : (editingId ? 'Update' : 'Create')}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Offers List */}
      <div className="space-y-4">
        {promotions.length > 0 ? (
          promotions.map(offer => (
            <div
              key={offer._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-6">
                {/* Image */}
                {offer.imageUrl && (
                  <div className="hidden sm:block flex-shrink-0 w-24 h-24 bg-slate-100 rounded-lg overflow-hidden">
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-lg">{offer.title}</h4>
                      {offer.discount && (
                        <p className="text-sm text-emerald-600 font-semibold">
                          {offer.discount}% OFF
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this offer?')) {
                            deleteMutation.mutate(offer._id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-3">{offer.description}</p>

                  <div className="flex flex-wrap gap-3 items-center">
                    {offer.category && (
                      <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                        {offer.category}
                      </span>
                    )}

                    {offer.validFrom || offer.validTo ? (
                      <span className="text-xs text-slate-500">
                        {new Date(offer.validFrom || '').toLocaleDateString()} -{' '}
                        {new Date(offer.validTo || '').toLocaleDateString()}
                      </span>
                    ) : null}

                    {offer.isActive ? (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                        INACTIVE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Gift className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No offers yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Create Your First Offer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionalOfferManager;
