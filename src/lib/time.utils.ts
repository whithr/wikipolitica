export const getEasternDateTime = () => {
  const now = new Date()

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(now)

  let year = 0,
    month = 0,
    day = 0,
    hour = 0,
    minute = 0,
    second = 0

  for (const p of parts) {
    switch (p.type) {
      case 'year':
        year = parseInt(p.value, 10)
        break
      case 'month':
        month = parseInt(p.value, 10)
        break
      case 'day':
        day = parseInt(p.value, 10)
        break
      case 'hour':
        hour = parseInt(p.value, 10)
        break
      case 'minute':
        minute = parseInt(p.value, 10)
        break
      case 'second':
        second = parseInt(p.value, 10)
        break
    }
  }
  return { year, month, day, hour, minute, second }
}

export const isEasternToday = (yyyy_mm_dd: string) => {
  // Example yyyy_mm_dd = "2025-01-23"
  const { year, month, day } = getEasternDateTime()
  const [y, m, d] = yyyy_mm_dd.split('-').map(Number)
  return y === year && m === month && d === day
}

// export const parseTimeToMinutes = (timeString: string | null | undefined) => {
//   if (!timeString) return null; // No time
//   const [hh, mm] = timeString.split(":");
//   if (!hh || !mm) return null;
//   const hours = parseInt(hh, 10);
//   const mins = parseInt(mm, 10);
//   return hours * 60 + mins;
// };

export const getEasternNowInMinutes = (): number => {
  const { hour, minute } = getEasternDateTime()
  return hour * 60 + minute
}

/**
 * Return true if yyyy_mm_dd matches the *user's local* date (today).
 * Example: "2025-01-24" => check if the local system date is 2025-01-24.
 */
export const isLocalToday = (yyyy_mm_dd: string) => {
  const now = new Date()
  const [y, m, d] = yyyy_mm_dd.split('-').map(Number)

  return (
    now.getFullYear() === y && now.getMonth() + 1 === m && now.getDate() === d
  )
}

/**
 * Parse "HH:MM:SS" into the total minutes after midnight (naive approach).
 * E.g. "09:30:00" => 570.  This does *not* account for timezone shifts.
 */
export const parseTimeToMinutes = (timeString: string | null | undefined) => {
  if (!timeString) return null
  const [hh, mm] = timeString.split(':')
  if (!hh || !mm) return null
  const hours = parseInt(hh, 10)
  const mins = parseInt(mm, 10)
  return hours * 60 + mins
}

/**
 * Get the user's *local* time of day in minutes after midnight.
 * E.g. if local time is 9:15 PM, returns 21*60 + 15 = 1275.
 */
export const getLocalNowInMinutes = (): number => {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}

/**
 * Format "YYYY-MM-DD" into something like "Thursday, January 24, 2025".
 * This is purely for display.  We let the browser do the final formatting.
 */
export const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
