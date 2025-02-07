export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      monthly_data: {
        Row: {
          id: string
          user_id: string
          month: string
          salary: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month: string
          salary: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          month?: string
          salary?: number
          created_at?: string
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          monthly_data_id: string
          category: 'investment' | 'debt' | 'needs' | 'leisure'
          name: string
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          monthly_data_id: string
          category: 'investment' | 'debt' | 'needs' | 'leisure'
          name: string
          amount: number
          created_at?: string
        }
        Update: {
          id?: string
          monthly_data_id?: string
          category?: 'investment' | 'debt' | 'needs' | 'leisure'
          name?: string
          amount?: number
          created_at?: string
        }
      }
    }
  }
}