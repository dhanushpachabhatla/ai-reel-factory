"use client";

import { Lightbulb, Loader2, RefreshCw } from "lucide-react";
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
    <section className="rounded-lg border border-line bg-white p-5">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-lg font-semibold text-ink">Dynamic Analytics Feedback Loop</h2>
          <p className="mt-1 text-sm text-neutral-500">Edit performance inputs, score winners, then ask Gemini what to make next.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={resetFromBriefs}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-ink"
          >
            <RefreshCw size={16} />
            Refresh Metrics
          </button>
          <button
            onClick={getRecommendations}
            disabled={isLoading}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-amber px-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Lightbulb size={16} />}
            Recommend Next Batch
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-line p-4">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dedbd2" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#315f9d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-paper p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-ink">Next-Batch Recommendations</h3>
            <span className="rounded-md bg-white px-2 py-1 text-xs text-neutral-600">{source}</span>
          </div>
          <div className="mt-4 grid gap-2">
            {recommendations.map((recommendation) => (
              <p key={recommendation} className="rounded-md bg-white px-3 py-2 text-sm leading-6 text-neutral-700">
                {recommendation}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="bg-paper text-neutral-600">
            <tr>
              <th className="px-3 py-3 font-medium">Reel</th>
              <th className="px-3 py-3 font-medium">Views</th>
              <th className="px-3 py-3 font-medium">Likes</th>
              <th className="px-3 py-3 font-medium">Comments</th>
              <th className="px-3 py-3 font-medium">Shares</th>
              <th className="px-3 py-3 font-medium">Saves</th>
              <th className="px-3 py-3 font-medium">Watch %</th>
              <th className="px-3 py-3 font-medium">Score</th>
              <th className="px-3 py-3 font-medium">Label</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.contentId} className="border-t border-line">
                <td className="max-w-[220px] px-3 py-3 font-medium text-ink">{row.name}</td>
                {(["views", "likes", "comments", "shares", "saves", "avgWatchTime"] as const).map((key) => (
                  <td key={key} className="px-3 py-3">
                    <input
                      type="number"
                      value={row[key]}
                      onChange={(event) => updateRecord(row.contentId, key, Number(event.target.value))}
                      className="h-9 w-24 rounded-md border border-line px-2 text-sm"
                    />
                  </td>
                ))}
                <td className="px-3 py-3 text-lg font-semibold text-cobalt">{row.score}</td>
                <td className="px-3 py-3">
                  <span className="rounded-md bg-ink px-2 py-1 text-xs font-medium text-white">{row.label}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
