import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import CampaignImageManager from '../../components/admin/CampaignImageManager';

const AdminContentManagement = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Content Management</h1>
        <p className="text-slate-500 mt-1">Manage hero section and trending categories images</p>
      </div>

      {/* Campaign Manager */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-900">Campaign Images</h2>
        </div>
        <p className="text-slate-600 mb-6">Create campaigns, upload hero banner images and trending category images</p>
        <CampaignImageManager />
      </div>
    </div>
  );
};

export default AdminContentManagement;
