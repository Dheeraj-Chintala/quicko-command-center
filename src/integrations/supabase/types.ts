/**
 * Typed subset of the public schema (see supabase_migrations/completeschema.sql).
 * Regenerate with: `npx supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts`
 *
 * Admin dashboard reads require JWT app_metadata.role === 'admin' (is_admin() in RLS).
 * Admin writes for verification: apply admin_verify_policies.sql (UPDATE drivers, driver_documents, vehicles).
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/** Avoids circular `Database` self-reference in table Row types. */
export type PublicSchemaEnums = {
  user_role: "rider" | "driver"
  driver_status: "pending" | "approved" | "rejected" | "suspended"
  duty_status: "on_duty" | "off_duty"
  vehicle_type: "bike" | "auto" | "cab"
  ownership_type: "self" | "rented"
  document_type:
    | "dl_front"
    | "dl_back"
    | "rc_front"
    | "rc_back"
    | "aadhaar_front"
    | "aadhaar_back"
    | "pan"
  doc_status: "pending" | "approved" | "rejected"
  trip_status: "requested" | "accepted" | "arrived" | "ongoing" | "completed" | "cancelled"
  txn_type: "credit" | "debit"
  txn_category: "trip_earning" | "commission" | "withdrawal" | "bonus" | "refund"
}

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      riders: {
        Row: {
          id: string
          auth_id: string
          phone: string
          name: string | null
          email: string | null
          avatar_url: string | null
          fcm_token: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id: string
          phone: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          fcm_token?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string
          phone?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          fcm_token?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          id: string
          auth_id: string
          phone: string
          name: string
          date_of_birth: string | null
          gender: string | null
          city: string
          vehicle_type: PublicSchemaEnums["vehicle_type"]
          status: PublicSchemaEnums["driver_status"]
          duty_status: PublicSchemaEnums["duty_status"]
          avatar_url: string | null
          fcm_token: string | null
          is_active: boolean
          rejection_note: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_id: string
          phone: string
          name: string
          date_of_birth?: string | null
          gender?: string | null
          city: string
          vehicle_type: PublicSchemaEnums["vehicle_type"]
          status?: PublicSchemaEnums["driver_status"]
          duty_status?: PublicSchemaEnums["duty_status"]
          avatar_url?: string | null
          fcm_token?: string | null
          is_active?: boolean
          rejection_note?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_id?: string
          phone?: string
          name?: string
          date_of_birth?: string | null
          gender?: string | null
          city?: string
          vehicle_type?: PublicSchemaEnums["vehicle_type"]
          status?: PublicSchemaEnums["driver_status"]
          duty_status?: PublicSchemaEnums["duty_status"]
          avatar_url?: string | null
          fcm_token?: string | null
          is_active?: boolean
          rejection_note?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      driver_documents: {
        Row: {
          id: string
          driver_id: string
          doc_type: PublicSchemaEnums["document_type"]
          storage_path: string
          public_url: string | null
          status: PublicSchemaEnums["doc_status"]
          admin_note: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          doc_type: PublicSchemaEnums["document_type"]
          storage_path: string
          public_url?: string | null
          status?: PublicSchemaEnums["doc_status"]
          admin_note?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          doc_type?: PublicSchemaEnums["document_type"]
          storage_path?: string
          public_url?: string | null
          status?: PublicSchemaEnums["doc_status"]
          admin_note?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_locations: {
        Row: {
          driver_id: string
          latitude: number
          longitude: number
          heading: number | null
          speed: number | null
          accuracy: number | null
          updated_at: string
        }
        Insert: {
          driver_id: string
          latitude: number
          longitude: number
          heading?: number | null
          speed?: number | null
          accuracy?: number | null
          updated_at?: string
        }
        Update: {
          driver_id?: string
          latitude?: number
          longitude?: number
          heading?: number | null
          speed?: number | null
          accuracy?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_locations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          id: string
          request_id: string | null
          rider_id: string
          driver_id: string
          vehicle_id: string | null
          vehicle_type: PublicSchemaEnums["vehicle_type"]
          status: PublicSchemaEnums["trip_status"]
          pickup_lat: number
          pickup_lng: number
          pickup_address: string | null
          drop_lat: number
          drop_lng: number
          drop_address: string | null
          distance_km: number | null
          fare: number | null
          surge_multiplier: number | null
          final_fare: number | null
          payment_method: string | null
          payment_status: string | null
          accepted_at: string | null
          arrived_at: string | null
          started_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          cancel_reason: string | null
          rider_rating: number | null
          driver_rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          request_id?: string | null
          rider_id: string
          driver_id: string
          vehicle_id?: string | null
          vehicle_type: PublicSchemaEnums["vehicle_type"]
          status?: PublicSchemaEnums["trip_status"]
          pickup_lat: number
          pickup_lng: number
          pickup_address?: string | null
          drop_lat: number
          drop_lng: number
          drop_address?: string | null
          distance_km?: number | null
          fare?: number | null
          surge_multiplier?: number | null
          final_fare?: number | null
          payment_method?: string | null
          payment_status?: string | null
          accepted_at?: string | null
          arrived_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          cancel_reason?: string | null
          rider_rating?: number | null
          driver_rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string | null
          rider_id?: string
          driver_id?: string
          vehicle_id?: string | null
          vehicle_type?: PublicSchemaEnums["vehicle_type"]
          status?: PublicSchemaEnums["trip_status"]
          pickup_lat?: number
          pickup_lng?: number
          pickup_address?: string | null
          drop_lat?: number
          drop_lng?: number
          drop_address?: string | null
          distance_km?: number | null
          fare?: number | null
          surge_multiplier?: number | null
          final_fare?: number | null
          payment_method?: string | null
          payment_status?: string | null
          accepted_at?: string | null
          arrived_at?: string | null
          started_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          cancel_reason?: string | null
          rider_rating?: number | null
          driver_rating?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          id: string
          driver_id: string
          vehicle_number: string
          vehicle_type: PublicSchemaEnums["vehicle_type"]
          make: string | null
          model: string | null
          year: number | null
          color: string | null
          ownership_type: PublicSchemaEnums["ownership_type"]
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          vehicle_number: string
          vehicle_type: PublicSchemaEnums["vehicle_type"]
          make?: string | null
          model?: string | null
          year?: number | null
          color?: string | null
          ownership_type?: PublicSchemaEnums["ownership_type"]
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          vehicle_number?: string
          vehicle_type?: PublicSchemaEnums["vehicle_type"]
          make?: string | null
          model?: string | null
          year?: number | null
          color?: string | null
          ownership_type?: PublicSchemaEnums["ownership_type"]
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      ride_requests: {
        Row: {
          id: string
          rider_id: string
          vehicle_type: PublicSchemaEnums["vehicle_type"]
          pickup_lat: number
          pickup_lng: number
          pickup_address: string | null
          drop_lat: number
          drop_lng: number
          drop_address: string | null
          distance_km: number | null
          estimated_fare: number | null
          status: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          rider_id: string
          vehicle_type: PublicSchemaEnums["vehicle_type"]
          pickup_lat: number
          pickup_lng: number
          pickup_address?: string | null
          drop_lat: number
          drop_lng: number
          drop_address?: string | null
          distance_km?: number | null
          estimated_fare?: number | null
          status?: string
          expires_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          rider_id?: string
          vehicle_type?: PublicSchemaEnums["vehicle_type"]
          pickup_lat?: number
          pickup_lng?: number
          pickup_address?: string | null
          drop_lat?: number
          drop_lng?: number
          drop_address?: string | null
          distance_km?: number | null
          estimated_fare?: number | null
          status?: string
          expires_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ride_requests_rider_id_fkey"
            columns: ["rider_id"]
            isOneToOne: false
            referencedRelation: "riders"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_earnings: {
        Row: {
          id: string
          driver_id: string
          trip_id: string
          gross_fare: number
          commission_pct: number
          commission_amt: number
          net_earning: number
          earned_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          trip_id: string
          gross_fare: number
          commission_pct?: number
          commission_amt: number
          net_earning: number
          earned_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          trip_id?: string
          gross_fare?: number
          commission_pct?: number
          commission_amt?: number
          net_earning?: number
          earned_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_earnings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_earnings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: true
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: PublicSchemaEnums
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      trip_status: [
        "requested",
        "accepted",
        "arrived",
        "ongoing",
        "completed",
        "cancelled",
      ] as const,
    },
  },
} as const
