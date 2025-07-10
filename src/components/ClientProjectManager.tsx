import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { projectService } from '../services/database';
import { Plus, Search, Filter, Calendar, Globe, Eye, Edit, Trash2, MoreVertical, AlertCircle, Loader } from 'lucide-react';
import { format } from 'date-fns';

const ClientProjectManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddProject, setShowAddProject] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    clientName: '',
    websiteUrl: '',
    notes: ''
  });
  const [databaseConnected, setDatabaseConnected] = useState(true);

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const projectsData = await projectService.getAll();
        setProjects(projectsData);
        // Check if we got real data or empty array due to no database
        if (projectsData.length === 0) {
          // Additional check to see if database is connected
          const { supabase, isSupabaseConnected } = await import('../lib/supabase');
          const connected = await isSupabaseConnected();
          setDatabaseConnected(connected);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setDatabaseConnected(false);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.websiteUrl.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check database connection first
    if (!databaseConnected) {
      alert('Database is not connected. Project tracking requires a Supabase database connection. Please configure your environment variables.');
      return;
    }
    
    try {
      const createdProject = await projectService.create({
        clientName: newProject.clientName,
        websiteUrl: newProject.websiteUrl,
        notes: newProject.notes,
        status: 'pending'
      });
      
      // Check if we got a mock project (starts with 'mock-')
      if (createdProject.id.startsWith('mock-')) {
        alert('Database is not connected. Project was not saved. Please configure your Supabase environment variables.');
        setDatabaseConnected(false);
        return;
      }
      
      setProjects(prev => [createdProject, ...prev]);
      setNewProject({ clientName: '', websiteUrl: '', notes: '' });
      setShowAddProject(false);
    } catch (error: any) {
      console.error('Error creating project:', error);
      
      // Check for specific error types
      if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
        alert('A project with this website URL already exists.');
      } else if (error.message?.includes('Database')) {
        alert('Database connection error. Please check your Supabase configuration.');
        setDatabaseConnected(false);
      } else {
        alert('Failed to create project. Please try again.');
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        await projectService.delete(id);
        setProjects(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const getStatusBadge = (status: Project['status']) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status];
  };

  const getStatusIcon = (status: Project['status']) => {
    switch (status) {
      case 'active': return '🟢';
      case 'completed': return '✅';
      case 'pending': return '🟡';
      default: return '⚪';
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <Loader className="w-8 h-8 animate-spin text-blue-600" />
      <span className="ml-3 text-gray-600">Loading projects...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Database Connection Warning */}
      {!databaseConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">Database Not Connected</p>
            <p className="text-sm text-yellow-700 mt-1">
              Project tracking requires a Supabase database. Configure your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY 
              environment variables to enable project saving and tracking.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Project Manager</h1>
          <p className="text-gray-600 mt-1">Manage and track all your GEO analysis projects</p>
          <div className="mt-2 flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${databaseConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-gray-500 text-sm">
              {databaseConnected ? 'Connected to Supabase Database' : 'Database not connected - Configure Supabase to save projects'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowAddProject(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Stats Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {projects.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                🟢
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                ✅
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {projects.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                🟡
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Client</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Website</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Created</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Analyzed</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{project.clientName}</div>
                        {project.notes && (
                          <div className="text-sm text-gray-500 mt-1">{project.notes}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={project.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {project.websiteUrl}
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                        <span className="mr-1">{getStatusIcon(project.status)}</span>
                        {project.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(project.createdAt, 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(project.lastAnalyzed, 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Get started by creating your first project'}
            </p>
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Project</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={newProject.clientName}
                  onChange={(e) => setNewProject({...newProject, clientName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL *
                </label>
                <input
                  type="url"
                  value={newProject.websiteUrl}
                  onChange={(e) => setNewProject({...newProject, websiteUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newProject.notes}
                  onChange={(e) => setNewProject({...newProject, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProjectManager;