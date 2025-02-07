import React from 'react';
import { PieChart, Wallet, TrendingUp, CreditCard, ShoppingCart, Coffee } from 'lucide-react';
import { MonthlyData } from '../types/finance';

interface DashboardProps {
  currentMonth: MonthlyData;
}

export function Dashboard({ currentMonth }: DashboardProps) {
  const totalAllocated = Object.values(currentMonth.allocations).reduce((a, b) => a + b, 0);
  const remaining = currentMonth.salary - totalAllocated;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Financial Dashboard</h2>
        <div className="flex items-center space-x-2 text-green-600">
          <Wallet className="w-5 h-5" />
          <span className="font-semibold">₹{currentMonth.salary.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CategoryCard
          title="Investment"
          icon={<TrendingUp className="w-5 h-5" />}
          amount={currentMonth.allocations.investment}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <CategoryCard
          title="Debt"
          icon={<CreditCard className="w-5 h-5" />}
          amount={currentMonth.allocations.debt}
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <CategoryCard
          title="Needs"
          icon={<ShoppingCart className="w-5 h-5" />}
          amount={currentMonth.allocations.needs}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <CategoryCard
          title="Leisure"
          icon={<Coffee className="w-5 h-5" />}
          amount={currentMonth.allocations.leisure}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <PieChart className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold">Monthly Allocation</h3>
        </div>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full flex">
            <div style={{ width: `${(currentMonth.allocations.investment / currentMonth.salary) * 100}%` }} className="bg-blue-500"></div>
            <div style={{ width: `${(currentMonth.allocations.debt / currentMonth.salary) * 100}%` }} className="bg-red-500"></div>
            <div style={{ width: `${(currentMonth.allocations.needs / currentMonth.salary) * 100}%` }} className="bg-purple-500"></div>
            <div style={{ width: `${(currentMonth.allocations.leisure / currentMonth.salary) * 100}%` }} className="bg-amber-500"></div>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Remaining: ₹{remaining.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ title, icon, amount, color, bgColor }: {
  title: string;
  icon: React.ReactNode;
  amount: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className={`p-4 rounded-lg shadow-sm ${bgColor}`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`${color} font-medium`}>{title}</span>
        <span className={`${color}`}>{icon}</span>
      </div>
      <div className="text-xl font-bold text-gray-800">₹{amount.toLocaleString()}</div>
    </div>
  );
}