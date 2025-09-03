export default {
  filters: {
    minBudget: 0,
    minHourlyRate: 0,
    requiredSkills: ['javascript', 'node', 'botpress', 'etl', 'sql'],
    paymentVerified: true,
    minClientSpend: 0,
    contractTypes: ['hourly', 'fixed'],
    allowedCountries: [] as string[],
  },
  safetyBufferMinutes: 10,
  defaultLookbackMinutes: 90,
};
