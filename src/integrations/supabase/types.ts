export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          page: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          page?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          page?: string | null
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          browser: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          is_active: boolean
          last_active: string
          location: string | null
          login_time: string
          os: string | null
          session_token: string
          terminated_at: string | null
          terminated_reason: string | null
          user_id: string
        }
        Insert: {
          browser?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean
          last_active?: string
          location?: string | null
          login_time?: string
          os?: string | null
          session_token: string
          terminated_at?: string | null
          terminated_reason?: string | null
          user_id: string
        }
        Update: {
          browser?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean
          last_active?: string
          location?: string | null
          login_time?: string
          os?: string | null
          session_token?: string
          terminated_at?: string | null
          terminated_reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          id: string
          recovery_code_expires_at: string | null
          recovery_email: string | null
          recovery_email_verified: boolean
          recovery_verification_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recovery_code_expires_at?: string | null
          recovery_email?: string | null
          recovery_email_verified?: boolean
          recovery_verification_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recovery_code_expires_at?: string | null
          recovery_email?: string | null
          recovery_email_verified?: boolean
          recovery_verification_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          category: string
          contributions: string[]
          cover_url: string | null
          created_at: string
          design_urls: string[]
          featured: boolean
          featured_image_url: string | null
          full_description: string
          id: string
          impact: string
          layout_mode: string
          logo_url: string | null
          name: string
          role: string
          short_description: string
          slug: string
          sort_order: number
          tagline: string
          updated_at: string
        }
        Insert: {
          category?: string
          contributions?: string[]
          cover_url?: string | null
          created_at?: string
          design_urls?: string[]
          featured?: boolean
          featured_image_url?: string | null
          full_description?: string
          id?: string
          impact?: string
          layout_mode?: string
          logo_url?: string | null
          name: string
          role?: string
          short_description?: string
          slug: string
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Update: {
          category?: string
          contributions?: string[]
          cover_url?: string | null
          created_at?: string
          design_urls?: string[]
          featured?: boolean
          featured_image_url?: string | null
          full_description?: string
          id?: string
          impact?: string
          layout_mode?: string
          logo_url?: string | null
          name?: string
          role?: string
          short_description?: string
          slug?: string
          sort_order?: number
          tagline?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          email_notified: boolean
          id: string
          is_read: boolean
          message: string
          name: string
          source_page: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          email_notified?: boolean
          id?: string
          is_read?: boolean
          message: string
          name: string
          source_page?: string
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_notified?: boolean
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          source_page?: string
          subject?: string
        }
        Relationships: []
      }
      login_history: {
        Row: {
          browser: string | null
          device_type: string | null
          failure_reason: string | null
          id: string
          ip_address: string | null
          location: string | null
          login_method: string
          login_time: string
          os: string | null
          success: boolean
          user_id: string
        }
        Insert: {
          browser?: string | null
          device_type?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          login_method?: string
          login_time?: string
          os?: string | null
          success?: boolean
          user_id: string
        }
        Update: {
          browser?: string | null
          device_type?: string | null
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          login_method?: string
          login_time?: string
          os?: string | null
          success?: boolean
          user_id?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          category: string
          created_at: string
          file_path: string | null
          id: string
          label: string
          public_url: string | null
          slot_key: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          file_path?: string | null
          id?: string
          label: string
          public_url?: string | null
          slot_key: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          file_path?: string | null
          id?: string
          label?: string
          public_url?: string | null
          slot_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      media_store: {
        Row: {
          assigned: boolean
          category: string
          company_id: string | null
          created_at: string
          file_path: string
          filename: string
          group_id: string | null
          id: string
          public_url: string
          updated_at: string
        }
        Insert: {
          assigned?: boolean
          category?: string
          company_id?: string | null
          created_at?: string
          file_path?: string
          filename?: string
          group_id?: string | null
          id?: string
          public_url?: string
          updated_at?: string
        }
        Update: {
          assigned?: boolean
          category?: string
          company_id?: string | null
          created_at?: string
          file_path?: string
          filename?: string
          group_id?: string | null
          id?: string
          public_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_store_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_store_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "project_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      media_tags: {
        Row: {
          created_at: string
          id: string
          media_id: string
          tag: string
        }
        Insert: {
          created_at?: string
          id?: string
          media_id: string
          tag?: string
        }
        Update: {
          created_at?: string
          id?: string
          media_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_tags_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "media_store"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          browser: string | null
          country: string | null
          created_at: string
          device_type: string | null
          id: string
          os: string | null
          page_path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          os?: string | null
          page_path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          country?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          os?: string | null
          page_path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      project_groups: {
        Row: {
          company_id: string
          created_at: string
          id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_groups_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          company_id: string
          created_at: string
          group_id: string | null
          id: string
          image_url: string
          sort_order: number
        }
        Insert: {
          company_id: string
          created_at?: string
          group_id?: string | null
          id?: string
          image_url?: string
          sort_order?: number
        }
        Update: {
          company_id?: string
          created_at?: string
          group_id?: string | null
          id?: string
          image_url?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_images_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_images_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "project_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          avatar_url: string | null
          client_name: string
          company: string
          created_at: string
          expanded_image_url: string | null
          id: string
          rating: number
          review_text: string
          role: string
          short_text: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          client_name: string
          company?: string
          created_at?: string
          expanded_image_url?: string | null
          id?: string
          rating?: number
          review_text?: string
          role?: string
          short_text?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          client_name?: string
          company?: string
          created_at?: string
          expanded_image_url?: string | null
          id?: string
          rating?: number
          review_text?: string
          role?: string
          short_text?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      security_alerts: {
        Row: {
          alert_type: string
          browser: string | null
          created_at: string
          details: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          is_read: boolean
          location: string | null
          os: string | null
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          alert_type: string
          browser?: string | null
          created_at?: string
          details?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_read?: boolean
          location?: string | null
          os?: string | null
          severity?: string
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string
          browser?: string | null
          created_at?: string
          details?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_read?: boolean
          location?: string | null
          os?: string | null
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content_key: string
          content_value: string
          created_at: string
          id: string
          page: string
          section: string
          updated_at: string
        }
        Insert: {
          content_key: string
          content_value?: string
          created_at?: string
          id?: string
          page: string
          section: string
          updated_at?: string
        }
        Update: {
          content_key?: string
          content_value?: string
          created_at?: string
          id?: string
          page?: string
          section?: string
          updated_at?: string
        }
        Relationships: []
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
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
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
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
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
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
