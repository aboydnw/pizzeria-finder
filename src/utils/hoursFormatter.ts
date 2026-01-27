// Format hours from JSONB to display string

const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const DAY_NAMES: Record<string, string> = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
};

export function formatHours(hours: Record<string, string> | undefined): string {
  if (!hours) {
    return 'Hours not available';
  }

  const formattedDays: string[] = [];
  
  for (const day of DAY_ORDER) {
    const value = hours[day];
    if (value) {
      formattedDays.push(`${DAY_NAMES[day]}: ${value}`);
    }
  }

  if (formattedDays.length === 0) {
    return 'Hours not available';
  }

  return formattedDays.join(' | ');
}

export function formatHoursCompact(hours: Record<string, string> | undefined): string[] {
  if (!hours) {
    return ['Hours not available'];
  }

  const result: string[] = [];
  
  for (const day of DAY_ORDER) {
    const value = hours[day];
    if (value) {
      result.push(`${DAY_NAMES[day]}: ${value}`);
    }
  }

  return result.length > 0 ? result : ['Hours not available'];
}

export function getTodayHours(hours: Record<string, string> | undefined): string {
  if (!hours) {
    return 'Hours not available';
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
  const todayKey = today.slice(0, 3); // 'mon', 'tue', etc.
  
  return hours[todayKey] || 'Closed';
}
