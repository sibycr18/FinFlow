import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Wallet,
  PiggyBank,
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import type { MonthlyData } from '../types/finance';
import { TestDataButton } from './TestDataButton';

interface AnalysisProps {
  monthlyData: MonthlyData[];
}

// Helper function to format currency in Indian format
const formatIndianCurrency = (amount: number) => {
  return amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    style: 'decimal'
  });
};

export function Analysis({ monthlyData }: AnalysisProps) {
  const [viewType, setViewType] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return {
      month: now.getMonth(),
      year: now.getFullYear()
    };
  });

  // Handle empty data case
  if (monthlyData.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center py-6 bg-slate-800/50 rounded-2xl">
          <PieChart className="w-8 h-8 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No Data Available</h3>
          <p className="text-slate-400 mb-6">Start adding expenses to see your financial analysis.</p>
          <TestDataButton />
        </div>
      </div>
    );
  }

  const currentMonth = monthlyData[monthlyData.length - 1];
  
  const getCategoryTotal = (category: keyof MonthlyData['expenses']) => 
    currentMonth.expenses[category].reduce((total, item) => total + item.amount, 0);

  const getTotalExpenses = () => 
    Object.values(currentMonth.expenses).reduce(
      (total, categoryExpenses) => 
        total + categoryExpenses.reduce((catTotal, expense) => catTotal + expense.amount, 0),
      0
    );

  const categories = [
    { key: 'investment' as const, label: 'Investment', color: 'bg-emerald-500', icon: PiggyBank },
    { key: 'debt' as const, label: 'Debt', color: 'bg-rose-500', icon: CreditCard },
    { key: 'needs' as const, label: 'Needs', color: 'bg-cyan-500', icon: ShoppingBag },
    { key: 'leisure' as const, label: 'Leisure', color: 'bg-amber-500', icon: Wallet },
  ];

  const totalExpenses = getTotalExpenses();
  const totalSavings = currentMonth.salary - totalExpenses;
  const savingsPercentage = ((totalSavings / currentMonth.salary) * 100).toFixed(1);

  // Get the category with highest expenses
  const highestCategory = categories.reduce((max, category) => {
    const total = getCategoryTotal(category.key);
    return total > getCategoryTotal(max.key) ? category : max;
  }, categories[0]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get last 6 years
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 6 },
    (_, i) => currentYear - 5 + i
  );

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Financial Analysis</h2>
          <p className="text-sm text-slate-400">Track your spending and savings patterns</p>
        </div>
        <div className="flex bg-slate-800/50 rounded-lg p-0.5">
          <button
            onClick={() => setViewType('monthly')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewType === 'monthly'
                ? 'bg-cyan-500 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewType('yearly')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewType === 'yearly'
                ? 'bg-cyan-500 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-cyan-500" />
            </div>
            <span className="text-xs text-slate-400">Total Expenses</span>
          </div>
          <div className="text-lg font-bold text-white">₹{formatIndianCurrency(totalExpenses)}</div>
          <div className="mt-1 text-xs text-slate-400">
            {currentMonth.expenses.investment.length + 
             currentMonth.expenses.debt.length + 
             currentMonth.expenses.needs.length + 
             currentMonth.expenses.leisure.length} transactions
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <PiggyBank className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-xs text-slate-400">Total Savings</span>
          </div>
          <div className="text-lg font-bold text-white">₹{formatIndianCurrency(totalSavings)}</div>
          <div className="mt-1 text-xs text-emerald-500">{savingsPercentage}% of income</div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <BarChart className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-xs text-slate-400">Monthly Income</span>
          </div>
          <div className="text-lg font-bold text-white">₹{formatIndianCurrency(currentMonth.salary)}</div>
          <div className="mt-1 text-xs text-slate-400">Salary</div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-rose-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-xs text-slate-400">Highest Category</span>
          </div>
          <div className="text-lg font-bold text-white">{highestCategory.label}</div>
          <div className="mt-1 text-xs text-slate-400">
            ₹{formatIndianCurrency(getCategoryTotal(highestCategory.key))}
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="flex items-center space-x-3 bg-slate-800/50 p-2 rounded-lg mb-4">
        <Calendar className="w-4 h-4 text-slate-400" />
        <select
          value={selectedDate.month}
          onChange={(e) => setSelectedDate(prev => ({ ...prev, month: parseInt(e.target.value) }))}
          className="bg-transparent text-sm text-slate-200 border-none focus:ring-0"
        >
          {months.map((month, index) => (
            <option key={month} value={index}>{month}</option>
          ))}
        </select>
        <select
          value={selectedDate.year}
          onChange={(e) => setSelectedDate(prev => ({ ...prev, year: parseInt(e.target.value) }))}
          className="bg-transparent text-sm text-slate-200 border-none focus:ring-0"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {categories.map(({ key, label, color, icon: Icon }) => {
          const amount = getCategoryTotal(key);
          const percentage = totalExpenses ? ((amount / totalExpenses) * 100).toFixed(1) : '0';
          
          return (
            <div key={key} className="bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <h3 className="text-sm font-semibold text-slate-200">{label}</h3>
                  </div>
                  <p className="text-lg font-bold text-white">
                    ₹{formatIndianCurrency(amount)}
                  </p>
                </div>
                <div className={`w-8 h-8 ${color} rounded-lg opacity-20`} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1.5">
                  <div className={`w-2 h-2 ${color} rounded-full`} />
                  <span className="text-slate-400">{percentage}% of total</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <span>{currentMonth.expenses[key].length} transactions</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Comparison */}
      <div className="bg-slate-800/50 rounded-lg p-3">
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Category Breakdown</h3>
        <div className="space-y-3">
          {categories.map(({ key, label, color, icon: Icon }) => {
            const amount = getCategoryTotal(key);
            const percentage = totalExpenses ? ((amount / totalExpenses) * 100) : 0;
            
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-300">{label}</span>
                  </div>
                  <span className="text-slate-400">₹{formatIndianCurrency(amount)}</span>
                </div>
                <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}