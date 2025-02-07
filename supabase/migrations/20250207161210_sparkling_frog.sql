/*
  # Initial Schema Setup for Finance Manager

  1. New Tables
    - `monthly_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `month` (text, YYYY-MM format)
      - `salary` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `expenses`
      - `id` (uuid, primary key)
      - `monthly_data_id` (uuid, references monthly_data)
      - `category` (text)
      - `name` (text)
      - `amount` (numeric)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create monthly_data table
CREATE TABLE monthly_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  month text NOT NULL,
  salary numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, month)
);

-- Create expenses table
CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_data_id uuid REFERENCES monthly_data ON DELETE CASCADE NOT NULL,
  category text NOT NULL CHECK (category IN ('investment', 'debt', 'needs', 'leisure')),
  name text NOT NULL,
  amount numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE monthly_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

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