import React, { useState } from 'react';
import { Plus, Calendar, IndianRupee } from 'lucide-react';
import { ExpenseForm } from './ExpenseForm';
import type { MonthlyData } from '../types/finance';

interface DashboardProps {
  monthlyData: MonthlyData[];
}

// Helper function to format currency in Indian format
const formatIndianCurrency = (amount: number) => {
  return amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    style: 'decimal'
  });
};

export function Dashboard({ monthlyData }: DashboardProps) {
  const [showExpenseForm, setShowExpenseForm] = useState(false);
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
        <div className="text-center py-6 bg-slate-800/50 rounded-lg">
          <IndianRupee className="w-8 h-8 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No Expenses Yet</h3>
          <p className="text-slate-400 mb-6">Start by adding your first expense.</p>
          <button
            onClick={() => setShowExpenseForm(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>
    );
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 6 },
    (_, i) => currentYear - 5 + i
  );

  const currentMonth = monthlyData[monthlyData.length - 1];
  const categories = [
    { key: 'investment' as const, label: 'Investment', color: 'bg-emerald-500' },
    { key: 'debt' as const, label: 'Debt', color: 'bg-rose-500' },
    { key: 'needs' as const, label: 'Needs', color: 'bg-cyan-500' },
    { key: 'leisure' as const, label: 'Leisure', color: 'bg-amber-500' },
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-200">Dashboard</h2>
          <p className="text-sm text-slate-400">Manage your monthly expenses</p>
        </div>
        <button
          onClick={() => setShowExpenseForm(true)}
          className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg inline-flex items-center gap-1.5 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Date Selection */}
      <div className="flex items-center space-x-3 bg-slate-800/50 p-2 rounded-lg mb-4">
        <Calendar className="w-4 h-4 text-slate-400" />
        <select
          value={selectedDate.month}
          onChange={(e) => setSelectedDate(prev => ({ ...prev, month: parseInt(e.target.value) }))}
          className="bg-transparent text-sm text-slate-200 border-none focus:ring-0 cursor-pointer appearance-none hover:text-white transition-colors [&>option]:bg-slate-800 [&>option]:text-slate-200"
        >
          {months.map((month, index) => (
            <option key={month} value={index} className="bg-slate-800 text-slate-200">{month}</option>
          ))}
        </select>
        <select
          value={selectedDate.year}
          onChange={(e) => setSelectedDate(prev => ({ ...prev, year: parseInt(e.target.value) }))}
          className="bg-transparent text-sm text-slate-200 border-none focus:ring-0 cursor-pointer appearance-none hover:text-white transition-colors [&>option]:bg-slate-800 [&>option]:text-slate-200"
        >
          {years.map(year => (
            <option key={year} value={year} className="bg-slate-800 text-slate-200">{year}</option>
          ))}
        </select>
      </div>

      {/* Recent Expenses */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-200">Recent Expenses</h3>
        <div className="grid gap-2">
          {categories.map(({ key, label, color }) => (
            currentMonth.expenses[key].map((expense, index) => (
              <div
                key={`${key}-${index}`}
                className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-200">{expense.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 ${color} rounded-full`} />
                    <span className="text-xs text-slate-400">{label}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">₹{formatIndianCurrency(expense.amount)}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(expense.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </p>
                </div>
              </div>
            ))
          ))}
        </div>
      </div>

      {/* Expense Form Modal */}
      {showExpenseForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-lg p-4 w-full max-w-md">
            <ExpenseForm
              onClose={() => setShowExpenseForm(false)}
              monthlyDataId={currentMonth.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}