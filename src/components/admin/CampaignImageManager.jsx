import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Upload, Calendar, Zap, ZapOff, CheckCircle2, AlertCircle, ChevronRight, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  uploadImages,
  getCampaigns,
  getActiveCampaign,
  createCampaign,
  activateCampaign,
  deactivateCampaign,
  deleteCampaign,
  updateCampaign,
} from '../../services/api';

/* ─────────────────────── helpers ─────────────────────── */
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';

/* ─────────────────────── main component ─────────────────────── */
const CampaignImageManager = () => {
  const queryClient = useQueryClient();
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [activeTab, setActiveTab] = useState('hero');

  /* ── queries ── */
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: getCampaigns,
    retry: 1,
    throwOnError: false,
    staleTime: 15000,
  });

  const { data: activeCampaign } = useQuery({
    queryKey: ['campaigns/active'],
    queryFn: getActiveCampaign,
    retry: 0,           // 404 = no active campaign — not an error, never retry
    throwOnError: false,
    staleTime: 30000,
    gcTime: 60000,
  });

  /* ── auto-select ── */
  useEffect(() => {
    if (Array.isArray(campaigns) && campaigns.length > 0 && !selectedCampaignId) {
      setSelectedCampaignId(campaigns[0]._id);
    }
  }, [campaigns, selectedCampaignId]);

  /* ── mutations ── */
  const createMutation = useMutation({
    mutationFn: (name) => createCampaign({
      campaignName: name,
      campaignMonth: new Date(name),
      sections: { hero: [] },
    }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setSelectedCampaignId(data._id);
      setNewCampaignName('');
      setShowCreateForm(false);
      toast.success('Campaign created!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create campaign'),
  });

  const activateMutation = useMutation({
    mutationFn: activateCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns/active'] });
      toast.success('Campaign activated!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Activation failed'),
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns/active'] });
      toast.success('Campaign deactivated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Deactivation failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setSelectedCampaignId(null);
      toast.success('Campaign deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });

  const selectedCampaign = Array.isArray(campaigns) && campaigns.find(c => c._id === selectedCampaignId);

  /* ── loading skeleton ── */
  if (campaignsLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Active Campaign Banner */}
      {activeCampaign && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-medium text-emerald-800">
            Active on storefront: <span className="font-bold">{activeCampaign.campaignName}</span>
          </span>
        </div>
      )}

      {!activeCampaign && Array.isArray(campaigns) && campaigns.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span className="text-sm font-medium text-amber-800">No campaign is currently active on the storefront.</span>
        </div>
      )}

      {/* Campaign Selector */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-200">
          <div>
            <h3 className="font-semibold text-slate-900">Campaigns</h3>
            <p className="text-xs text-slate-500 mt-0.5">{campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="px-5 py-4 bg-blue-50 border-b border-blue-100">
            <label className="block text-sm font-semibold text-slate-800 mb-2">Campaign Month</label>
            <div className="flex gap-2">
              <input
                type="month"
                value={newCampaignName}
                onChange={e => setNewCampaignName(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <button
                onClick={() => createMutation.mutate(newCampaignName)}
                disabled={!newCampaignName || createMutation.isPending}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                {createMutation.isPending ? 'Creating…' : 'Create'}
              </button>
              <button onClick={() => setShowCreateForm(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Campaign List */}
        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {Array.isArray(campaigns) && campaigns.length > 0 ? (
            campaigns.map(campaign => {
              const isSelected = selectedCampaignId === campaign._id;
              return (
                <div
                  key={campaign._id}
                  onClick={() => setSelectedCampaignId(campaign._id)}
                  className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50 border-l-2 border-l-blue-600' : 'bg-white hover:bg-slate-50 border-l-2 border-l-transparent'
                  }`}
                >
                  <Calendar className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold text-sm ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>
                        {campaign.campaignName}
                      </span>
                      {campaign.isActive && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">LIVE</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Created {fmtDate(campaign.createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    {!campaign.isActive && (
                      <button
                        onClick={() => activateMutation.mutate(campaign._id)}
                        disabled={activateMutation.isPending}
                        title="Activate"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Zap className="w-3 h-3" />
                        <span className="hidden sm:inline">Activate</span>
                      </button>
                    )}
                    {campaign.isActive && (
                      <button
                        onClick={() => deactivateMutation.mutate(campaign._id)}
                        disabled={deactivateMutation.isPending}
                        title="Deactivate"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        <ZapOff className="w-3 h-3" />
                        <span className="hidden sm:inline">Deactivate</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete campaign "${campaign.campaignName}"?`)) {
                          deleteMutation.mutate(campaign._id);
                        }
                      }}
                      disabled={campaign.isActive || deleteMutation.isPending}
                      title={campaign.isActive ? 'Deactivate before deleting' : 'Delete'}
                      className="p-1.5 text-red-500 hover:bg-red-50 disabled:text-slate-300 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {isSelected && <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-400 bg-white">
              <Calendar className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No campaigns yet</p>
              <p className="text-xs mt-1">Click &quot;New Campaign&quot; to create one</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Editor */}
      {selectedCampaign && (
        <ImageEditor
          campaign={selectedCampaign}
          campaignId={selectedCampaignId}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {!selectedCampaign && Array.isArray(campaigns) && campaigns.length > 0 && (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">Select a campaign above to edit its images</p>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────── ImageEditor ─────────────────────── */
const ImageEditor = ({ campaign, campaignId, activeTab, setActiveTab }) => {
  const queryClient = useQueryClient();
  const fileInputRefs = useRef({});
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [images, setImages] = useState(() => campaign.sections?.[activeTab] || []);

  useEffect(() => {
    setImages(campaign.sections?.[activeTab] || []);
  }, [campaign._id, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveMutation = useMutation({
    mutationFn: (updatedImages) => {
      // Sanitize highlight fields before sending:
      // - highlightColor must be a valid hex (#xxx or #xxxxxx) or the backend validation fails
      // - highlightText can be empty string
      const sanitized = updatedImages.map(img => ({
        ...img,
        highlightText: img.highlightText || '',
        highlightColor: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(img.highlightColor)
          ? img.highlightColor
          : '#000000',
      }));
      return updateCampaign(campaignId, {
        [`sections.${activeTab}`]: sanitized,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Section saved!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Save failed'),
  });


  const handleAddImage = () => {
    const isPromo = images.length >= 1; // index 0 = hero, rest = promo cards
    setImages(prev => [...prev, {
      _tempId: `temp-${Date.now()}-${Math.random()}`,
      imageUrl: '',
      title: isPromo ? 'Summer Sale' : '',
      description: isPromo ? 'Up to 40% OFF' : '',
      badge: '',
      actionText: isPromo ? 'Shop now' : 'Explore Products',
      actionLink: '/shop',
      highlightText: '',
      highlightColor: '#ffd700',
      bgGradient: isPromo ? '#f59e0b' : '',
      textColor: isPromo ? 'text-slate-900' : '',
      actionBg: isPromo ? 'bg-blue-600 hover:bg-blue-700' : '',
      actionTextColor: isPromo ? 'text-white' : '',
      order: prev.length,
    }]);
  };

  const handleUpdate = (index, field, value) => {
    setImages(prev => prev.map((img, i) => i === index ? { ...img, [field]: value } : img));
  };

  const handleUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Only JPG, PNG, WebP allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File exceeds 5MB');
      return;
    }
    setUploadingIndex(index);
    try {
      const fd = new FormData();
      fd.append('images', file);
      const res = await uploadImages(fd);
      const url = res?.urls?.[0] || (Array.isArray(res) ? res[0]?.url || res[0] : null);
      if (!url || !url.startsWith('http')) throw new Error('No valid URL from server');
      handleUpdate(index, 'imageUrl', url);
      toast.success('Image uploaded! Save to apply.');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploadingIndex(null);
      if (fileInputRefs.current[index]) fileInputRefs.current[index].value = '';
    }
  };

  const handleRemove = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i })));
  };

  const sectionTabs = [
    { id: 'hero', label: '🏠 Hero Section' },
  ];

  const hasUnsaved = JSON.stringify(images) !== JSON.stringify(campaign.sections?.[activeTab] || []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Section Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-800 to-slate-700 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-sm">{campaign.campaignName}</h3>
          <p className="text-slate-400 text-xs mt-0.5">Editing campaign content</p>
        </div>
        {campaign.isActive && (
          <span className="text-xs bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-full">🟢 LIVE</span>
        )}
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        {sectionTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-700 bg-white border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Unsaved changes indicator */}
        {hasUnsaved && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium px-3 py-2 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            You have unsaved changes — click "Save Section" to apply.
          </div>
        )}

        {/* Image cards */}
        {images.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
            <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold text-sm">No images in this section</p>
            <p className="text-slate-400 text-xs mt-1">Click "Add Image" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {images.map((image, index) => (
              <ImageCard
                key={image._tempId || image._id || index}
                index={index}
                image={image}
                activeTab={activeTab}
                uploadingIndex={uploadingIndex}
                fileInputRefs={fileInputRefs}
                onUpdate={handleUpdate}
                onUpload={handleUpload}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleAddImage}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </button>

          {images.length > 0 && (
            <button
              onClick={() => saveMutation.mutate(images)}
              disabled={saveMutation.isPending}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm ${
                hasUnsaved
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              } disabled:opacity-50`}
            >
              {saveMutation.isPending ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
              ) : (
                <><CheckCircle2 className="w-4 h-4" /> Save Section</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────── ImageCard ─────────────────────── */
const ImageCard = ({ index, image, activeTab, uploadingIndex, fileInputRefs, onUpdate, onUpload, onRemove }) => {
  const hasImage = Boolean(image.imageUrl?.trim());
  const isUploading = uploadingIndex === index;
  const isHero = index === 0;       // Image 1 = main hero banner
  const isPromo = index > 0;        // Images 2+ = small promo cards

  // Normalize hex color so pickers always get valid values
  const normalizeHex = (c, fallback = '#ffd700') => {
    if (!c) return fallback;
    if (c.startsWith('#')) return c;
    if (/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(c)) return '#' + c;
    return fallback;
  };

  const safeHighlightColor = normalizeHex(image.highlightColor, '#ffd700');
  const safeBgColor = normalizeHex(image.bgGradient, '#f59e0b');

  // Role metadata
  const roleLabel = isHero ? '🏠 Main Hero Banner' : `📢 Promo Card ${index}`;
  const roleDesc = isHero
    ? 'Big banner: image on right, title + description on left'
    : 'Small card below the hero title (short text + colored background)';
  const roleColor = isHero ? 'bg-blue-600' : 'bg-purple-600';

  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all ${hasImage ? 'border-emerald-200' : 'border-slate-200'} bg-white shadow-sm`}>
      {/* Card Header */}
      <div className={`flex items-center justify-between px-4 py-3 ${isHero ? 'bg-blue-50 border-b border-blue-100' : 'bg-purple-50 border-b border-purple-100'}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`w-6 h-6 rounded-full ${roleColor} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>{index + 1}</span>
          <div>
            <span className={`text-sm font-bold ${isHero ? 'text-blue-800' : 'text-purple-800'}`}>{roleLabel}</span>
            <p className="text-xs text-slate-500">{roleDesc}</p>
          </div>
          {hasImage && <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">✓ Uploaded</span>}
        </div>
        <button onClick={() => onRemove(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Upload Row */}
        <div>
          <input type="file" ref={el => (fileInputRefs.current[index] = el)} onChange={e => onUpload(e, index)} accept="image/jpeg,image/png,image/webp" className="hidden" />
          <div className="flex gap-3 items-stretch">
            <button
              type="button"
              onClick={() => fileInputRefs.current[index]?.click()}
              disabled={isUploading}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isUploading ? 'bg-blue-100 text-blue-500 cursor-wait'
                : hasImage ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              }`}
            >
              {isUploading ? <><div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> {hasImage ? 'Change Image' : 'Upload Image'}</>}
            </button>
            <input type="text" placeholder="Or paste URL…" value={image.imageUrl} onChange={e => onUpdate(index, 'imageUrl', e.target.value)} className="flex-1 px-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-0" />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">JPG, PNG, WebP · Max 5MB</p>
        </div>

        {/* Image Preview */}
        {hasImage && (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <img src={image.imageUrl} alt="Preview" className="w-full h-36 sm:h-44 object-cover"
              onError={e => { e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="180"%3E%3Crect fill="%23f3f4f6" width="400" height="180"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="14"%3EImage Preview%3C/text%3E%3C/svg%3E'; }} />
            <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">✓ Ready</div>
          </div>
        )}

        {/* ── HERO BANNER FIELDS (Image 1 only) ── */}
        {isHero && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title *</label>
                <input type="text" placeholder="e.g., Your One-Stop Shop" value={image.title} onChange={e => onUpdate(index, 'title', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Button Text</label>
                <input type="text" placeholder="e.g., Explore Products" value={image.actionText} onChange={e => onUpdate(index, 'actionText', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description *</label>
              <textarea placeholder="e.g., Get 50% off all items this season" value={image.description} onChange={e => onUpdate(index, 'description', e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" />
            </div>

            {/* Highlight controls — Hero only */}
            <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">✨ Text Highlight</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Highlight Text <span className="font-normal text-slate-400">(word in title)</span></label>
                  <input type="text" placeholder="e.g., One-Stop" value={image.highlightText || ''} onChange={e => onUpdate(index, 'highlightText', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Highlight Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={safeHighlightColor} onChange={e => onUpdate(index, 'highlightColor', e.target.value)} className="w-12 h-10 p-1 border border-slate-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex-shrink-0" />
                    <input type="text" value={safeHighlightColor} onChange={e => { const v = e.target.value; if (/^#([0-9a-fA-F]{0,6})$/.test(v)) onUpdate(index, 'highlightColor', v); }} placeholder="#ffd700" maxLength={7} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                  </div>
                </div>
              </div>
              {image.title && image.highlightText && (
                <div className="bg-white border border-slate-200 rounded-lg px-4 py-3">
                  <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Live Preview</p>
                  <p className="text-sm font-bold text-slate-800 leading-snug">
                    {image.title.split(image.highlightText).reduce((acc, part, i, arr) => {
                      if (i === arr.length - 1) return [...acc, part];
                      return [...acc, part, <span key={i} style={{ color: safeHighlightColor }}>{image.highlightText}</span>];
                    }, [])}
                  </p>
                </div>
              )}
              {image.title && image.highlightText && !image.title.includes(image.highlightText) && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">⚠️ Not found in title — check spelling (case-sensitive).</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Action Link</label>
              <input type="text" placeholder="e.g., /shop?category=tech" value={image.actionLink} onChange={e => onUpdate(index, 'actionLink', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
            </div>
          </>
        )}

        {/* ── PROMO CARD FIELDS (Images 2+ only) ── */}
        {isPromo && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Short Title * <span className="font-normal text-slate-400">(keep it brief)</span></label>
                <input type="text" placeholder="e.g., Summer Sale" value={image.title} onChange={e => onUpdate(index, 'title', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Subtitle *</label>
                <input type="text" placeholder="e.g., Up to 40% OFF" value={image.description} onChange={e => onUpdate(index, 'description', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
            </div>

            {/* Promo card styling */}
            <div className="space-y-3 bg-purple-50 border border-purple-200 rounded-xl p-3">
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">🎨 Card Style</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={safeBgColor} onChange={e => onUpdate(index, 'bgGradient', e.target.value)} className="w-12 h-10 p-1 border border-slate-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white flex-shrink-0" />
                    <input type="text" value={safeBgColor} onChange={e => { const v = e.target.value; if (/^#([0-9a-fA-F]{0,6})$/.test(v)) onUpdate(index, 'bgGradient', v); }} placeholder="#f59e0b" maxLength={7} className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Text Color</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { onUpdate(index, 'textColor', 'text-slate-900'); onUpdate(index, 'actionBg', 'bg-blue-600 hover:bg-blue-700'); onUpdate(index, 'actionTextColor', 'text-white'); }}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${image.textColor !== 'text-white' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 text-slate-700 bg-white'}`}>
                      Dark Text
                    </button>
                    <button type="button" onClick={() => { onUpdate(index, 'textColor', 'text-white'); onUpdate(index, 'actionBg', 'bg-white hover:bg-slate-100'); onUpdate(index, 'actionTextColor', 'text-slate-900'); }}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${image.textColor === 'text-white' ? 'border-white bg-white text-slate-900 shadow' : 'border-slate-300 text-slate-500 bg-slate-100'}`}>
                      Light Text
                    </button>
                  </div>
                </div>
              </div>

              {/* Promo card preview */}
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Card Preview</p>
                <div className="rounded-xl p-4 flex flex-col justify-between h-28 max-w-[200px]" style={{ backgroundColor: safeBgColor }}>
                  <div>
                    <p className={`text-sm font-bold ${image.textColor || 'text-slate-900'} line-clamp-1`}>{image.title || 'Card Title'}</p>
                    <p className={`text-xs font-semibold ${image.textColor || 'text-slate-900'} line-clamp-1 mt-0.5`}>{image.description || 'Subtitle'}</p>
                  </div>
                  <div className={`inline-flex items-center gap-1 ${image.actionBg || 'bg-blue-600'} ${image.actionTextColor || 'text-white'} px-2.5 py-1.5 rounded-full text-xs font-bold w-fit`}>
                    {image.actionText || 'Shop now'} →
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Button Text</label>
                <input type="text" placeholder="e.g., Shop now" value={image.actionText} onChange={e => onUpdate(index, 'actionText', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Action Link</label>
                <input type="text" placeholder="e.g., /shop" value={image.actionLink} onChange={e => onUpdate(index, 'actionLink', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignImageManager;

