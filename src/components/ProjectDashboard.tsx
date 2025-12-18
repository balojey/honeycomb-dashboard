'use client';

import { useState } from 'react';
import ProjectCreationForm from './ProjectCreationForm';
import ProjectsList from './ProjectsList';

type TabType = 'create' | 'list';

export default function ProjectDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('list');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Honeycomb Protocol Dashboard
          </h1>
          <p className="text-gray-600">
            Create and manage your Honeycomb Protocol projects
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Projects
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'create'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Create Project
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'list' && <ProjectsList />}
          {activeTab === 'create' && <ProjectCreationForm />}
        </div>
      </div>
    </div>
  );
}