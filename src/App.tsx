import React, { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  owner_principal: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = async () => {
    // For demo purposes, we'll simulate a successful login
    // In a real ICP app, this would integrate with Internet Identity
    const mockPrincipal = "rdmx6-jaaaa-aaaah-qcaiq-cai";
    setPrincipal(mockPrincipal);
    setIsAuthenticated(true);
    loadProjects();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPrincipal('');
    setProjects([]);
  };

  const loadProjects = async () => {
    if (!principal) return;
    
    try {
      setIsLoading(true);
      // This would call the canister method list_projects()
      // For demo purposes, we'll simulate the response
      const mockProjects: Project[] = [
        { id: 'project_1', name: 'My First Song', owner_principal: principal },
        { id: 'project_2', name: 'Collaboration Track', owner_principal: principal },
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !principal) return;

    try {
      setIsLoading(true);
      // This would call the canister method create_project()
      // For demo purposes, we'll simulate the response
      const newProject: Project = {
        id: `project_${Date.now()}`,
        name: newProjectName,
        owner_principal: principal,
      };
      
      setProjects([...projects, newProject]);
      setNewProjectName('');
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-8">🎵 Orpheus</h1>
          <p className="text-xl text-gray-300 mb-8">Music Collaboration on Internet Computer</p>
          <button
            onClick={login}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Login with Internet Identity
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold text-gray-900">🎵 Orpheus</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Principal: {principal.slice(0, 10)}...{principal.slice(-10)}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Project Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Project</h2>
            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project name..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !newProjectName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {isLoading ? 'Creating...' : 'Create Project'}
              </button>
            </form>
          </div>

          {/* Projects List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Projects</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading projects...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No projects yet. Create your first one!
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">ID: {project.id}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {project.owner_principal.slice(0, 8)}...{project.owner_principal.slice(-8)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
