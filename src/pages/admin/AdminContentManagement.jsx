import { useState } from 'react';
import { Image as ImageIcon, Gift, LayoutDashboard } from 'lucide-react';
import CampaignImageManager from '../../components/admin/CampaignImageManager';
import PromotionalOfferManager from '../../components/admin/PromotionalOfferManager';

const tabs = [
  { id: 'campaigns', label: 'Campaign Images', icon: ImageIcon, desc: 'Hero banners & trending category slides' },
  { id: 'promotions', label: 'Promotional Offers', icon: Gift, desc: 'Discount offers & promotional banners' },
];

const AdminContentManagement = () => {
  const [activeTab, setActiveTab] = useState('campaigns');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Page Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Content Management</h1>
            <p className="text-slate-500 mt-1 text-sm sm:text-base">Manage storefront content — hero banners, campaigns, and promotional offers</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-4 font-semibold text-sm transition-all relative ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/60'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-full" />
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.id === 'campaigns' ? 'Campaigns' : 'Offers'}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Description Bar */}
          <div className="px-6 py-3 bg-slate-50/60 border-b border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              {tabs.find(t => t.id === activeTab)?.desc}
            </p>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === 'campaigns' && <CampaignImageManager />}
            {activeTab === 'promotions' && <PromotionalOfferManager />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContentManagement;
