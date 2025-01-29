export type DaySummary = {
  trump_property?: string | null;
  political_rally?: string | null;
  golf?: string | null;
  fundraiser?: string | null;
  international?: string | null;
};

export type PoolReportSchedule = {
  id: number;
  date: string; // e.g., "2025-01-23"
  time?: string | null; // e.g., "11:00:00"
  time_formatted?: string | null; // e.g., "11:00 AM"
  year: number; // e.g., 2025
  month: string; // e.g., "January"
  day: number; // e.g., 23
  day_of_week: string; // e.g., "Thursday"
  type: string; // e.g., "Pool Report Schedule"
  details: string; // Event details
  location: string; // Location of the event
  coverage: string; // e.g., "In-Town Pool" or "Closed Press"
  daily_text: string; // Additional text, if any
  url?: string | null; // Optional URL for more information
  video_url?: string | null; // Optional video URL
  day_summary?: DaySummary | null; // Optional day summary object
  newmonth?: boolean; // Indicates if this is the start of a new month
  daycount?: number | null; // Optional count of days
  lastdaily: boolean; // Indicates if this is the last daily event
  latitude?: number | null; // Optional latitude
  longitude?: number | null; // Optional longitude
};

export type PoolReportSchedules = PoolReportSchedule[];
