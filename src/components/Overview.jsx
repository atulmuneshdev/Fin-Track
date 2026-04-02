import React from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import useStore from '../store/useStore';
import SummaryCard from './SummaryCard';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const renderLegendText = (value, entry) => {
  return <span className="text-foreground/80">{value}</span>;
};

const Overview = () => {
  const { getTotals, getSpendingByCategory, getTrendData } = useStore();
  const totals = getTotals();
  const categoryData = getSpendingByCategory();
  const trendData = getTrendData();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Balance" 
          amount={totals.totalBalance} 
          icon={DollarSign} 
          trend={2.5}
          variant="balance"
        />
        <SummaryCard 
          title="Monthly Income" 
          amount={totals.totalIncome} 
          icon={ArrowUpRight} 
          trend={1.2}
          variant="income"
        />
        <SummaryCard 
          title="Monthly Expenses" 
          amount={totals.totalExpenses} 
          icon={ArrowDownRight} 
          trend={-0.8}
          variant="expense"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={20} className="text-primary" />
            <h3 className="text-lg font-semibold">Balance Trend</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorBalance)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categorical Breakdown */}
        <div className="bg-card border rounded-xl p-6 shadow-sm ">
          <div className="flex items-center gap-2 mb-6">
            <PieChartIcon size={20} className="text-primary" />
            <h3 className="text-lg font-semibold">Spending by Category</h3>
          </div>
          <div className="h-[300px] w-full ">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend verticalAlign="bottom" height={36} formatter={renderLegendText} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <PieChartIcon size={48} className="mb-2 opacity-20" />
                <p>No spending data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-card border rounded-xl p-6 shadow-sm cursor-pointer">
        <h3 className="text-lg font-semibold mb-6">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 rounded-lg bg-secondary/50 border">
            <p className="text-sm font-medium text-muted-foreground mb-1">Highest Spending</p>
            <p className="text-xl font-bold">
              {categoryData.length > 0 
                ? categoryData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name 
                : 'N/A'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50 border">
            <p className="text-sm font-medium text-muted-foreground mb-1">Monthly Comparison</p>
            <p className="text-xl font-bold text-emerald-500">+12.5% vs Last Month</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/50 border">
            <p className="text-sm font-medium text-muted-foreground mb-1">Savings Goal</p>
            <p className="text-xl font-bold">75% Achieved</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
