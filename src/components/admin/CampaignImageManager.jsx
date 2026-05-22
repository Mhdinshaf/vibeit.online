import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Upload, Calendar, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  uploadImages,
  getCampaigns,
  getActiveCampaign,
  createCampaign,
  activateCampaign as activateCampaignApi,
  deleteCampaign,
  updateCampaign,
} from '../../services/api';

const CampaignImageManager = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('hero');
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch campaigns
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: getCampaigns,
  });

  // Fetch active campaign
  const { data: activeCampaign } = useQuery({
    queryKey: ['campaigns/active'],
    queryFn: getActiveCampaign,
  });

  const initializedRef = useRef(false);

  // Auto-select first campaign when campaigns load for the first time
  useEffect(() => {
    if (!initializedRef.current && campaigns.length > 0 && !selectedCampaignId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCampaignId(campaigns[0]._id);
      initializedRef.current = true;
    }
  }, [campaigns, selectedCampaignId]); // Dependencies are correct

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async (campaignName) => {
      const campaignMonth = new Date(campaignName);
      return createCampaign({
        campaignName,
        campaignMonth,
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
    mutationFn: activateCampaignApi,
    onSuccess: () => {
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
      if (selectedCampaignId === campaigns[0]?._id) {
        const remaining = campaigns.filter(c => c._id !== campaigns[0]._id);
        setSelectedCampaignId(remaining[0]?._id || null);
      }
      toast.success('Campaign deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete campaign');
    },
  });

  const selectedCampaign = campaigns.find(c => c._id === selectedCampaignId);
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
    <div className="space-y-8">
      {/* Campaign Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Select Campaign</h3>
            <p className="text-sm text-slate-500 mt-1">Choose or create a monthly campaign</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <label className="block text-sm font-medium text-slate-900 mb-2">Campaign Month (YYYY-MM)</label>
            <div className="flex gap-2">
              <input
                type="month"
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                onClick={() => createCampaignMutation.mutate(`${newCampaignName}`)}
                disabled={!newCampaignName || createCampaignMutation.isPending}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
              >
                {createCampaignMutation.isPending ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        )}

        {/* Campaign List */}
        <div className="space-y-2">
          {campaigns.map(campaign => (
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
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <h4 className="font-medium text-slate-900">{campaign.campaignName}</h4>
                    {isActiveCampaign && (
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Created {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!isActiveCampaign && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        activateCampaignMutation.mutate(campaign._id);
                      }}
                      className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    >
                      Activate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this campaign?')) {
                          deleteCampaignMutation.mutate(campaign._id);
                        }
                      }}
                      className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {campaigns.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No campaigns yet</p>
            <p className="text-sm text-slate-400">Create your first campaign to get started</p>
          </div>
        )}
      </div>

      {/* Campaign Editor */}
      {selectedCampaign && (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2">
            {['hero', 'trendingCategories'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 font-medium rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'hero' ? 'Hero Section' : 'Trending Categories'}
              </button>
            ))}
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="ml-auto px-4 py-2.5 font-medium rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all inline-flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          {/* Content Editor */}
          <HeroAndCategoryEditor
            campaign={selectedCampaign}
            activeTab={activeTab}
            campaignId={selectedCampaignId}
            previewMode={previewMode}
          />
        </div>
      )}

      {campaigns.length === 0 && !showCreateForm && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No campaigns to edit</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Create Your First Campaign
          </button>
        </div>
      )}
    </div>
  );
};

const HeroAndCategoryEditor = ({ campaign, activeTab, campaignId, previewMode }) => {
  const queryClient = useQueryClient();
  const fileInputRefs = useRef({});
  const [uploadingIndex, setUploadingIndex] = useState(null);
  // Initialize images from campaign sections
  const currentImages = campaign.sections?.[activeTab] || [];
  const [images, setImages] = useState(currentImages);

  // Update images when tab changes or campaign updates
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

  if (previewMode) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Live Preview</h3>
        {/* Preview will be implemented in frontend components */}
        <div className="text-center py-12 text-slate-500">
          Preview functionality will display your changes in real-time when components are integrated
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          {activeTab === 'hero' ? 'Hero Section Images' : 'Trending Categories'}
        </h3>
        <button
          onClick={handleAddImage}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </button>
      </div>

      <div className="space-y-6">
        {images.map((image, index) => (
          <div key={index} className="p-6 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-slate-900">Image {index + 1}</h4>
              <button
                onClick={() => handleRemoveImage(index)}
                className="text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={image.title}
                onChange={(e) => handleUpdateImage(index, 'title', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              <textarea
                placeholder="Description"
                value={image.description}
                onChange={(e) => handleUpdateImage(index, 'description', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows="2"
              />

              {activeTab === 'trendingCategories' && (
                <input
                  type="text"
                  placeholder="Badge (e.g., Electronic, Fashion)"
                  value={image.badge}
                  onChange={(e) => handleUpdateImage(index, 'badge', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              )}

              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={image.imageUrl}
                  onChange={(e) => handleUpdateImage(index, 'imageUrl', e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex-shrink-0">
                  <input 
                    type="file" 
                    ref={el => fileInputRefs.current[index] = el} 
                    onChange={(e) => handleImageUpload(e, index)} 
                    accept="image/jpeg,image/png,image/webp" 
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRefs.current[index]?.click()}
                    disabled={uploadingIndex === index}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors inline-flex items-center gap-2 border border-slate-300 disabled:opacity-50"
                  >
                    {uploadingIndex === index ? (
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Upload Photo
                  </button>
                </div>
              </div>

              {image.imageUrl && (
                <div className="p-4 bg-slate-50 rounded-lg">
                  <img
                    src={image.imageUrl}
                    alt="Preview"
                    className="max-h-48 object-contain mx-auto"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}

              <input
                type="text"
                placeholder="Action Link (e.g., /shop?category=Tech)"
                value={image.actionLink}
                onChange={(e) => handleUpdateImage(index, 'actionLink', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              <input
                type="text"
                placeholder="Action Text (default: Explore)"
                value={image.actionText}
                onChange={(e) => handleUpdateImage(index, 'actionText', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        ))}
      </div>

      {images.length > 0 && (
        <div className="mt-6 flex gap-2">
          <button
            onClick={handleSave}
            disabled={updateSectionMutation.isPending}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg font-medium transition-colors"
          >
            {updateSectionMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-12">
          <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No images yet</p>
          <button
            onClick={handleAddImage}
            className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add the first image
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignImageManager;
