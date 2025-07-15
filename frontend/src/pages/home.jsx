import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, RefreshCw, Github, GitCommit, Code2, Star, GitFork } from 'lucide-react'; // Added Star and GitFork for overview

import Header from '../components/Header';
import Footer from '../components/Footer';
// Assuming GitHubActivityOverview, LineChartComponent, and DonutChartComponent
// are styled to align with the new sharp aesthetic
import GitHubActivityOverview from '../components/GitHubActivityOverview.jsx';
import { LineChartComponent, DonutChartComponent } from '../components/Charts.jsx';

// Component for displaying a list of repositories
const RepositoryList = ({ repositories, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Repositories</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-3">
              <div className="bg-gray-200 h-5 w-48 rounded"></div>
              <div className="bg-gray-200 h-5 w-24 rounded"></div>
              <div className="bg-gray-200 h-5 w-32 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Repositories</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Repository
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Commits
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Languages
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {repositories.map((repo, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Github className="h-5 w-5 text-gray-500 mr-3" />
                    <div className="text-sm font-medium text-gray-900">{repo.repo}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <GitCommit className="h-4 w-4 text-emerald-500 mr-2" /> {/* Sharper green */}
                    <span className="text-sm text-gray-800">{repo.commits}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-2">
                    {repo.languages.split(', ').map((lang, langIndex) => (
                      <span
                        key={langIndex}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200" // Sharper tags
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

// Component for displaying language distribution
const LanguageDistribution = ({ repositories, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Language Distribution</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="bg-gray-200 h-4 w-24 rounded"></div>
              <div className="bg-gray-200 h-6 w-16 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Language Distribution</h2>
        <div className="text-center text-gray-500 py-8">
          <Code2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No language data available.</p>
        </div>
      </div>
    );
  }

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
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Language Distribution</h2>
      <div className="space-y-4">
        {sortedLanguages.map(([language, count], index) => (
          <div key={index} className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-gray-700">{language}</span>
            <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
              {count} {count === 1 ? 'repo' : 'repos'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Home component for the dashboard
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
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.error) throw new Error(result.error);
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

  const totalRepos = data.length;
  const totalCommits = data.reduce((sum, repo) => sum + (repo.commits || 0), 0);
  const totalStars = data.reduce((sum, repo) => sum + (repo.stars || 0), 0);
  const totalForks = data.reduce((sum, repo) => sum + (repo.forks || 0), 0);

  const uniqueLanguages = new Set();
  data.forEach(repo => {
    if (repo.languages && repo.languages !== 'N/A') {
      repo.languages.split(', ').forEach(lang => uniqueLanguages.add(lang));
    }
  });
  const activeLanguages = uniqueLanguages.size;

  const { commitChartData, languageChartData, sortedRepositories } = useMemo(() => {
    const commitData = data
      .map(repo => ({ name: repo.repo.replace(/[\r\n]/g, ''), commits: repo.commits }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const langCounts = {};
    data.forEach(repo => {
      if (repo.languages && repo.languages !== 'N/A') {
        repo.languages.split(', ').forEach(lang => {
          langCounts[lang] = (langCounts[lang] || 0) + 1;
        });
      }
    });

    const langData = Object.entries(langCounts).map(([name, value]) => ({ name, value }));
    const reposSortedByCommits = [...data].sort((a, b) => (b.commits || 0) - (a.commits || 0));

    return {
      commitChartData: commitData,
      languageChartData: langData,
      sortedRepositories: reposSortedByCommits
    };
  }, [data]);

  const handleRefresh = () => {
    fetchGitHubActivity();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-6 bg-white border border-red-300 rounded-lg shadow-lg">
          <div className="flex items-start">
            <AlertCircle className="h-7 w-7 text-red-600 mr-4 mt-1" />
            <div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Data</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-5 inline-flex items-center px-5 py-2.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col font-sans"> {/* Changed bg-zinc-50 to bg-zinc-100 for a slightly lighter, crisper background */}
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-10"> {/* Increased padding */}
          {/* Dashboard Heading */}
          <div className="flex items-center justify-between mb-10"> {/* Increased margin-bottom */}
            <div>
              <h1 className="text-4xl font-semibold text-gray-900 leading-tight">GitHub Activity Dashboard</h1> {/* Larger, bolder heading */}
              <p className="text-lg text-gray-700 mt-3">Comprehensive insights into my coding ecosystem.</p> {/* Larger, more descriptive sub-heading */}
              {lastUpdated && !isLoading && (
                <p className="text-sm text-gray-500 mt-2">
                  Last updated: <span className="font-medium">{new Date(lastUpdated).toLocaleString()}</span>
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-3"> {/* Increased gap */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="inline-flex items-center px-5 py-2.5 text-base font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-md border border-gray-300 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" // Sharper button
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Refreshing...' : 'Refresh Data'} {/* Clearer button text */}
              </button>
              <a
                href="https://github.com/SinhleM"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1.5 font-medium transition-colors duration-200" // Blue link for prominence
              >
                View My GitHub Profile <Github className="h-4 w-4 inline ml-0.5" />
              </a>
            </div>
          </div>

          {/* GitHub Activity Overview - Assuming this component is updated internally */}
          {/* You'll need to apply similar styling principles within GitHubActivityOverview.jsx */}
          <GitHubActivityOverview
            totalRepos={totalRepos}
            totalCommits={totalCommits}
            totalStars={totalStars}
            totalForks={totalForks}
            activeLanguages={activeLanguages}
            isLoading={isLoading}
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 my-10"> {/* Increased gap and margin */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-lg p-6 flex flex-col justify-between"> {/* Added border and rounded corners */}
              {!isLoading && data.length > 0 ? (
                <LineChartComponent
                  data={commitChartData}
                  xAxisKey="name"
                  lineKey="commits"
                  title="Commits Per Repository"
                  height={400}
                  color="#3B82F6" // Retained a sharp blue
                />
              ) : (
                <div className="flex items-center justify-center h-[400px] bg-gray-50 text-gray-400 border border-gray-200 rounded-md animate-pulse">
                  <span className="text-lg">Loading Commit Data...</span>
                </div>
              )}
            </div>
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 flex flex-col justify-between"> {/* Added border and rounded corners */}
              {!isLoading && data.length > 0 ? (
                <DonutChartComponent
                  data={languageChartData}
                  dataKey="value"
                  nameKey="name"
                  title="Language Distribution"
                  height={400}
                />
              ) : (
                <div className="flex items-center justify-center h-[400px] bg-gray-50 text-gray-400 border border-gray-200 rounded-md animate-pulse">
                   <span className="text-lg">Loading Language Distribution...</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10"> {/* Increased gap and margin */}
            <LanguageDistribution repositories={data} isLoading={isLoading} />
            {!isLoading && data.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6"> {/* Added border and rounded corners */}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Repository Statistics</h2> {/* More formal heading */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3"> {/* Subtle borders for separation */}
                    <span className="text-base font-medium text-gray-700">Most Active Repository</span>
                    <span className="text-base font-bold text-emerald-600"> {/* Sharper green */}
                      {data.reduce((max, repo) => repo.commits > max.commits ? repo : max, data[0])?.repo || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-base font-medium text-gray-700">Average Commits per Repo</span>
                    <span className="text-base font-bold text-blue-600">
                      {totalRepos > 0 ? Math.round(totalCommits / totalRepos) : 0} commits
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-base font-medium text-gray-700">Most Used Language</span>
                    <span className="text-base font-bold text-purple-600">
                      {languageChartData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between"> {/* No bottom border on the last item */}
                    <span className="text-base font-medium text-gray-700">Total Unique Languages</span>
                    <span className="text-base font-bold text-orange-600">{activeLanguages} languages</span>
                  </div>
                </div>
              </div>
            )}
            {/* Loading state for Repository Stats */}
            {isLoading && (
              <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Repository Statistics</h2>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="bg-gray-200 h-4 w-40 rounded"></div>
                      <div className="bg-gray-200 h-4 w-24 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <RepositoryList repositories={sortedRepositories} isLoading={isLoading} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;