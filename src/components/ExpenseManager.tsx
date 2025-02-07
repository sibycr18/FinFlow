import React, { useState } from 'react';
import { Plus, Trash2, IndianRupee, TrendingUp, CreditCard, ShoppingBag, Coffee, Calendar, ChevronDown, ChevronUp, X } from 'lucide-react';
import type { CategoryExpenses, ExpenseItem } from '../types/finance';

interface ExpenseManagerProps {
  salary: number;
  onSalaryChange: (salary: number) => void;
  expenses: CategoryExpenses;
  onExpenseAdd: (category: string, name: string, amount: number) => void;
  onExpenseRemove: (id: string) => void;
}

export function ExpenseManager({
  salary,
  onSalaryChange,
  expenses,
  onExpenseAdd,
  onExpenseRemove
}: ExpenseManagerProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return {
      month: now.getMonth(),
      year: now.getFullYear()
    };
  });

  const [expandedCategory, setExpandedCategory] = useState<keyof CategoryExpenses | null>(null);

  const [newExpense, setNewExpense] = useState<{
    category: keyof CategoryExpenses;
    name: string;
    amount: string;
  }>({
    category: 'investment',
    name: '',
    amount: '',
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => selectedDate.year - 2 + i
  );

  const totalExpenses = Object.values(expenses).reduce(
    (total, categoryExpenses) => 
      total + categoryExpenses.reduce((catTotal, expense) => catTotal + expense.amount, 0),
    0
  );

  const remainingSalary = salary - totalExpenses;

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount) return;

    const amount = parseFloat(newExpense.amount);
    if (isNaN(amount)) return;

    onExpenseAdd(newExpense.category, newExpense.name, amount);

    setNewExpense({
      ...newExpense,
      name: '',
      amount: '',
    });
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage === 0) return 'text-slate-500';
    return percentage > 0 ? 'text-emerald-400' : 'text-rose-400';
  };

  const categories = [
    { key: 'investment', label: 'Investment', color: 'from-emerald-600/30 to-emerald-700/30 border-emerald-500/20', icon: <TrendingUp className="w-5 h-5 text-emerald-400" /> },
    { key: 'debt', label: 'Debt', color: 'from-rose-600/30 to-rose-700/30 border-rose-500/20', icon: <CreditCard className="w-5 h-5 text-rose-400" /> },
    { key: 'needs', label: 'Needs', color: 'from-cyan-600/30 to-cyan-700/30 border-cyan-500/20', icon: <ShoppingBag className="w-5 h-5 text-cyan-400" /> },
    { key: 'leisure', label: 'Leisure', color: 'from-amber-600/30 to-amber-700/30 border-amber-500/20', icon: <Coffee className="w-5 h-5 text-amber-400" /> },
  ] as const;

  const toggleCategory = (category: keyof CategoryExpenses) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-100">Budget Tracker</h2>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <select
              value={selectedDate.month}
              onChange={(e) => setSelectedDate(prev => ({ ...prev, month: parseInt(e.target.value) }))}
              className="input-dark text-sm h-10 px-4 min-w-[120px]"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={selectedDate.year}
              onChange={(e) => setSelectedDate(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              className="input-dark text-sm h-10 px-4 min-w-[100px]"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat-card py-4 px-5">
            <p className="text-sm font-medium text-slate-400 mb-1">Monthly Salary</p>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={salary}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  onSalaryChange(parseInt(value) || 0);
                }}
                className="input-dark w-full pl-10 text-xl font-bold py-2"
                placeholder="Enter your salary"
              />
            </div>
          </div>

          <div className="stat-card py-4 px-5">
            <p className="text-sm font-medium text-slate-400 mb-1">Total Spent</p>
            <p className="text-xl font-bold text-gray-100">
              ₹{totalExpenses.toLocaleString()}
            </p>
            <div className={`mt-1 text-sm ${getPercentageColor(12.5)}`}>
              +12.5% from last month
            </div>
          </div>

          <div className="stat-card py-4 px-5">
            <p className="text-sm font-medium text-slate-400 mb-1">Remaining</p>
            <p className={`text-xl font-bold ${
              remainingSalary >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              ₹{remainingSalary.toLocaleString()}
            </p>
            <div className="mt-1 text-sm text-slate-500">
              Available balance
            </div>
          </div>
        </div>

        <div className="card-glass rounded-xl p-3 mb-6 shadow-lg shadow-slate-900/20">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-[20%]">
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as keyof CategoryExpenses })}
                className="w-full"
              >
                {categories.map(({ key, label }) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <input
              type="text"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              className="input-dark w-full sm:w-[45%]"
              placeholder="Expense name"
            />
            <input
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="input-dark w-full sm:w-[20%]"
              placeholder="Amount"
            />
            <button 
              onClick={addExpense} 
              className="btn-gradient w-full sm:w-[15%] flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {categories.map(({ key, label, color, icon }) => {
            const isExpanded = expandedCategory === key;
            return (
              <div 
                key={key} 
                className={`category-container ${isExpanded ? 'expanded' : ''} 
                  card-glass rounded-2xl p-4 bg-gradient-to-br ${color} 
                  shadow-lg shadow-slate-900/20 border-2`}
                style={{
                  gridColumn: isExpanded ? '1 / -1' : 'auto',
                  zIndex: isExpanded ? 50 : 'auto'
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {icon}
                    <h3 className="text-lg font-semibold text-gray-100">{label}</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-slate-300">
                      {expenses[key].length} items
                    </span>
                    <button
                      onClick={() => toggleCategory(key)}
                      className="text-slate-300 hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                    {isExpanded && (
                      <button
                        onClick={() => setExpandedCategory(null)}
                        className="text-slate-300 hover:text-rose-400 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className={`custom-scrollbar overflow-y-auto ${
                  isExpanded ? 'h-[calc(100vh-12rem)]' : 'h-48'
                }`}>
                  {expenses[key].length > 0 ? (
                    <div className="rounded-lg overflow-hidden border border-slate-700/50">
                      <div className="grid grid-cols-12 gap-4 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-300">
                        <div className="col-span-6">Name</div>
                        <div className="col-span-4 text-right">Amount</div>
                        <div className="col-span-2 text-right">Action</div>
                      </div>
                      
                      <div className="divide-y divide-slate-700/30">
                        {expenses[key].map((item) => (
                          <div
                            key={item.id}
                            className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-800/40 hover:bg-slate-800/60 transition-colors items-center"
                          >
                            <div className="col-span-6 font-medium text-gray-100">
                              {item.name}
                            </div>
                            <div className="col-span-4 text-right text-gray-200">
                              ₹{item.amount.toLocaleString()}
                            </div>
                            <div className="col-span-2 text-right">
                              <button
                                onClick={() => onExpenseRemove(item.id)}
                                className="text-gray-400 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-slate-700/50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      No expenses added yet
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}