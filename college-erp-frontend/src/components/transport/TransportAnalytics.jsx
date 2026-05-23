import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, CartesianGrid, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Bus, TrendingUp, AlertTriangle, Zap, Droplets, MapPin, Activity, Settings } from 'lucide-react';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#64748B'];

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-500 gap-3">
    <div className="p-4 bg-gray-50 rounded-full">
      {Icon ? <Icon size={32} className="text-gray-400" /> : <Activity size={32} className="text-gray-400" />}
    </div>
    <p className="font-medium text-sm text-gray-500">{message}</p>
  </div>
);

const TransportAnalytics = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <TrendingUp className="text-gray-300" size={48} />
          <p className="text-gray-500 font-medium">Loading smart analytics...</p>
        </div>
      </div>
    );
  }

  // Mock charts data for visual layout since not strictly from backend yet
  const conditionData = [
    { name: 'Excellent', value: data?.activeBuses || 0 },
    { name: 'Maintenance', value: data?.maintenanceBuses || 0 },
    { name: 'Critical', value: data?.nonRunningBuses || 0 },
  ].filter(item => item.value > 0);

  const hasConditionData = Array.isArray(conditionData) && conditionData.length > 0;

  const occupancyTrend = [
    { time: '6 AM', occupancy: 20 },
    { time: '8 AM', occupancy: 95 },
    { time: '10 AM', occupancy: 40 },
    { time: '2 PM', occupancy: 35 },
    { time: '4 PM', occupancy: 90 },
    { time: '6 PM', occupancy: 25 },
  ];
  
  const hasOccupancyData = Array.isArray(occupancyTrend) && occupancyTrend.length > 0;

  return (
    <div className="p-6 bg-gray-50/30 rounded-b-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Fleet Condition */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="bg-emerald-50 p-1.5 rounded-lg">
                <Zap className="text-emerald-600" size={18} />
              </div>
              Fleet Condition Overview
            </h3>
          </div>
          <div className="h-[250px] w-full">
            {hasConditionData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conditionData}
                    cx="50%" cy="50%"
                    innerRadius={65} outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {conditionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 500 }} 
                    itemStyle={{ color: '#1E293B' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={Zap} message="No fleet condition data available" />
            )}
          </div>
        </div>

        {/* Occupancy Trend */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <Activity className="text-blue-600" size={18} />
              </div>
              Daily Occupancy Trend
            </h3>
          </div>
          <div className="h-[250px] w-full">
            {hasOccupancyData ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={occupancyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }} />
                  <RechartsTooltip 
                    cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }} 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 500 }} 
                  />
                  <Line type="monotone" dataKey="occupancy" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={Activity} message="No occupancy data available" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="bg-amber-50 p-1.5 rounded-lg">
                <AlertTriangle className="text-amber-600" size={18} />
              </div>
              AI Smart Insights
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 items-start group hover:bg-amber-100 transition-colors">
              <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Bus TN-33-AB-1021 is nearing full capacity.</p>
                <p className="text-xs text-gray-600 mt-1">Route North Campus currently has 95% occupancy.</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3 items-start group hover:bg-red-100 transition-colors">
              <Settings size={20} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Bus 12 maintenance overdue by 8 days.</p>
                <p className="text-xs text-gray-600 mt-1">Schedule critical engine check immediately.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex gap-3 items-start group hover:bg-emerald-100 transition-colors">
              <TrendingUp size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Driver Ravi has highest on-time performance.</p>
                <p className="text-xs text-gray-600 mt-1">100% schedule adherence for the past 30 days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Efficiency */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="bg-indigo-50 p-1.5 rounded-lg">
                <Droplets className="text-indigo-600" size={18} />
              </div>
              Operational Efficiency
            </h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-semibold text-gray-700">Overall Fuel Efficiency</p>
                <span className="text-lg font-bold text-emerald-600">{data?.fuelEfficiencyScore || 85}/100</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${data?.fuelEfficiencyScore || 85}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-semibold text-gray-700">On-Time Performance</p>
                <span className="text-lg font-bold text-blue-600">92%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl mt-4 border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Monthly Est. Cost</p>
                <p className="text-xl font-bold text-gray-900 mt-0.5">₹{(data?.monthlyCost || 125000).toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
                <MapPin className="text-indigo-500" size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportAnalytics;
