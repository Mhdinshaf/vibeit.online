import { useState } from 'react';
import { Image as ImageIcon, Gift } from 'lucide-react';
import CampaignImageManager from '../../components/admin/CampaignImageManager';
import PromotionalOfferManager from '../../components/admin/PromotionalOfferManager';

const AdminContentManagement = () => {
  const [activeTab, setActiveTab] = useState('campaigns');

  const tabs = [
    {
      id: 'campaigns',
      label: 'Campaign Images',
      icon: ImageIcon,
      description: 'Manage hero and category images for monthly campaigns',
    },
    {
      id: 'promotions',
      label: 'Promotional Offers',
      icon: Gift,
      description: 'Create and manage promotional banners and offers',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Content Management</h1>
        <p className="text-slate-500 mt-1">Manage dynamic content and promotional campaigns</p>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ${
                isActive
                  ? 'border-blue-600 bg-blue-50 shadow-lg'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? 'bg-blue-600' : 'bg-slate-100'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                </div>
                <div className="text-left">
                  <h3 className={`font-semibold text-lg ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                    {tab.label}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{tab.description}</p>
                </div>
              </div>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'campaigns' && <CampaignImageManager />}
        {activeTab === 'promotions' && <PromotionalOfferManager />}
      </div>
    </div>
  );
};

export default AdminContentManagement;
