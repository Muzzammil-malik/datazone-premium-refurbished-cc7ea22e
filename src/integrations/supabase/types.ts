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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity: {
        Row: {
          at: string
          id: string
          kind: string
          message: string
        }
        Insert: {
          at?: string
          id: string
          kind: string
          message: string
        }
        Update: {
          at?: string
          id?: string
          kind?: string
          message?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          active: boolean
          created_at: string
          cta: string
          end_date: string | null
          id: string
          image: string | null
          link: string
          start_date: string | null
          subtitle: string
          title: string
          type: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          cta?: string
          end_date?: string | null
          id: string
          image?: string | null
          link?: string
          start_date?: string | null
          subtitle?: string
          title?: string
          type?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          cta?: string
          end_date?: string | null
          id?: string
          image?: string | null
          link?: string
          start_date?: string | null
          subtitle?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      brands: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          logo: string | null
          name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id: string
          logo?: string | null
          name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          logo?: string | null
          name?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          order: number
          slug: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id: string
          name: string
          order?: number
          slug: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          order?: number
          slug?: string
        }
        Relationships: []
      }
      homepage: {
        Row: {
          featured_ids: string[]
          hero_headline: string
          hero_subtitle: string
          id: number
          testimonial_ids: string[]
          updated_at: string
          why: Json
        }
        Insert: {
          featured_ids?: string[]
          hero_headline?: string
          hero_subtitle?: string
          id?: number
          testimonial_ids?: string[]
          updated_at?: string
          why?: Json
        }
        Update: {
          featured_ids?: string[]
          hero_headline?: string
          hero_subtitle?: string
          id?: number
          testimonial_ids?: string[]
          updated_at?: string
          why?: Json
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string
          customer: string
          date: string
          id: string
          notes: string | null
          phone: string
          product_id: string | null
          product_name: string | null
          source: string
          status: string
        }
        Insert: {
          created_at?: string
          customer: string
          date?: string
          id: string
          notes?: string | null
          phone?: string
          product_id?: string | null
          product_name?: string | null
          source?: string
          status?: string
        }
        Update: {
          created_at?: string
          customer?: string
          date?: string
          id?: string
          notes?: string | null
          phone?: string
          product_id?: string | null
          product_name?: string | null
          source?: string
          status?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          battery_health: number | null
          created_at: string
          id: string
          product_id: string | null
          purchase_date: string
          qc_status: string
          remarks: string | null
          serial: string
          shelf: string
          ssd_health: number | null
          status: string
          supplier: string
        }
        Insert: {
          battery_health?: number | null
          created_at?: string
          id: string
          product_id?: string | null
          purchase_date?: string
          qc_status?: string
          remarks?: string | null
          serial: string
          shelf?: string
          ssd_health?: number | null
          status?: string
          supplier?: string
        }
        Update: {
          battery_health?: number | null
          created_at?: string
          id?: string
          product_id?: string | null
          purchase_date?: string
          qc_status?: string
          remarks?: string | null
          serial?: string
          shelf?: string
          ssd_health?: number | null
          status?: string
          supplier?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          availability: string
          battery_health: number | null
          brand: string
          category: string
          charger: boolean | null
          condition: string
          created_at: string
          description: string | null
          display_size: string | null
          featured: boolean
          gpu: string
          id: string
          image: string
          images: string[]
          keywords: string | null
          meta_description: string | null
          meta_title: string | null
          model: string | null
          name: string
          new_arrival: boolean
          office: boolean | null
          original_price: number
          price: number
          processor: string
          ram: string
          rating: number
          resolution: string | null
          reviews: number
          slug: string | null
          storage: string
          tagline: string
          video: string | null
          windows: string | null
        }
        Insert: {
          active?: boolean
          availability?: string
          battery_health?: number | null
          brand: string
          category: string
          charger?: boolean | null
          condition?: string
          created_at?: string
          description?: string | null
          display_size?: string | null
          featured?: boolean
          gpu?: string
          id: string
          image?: string
          images?: string[]
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          model?: string | null
          name: string
          new_arrival?: boolean
          office?: boolean | null
          original_price?: number
          price?: number
          processor?: string
          ram?: string
          rating?: number
          resolution?: string | null
          reviews?: number
          slug?: string | null
          storage?: string
          tagline?: string
          video?: string | null
          windows?: string | null
        }
        Update: {
          active?: boolean
          availability?: string
          battery_health?: number | null
          brand?: string
          category?: string
          charger?: boolean | null
          condition?: string
          created_at?: string
          description?: string | null
          display_size?: string | null
          featured?: boolean
          gpu?: string
          id?: string
          image?: string
          images?: string[]
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          model?: string | null
          name?: string
          new_arrival?: boolean
          office?: boolean | null
          original_price?: number
          price?: number
          processor?: string
          ram?: string
          rating?: number
          resolution?: string | null
          reviews?: number
          slug?: string | null
          storage?: string
          tagline?: string
          video?: string | null
          windows?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          customer: string
          date: string
          featured: boolean
          id: string
          rating: number
          status: string
          text: string
        }
        Insert: {
          created_at?: string
          customer: string
          date?: string
          featured?: boolean
          id: string
          rating?: number
          status?: string
          text?: string
        }
        Update: {
          created_at?: string
          customer?: string
          date?: string
          featured?: boolean
          id?: string
          rating?: number
          status?: string
          text?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          featured: boolean
          icon: string
          id: string
          order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          featured?: boolean
          icon?: string
          id: string
          order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          featured?: boolean
          icon?: string
          id?: string
          order?: number
          title?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          address: string
          email: string
          favicon: string | null
          hours: string
          id: number
          logo: string | null
          maps_link: string
          phone: string
          seo: Json
          social: Json
          store_name: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          address?: string
          email?: string
          favicon?: string | null
          hours?: string
          id?: number
          logo?: string | null
          maps_link?: string
          phone?: string
          seo?: Json
          social?: Json
          store_name?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          address?: string
          email?: string
          favicon?: string | null
          hours?: string
          id?: number
          logo?: string | null
          maps_link?: string
          phone?: string
          seo?: Json
          social?: Json
          store_name?: string
          updated_at?: string
          whatsapp?: string
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
