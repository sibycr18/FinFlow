import { supabase } from './supabase';

export async function insertTestData() {
  try {
    console.log('Starting test data insertion...');

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }

    // First, create a monthly data entry
    const { data: monthlyData, error: monthlyError } = await supabase
      .from('monthly_data')
      .insert([
        {
          month: new Date().toISOString(),
          salary: 50000,
          user_id: user.id
        }
      ])
      .select()
      .single();

    if (monthlyError) {
      console.error('Error creating monthly data:', monthlyError);
      throw monthlyError;
    }
    
    if (!monthlyData) {
      console.error('No monthly data created');
      throw new Error('No monthly data created');
    }

    console.log('Created monthly data:', monthlyData);

    // Then, create test expenses for each category
    const expenses = [
      // Investment expenses
      {
        monthly_data_id: monthlyData.id,
        name: 'Stock Investment',
        amount: 5000,
        category: 'investment'
      },
      {
        monthly_data_id: monthlyData.id,
        name: 'Mutual Funds',
        amount: 3000,
        category: 'investment'
      },
      // Debt expenses
      {
        monthly_data_id: monthlyData.id,
        name: 'Credit Card Payment',
        amount: 4000,
        category: 'debt'
      },
      {
        monthly_data_id: monthlyData.id,
        name: 'Loan EMI',
        amount: 6000,
        category: 'debt'
      },
      // Needs expenses
      {
        monthly_data_id: monthlyData.id,
        name: 'Rent',
        amount: 12000,
        category: 'needs'
      },
      {
        monthly_data_id: monthlyData.id,
        name: 'Groceries',
        amount: 8000,
        category: 'needs'
      },
      {
        monthly_data_id: monthlyData.id,
        name: 'Utilities',
        amount: 3000,
        category: 'needs'
      },
      // Leisure expenses
      {
        monthly_data_id: monthlyData.id,
        name: 'Restaurant Dining',
        amount: 4000,
        category: 'leisure'
      },
      {
        monthly_data_id: monthlyData.id,
        name: 'Movie & Entertainment',
        amount: 2000,
        category: 'leisure'
      },
      {
        monthly_data_id: monthlyData.id,
        name: 'Shopping',
        amount: 3000,
        category: 'leisure'
      }
    ];

    console.log('Inserting expenses:', expenses);

    const { error: expensesError } = await supabase
      .from('expenses')
      .insert(expenses);

    if (expensesError) {
      console.error('Error inserting expenses:', expensesError);
      throw expensesError;
    }

    console.log('Successfully inserted all test data');
    return { success: true };
  } catch (error) {
    console.error('Error in insertTestData:', error);
    return { success: false, error };
  }
}
