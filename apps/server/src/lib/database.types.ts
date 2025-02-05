export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bill_actions: {
        Row: {
          action_date: string
          action_text: string
          bill_id: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          action_date: string
          action_text: string
          bill_id: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          action_date?: string
          action_text?: string
          bill_id?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_actions_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      bill_text_versions: {
        Row: {
          bill_id: string
          created_at: string | null
          date: string | null
          full_text: string | null
          id: string
          pdf_url: string | null
          updated_at: string | null
          version_name: string | null
        }
        Insert: {
          bill_id: string
          created_at?: string | null
          date?: string | null
          full_text?: string | null
          id?: string
          pdf_url?: string | null
          updated_at?: string | null
          version_name?: string | null
        }
        Update: {
          bill_id?: string
          created_at?: string | null
          date?: string | null
          full_text?: string | null
          id?: string
          pdf_url?: string | null
          updated_at?: string | null
          version_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bill_text_versions_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      bills: {
        Row: {
          bill_number: string
          bill_type: string
          congress_id: string
          constitutional_authority_statement: string | null
          created_at: string | null
          id: string
          introduced_date: string | null
          origin_chamber: string | null
          policy_area: string | null
          public_law_number: string | null
          status: string | null
          title: string | null
          update_date: string | null
          updated_at: string | null
        }
        Insert: {
          bill_number: string
          bill_type: string
          congress_id: string
          constitutional_authority_statement?: string | null
          created_at?: string | null
          id?: string
          introduced_date?: string | null
          origin_chamber?: string | null
          policy_area?: string | null
          public_law_number?: string | null
          status?: string | null
          title?: string | null
          update_date?: string | null
          updated_at?: string | null
        }
        Update: {
          bill_number?: string
          bill_type?: string
          congress_id?: string
          constitutional_authority_statement?: string | null
          created_at?: string | null
          id?: string
          introduced_date?: string | null
          origin_chamber?: string | null
          policy_area?: string | null
          public_law_number?: string | null
          status?: string | null
          title?: string | null
          update_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bills_congress_id_fkey"
            columns: ["congress_id"]
            isOneToOne: false
            referencedRelation: "congress"
            referencedColumns: ["id"]
          },
        ]
      }
      committee_memberships: {
        Row: {
          committee_id: string | null
          created_at: string | null
          end_date: string | null
          id: string
          member_congress_id: string | null
          role: string | null
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          committee_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          member_congress_id?: string | null
          role?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          committee_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          member_congress_id?: string | null
          role?: string | null
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "committee_memberships_committee_id_fkey"
            columns: ["committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "committee_memberships_member_congress_id_fkey"
            columns: ["member_congress_id"]
            isOneToOne: false
            referencedRelation: "member_congress"
            referencedColumns: ["id"]
          },
        ]
      }
      committees: {
        Row: {
          chamber: string | null
          committee_type_code: string | null
          congress_id: string | null
          created_at: string | null
          id: string
          name: string
          parent_committee_id: string | null
          system_code: string | null
          update_date: string | null
          updated_at: string | null
        }
        Insert: {
          chamber?: string | null
          committee_type_code?: string | null
          congress_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          parent_committee_id?: string | null
          system_code?: string | null
          update_date?: string | null
          updated_at?: string | null
        }
        Update: {
          chamber?: string | null
          committee_type_code?: string | null
          congress_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          parent_committee_id?: string | null
          system_code?: string | null
          update_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "committees_congress_id_fkey"
            columns: ["congress_id"]
            isOneToOne: false
            referencedRelation: "congress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "committees_parent_committee_id_fkey"
            columns: ["parent_committee_id"]
            isOneToOne: false
            referencedRelation: "committees"
            referencedColumns: ["id"]
          },
        ]
      }
      congress: {
        Row: {
          congress_number: number
          created_at: string | null
          end_year: number | null
          id: string
          name: string
          start_year: number | null
          update_date: string | null
          updated_at: string | null
        }
        Insert: {
          congress_number: number
          created_at?: string | null
          end_year?: number | null
          id?: string
          name: string
          start_year?: number | null
          update_date?: string | null
          updated_at?: string | null
        }
        Update: {
          congress_number?: number
          created_at?: string | null
          end_year?: number | null
          id?: string
          name?: string
          start_year?: number | null
          update_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      congress_sessions: {
        Row: {
          chamber: string
          congress_id: string | null
          created_at: string | null
          end_date: string | null
          id: string
          session_number: number
          start_date: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          chamber: string
          congress_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          session_number: number
          start_date?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          chamber?: string
          congress_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          session_number?: number
          start_date?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "congress_sessions_congress_id_fkey"
            columns: ["congress_id"]
            isOneToOne: false
            referencedRelation: "congress"
            referencedColumns: ["id"]
          },
        ]
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
          document_number: string | null
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
          presidency_project_date: string | null
          presidency_project_html: string | null
          presidency_project_title: string | null
          presidency_project_url: string | null
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
          document_number?: string | null
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
          presidency_project_date?: string | null
          presidency_project_html?: string | null
          presidency_project_title?: string | null
          presidency_project_url?: string | null
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
          document_number?: string | null
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
          presidency_project_date?: string | null
          presidency_project_html?: string | null
          presidency_project_title?: string | null
          presidency_project_url?: string | null
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
      job_status: {
        Row: {
          created_at: string | null
          id: string
          job_name: string
          last_error: string | null
          last_run_at: string | null
          last_success_at: string | null
          run_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_name: string
          last_error?: string | null
          last_run_at?: string | null
          last_success_at?: string | null
          run_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          job_name?: string
          last_error?: string | null
          last_run_at?: string | null
          last_success_at?: string | null
          run_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      member_congress: {
        Row: {
          chamber: string | null
          congress_id: string | null
          created_at: string | null
          district: number | null
          id: string
          member_id: string | null
          party_name: string | null
          start_year: number | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          chamber?: string | null
          congress_id?: string | null
          created_at?: string | null
          district?: number | null
          id?: string
          member_id?: string | null
          party_name?: string | null
          start_year?: number | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          chamber?: string | null
          congress_id?: string | null
          created_at?: string | null
          district?: number | null
          id?: string
          member_id?: string | null
          party_name?: string | null
          start_year?: number | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_congress_congress_id_fkey"
            columns: ["congress_id"]
            isOneToOne: false
            referencedRelation: "congress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_congress_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          bioguide_id: string
          birth_year: number | null
          created_at: string | null
          depiction_attribution: string | null
          depiction_image_url: string | null
          direct_order_name: string | null
          first_name: string | null
          honorific_name: string | null
          id: string
          inverted_order_name: string | null
          last_name: string | null
          middle_name: string | null
          update_date: string | null
          updated_at: string | null
        }
        Insert: {
          bioguide_id: string
          birth_year?: number | null
          created_at?: string | null
          depiction_attribution?: string | null
          depiction_image_url?: string | null
          direct_order_name?: string | null
          first_name?: string | null
          honorific_name?: string | null
          id?: string
          inverted_order_name?: string | null
          last_name?: string | null
          middle_name?: string | null
          update_date?: string | null
          updated_at?: string | null
        }
        Update: {
          bioguide_id?: string
          birth_year?: number | null
          created_at?: string | null
          depiction_attribution?: string | null
          depiction_image_url?: string | null
          direct_order_name?: string | null
          first_name?: string | null
          honorific_name?: string | null
          id?: string
          inverted_order_name?: string | null
          last_name?: string | null
          middle_name?: string | null
          update_date?: string | null
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

