import { AnalyticsRecord } from "./types";

export function performanceScore(record: AnalyticsRecord) {
  const engagement = record.likes + record.comments * 2 + record.shares * 4 + record.saves * 3;
  const engagementRate = record.views ? engagement / record.views : 0;
  return Math.round(record.avgWatchTime * 0.55 + engagementRate * 1000 * 0.45);
}

export function performanceLabel(score: number) {
  if (score >= 85) return "Winner";
  if (score >= 65) return "Promising";
  if (score >= 45) return "Average";
  return "Pause";
}
