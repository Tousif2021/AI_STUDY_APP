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
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          role: 'user' | 'admin' | 'pro'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'pro'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'pro'
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string | null
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          type: 'pdf' | 'docx' | 'pptx' | 'image' | 'text'
          url: string
          content: string | null
          course_id: string | null
          created_at: string
          uploaded_by: string
          processed: boolean
          page_count: number | null
          thumbnail_url: string | null
        }
        Insert: {
          id?: string
          title: string
          type: 'pdf' | 'docx' | 'pptx' | 'image' | 'text'
          url: string
          content?: string | null
          course_id?: string | null
          created_at?: string
          uploaded_by: string
          processed?: boolean
          page_count?: number | null
          thumbnail_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          type?: 'pdf' | 'docx' | 'pptx' | 'image' | 'text'
          url?: string
          content?: string | null
          course_id?: string | null
          created_at?: string
          uploaded_by?: string
          processed?: boolean
          page_count?: number | null
          thumbnail_url?: string | null
        }
      }
      calendar_events: {
        Row: {
          id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          location: string | null
          type: 'study' | 'exam' | 'meeting' | 'deadline'
          reminder: string | null
          course_id: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          location?: string | null
          type: 'study' | 'exam' | 'meeting' | 'deadline'
          reminder?: string | null
          course_id?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          location?: string | null
          type?: 'study' | 'exam' | 'meeting' | 'deadline'
          reminder?: string | null
          course_id?: string | null
          created_by?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}