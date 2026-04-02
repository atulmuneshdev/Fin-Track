import React from 'react';
import { cn } from '../lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

const cardVariants = {
  balance: {
    icon: "bg-blue-500/10 text-blue-500",
    trend: "text-gray-500 dark:text-gray-400",
  },
  income: {
    icon: "bg-emerald-500/10 text-emerald-500",
    trend: "text-emerald-500",
  },
  expense: {
    icon: "bg-rose-500/10 text-rose-500",
    trend: "text-rose-500",
  },
};

const SummaryCard = ({ title, amount, icon: Icon, trend, variant = 'balance' }) => {

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);

  const trendIcon = trend > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />;

  return (
    <div className="bg-white cursor-pointer dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      
      {/* Top Section */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </p>

        <div className={cn("p-2 rounded-lg", cardVariants[variant].icon)}>
          <Icon size={20} />
        </div>
      </div>

      {/* Amount */}
      <h3 className="text-3xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
        {formattedAmount}
      </h3>

      {/* Trend */}
      {trend !== undefined && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold",
          cardVariants[variant].trend
        )}>
          {trendIcon}
          <span className="text-gray-700 dark:text-gray-300">
            {Math.abs(trend)}% vs last month
          </span>
        </div>
      )}

    </div>
  );
};

export default SummaryCard;