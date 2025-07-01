import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, RefreshCw, Github, GitCommit, Code2, Calendar } from 'lucide-react';

import Header from '../components/Header.jsx';
import GitHubActivityOverview from '../components/GitHubActivityOverview.jsx';
import { LineChartComponent, BarChartComponent, PieChartComponent, DonutChartComponent, MultiLineChartComponent, StackedBarChartComponent } from '../components/Charts.jsx';

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

const LanguageDistribution = ({ repositories, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Language Distribution</h2>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="bg-gray-200 h-4 w-20 rounded"></div>
              <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Language Distribution</h2>
        <div className="text-center text-gray-500 py-8">
          <Code2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No language data available</p>
        </div>
      </div>
    );
  }

  // Calculate language distribution
  const languageCount = {};
  repositories.forEach(repo => {
    if (repo.languages && repo.languages !== 'N/A') {
      const languages = repo.languages.split(', ');
      languages.forEach(lang => {
        languageCount[lang] = (languageCount[lang] || 0) + 1;
      });
    }
  });

  const sortedLanguages = Object.entries(languageCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Language Distribution</h2>
      <div className="space-y-3">
        {sortedLanguages.map(([language, count], index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{language}</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {count} {count === 1 ? 'repo' : 'repos'}
            </span>
          </div>
        ))}
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

  // Calculate statistics
  const totalRepos = data.length;
  const totalCommits = data.reduce((sum, repo) => sum + (repo.commits || 0), 0);
  const totalStars = data.reduce((sum, repo) => sum + (repo.stars || 0), 0); // MODIFIED
  const totalForks = data.reduce((sum, repo) => sum + (repo.forks || 0), 0); // MODIFIED

  // Calculate active languages
  const uniqueLanguages = new Set();
  data.forEach(repo => {
    if (repo.languages && repo.languages !== 'N/A') {
      repo.languages.split(', ').forEach(lang => uniqueLanguages.add(lang));
    }
  });
  const activeLanguages = uniqueLanguages.size;

  // Prepare data for the charts using useMemo for efficiency
  const { commitChartData, languageChartData } = useMemo(() => {
    // Data for the commit bar chart
    const commitData = data.map(repo => ({
      name: repo.repo,
      commits: repo.commits
    })).sort((a, b) => b.commits - a.commits); // Sort for better visualization

    // Data for the language donut chart
    const languageCount = {};
    data.forEach(repo => {
      if (repo.languages && repo.languages !== 'N/A') {
        repo.languages.split(', ').forEach(lang => {
          languageCount[lang] = (languageCount[lang] || 0) + 1;
        });
      }
    });
    const langData = Object.entries(languageCount).map(([name, value]) => ({ name, value }));

    return { commitChartData: commitData, languageChartData: langData };
  }, [data]);


  const handleRefresh = () => {
    fetchGitHubActivity();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPath="/" />
        <div className="max-w-7xl mx-auto px-4 py-8">
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
      {/* Header Component */}
      <Header currentPath="/" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
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

        {/* GitHub Activity Overview Component */}
        <GitHubActivityOverview
          totalRepos={totalRepos}
          totalCommits={totalCommits}
          totalStars={totalStars}
          totalForks={totalForks}
          activeLanguages={activeLanguages}
          isLoading={isLoading}
        />

        {/* REPLACED: Original CommitActivityChart section is now a grid with two charts */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 my-8">
          {/* Commit Activity Chart */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6">
            {!isLoading && data.length > 0 ? (
              <BarChartComponent // Using BarChartComponent from Chart.jsx
                data={commitChartData}
                xAxisKey="name"
                barKey="commits"
                title="Commits Per Repository"
                height={400}
                color="#10B981"
              />
            ) : (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-pulse bg-gray-200 rounded-md w-full h-[400px]"></div>
                </div>
            )}
          </div>

          {/* Language Distribution Donut Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
             {!isLoading && data.length > 0 ? (
              <DonutChartComponent // Using DonutChartComponent from Chart.jsx
                data={languageChartData}
                dataKey="value"
                nameKey="name"
                title="Language Distribution"
                height={400}
              />
            ) : (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-pulse bg-gray-200 rounded-full w-64 h-64"></div>
                </div>
            )}
          </div>
        </div>


        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Language Distribution */}
          <LanguageDistribution
            repositories={data}
            isLoading={isLoading}
          />

          {/* Additional Stats Card */}
          {!isLoading && data.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Repository Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Most Active Repository</span>
                  <span className="text-sm font-bold text-green-600">
                    {data.reduce((max, repo) => repo.commits > max.commits ? repo : max, data[0])?.repo}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Average Commits per Repo</span>
                  <span className="text-sm font-bold text-blue-600">
                    {totalRepos > 0 ? Math.round(totalCommits / totalRepos) : 0} commits
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Most Used Language</span>
                  <span className="text-sm font-bold text-purple-600">
                    {languageChartData.sort((a,b) => b.value - a.value)[0]?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Languages</span>
                  <span className="text-sm font-bold text-orange-600">
                    {activeLanguages} languages
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Repository List Component */}
        <RepositoryList
          repositories={data}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Home;