import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we have real Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key-here'

if (!hasValidCredentials) {
  console.warn('⚠️  Using placeholder Supabase credentials. Please set up your Supabase project and update .env file.')
  console.warn('📖 Follow the instructions in SUPABASE_SETUP.md')
}

// Use placeholder values if real credentials aren't available
const finalUrl = hasValidCredentials ? supabaseUrl : 'https://placeholder.supabase.co'
const finalKey = hasValidCredentials ? supabaseAnonKey : 'placeholder-key'

export const supabase = createClient(finalUrl, finalKey)

// Export flag to check if we have valid credentials
export const hasValidSupabaseConfig = hasValidCredentials

// Database types
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          author: string
          author_email: string
          technologies: string[]
          github_url: string | null
          live_url: string | null
          image_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          author: string
          author_email: string
          technologies: string[]
          github_url?: string | null
          live_url?: string | null
          image_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          author?: string
          author_email?: string
          technologies?: string[]
          github_url?: string | null
          live_url?: string | null
          image_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}