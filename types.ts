export interface Ticket {
  id: number;
  user_id: string;
  number: string;
  participants: number;
  amount_played: number;
  amount_per_participant: number;
  prize_won: number;
  created_at: string;
  shared_with: string | null;
}

export interface Prize {
    number: string;
    prize: number;
}

export interface GroundingSource {
    web?: {
        uri: string;
        title: string;
    }
}

// Supabase generated types
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
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tickets: {
        Row: {
          amount_per_participant: number
          amount_played: number
          created_at: string
          id: number
          number: string
          participants: number
          prize_won: number
          user_id: string
          shared_with: string | null
        }
        Insert: {
          amount_played?: number
          created_at?: string
          id?: number
          number: string
          participants?: number
          prize_won?: number
          user_id: string
          shared_with?: string | null
        }
        Update: {
          amount_played?: number
          created_at?: string
          id?: number
          number?: string
          participants?: number
          prize_won?: number
          user_id?: string
          shared_with?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
