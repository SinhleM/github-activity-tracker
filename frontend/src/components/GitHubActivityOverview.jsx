import React from 'react';
import { Github, GitCommit, Code2, Calendar, Star, GitFork, Users, TrendingUp } from 'lucide-react';

const GitHubActivityOverview = ({
  totalRepos = 0,
  totalCommits = 0,
  totalStars = 0,
  totalForks = 0,
  activeLanguages = 0,
  isLoading = false
}) => {
  const stats = [
    {
      title: 'Total Repositories',
      value: totalRepos,
      icon: Github,
      color: 'blue',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Commits',
      value: totalCommits,
      icon: GitCommit,
      color: 'green',
      borderColor: 'border-green-500',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Languages',
      value: activeLanguages,
      icon: Code2,
      color: 'purple',
      borderColor: 'border-purple-500',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Stars',
      value: totalStars,
      icon: Star,
      color: 'yellow',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Forks',
      value: totalForks,
      icon: GitFork,
      color: 'indigo',
      borderColor: 'border-indigo-500',
      iconColor: 'text-indigo-500',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Last Updated',
      value: new Date().toLocaleDateString(),
      icon: Calendar,
      color: 'orange',
      borderColor: 'border-orange-500',
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const LoadingSkeleton = () => (
    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${stat.borderColor} hover:shadow-lg transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {stat.title}
                </p>
                <div className="text-2xl font-bold text-gray-900">
                  {isLoading ? (
                    <LoadingSkeleton />
                  ) : (
                    typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value
                  )}
                </div>
              </div>
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>

            {/* Optional: Add a trend indicator */}
            {!isLoading && typeof stat.value === 'number' && stat.value > 0 && (
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Active</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GitHubActivityOverview;