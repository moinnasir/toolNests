export const CRON_PRESETS = [
  { label: 'Every 5 minutes', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily at midnight', value: '0 0 * * *' },
  { label: 'Weekly Mon 09:00', value: '0 9 * * 1' },
  { label: 'Monthly 1st 00:00', value: '0 0 1 * *' },
] as const;
