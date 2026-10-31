import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// Names and currency in one place, so they are easy to change.
export const BRAND_PUBLIC = "RoomsForUse"; // visitors and admin navbar
export const BRAND_USER = "SB Hotel"; // customer navbar
export const CURRENCY = "₹";

// Dates from the API are UTC midnight, so format them in UTC (no off-by-one day).
export const fmtDate = (d) => dayjs.utc(d).format("DD-MM-YYYY");

export const inr = (n) => `${CURRENCY}${Number(n)}`;

export const today = () => dayjs().format("YYYY-MM-DD");

// "YYYY-MM-DD" strings parse as UTC, so this is exact (23rd to 24th = 1 night).
export const nightsBetween = (from, to) =>
  Math.round((Date.parse(to) - Date.parse(from)) / 86400000);

export const errMsg = (error, fallback = "Something went wrong") =>
  error?.response?.data?.msg || fallback;

export const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

// Labels used on screen (stored values stay "deluxe"/"standard" and "customer"/"admin").
export const typeLabel = (t) => (t === "deluxe" ? "Delux" : "Non-Delux");
export const roleLabel = (r) => (r === "admin" ? "Admin" : "Ordinary");
