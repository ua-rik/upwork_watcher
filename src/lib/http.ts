export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 5,
  delay = 1000,
): Promise<T> {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const backoff = delay * Math.pow(2, attempt) + Math.random() * 100;
      await new Promise((res) => setTimeout(res, backoff));
    }
  }
}
