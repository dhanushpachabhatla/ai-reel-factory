"use client";

import { Lightbulb, Loader2, RefreshCw, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AnalyticsRecord, ReelBrief } from "@/lib/types";
import { performanceLabel, performanceScore } from "@/lib/scoring";

function defaultAnalytics(briefs: ReelBrief[]): AnalyticsRecord[] {
  return briefs.slice(0, 6).map((brief, index) => ({
    contentId: brief.id,
    views: 18000 + index * 7400,
    likes: 900 + index * 210,
    comments: 32 + index * 11,
    shares: 140 + index * 55,
    saves: 210 + index * 65,
    avgWatchTime: 54 + index * 5
  }));
}

type AnalyticsPanelProps = {
  briefs: ReelBrief[];
};

export function AnalyticsPanel({ briefs }: AnalyticsPanelProps) {
  const [records, setRecords] = useState<AnalyticsRecord[]>(() => defaultAnalytics(briefs));
  const [recommendations, setRecommendations] = useState<string[]>([
    "Generate a batch, edit metrics, then ask Gemini for next-batch recommendations."
  ]);
  const [source, setSource] = useState("local scoring");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setRecords(defaultAnalytics(briefs));
    setRecommendations(["New batch detected. Score the first reels, then ask Gemini for the next batch."]);
    setSource("local scoring");
  }, [briefs]);

  const rows = useMemo(
    () =>
      records.map((record) => {
        const brief = briefs.find((item) => item.id === record.contentId);
        const score = performanceScore(record);
        return {
          ...record,
          name: brief?.title.slice(0, 22) ?? record.contentId,
          score,
          label: performanceLabel(score)
        };
      }),
    [briefs, records]
  );

  function resetFromBriefs() {
    setRecords(defaultAnalytics(briefs));
    setRecommendations(["Metrics refreshed from the current generated batch."]);
    setSource("local scoring");
  }

  function updateRecord(contentId: string, key: keyof AnalyticsRecord, value: number) {
    setRecords((current) =>
      current.map((record) => (record.contentId === contentId ? { ...record, [key]: value } : record))
    );
  }

  async function getRecommendations() {
    setIsLoading(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
      const response = await fetch(`${apiBaseUrl}/analytics/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefs, analytics: records })
      });
      if (!response.ok) throw new Error("Recommendation request failed");
      const data = (await response.json()) as { source: string; recommendations: string[] };
      setRecommendations(data.recommendations);
      setSource(data.source);
    } catch {
      setRecommendations([
        "Repeat the highest-score hooks with new first frames.",
        "Pause formats with low saves and shares.",
        "Turn top comments into the next research queue.",
        "Generate 3 variations for every winner before trying a new format."
      ]);
      setSource("frontend fallback");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-line glass p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-lg font-bold text-ink">Dynamic Analytics Feedback Loop</h2>
          <p className="mt-1 text-sm text-muted">Edit performance inputs, score winners, then ask Gemini what to make next.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={resetFromBriefs}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-elevated px-3 text-sm font-bold text-ink hover:bg-base transition-colors shadow-sm"
          >
            <RefreshCw size={16} />
            Refresh Metrics
          </button>
          <button
            onClick={getRecommendations}
            disabled={isLoading}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-amber px-3 text-sm font-bold text-ink shadow-sm transition-all hover:bg-amber/90 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Lightbulb size={16} />}
            Recommend Next Batch
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl border border-line glass p-5 shadow-sm">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dedbd2" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                <YAxis tick={{ fill: "var(--text-muted)" }} />
                <Tooltip contentStyle={{ backgroundColor: "rgb(var(--bg-elevated))", border: "1px solid rgb(var(--line))", borderRadius: "8px", color: "rgb(var(--ink))" }} />
                <Bar dataKey="score" fill="rgb(var(--cobalt))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-base p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-bold text-ink">Next-Batch Recommendations</h3>
            <span className="rounded-md bg-elevated border border-line px-2 py-1 text-xs font-semibold text-muted shadow-sm">{source}</span>
          </div>
          <div className="mt-4 grid gap-3">
            {recommendations.map((recommendation) => (
              <p key={recommendation} className="rounded-xl bg-elevated border border-line/50 px-4 py-3 text-sm leading-6 text-ink/90 shadow-sm">
                {recommendation}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line glass shadow-sm">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="bg-base border-b border-line text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Reel</th>
              <th className="px-4 py-3 font-semibold">Views</th>
              <th className="px-4 py-3 font-semibold">Likes</th>
              <th className="px-4 py-3 font-semibold">Comments</th>
              <th className="px-4 py-3 font-semibold">Shares</th>
              <th className="px-4 py-3 font-semibold">Saves</th>
              <th className="px-4 py-3 font-semibold">Watch %</th>
              <th className="px-4 py-3 font-semibold">Score</th>
              <th className="px-4 py-3 font-semibold">Label</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.contentId} className="border-t border-line hover:bg-base/50 transition-colors">
                <td className="max-w-[220px] px-4 py-4 font-bold text-ink">{row.name}</td>
                {(["views", "likes", "comments", "shares", "saves", "avgWatchTime"] as const).map((key) => (
                  <td key={key} className="px-4 py-4">
                    <input
                      type="number"
                      value={row[key]}
                      onChange={(event) => updateRecord(row.contentId, key, Number(event.target.value))}
                      className="h-9 w-24 rounded-md border border-line bg-elevated px-2 text-sm text-ink shadow-sm focus:border-cobalt focus:outline-none transition-colors"
                    />
                  </td>
                ))}
                <td className="px-4 py-4 text-lg font-bold text-cobalt">{row.score}</td>
                <td className="px-4 py-4">
                  <span className="rounded-md bg-ink px-2 py-1 text-xs font-bold text-base">{row.label}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
