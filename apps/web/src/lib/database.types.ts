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
      countries: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      executive_actions: {
        Row: {
          categories: string[] | null
          description_html: string | null
          full_html: string | null
          guid: string
          id: number
          inserted_at: string | null
          link: string
          pub_date: string | null
          title: string
        }
        Insert: {
          categories?: string[] | null
          description_html?: string | null
          full_html?: string | null
          guid: string
          id?: number
          inserted_at?: string | null
          link: string
          pub_date?: string | null
          title: string
        }
        Update: {
          categories?: string[] | null
          description_html?: string | null
          full_html?: string | null
          guid?: string
          id?: number
          inserted_at?: string | null
          link?: string
          pub_date?: string | null
          title?: string
        }
        Relationships: []
      }
      executive_orders: {
        Row: {
          body_html_url: string | null
          citation: string | null
          created_at: string | null
          disposition_notes: string | null
          document_number: string
          end_page: number | null
          executive_order_number: string | null
          full_text_markdown: string | null
          full_text_xml: string | null
          full_text_xml_url: string | null
          html_url: string | null
          id: string
          json_url: string | null
          not_received_for_publication: string | null
          pdf_url: string | null
          publication_date: string | null
          signing_date: string | null
          start_page: number | null
          subtype: string | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          body_html_url?: string | null
          citation?: string | null
          created_at?: string | null
          disposition_notes?: string | null
          document_number: string
          end_page?: number | null
          executive_order_number?: string | null
          full_text_markdown?: string | null
          full_text_xml?: string | null
          full_text_xml_url?: string | null
          html_url?: string | null
          id?: string
          json_url?: string | null
          not_received_for_publication?: string | null
          pdf_url?: string | null
          publication_date?: string | null
          signing_date?: string | null
          start_page?: number | null
          subtype?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          body_html_url?: string | null
          citation?: string | null
          created_at?: string | null
          disposition_notes?: string | null
          document_number?: string
          end_page?: number | null
          executive_order_number?: string | null
          full_text_markdown?: string | null
          full_text_xml?: string | null
          full_text_xml_url?: string | null
          html_url?: string | null
          id?: string
          json_url?: string | null
          not_received_for_publication?: string | null
          pdf_url?: string | null
          publication_date?: string | null
          signing_date?: string | null
          start_page?: number | null
          subtype?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      president_schedule: {
        Row: {
          coverage: string | null
          created_at: string | null
          daily_text: string | null
          date: string
          day: number
          day_of_week: string
          day_summary: Json | null
          daycount: number | null
          details: string | null
          id: number
          lastdaily: boolean | null
          latitude: number | null
          location: string | null
          longitude: number | null
          month: string
          newmonth: boolean | null
          time: string | null
          time_formatted: string | null
          type: string
          updated_at: string | null
          url: string | null
          video_url: string | null
          year: number
        }
        Insert: {
          coverage?: string | null
          created_at?: string | null
          daily_text?: string | null
          date: string
          day: number
          day_of_week: string
          day_summary?: Json | null
          daycount?: number | null
          details?: string | null
          id?: never
          lastdaily?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          month: string
          newmonth?: boolean | null
          time?: string | null
          time_formatted?: string | null
          type: string
          updated_at?: string | null
          url?: string | null
          video_url?: string | null
          year: number
        }
        Update: {
          coverage?: string | null
          created_at?: string | null
          daily_text?: string | null
          date?: string
          day?: number
          day_of_week?: string
          day_summary?: Json | null
          daycount?: number | null
          details?: string | null
          id?: never
          lastdaily?: boolean | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          month?: string
          newmonth?: boolean | null
          time?: string | null
          time_formatted?: string | null
          type?: string
          updated_at?: string | null
          url?: string | null
          video_url?: string | null
          year?: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
