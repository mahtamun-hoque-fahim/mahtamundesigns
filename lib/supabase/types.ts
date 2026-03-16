export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          layout_mode: string | null
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
          layout_mode?: string | null
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
          layout_mode?: string | null
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
          id: string
          message: string
          name: string
          read: boolean
          source_page: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          read?: boolean
          source_page?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean
          source_page?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      logo_strip_items: {
        Row: {
          active: boolean
          created_at: string
          id: string
          logo_url: string
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          logo_url: string
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          logo_url?: string
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          created_at: string
          id: string
          label: string | null
          public_url: string | null
          slot_key: string
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          public_url?: string | null
          slot_key: string
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          public_url?: string | null
          slot_key?: string
          storage_path?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          browser: string | null
          created_at: string
          device_type: string | null
          id: string
          ip_address: string | null
          location: string | null
          os: string | null
          page_path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
          os?: string | null
          page_path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: string | null
          location?: string | null
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
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          company_id: string
          created_at: string
          group_id: string | null
          id: string
          image_url: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          group_id?: string | null
          id?: string
          image_url: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          group_id?: string | null
          id?: string
          image_url?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
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
          company: string
          created_at?: string
          expanded_image_url?: string | null
          id?: string
          rating?: number
          review_text: string
          role: string
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
          content_value: string
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
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
