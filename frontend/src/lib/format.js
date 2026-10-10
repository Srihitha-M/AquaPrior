
const nf = new Intl.NumberFormat("en-IN");

export const formatInt = (n) => nf.format(n);

// "KONDAPUR" → "Kondapur"
export const titleCase = (s) =>
  String(s)
    .toLowerCase()
    .replace(/(^|[\s\-/(])([a-z])/g, (_, a, b) => a + b.toUpperCase());

// Format groundwater changes in meters
export const formatMeters = (n, digits = 2) => {
  if (n === null || n === undefined || Number.isNaN(n)) {
    return "—";
  }

  const sign = n < 0 ? "−" : "+";
  return `${sign}${Math.abs(n).toFixed(digits)} m`;
};
