/**
 * Return true if yyyy_mm_dd matches the *user's local* date (today).
 * Example: "2025-01-24" => check if the local system date is 2025-01-24.
 */
export const isLocalToday = (yyyy_mm_dd: string): boolean => {
  const now = new Date();
  const [y, m, d] = yyyy_mm_dd.split("-").map(Number);

  return (
    now.getFullYear() === y &&
    now.getMonth() + 1 === m &&
    now.getDate() === d
  );
};

/**
 * Parse "HH:MM:SS" into the total minutes after midnight (naive approach).
 * E.g. "09:30:00" => 570.  This does *not* account for timezone shifts.
 */
export const parseTimeToMinutes = (
  timeString: string | null | undefined,
): number | null => {
  if (!timeString) return null;
  const [hh, mm] = timeString.split(":");
  if (!hh || !mm) return null;
  const hours = parseInt(hh, 10);
  const mins = parseInt(mm, 10);
  return hours * 60 + mins;
};

/**
 * Get the user's *local* time of day in minutes after midnight.
 * E.g. if local time is 9:15 PM, returns 21*60 + 15 = 1275.
 */
export const getLocalNowInMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

/**
 * Format "YYYY-MM-DD" into something like "Thursday, January 24, 2025".
 * This is purely for display.  We let the browser do the final formatting.
 */
export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export function formatDateWithSuffix(dateString: string | null): string | null {
  if (!dateString) return dateString;

  // Check if the date string matches the YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  let date: Date;

  if (dateRegex.test(dateString)) {
    const [yearStr, monthStr, dayStr] = dateString.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1; // JavaScript months are 0-indexed
    const day = parseInt(dayStr, 10);
    date = new Date(year, month, day);
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) {
    return dateString; // Return the original string if invalid date
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
  };
  const day = date.getDate();

  // Function to get ordinal suffix
  const getOrdinalSuffix = (n: number): string => {
    if (n >= 11 && n <= 13) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const suffix = getOrdinalSuffix(day);
  const formattedMonthYear = date.toLocaleDateString(undefined, options);

  return `${
    formattedMonthYear.split(" ")[0]
  } ${day}${suffix}, ${date.getFullYear()}`;
}

export function getEasternNowInMinutes(): number {
  // Get the current time as seen in Eastern time (America/New_York)
  const now = new Date();
  // Format the current time in Eastern time using a locale that allows us to extract hours and minutes.
  // Note: This returns a string like "06:40" (24-hour format) if configured correctly.
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/New_York",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  // Use Intl.DateTimeFormat to get the time string in Eastern time.
  const timeString = new Intl.DateTimeFormat("en-US", options).format(now);
  const [hourStr, minuteStr] = timeString.split(":");
  const hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);
  return hours * 60 + minutes;
}

export const getEasternToday = () => {
  const easternDate = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Convert from MM/DD/YYYY to YYYY-MM-DD
  const [month, day, year] = easternDate.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};
