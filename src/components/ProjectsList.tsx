'use client';

import { useState, useEffect } from 'react';
import { useWalletAddress } from '@/hooks/useWalletAddress';
import { createClient } from '@/lib/supabase';

interface Project {
  id: string;
  name: string;
  project_address: string;
  authority_public_key: string;
  achievements: string[];
  custom_data_fields: string[];
  created_at: string;
}

export default function ProjectsList() {
  const { walletRecord } = useWalletAddress();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletRecord?.address) {
      fetchProjects();
    }
  }, [walletRecord?.address]);

  const fetchProjects = async () => {
    if (!walletRecord?.address) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // First get the wallet address ID
      const { data: walletData, error: walletError } = await supabase
        .from('wallet_addresses')
        .select('id')
        .eq('address', walletRecord.address)
        .single();

      if (walletError) {
        if (walletError.code === 'PGRST116') {
          // No wallet found, no projects
          setProjects([]);
          return;
        }
        throw walletError;
      }

      // Fetch projects for this wallet
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('wallet_address_id', walletData.id)
        .order('created_at', { ascending: false });

      if (projectsError) {
        throw projectsError;
      }

      setProjects(projectsData || []);

    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setIsLoading(false);
    }
  };

  if (!walletRecord?.address) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-gray-600">Connect your wallet to view your projects.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={fetchProjects}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Honeycomb Projects</h2>
        <button
          onClick={fetchProjects}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You haven't created any projects yet.</p>
          <p className="text-sm text-gray-500">Create your first Honeycomb project to get started!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{project.name}</h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Address:</span>
                  <p className="text-gray-600 break-all font-mono text-xs">
                    {project.project_address}
                  </p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700">Authority:</span>
                  <p className="text-gray-600 break-all font-mono text-xs">
                    {project.authority_public_key}
                  </p>
                </div>

                {project.achievements.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Achievements:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.achievements.map((achievement, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.custom_data_fields.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Custom Fields:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.custom_data_fields.map((field, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <p className="text-gray-600">
                    {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}