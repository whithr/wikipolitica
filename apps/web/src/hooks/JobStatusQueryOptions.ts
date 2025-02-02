import { Tables } from "@/lib/database.types";
import { supabase } from "@/main";
import { queryOptions } from "@tanstack/react-query";

export type JobStatusType = Pick<
  Tables<"job_status">,
  | "id"
  | "job_name"
  | "last_run_at"
  | "run_count"
  | "last_success_at"
  | "last_error"
  | "updated_at"
>;

export const jobStatusQueryOptions = queryOptions<
  JobStatusType[]
>({
  queryKey: ["job_status"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("job_status")
      .select(
        "id, job_name, last_run_at, run_count, last_success_at, last_error, updated_at",
      );

    if (error) {
      throw new Error(error.message);
    }

    // Return an empty array if data is null or undefined.
    return data || [];
  },
});
