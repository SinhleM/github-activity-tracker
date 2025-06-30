import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Color palette for charts
const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {/* Corrected to use entry.name for better labeling */}
            {`${entry.name}: ${formatter ? formatter(entry.value) : entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Line Chart Component
export const LineChartComponent = ({
  data,
  xAxisKey,
  lineKey,
  height = 300,
  color = COLORS[0],
  title,
  formatter
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey={xAxisKey}
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
          />
          <Tooltip
            content={<CustomTooltip formatter={formatter} />}
          />
          <Line
            type="monotone"
            dataKey={lineKey}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Bar Chart Component
export const BarChartComponent = ({
  data,
  xAxisKey,
  barKey,
  height = 300,
  color = COLORS[1],
  title,
  formatter,
  horizontal = false
}) => {
  const ChartComponent = horizontal ? BarChart : BarChart;

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout={horizontal ? 'horizontal' : 'vertical'}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          {horizontal ? (
            <>
              <XAxis type="number" stroke="#6B7280" fontSize={12} />
              <YAxis type="category" dataKey={xAxisKey} stroke="#6B7280" fontSize={12} width={100} />
            </>
          ) : (
            <>
              <XAxis dataKey={xAxisKey} stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
            </>
          )}
          <Tooltip
            content={<CustomTooltip formatter={formatter} />}
          />
          <Bar
            dataKey={barKey}
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

// Pie Chart Component
export const PieChartComponent = ({
  data,
  dataKey,
  nameKey,
  height = 300,
  title,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 80
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0];
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900">{data.name}</p>
                    <p className="text-sm" style={{ color: data.payload.fill }}>
                      {`${dataKey}: ${data.value}`}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-sm text-gray-700">{value}</span>}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Donut Chart (Pie chart with inner radius)
export const DonutChartComponent = (props) => {
  return <PieChartComponent {...props} innerRadius={40} outerRadius={80} />;
};

// Multi-line Chart Component
export const MultiLineChartComponent = ({
  data,
  xAxisKey,
  lines, // Array of {key, color, name}
  height = 300,
  title,
  formatter
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey={xAxisKey}
            stroke="#6B7280"
            fontSize={12}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
          />
          <Tooltip
            content={<CustomTooltip formatter={formatter} />}
          />
          <Legend />
          {lines.map((line, index) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color || COLORS[index % COLORS.length]}
              strokeWidth={2}
              name={line.name || line.key}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Stacked Bar Chart Component
export const StackedBarChartComponent = ({
  data,
  xAxisKey,
  bars, // Array of {key, color, name}
  height = 300,
  title,
  formatter
}) => {
  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey={xAxisKey} stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip
            content={<CustomTooltip formatter={formatter} />}
          />
          <Legend />
          {bars.map((bar, index) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              stackId="a"
              fill={bar.color || COLORS[index % COLORS.length]}
              name={bar.name || bar.key}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// ADDED: Default export to align with the import in home.jsx
export default {
  LineChartComponent,
  BarChartComponent,
  PieChartComponent,
  DonutChartComponent,
  MultiLineChartComponent,
  StackedBarChartComponent
};