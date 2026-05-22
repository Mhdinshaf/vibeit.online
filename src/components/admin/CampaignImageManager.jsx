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

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image exceeds 5MB limit');
      return;
    }

    setUploadingIndex(index);
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

      handleUpdateImage(index, 'imageUrl', uploadedUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to upload image');
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
          Hero Section
        </button>
        <button
          onClick={() => setActiveTab('trendingCategories')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'trendingCategories'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Trending Categories
        </button>
      </div>

      {/* Images List */}
      <div className="space-y-4">
        {images.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p>No images yet. Click "Add Image" to get started.</p>
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

      {/* Add Image Button */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={handleAddImage}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </button>

        {images.length > 0 && (
          <button
            onClick={handleSave}
            disabled={updateSectionMutation.isPending}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {updateSectionMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
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
  return (
    <div className="p-4 border border-slate-200 rounded-lg space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-slate-900">Image {index + 1}</h4>
        <button
          onClick={() => onRemove(index)}
          className="text-red-600 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <input
        type="text"
        placeholder="Title"
        value={image.title}
        onChange={(e) => onUpdate(index, 'title', e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
      />

      <textarea
        placeholder="Description"
        value={image.description}
        onChange={(e) => onUpdate(index, 'description', e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
        rows="2"
      />

      {activeTab === 'trendingCategories' && (
        <input
          type="text"
          placeholder="Badge (e.g., Electronic, Fashion)"
          value={image.badge}
          onChange={(e) => onUpdate(index, 'badge', e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
        />
      )}

      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Image URL"
          value={image.imageUrl}
          onChange={(e) => onUpdate(index, 'imageUrl', e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
        />
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
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors border border-slate-300 disabled:opacity-50 text-sm flex items-center gap-2"
        >
          {uploadingIndex === index ? (
            <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-3 h-3" />
          )}
          Upload
        </button>
      </div>

      {image.imageUrl && (
        <div className="p-3 bg-slate-50 rounded-lg">
          <img
            src={image.imageUrl}
            alt="Preview"
            className="max-h-40 object-contain mx-auto"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3C/svg%3E';
            }}
          />
        </div>
      )}

      <input
        type="text"
        placeholder="Action Link (e.g., /shop?category=Tech)"
        value={image.actionLink}
        onChange={(e) => onUpdate(index, 'actionLink', e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
      />

      <input
        type="text"
        placeholder="Action Text (default: Explore)"
        value={image.actionText}
        onChange={(e) => onUpdate(index, 'actionText', e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
      />
    </div>
  );
};

export default CampaignImageManager;
