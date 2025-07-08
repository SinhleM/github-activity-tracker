import React, { useState } from 'react';
import {
  BarChartComponent,
  LineChartComponent,
  PieChartComponent,
  DonutChartComponent,
} from './Chart.jsx';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const CommitActivityChart = ({ repositories = [], isLoading = false }) => {
  const [chartType, setChartType] = useState('bar');

  if (isLoading) {
    return (
      <div className="bg-white shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Commit Activity</h2>
          <div className="animate-pulse bg-gray-200 h-8 w-32"></div>
        </div>
        <div className="animate-pulse bg-gray-200 h-64"></div>
      </div>
    );
  }

  if (!repositories || repositories.length === 0) {
    return (
      <div className="bg-white shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Commit Activity</h2>
        <div className="flex items-center justify-center h-64 text-gray-50">
          <div className="text-center">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No commit data available</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = repositories.map(repo => ({
    name: repo.repo || repo.name,
    commits: repo.commits || 0,
    languages: repo.languages || 'N/A',
  }));

  const sortedData = [...chartData].sort((a, b) => b.commits - a.commits);

  const pieData = sortedData.slice(0, 8).map(repo => ({
    name: repo.name,
    value: repo.commits,
    commits: repo.commits,
  }));

  const chartOptions = [
    {
      id: 'bar',
      label: 'Bar Chart',
      icon: BarChart3,
      description: 'Compare commits across repositories',
    },
    {
      id: 'line',
      label: 'Line Chart',
      icon: TrendingUp,
      description: 'Show commit trends',
    },
    {
      id: 'pie',
      label: 'Pie Chart',
      icon: PieChart,
      description: 'Commit distribution',
    },
    {
      id: 'donut',
      label: 'Donut Chart',
      icon: PieChart,
      description: 'Commit distribution (donut)',
    },
  ];

  const formatCommits = value => `${value} commits`;

  const renderChart = () => {
    const commonProps = {
      height: 400,
      title: '',
      formatter: formatCommits,
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChartComponent
            data={sortedData}
            xAxisKey="name"
            lineKey="commits"
            color="#10B981"
            {...commonProps}
          />
        );
      case 'pie':
        return (
          <PieChartComponent
            data={pieData}
            dataKey="value"
            nameKey="name"
            height={400}
            title=""
            showLegend={true}
          />
        );
      case 'donut':
        return (
          <DonutChartComponent
            data={pieData}
            dataKey="value"
            nameKey="name"
            height={400}
            title=""
            showLegend={true}
          />
        );
      case 'bar':
      default:
        return (
          <BarChartComponent
            data={sortedData}
            xAxisKey="name"
            barKey="commits"
            color="#3B82F6"
            {...commonProps}
          />
        );
    }
  };

  return (
    <div className="bg-white shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Commit Activity</h2>
          <p className="text-sm text-gray-600">
            Showing commits across {repositories.length} repositories
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {chartOptions.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setChartType(option.id)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  chartType === option.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                }`}
                title={option.description}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {repositories.reduce((sum, repo) => sum + (repo.commits || 0), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Commits</div>
        </div>

        <div className="bg-gray-50 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {Math.max(...repositories.map(repo => repo.commits || 0)).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Highest Commits</div>
        </div>

        <div className="bg-gray-50 p-4">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(
              repositories.reduce((sum, repo) => sum + (repo.commits || 0), 0) /
                repositories.length
            ).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Average Commits</div>
        </div>
      </div>

      <div className="w-full">{renderChart()}</div>

      {(chartType === 'pie' || chartType === 'donut') && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Repository Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedData.slice(0, 6).map((repo, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3"
                    style={{
                      backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
                    }}
                  ></div>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {repo.name}
                  </span>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  {repo.commits} commits
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitActivityChart;
