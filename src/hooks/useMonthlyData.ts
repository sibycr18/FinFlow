import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { MonthlyData } from '../types/finance';
import type { Database } from '../types/supabase';

type SupabaseMonthlyData = Database['public']['Tables']['monthly_data']['Row'];
type SupabaseExpense = Database['public']['Tables']['expenses']['Row'];

export function useMonthlyData() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }

      const { data: monthlyDataRows, error: monthlyError } = await supabase
        .from('monthly_data')
        .select('*')
        .order('month', { ascending: true });

      if (monthlyError) throw monthlyError;

      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*');

      if (expensesError) throw expensesError;

      const transformedData = monthlyDataRows.map((monthData: SupabaseMonthlyData) => {
        const monthExpenses = expensesData.filter(
          (expense: SupabaseExpense) => expense.monthly_data_id === monthData.id
        );

        const expenses = {
          investment: monthExpenses.filter(e => e.category === 'investment').map(e => ({
            id: e.id,
            name: e.name,
            amount: e.amount,
          })),
          debt: monthExpenses.filter(e => e.category === 'debt').map(e => ({
            id: e.id,
            name: e.name,
            amount: e.amount,
          })),
          needs: monthExpenses.filter(e => e.category === 'needs').map(e => ({
            id: e.id,
            name: e.name,
            amount: e.amount,
          })),
          leisure: monthExpenses.filter(e => e.category === 'leisure').map(e => ({
            id: e.id,
            name: e.name,
            amount: e.amount,
          })),
        };

        return {
          id: monthData.id,
          month: monthData.month,
          salary: monthData.salary,
          expenses,
        };
      });

      setMonthlyData(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateMonthlyData = async (updates: Partial<MonthlyData>) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('monthly_data')
        .upsert({
          id: updates.id,
          month: updates.month,
          salary: updates.salary,
          user_id: session.session.user.id,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      await fetchMonthlyData(); // Refresh data
      return data;
    } catch (err) {
      console.error('Error updating monthly data:', err);
      throw err;
    }
  };

  const addExpense = async (
    monthlyDataId: string,
    category: string,
    name: string,
    amount: number
  ) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('expenses')
        .insert({
          monthly_data_id: monthlyDataId,
          category,
          name,
          amount,
        });

      if (error) throw error;

      await fetchMonthlyData(); // Refresh data
    } catch (err) {
      console.error('Error adding expense:', err);
      throw err;
    }
  };

  const removeExpense = async (expenseId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      await fetchMonthlyData(); // Refresh data
    } catch (err) {
      console.error('Error removing expense:', err);
      throw err;
    }
  };

  return {
    monthlyData,
    loading,
    error,
    updateMonthlyData,
    addExpense,
    removeExpense,
  };
}