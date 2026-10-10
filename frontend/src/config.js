export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://ohpxgx4dgsuivblvffwcfzrvwe0zqvdm.lambda-url.ap-southeast-2.on.aws/";

export const MIN_CAPACITY = 1;
export const MAX_CAPACITY = 23;
export const CAPACITY_PRESETS = [5, 10, 20];

export const DATA_PERIODS = {
  tanker: "June–August 2026",
  groundwater: "September 2–October 2, 2026",
};

export const DATASET_AUDIT = {
  eligibleSections: 218,
  unassessedEligibleSections: 195,
  totalBookings: 712931,
};