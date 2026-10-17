export const identityOptions = [
  "Real estate professional",
  "Legal professional",
  "Financial professional",
  "Sales or business development",
  "Founder or executive",
  "Investor",
  "Other",
] as const;

export const IDENTITY_OPTIONS = new Set<string>(identityOptions);
