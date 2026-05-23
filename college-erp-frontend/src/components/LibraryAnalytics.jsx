import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Book, TrendingUp, Clock, AlertTriangle, CheckCircle, BarChart3, Database } from 'lucide-react';

const COLORS = ['#10B981', '#6366F1', '#EF4444'];

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-text-muted gap-3">
    <div className="p-4 bg-gray-50 rounded-full">
      <Icon size={32} className="text-gray-400" />
    </div>
    <p className="font-medium text-sm text-gray-500">{message}</p>
  </div>
);

const LibraryAnalytics = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <TrendingUp className="text-gray-300" size={48} />
          <p className="text-text-muted font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <EmptyState icon={Database} message="No analytics data available yet" />
      </div>
    );
  }

  const pieData = [
    { name: 'Available', value: data?.availableBooks || 0 },
    { name: 'Borrowed', value: data?.borrowedBooks || 0 },
    { name: 'Overdue', value: data?.overdueCount || 0 },
  ].filter(item => item.value > 0);

  const hasPieData = pieData.length > 0;
  const hasBarData = Array.isArray(data?.barChartData) && data.barChartData.length > 0;
  const hasTopBooks = Array.isArray(data?.topBooks) && data.topBooks.length > 0;
  const hasRecentActivity = Array.isArray(data?.recentActivity) && data.recentActivity.length > 0;

  // Assuming max borrow count for progress bar scaling
  const maxBorrowCount = hasTopBooks ? Math.max(...data.topBooks.map(b => b.borrowCount || 0)) : 1;

  return (
    <div className="p-6 bg-gray-50/30 rounded-b-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Inventory Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="bg-indigo-50 p-1.5 rounded-lg">
                <BarChart3 className="text-indigo-600" size={18} />
              </div>
              Inventory Distribution
            </h3>
          </div>
          <div className="h-[250px] w-full">
            {hasPieData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={65} outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
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
              <EmptyState icon={BarChart3} message="No distribution data available" />
            )}
          </div>
        </div>

        {/* Monthly Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <TrendingUp className="text-blue-600" size={18} />
              </div>
              Borrowing Activity
            </h3>
          </div>
          <div className="h-[250px] w-full">
            {hasBarData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }} />
                  <RechartsTooltip 
                    cursor={{ fill: '#F8FAFC' }} 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 500 }} 
                  />
                  <Bar dataKey="borrows" fill="#3B82F6" radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState icon={TrendingUp} message="No borrowing activity data" />
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Books */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="bg-emerald-50 p-1.5 rounded-lg">
                <Book className="text-emerald-600" size={18} />
              </div>
              Top Borrowed Books
            </h3>
          </div>
          
          {hasTopBooks ? (
            <div className="space-y-4">
              {data.topBooks.map((book, idx) => {
                const progressWidth = maxBorrowCount > 0 ? `${Math.min((book.borrowCount / maxBorrowCount) * 100, 100)}%` : '0%';
                
                return (
                  <div key={book.id || idx} className="group flex flex-col gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-sm">
                        #{idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-sm font-semibold text-gray-900 truncate pr-2">{book.bookName}</p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-800 shrink-0 border border-gray-200">
                            {book.category || 'General'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <p className="truncate">{book.author}</p>
                          <span className="font-semibold text-indigo-600">{book.borrowCount} borrows</span>
                        </div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500 ease-out group-hover:bg-indigo-600"
                        style={{ width: progressWidth }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={Book} message="No top borrowed books yet" />
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <div className="bg-amber-50 p-1.5 rounded-lg">
                <Clock className="text-amber-600" size={18} />
              </div>
              Recent Activity Feed
            </h3>
          </div>
          
          {hasRecentActivity ? (
            <div className="relative pl-2 py-2">
              <div className="absolute left-[15px] top-6 bottom-6 w-px bg-gray-200"></div>
              <div className="space-y-6">
                {data.recentActivity.map((act, idx) => {
                  const isReturn = act.status === 'Returned';
                  const isOverdue = act.status === 'Overdue';
                  
                  let DotColor = "bg-blue-500";
                  let IconColor = "text-blue-500";
                  let BgColor = "bg-blue-50";
                  let ActIcon = Book;
                  
                  if (isReturn) {
                    DotColor = "bg-emerald-500";
                    IconColor = "text-emerald-500";
                    BgColor = "bg-emerald-50";
                    ActIcon = CheckCircle;
                  } else if (isOverdue) {
                    DotColor = "bg-red-500";
                    IconColor = "text-red-500";
                    BgColor = "bg-red-50";
                    ActIcon = AlertTriangle;
                  }

                  return (
                    <div key={act.id || idx} className="relative flex items-start gap-4 group">
                      <div className={`absolute -left-[5px] top-2.5 w-2.5 h-2.5 rounded-full ${DotColor} border-2 border-white shadow-sm z-10`}></div>
                      
                      <div className={`p-2 rounded-xl shrink-0 ${BgColor} ${IconColor} group-hover:scale-110 transition-transform duration-200 ml-4`}>
                        <ActIcon size={16} />
                      </div>
                      
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm text-gray-800 leading-snug">
                          <span className="font-semibold text-gray-900">{act.borrowerName}</span> 
                          {' '}{isReturn ? 'returned' : isOverdue ? 'has overdue' : 'borrowed'}{' '}
                          <span className="font-medium text-indigo-600">{act.bookName}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          {act.date || act.createdAt ? new Date(act.date || act.createdAt).toLocaleDateString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyState icon={Clock} message="No recent activity found" />
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryAnalytics;
