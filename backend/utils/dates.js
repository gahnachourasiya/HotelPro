// Dates travel as "YYYY-MM-DD" strings and are stored as UTC midnight.
const DAY_MS = 24 * 60 * 60 * 1000;

function parseDay(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return null;
  // Rejects things like 2026-02-31 that JS would roll over
  if (d.toISOString().slice(0, 10) !== value) return null;
  return d;
}

function todayUTC() {
  return parseDay(new Date().toISOString().slice(0, 10));
}

// Nights between check-in and check-out: 23rd to 24th is 1 night.
function nightsBetween(from, to) {
  return Math.round((to.getTime() - from.getTime()) / DAY_MS);
}

module.exports = { parseDay, todayUTC, nightsBetween };
