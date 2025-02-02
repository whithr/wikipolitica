import { SupabaseClient } from "@supabase/supabase-js";

export async function updateJobStatus(
  jobName: string,
  {
    rowChanged,
    errorMsg,
  }: { rowChanged?: boolean; errorMsg?: string } = {},
  supabase: SupabaseClient<any, "public", any>,
) {
  const now = new Date().toISOString();

  // Fetch any existing record for this job name.
  const { data: existingStatus, error: fetchError } = await supabase
    .from("job_status")
    .select("*")
    .eq("job_name", jobName)
    .maybeSingle();

  if (fetchError) {
    console.error(`Error fetching job status for ${jobName}:`, fetchError);
  }

  // Increment run_count (or default to 1)
  const newRunCount = (existingStatus?.run_count || 0) + 1;

  // Always update last_run_at and run_count. Only update last_success_at if a row change occurred.
  const updates: any = {
    job_name: jobName,
    last_run_at: now,
    run_count: newRunCount,
    updated_at: now,
  };

  if (rowChanged) {
    updates.last_success_at = now;
  }

  if (errorMsg) {
    updates.last_error = errorMsg;
  }

  const { error: upsertError } = await supabase
    .from("job_status")
    .upsert(updates, { onConflict: "job_name" });

  if (upsertError) {
    console.error(`Error updating job status for ${jobName}:`, upsertError);
  }
}
