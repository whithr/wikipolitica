import { Tables } from "@/lib/database.types";
import { supabase } from "@/main";
import { queryOptions } from "@tanstack/react-query";

export type ExecutiveOrderType = Pick<
  Tables<"executive_orders">,
  | "id"
  | "citation"
  | "document_number"
  | "pdf_url"
  | "signing_date"
  | "publication_date"
  | "title"
  | "executive_order_number"
  | "presidency_project_title"
  | "presidency_project_date"
>;

export const executiveOrdersQueryOptions = queryOptions<
  ExecutiveOrderType[]
>({
  queryKey: ["executive_orders"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("executive_orders")
      .select(
        "id, citation, document_number, pdf_url, signing_date, publication_date, title, executive_order_number, presidency_project_title, presidency_project_date",
      )
      .order("publication_date", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Return an empty array if data is null or undefined.
    return data || [];
  },
});

export type ExecutiveOrderMarkdown = Pick<
  Tables<"executive_orders">,
  | "presidency_project_html"
  | "presidency_project_title"
  | "presidency_project_date"
>;

export const executiveOrderMarkdownQueryOptions = (id?: string) =>
  queryOptions<ExecutiveOrderMarkdown>({
    queryKey: ["executive_orders", id],
    enabled: !!id, // Only run the query if 'id' is truthy
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");

      const { data, error } = await supabase
        .from("executive_orders")
        .select(
          "presidency_project_html, presidency_project_title, presidency_project_date",
        )
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
