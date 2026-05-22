import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Upload, Calendar, Eye } from 'lucide-react';
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

const CampaignImageManager = () => {
  const queryClient = useQueryClient();
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [activeTab, setActiveTab] = useState('hero');

  // Fetch campaigns
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: getCampaigns,
    retry: 1,
    throwOnError: false,
  });

  // Fetch active campaign
  const { data: activeCampaign } = useQuery({
    queryKey: ['campaigns/active'],
    queryFn: getActiveCampaign,
    retry: 1,
    throwOnError: false,
  });

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignName) => {
      return createCampaign({
        campaignName,
        campaignMonth: new Date(campaignName),
        sections: {
          hero: [],
          trendingCategories: [],
        },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setSelectedCampaignId(data._id);
      setNewCampaignName('');
      setShowCreateForm(false);
      toast.success('Campaign created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create campaign');
    },
  });

  // Activate campaign mutation
  const activateCampaignMutation = useMutation({
    mutationFn: activateCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns/active'] });
      toast.success('Campaign activated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to activate campaign');
    },
  });

  // Deactivate campaign mutation
  const deactivateCampaignMutation = useMutation({
    mutationFn: deactivateCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaigns/active'] });
      toast.success('Campaign deactivated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to deactivate campaign');
    },
  });

  // Delete campaign mutation
  const deleteCampaignMutation = useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setSelectedCampaignId(null);
      toast.success('Campaign deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete campaign');
    },
  });

  const selectedCampaign = Array.isArray(campaigns) && campaigns.find(c => c._id === selectedCampaignId);
  const isActiveCampaign = activeCampaign?._id === selectedCampaignId;

  if (campaignsLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaign Selector */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Campaigns</h3>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-sm font-medium text-slate-900 mb-2">Campaign Month (YYYY-MM)</label>
            <div className="flex gap-2">
              <input
                type="month"
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={() => createCampaignMutation.mutate(newCampaignName)}
                disabled={!newCampaignName || createCampaignMutation.isPending}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
              >
                {createCampaignMutation.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        )}

        {/* Campaign List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Array.isArray(campaigns) && campaigns.length > 0 ? (
            campaigns.map(campaign => (
              <div
                key={campaign._id}
                onClick={() => setSelectedCampaignId(campaign._id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCampaignId === campaign._id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <div>
                      <h4 className="font-medium text-slate-900">{campaign.campaignName}</h4>
                      <p className="text-xs text-slate-500">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isActiveCampaign && (
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        ACTIVE
                      </span>
                    )}
                    <div className="flex gap-2">
                      {!isActiveCampaign && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            activateCampaignMutation.mutate(campaign._id);
                          }}
                          disabled={activateCampaignMutation.isPending}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white text-sm rounded-lg transition-colors"
                        >
                          Activate
                        </button>
                      )}
                      {isActiveCampaign && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deactivateCampaignMutation.mutate(campaign._id);
                          }}
                          disabled={deactivateCampaignMutation.isPending}
                          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-400 text-white text-sm rounded-lg transition-colors"
                        >
                          {deactivateCampaignMutation.isPending ? 'Deactivating...' : 'Deactivate'}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this campaign?')) {
                            deleteCampaignMutation.mutate(campaign._id);
                          }
                        }}
                        disabled={deleteCampaignMutation.isPending || isActiveCampaign}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white text-sm rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">
              No campaigns yet. Create one to get started.
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

      {(!Array.isArray(campaigns) || campaigns.length === 0) && (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-slate-200">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No campaigns yet</p>
          <p className="text-sm text-slate-400">Click "New Campaign" to create your first campaign</p>
        </div>
      )}
    </div>
  );
};

const ImageEditor = ({ campaign, campaignId, activeTab, setActiveTab }) => {
  const queryClient = useQueryClient();
  const fileInputRefs = useRef({});
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const currentImages = campaign.sections?.[activeTab] || [];
  const [images, setImages] = useState(currentImages);

  // Update images when tab changes
  if (JSON.stringify(currentImages) !== JSON.stringify(images)) {
    setImages(currentImages);
  }

  const updateSectionMutation = useMutation({
    mutationFn: async (updatedImages) => {
      return updateCampaign(campaignId, {
        [`sections.${activeTab}`]: updatedImages,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast.success('Section updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update section');
    },
  });

  const handleAddImage = () => {
    setImages([
      ...images,
      {
        title: '',
        description: '',
        badge: '',
        imageUrl: '',
        actionLink: '',
        actionText: 'Explore',
        order: images.length,
      },
    ]);
  };

  const handleUpdateImage = (index, field, value) => {
    const updated = [...images];
    updated[index][field] = value;
    setImages(updated);
  };

  const handleImageUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Invalid file type. Only JPG, PNG, and WebP are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image exceeds 5MB limit. Please choose a smaller file.');
      return;
    }

    setUploadingIndex(index);
    try {
      const formDataObj = new FormData();
      formDataObj.append('images', file);
      
      console.log('Uploading image:', { name: file.name, size: file.size });
      const response = await uploadImages(formDataObj);

      let uploadedUrl = '';
      if (response && response.urls && Array.isArray(response.urls) && response.urls.length > 0) {
        uploadedUrl = response.urls[0];
      } else if (Array.isArray(response) && response.length > 0) {
        uploadedUrl = response[0]?.url || response[0];
      } else if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        uploadedUrl = response.data[0];
      } else if (typeof response === 'string') {
        uploadedUrl = response;
      }

      if (!uploadedUrl || !uploadedUrl.startsWith('http')) {
        console.error('Invalid URL received:', uploadedUrl);
        throw new Error('Invalid image URL received from server');
      }

      // Update the image URL in state
      handleUpdateImage(index, 'imageUrl', uploadedUrl);
      toast.success(`✓ Image uploaded! Click "Save Changes" to finalize.`);
      
      console.log('Upload successful:', uploadedUrl);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error.message || error.response?.data?.message || 'Failed to upload image';
      toast.error(errorMsg);
    } finally {
      setUploadingIndex(null);
      if (fileInputRefs.current[index]) {
        fileInputRefs.current[index].value = '';
      }
    }
  };

  const handleRemoveImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated.map((img, i) => ({ ...img, order: i })));
  };

  const handleSave = () => {
    updateSectionMutation.mutate(images);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'hero'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          🏠 Hero Section
        </button>
        <button
          onClick={() => setActiveTab('trendingCategories')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'trendingCategories'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          🔥 Trending Categories
        </button>
      </div>

      {/* Images List */}
      <div className="space-y-4">
        {images.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Upload className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-medium mb-1">No images yet</p>
            <p className="text-sm">Click "Add Image" below to create your first {activeTab === 'hero' ? 'hero' : 'category'} image.</p>
          </div>
        ) : (
          images.map((image, index) => (
            <ImageItem
              key={index}
              index={index}
              image={image}
              activeTab={activeTab}
              uploadingIndex={uploadingIndex}
              fileInputRefs={fileInputRefs}
              onUpdate={handleUpdateImage}
              onUpload={handleImageUpload}
              onRemove={handleRemoveImage}
            />
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-2 flex-wrap sm:flex-nowrap">
        <button
          onClick={handleAddImage}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm text-xs sm:text-sm whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Image</span>
          <span className="sm:hidden">Add</span>
        </button>

        {images.length > 0 && (
          <>
            <button
              onClick={handleSave}
              disabled={updateSectionMutation.isPending}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white px-3 sm:px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm text-xs sm:text-sm whitespace-nowrap"
            >
              {updateSectionMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="hidden sm:inline">Saving...</span>
                  <span className="sm:hidden">Save...</span>
                </>
              ) : (
                <>
                  ✓ <span className="hidden sm:inline">Save Changes</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </button>
            
            <div className="flex-1 hidden sm:flex items-center text-sm text-slate-600 bg-blue-50 px-4 py-3 rounded-lg border border-blue-200 min-w-max">
              <span>💡 Upload images, fill in details, then click "Save Changes" to finalize.</span>
            </div>
            
            <div className="w-full sm:hidden text-xs text-slate-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
              <span>💡 Upload, fill details, save!</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ImageItem = ({
  index,
  image,
  activeTab,
  uploadingIndex,
  fileInputRefs,
  onUpdate,
  onUpload,
  onRemove,
}) => {
  const hasImage = image.imageUrl && image.imageUrl.trim() !== '';

  return (
    <div className="p-4 border border-slate-200 rounded-lg space-y-3 hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-slate-900">Image {index + 1} {hasImage && <span className="text-xs bg-emerald-100 text-emerald-700 ml-2 px-2 py-1 rounded">✓ Uploaded</span>}</h4>
        <button
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
          title="Remove this image"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Image Upload Section - PRIORITY */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <label className="block text-xs font-semibold text-slate-700 mb-2">📸 UPLOAD IMAGE</label>
        <div className="flex gap-2 items-stretch flex-col sm:flex-row">
          <input
            type="file"
            ref={(el) => (fileInputRefs.current[index] = el)}
            onChange={(e) => onUpload(e, index)}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRefs.current[index]?.click()}
            disabled={uploadingIndex === index}
            className="flex-1 px-3 sm:px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm whitespace-nowrap"
            title="Click to select and upload image"
          >
            {uploadingIndex === index ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <span className="hidden sm:inline">Uploading...</span>
                <span className="sm:hidden">Upload...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:inline">{hasImage ? 'Change Image' : 'Upload Image'}</span>
                <span className="sm:hidden">{hasImage ? 'Change' : 'Upload'}</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">JPG, PNG, WebP • Max 5MB • Tap button to choose</p>
      </div>

      {/* Image Preview */}
      {hasImage && (
        <div className="relative rounded-lg overflow-hidden bg-slate-100 border border-slate-300">
          <img
            src={image.imageUrl}
            alt="Preview"
            className="w-full h-32 sm:h-48 object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23f3f4f6" width="400" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif"%3EImage Preview%3C/text%3E%3C/svg%3E';
            }}
          />
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
            ✓ Ready
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Title *</label>
        <input
          type="text"
          placeholder={activeTab === 'hero' ? 'e.g., Summer Sale' : 'e.g., Laptops'}
          value={image.title}
          onChange={(e) => onUpdate(index, 'title', e.target.value)}
          className="w-full px-2 sm:px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Description *</label>
        <textarea
          placeholder={activeTab === 'hero' ? 'e.g., Get 50% off all items this season' : 'e.g., Browse the latest laptops'}
          value={image.description}
          onChange={(e) => onUpdate(index, 'description', e.target.value)}
          className="w-full px-2 sm:px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm resize-none"
          rows="2"
        />
      </div>

      {/* Badge for Trending Categories */}
      {activeTab === 'trendingCategories' && (
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Badge *</label>
          <input
            type="text"
            placeholder="e.g., Electronics, Fashion, Hot, New"
            value={image.badge}
            onChange={(e) => onUpdate(index, 'badge', e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm"
          />
        </div>
      )}

      {/* Action Link */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Action Link (Optional)</label>
        <input
          type="text"
          placeholder="e.g., /shop?category=tech or /products/laptops"
          value={image.actionLink}
          onChange={(e) => onUpdate(index, 'actionLink', e.target.value)}
          className="w-full px-2 sm:px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm"
        />
      </div>

      {/* Action Text */}
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Button Text (Optional)</label>
        <input
          type="text"
          placeholder="e.g., Shop Now, Explore, Learn More (default: Explore)"
          value={image.actionText}
          onChange={(e) => onUpdate(index, 'actionText', e.target.value)}
          className="w-full px-2 sm:px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm"
        />
      </div>
    </div>
  );
};

export default CampaignImageManager;
