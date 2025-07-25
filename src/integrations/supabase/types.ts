export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      designs: {
        Row: {
          category: string | null
          created_at: string
          design_no: string | null
          id: number
          main_image_url: string | null
          price: number | null
          secondary_image_1_url: string | null
          secondary_image_2_url: string | null
          secondary_image_3_url: string | null
          secondary_image_4_url: string | null
          secondary_image_5_url: string | null
          stitches: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          design_no?: string | null
          id?: number
          main_image_url?: string | null
          price?: number | null
          secondary_image_1_url?: string | null
          secondary_image_2_url?: string | null
          secondary_image_3_url?: string | null
          secondary_image_4_url?: string | null
          secondary_image_5_url?: string | null
          stitches?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          design_no?: string | null
          id?: number
          main_image_url?: string | null
          price?: number | null
          secondary_image_1_url?: string | null
          secondary_image_2_url?: string | null
          secondary_image_3_url?: string | null
          secondary_image_4_url?: string | null
          secondary_image_5_url?: string | null
          stitches?: number | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          id: number
          name: string | null
          email: string | null
          phone: string | null
          message: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name?: string | null
          email?: string | null
          phone?: string | null
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string | null
          email?: string | null
          phone?: string | null
          message?: string | null
          created_at?: string
        }
        Relationships: []
      },
      cart: {
        Row: {
          id: string;
          user_id: string;
          design_id: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          design_id: number;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          design_id?: number;
          quantity?: number;
          created_at?: string;
        };
        Relationships: [];
      },
      user_addresses: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          house_no: string;
          landmark: string;
          city: string;
          district: string;
          state: string;
          pincode: string;
          primary_mobile: string;
          secondary_mobile: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          house_no: string;
          landmark?: string;
          city: string;
          district: string;
          state: string;
          pincode: string;
          primary_mobile: string;
          secondary_mobile?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          house_no?: string;
          landmark?: string;
          city?: string;
          district?: string;
          state?: string;
          pincode?: string;
          primary_mobile?: string;
          secondary_mobile?: string | null;
          created_at?: string;
        };
        Relationships: [];
      },
      orders: {
        Row: {
          id: string;
          user_id: string;
          address_id: string;
          design_no: string;
          quantity: number;
          price: number;
          payment_status: string;
          created_at: string;
          category?: string;
          custom_order_id?: string;
          work_status?: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          address_id: string;
          design_no: string;
          quantity: number;
          price: number;
          payment_status: string;
          created_at?: string;
          category?: string;
          custom_order_id?: string;
          work_status?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          address_id?: string;
          design_no?: string;
          quantity?: number;
          price?: number;
          payment_status?: string;
          created_at?: string;
          category?: string;
          custom_order_id?: string;
          work_status?: string;
        };
        Relationships: [];
      },
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
