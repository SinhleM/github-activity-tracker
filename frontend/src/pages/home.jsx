import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Github, GitCommit, Code2, Calendar } from 'lucide-react';

// Mock components that match your structure - replace these with your actual components
const GitHubActivityOverview = ({ totalRepos, totalCommits, isLoading }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Repositories</p>
          <div className="text-3xl font-bold text-gray-900">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              totalRepos
            )}
          </div>
        </div>
        <Github className="h-8 w-8 text-blue-500" />
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Commits</p>
          <div className="text-3xl font-bold text-gray-900">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              totalCommits
            )}
          </div>
        </div>
        <GitCommit className="h-8 w-8 text-green-500" />
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Active Languages</p>
          <div className="text-3xl font-bold text-gray-900">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
            ) : (
              '5+'
            )}
          </div>
        </div>
        <Code2 className="h-8 w-8 text-purple-500" />
      </div>
    </div>
    
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Last Updated</p>
          {/* FIX: Changed <p> to <div> to correctly nest the loading div */}
          <div className="text-sm font-bold text-gray-900">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
            ) : (
              new Date().toLocaleDateString()
            )}
          </div>
        </div>
        <Calendar className="h-8 w-8 text-orange-500" />
      </div>
    </div>
  </div>
);

const RepositoryList = ({ repositories, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Repositories</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded-lg">
              <div className="bg-gray-200 h-4 w-32 rounded"></div>
              <div className="bg-gray-200 h-4 w-16 rounded"></div>
              <div className="bg-gray-200 h-4 w-24 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Repositories</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Repository
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commits
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Languages
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {repositories.map((repo, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Github className="h-5 w-5 text-gray-400 mr-3" />
                    <div className="text-sm font-medium text-gray-900">{repo.repo}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <GitCommit className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-900">{repo.commits}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {repo.languages.split(', ').map((lang, langIndex) => (
                      <span
                        key={langIndex}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CommitActivityChart = ({ repositories, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Commit Activity</h2>
        <div className="animate-pulse bg-gray-200 h-64 rounded"></div>
      </div>
    );
  }

  const maxCommits = Math.max(...repositories.map(repo => repo.commits));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Commit Activity by Repository</h2>
      <div className="space-y-4">
        {repositories.map((repo, index) => {
          const percentage = maxCommits > 0 ? (repo.commits / maxCommits) * 100 : 0;
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-32 text-sm font-medium text-gray-700 truncate">
                {repo.repo}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                  {repo.commits}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Home = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchGitHubActivity = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/github-activity');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Handle error responses from your Flask API
      if (result.error) {
        throw new Error(result.error);
      }
      
      setData(result);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching GitHub activity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubActivity();
  }, []);

  // Calculate totals
  const totalRepos = data.length;
  const totalCommits = data.reduce((sum, repo) => sum + repo.commits, 0);

  const handleRefresh = () => {
    fetchGitHubActivity();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading GitHub Activity</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={handleRefresh}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GitHub Activity Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Track your repositories, commits, and coding activity
            </p>
            {lastUpdated && !isLoading && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Activity Overview */}
        <GitHubActivityOverview 
          totalRepos={totalRepos}
          totalCommits={totalCommits}
          isLoading={isLoading}
        />

        {/* Charts and Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CommitActivityChart 
            repositories={data}
            isLoading={isLoading}
          />
          
          {!isLoading && data.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Language Distribution</h2>
              <div className="space-y-3">
                {Array.from(new Set(data.flatMap(repo => 
                  repo.languages.split(', ').filter(lang => lang !== 'N/A')
                ))).slice(0, 6).map((language, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{language}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {data.filter(repo => repo.languages.includes(language)).length} repos
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Repository List */}
        <RepositoryList 
          repositories={data}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Home;