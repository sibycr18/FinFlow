import React, { useState, useEffect } from 'react';
import { ExpenseManager } from './components/ExpenseManager';
import { Analysis } from './components/Analysis';
import { Sidebar } from './components/Sidebar';
import { useMonthlyData } from './hooks/useMonthlyData';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

function App() {
  const [activeTab, setActiveTab] = useState<'expenses' | 'analysis'>('expenses');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    monthlyData,
    loading: dataLoading,
    error,
    updateMonthlyData,
    addExpense,
    removeExpense,
  } = useMonthlyData();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-cyan-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-cyan-500">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-rose-500">Error: {error}</div>
      </div>
    );
  }

  const currentMonth = monthlyData[monthlyData.length - 1] || {
    id: crypto.randomUUID(),
    month: new Date().toISOString().slice(0, 7),
    salary: 0,
    expenses: {
      investment: [],
      debt: [],
      needs: [],
      leisure: [],
    },
  };

  const handleSalaryChange = async (salary: number) => {
    await updateMonthlyData({ ...currentMonth, salary });
  };

  const handleExpenseChange = async (
    category: string,
    name: string,
    amount: number
  ) => {
    await addExpense(currentMonth.id, category, name, amount);
  };

  const handleExpenseRemove = async (expenseId: string) => {
    await removeExpense(expenseId);
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        user={user}
      />
      
      <div className="pl-64">
        <main className="max-w-7xl mx-auto">
          {activeTab === 'expenses' ? (
            <ExpenseManager
              salary={currentMonth.salary}
              onSalaryChange={handleSalaryChange}
              expenses={currentMonth.expenses}
              onExpenseAdd={handleExpenseChange}
              onExpenseRemove={handleExpenseRemove}
            />
          ) : (
            <Analysis monthlyData={monthlyData} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App