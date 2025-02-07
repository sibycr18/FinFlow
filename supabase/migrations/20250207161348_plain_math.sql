/*
  # Update Security Policies for Finance Manager

  1. Security Changes
    - Add RLS policies for monthly_data and expenses tables
    - Ensure users can only access their own data
    - Enable row level security on both tables

  Note: Tables are already created, this migration only adds security policies
*/

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'monthly_data' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE monthly_data ENABLE ROW LEVEL SECURITY;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'expenses' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- monthly_data policies
  DROP POLICY IF EXISTS "Users can view their own monthly data" ON monthly_data;
  DROP POLICY IF EXISTS "Users can insert their own monthly data" ON monthly_data;
  DROP POLICY IF EXISTS "Users can update their own monthly data" ON monthly_data;
  
  -- expenses policies
  DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
  DROP POLICY IF EXISTS "Users can insert their own expenses" ON expenses;
  DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;
END $$;

-- Create policies for monthly_data
CREATE POLICY "Users can view their own monthly data"
  ON monthly_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monthly data"
  ON monthly_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monthly data"
  ON monthly_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for expenses
CREATE POLICY "Users can view their own expenses"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM monthly_data
    WHERE monthly_data.id = expenses.monthly_data_id
    AND monthly_data.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own expenses"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM monthly_data
    WHERE monthly_data.id = expenses.monthly_data_id
    AND monthly_data.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own expenses"
  ON expenses
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM monthly_data
    WHERE monthly_data.id = expenses.monthly_data_id
    AND monthly_data.user_id = auth.uid()
  ));