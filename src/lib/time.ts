export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

export function calculateNextWatermark(
  current: Date | null,
  jobs: { postedAt: Date }[],
): Date {
  return jobs.reduce(
    (max, j) => (j.postedAt > max ? j.postedAt : max),
    current ?? new Date(0),
  );
}
