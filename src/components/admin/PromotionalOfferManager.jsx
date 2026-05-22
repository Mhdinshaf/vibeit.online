import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Check, X, Gift, Upload, Tag, Calendar, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadImages, getAllPromotions, createPromotion, updatePromotion, deletePromotion } from '../../services/api';

const EMPTY_FORM = {
  title: '', description: '', imageUrl: '', discount: '', category: '', validFrom: '', validTo: '', isActive: true,
};

const PromotionalOfferManager = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  /* ── query ── */
  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: getAllPromotions,
    retry: 1,
    throwOnError: false,
    staleTime: 15000,
  });

  /* ── mutations ── */
  const saveMutation = useMutation({
    mutationFn: (data) => editingId ? updatePromotion(editingId, data) : createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      const msg = editingId ? 'Offer updated!' : 'Offer created!';
      resetForm();
      toast.success(msg);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to save'),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      toast.success('Offer deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });

  /* ── handlers ── */
  const resetForm = () => { setFormData(EMPTY_FORM); setShowForm(false); setEditingId(null); };

  const handleEdit = (p) => {
    setFormData({
      title: p.title, description: p.description, imageUrl: p.imageUrl || '',
      discount: p.discount, category: p.category || '',
      validFrom: p.validFrom?.split('T')[0] || '', validTo: p.validTo?.split('T')[0] || '',
      isActive: p.isActive,
    });
    setEditingId(p._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.title.trim()) return toast.error('Title is required');
    if (!formData.description.trim()) return toast.error('Description is required');
    if (formData.discount === '' || formData.discount === undefined) return toast.error('Discount % is required');
    if (!formData.validFrom || !formData.validTo) return toast.error('Valid From and Valid To dates are required');
    if (new Date(formData.validFrom) >= new Date(formData.validTo)) return toast.error('Valid From must be before Valid To');
    saveMutation.mutate(formData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image exceeds 5MB'); return; }
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('images', file);
      const res = await uploadImages(fd);
      const url = res?.urls?.[0] || (Array.isArray(res) ? res[0]?.url || res[0] : null);
      if (!url) throw new Error('No URL returned');
      setFormData(prev => ({ ...prev, imageUrl: url }));
      toast.success('Image uploaded!');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header Action */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Promotional Offers</h3>
          <p className="text-xs text-slate-500 mt-0.5">{promotions.length} offer{promotions.length !== 1 ? 's' : ''} configured</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Offer
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
          {/* Form Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-white" />
              <span className="font-bold text-white text-sm">{editingId ? 'Edit Offer' : 'Create New Offer'}</span>
            </div>
            <button type="button" onClick={resetForm} className="text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Offer Title *</label>
                <input
                  type="text" name="title" value={formData.title} onChange={handleChange} required
                  placeholder="e.g., Flash Sale 50% Off"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Discount % *</label>
                <input
                  type="number" name="discount" value={formData.discount} onChange={handleChange}
                  min="0" max="100" placeholder="e.g., 25" required
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description *</label>
              <textarea
                name="description" value={formData.description} onChange={handleChange}
                rows={2} placeholder="Brief description of this offer…" required
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Offer Image</label>
              <div className="flex gap-2">
                <input
                  type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                  placeholder="Paste image URL or upload below…"
                  className="flex-1 px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
                />
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/jpeg,image/png,image/webp" className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors border border-slate-300 inline-flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
                >
                  {isUploading ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                  {isUploading ? 'Uploading…' : 'Upload'}
                </button>
              </div>
              {formData.imageUrl && (
                <div className="mt-2 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={formData.imageUrl} alt="Preview"
                    className="w-full h-32 object-cover"
                    onError={e => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="130"%3E%3Crect fill="%23f3f4f6" width="400" height="130"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif"%3EInvalid URL%3C/text%3E%3C/svg%3E'; }}
                  />
                </div>
              )}
            </div>

            {/* Row 3 - Category & Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category (Optional)</label>
                <input
                  type="text" name="category" value={formData.category} onChange={handleChange}
                  placeholder="e.g., Fashion, Electronics"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Valid From *</label>
                <input
                  type="date" name="validFrom" value={formData.validFrom} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Valid To *</label>
                <input
                  type="date" name="validTo" value={formData.validTo} onChange={handleChange} required
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                className="flex-shrink-0"
              >
                {formData.isActive
                  ? <ToggleRight className="w-8 h-8 text-emerald-600" />
                  : <ToggleLeft className="w-8 h-8 text-slate-400" />}
              </button>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {formData.isActive ? 'Active on storefront' : 'Hidden from storefront'}
                </p>
                <p className="text-xs text-slate-500">Toggle to show/hide this offer on the website</p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-bold transition-colors inline-flex items-center justify-center gap-2"
              >
                {saveMutation.isPending
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                  : <><Check className="w-4 h-4" /> {editingId ? 'Update Offer' : 'Create Offer'}</>}
              </button>
              <button
                type="button" onClick={resetForm}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Offers List */}
      {promotions.length > 0 ? (
        <div className="space-y-3">
          {promotions.map(offer => {
            const isExpired = offer.validTo && new Date(offer.validTo) < new Date();
            return (
              <div
                key={offer._id}
                className={`bg-white rounded-2xl border transition-shadow hover:shadow-md overflow-hidden ${
                  !offer.isActive ? 'opacity-70 border-slate-200' : isExpired ? 'border-red-200' : 'border-slate-200'
                }`}
              >
                <div className="flex gap-0">
                  {/* Color stripe */}
                  <div className={`w-1 flex-shrink-0 ${offer.isActive && !isExpired ? 'bg-emerald-500' : isExpired ? 'bg-red-400' : 'bg-slate-300'}`} />

                  <div className="flex flex-col sm:flex-row gap-4 p-4 flex-1 min-w-0">
                    {/* Image */}
                    {offer.imageUrl && (
                      <div className="flex-shrink-0 w-full sm:w-20 h-20 bg-slate-100 rounded-xl overflow-hidden">
                        <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = 'none'; }} />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{offer.title}</h4>
                          {offer.discount > 0 && (
                            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">{offer.discount}% OFF</span>
                          )}
                          {offer.isActive && !isExpired && (
                            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                          )}
                          {isExpired && (
                            <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">EXPIRED</span>
                          )}
                          {!offer.isActive && !isExpired && (
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">INACTIVE</span>
                          )}
                        </div>
                        {/* Actions */}
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleEdit(offer)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { if (window.confirm('Delete this offer?')) deleteMutation.mutate(offer._id); }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mb-2 line-clamp-1">{offer.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {offer.category && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                            <Tag className="w-3 h-3" />
                            {offer.category}
                          </span>
                        )}
                        {(offer.validFrom || offer.validTo) && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                            <Calendar className="w-3 h-3" />
                            {new Date(offer.validFrom).toLocaleDateString()} → {new Date(offer.validTo).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-14 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <Gift className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-bold">No promotional offers yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first offer to display on the storefront</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create First Offer
          </button>
        </div>
      )}
    </div>
  );
};

export default PromotionalOfferManager;
