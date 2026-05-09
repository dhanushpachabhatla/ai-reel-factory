"use client";

import {
  Activity,
  BarChart3,
  CalendarDays,
  Download,
  Factory,
  Loader2,
  Play,
  Sparkles
} from "lucide-react";
import { useMemo, useState } from "react";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { BriefCardGrid } from "@/components/BriefCardGrid";
import { BriefDetailPanel } from "@/components/BriefDetailPanel";
import { ChannelCard } from "@/components/ChannelCard";
import { MetricCard } from "@/components/MetricCard";
import { PipelineTable } from "@/components/PipelineTable";
import { channels, seedBriefs } from "@/lib/data";
import { mockGenerate } from "@/lib/mock-generator";
import { ReelBrief } from "@/lib/types";

function csvEscape(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function buildCsv(briefs: ReelBrief[]) {
  const header = [
    "channelId",
    "title",
    "hook",
    "script",
    "voiceover",
    "storyboard",
    "visualPrompts",
    "editingNotes",
    "caption",
    "hashtags",
    "cta",
    "status",
    "scheduledDate"
  ];
  const rows = briefs.map((brief) => [
    brief.channelId,
    brief.title,
    brief.hook,
    brief.script,
    brief.voiceover,
    brief.storyboard.join(" | "),
    brief.visualPrompts.join(" | "),
    brief.editingNotes,
    brief.caption,
    brief.hashtags.join(" "),
    brief.cta,
    brief.status,
    brief.scheduledDate
  ]);
  return [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
}

export default function Home() {
  const [briefs, setBriefs] = useState<ReelBrief[]>(seedBriefs);
  const [generationStep, setGenerationStep] = useState<number | null>(null);
  const [source, setSource] = useState("seed");
  const [selectedCount, setSelectedCount] = useState(5);
  const [reelsPerChannel, setReelsPerChannel] = useState(2);
  const [selectedBrief, setSelectedBrief] = useState<ReelBrief | null>(null);

  const selectedChannels = useMemo(() => channels.slice(0, selectedCount), [selectedCount]);
  const dailyTarget = selectedChannels.length * reelsPerChannel;

  const steps = [
    "Loading Channel Playbooks...",
    "Writing Hook-First Scripts...",
    "Designing Visual Prompts...",
    "Finalizing Briefs..."
  ];

  async function generateBatch() {
    setGenerationStep(0);
    for (let i = 1; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setGenerationStep(i);
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
      const response = await fetch(`${apiBaseUrl}/generate/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channels: selectedChannels, reelsPerChannel })
      });
      if (!response.ok) throw new Error("Backend generation failed");
      const data = (await response.json()) as { source: string; briefs: ReelBrief[] };
      setBriefs(data.briefs);
      setSource(data.source);
    } catch {
      setBriefs(mockGenerate(selectedChannels, reelsPerChannel));
      setSource("frontend fallback");
    } finally {
      setGenerationStep(null);
    }
  }

  function handleStatusChange(id: string, newStatus: ContentStatus) {
    setBriefs((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
  }

  function exportCsv() {
    const csv = buildCsv(briefs);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "ai-reel-factory-content-calendar.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-paper">
      <section className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-ink text-white">
                <Factory size={22} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-coral">Matiks assignment prototype</p>
                <h1 className="text-2xl font-semibold text-ink md:text-3xl">AI Reel Factory</h1>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600 md:text-base">
              One operator can generate multi-channel reel briefs, move them through a production pipeline,
              export a posting calendar, and feed analytics back into the next batch.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={generateBatch}
              disabled={generationStep !== null}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-ink px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generationStep !== null ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Generate Batch
            </button>
            <button
              onClick={exportCsv}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Play} label="Daily Output" value={`${dailyTarget} reels`} detail="Generated from channel playbooks in one batch." />
          <MetricCard icon={CalendarDays} label="Channels Managed" value={`${selectedChannels.length}`} detail="Designed for 10+ niche pages." />
          <MetricCard icon={Activity} label="Operator Role" value="QC only" detail="Approve, edit exceptions, and tune playbooks." />
          <MetricCard icon={BarChart3} label="Generation Source" value={source} detail="Gemini when configured, mock fallback for demos." />
        </div>

        <section className="mt-6 rounded-lg border border-line bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">Batch Controls</h2>
              <p className="mt-1 text-sm text-neutral-500">Simulate the exact Matiks scale equation.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium text-neutral-700">
                Channels
                <select
                  value={selectedCount}
                  onChange={(event) => setSelectedCount(Number(event.target.value))}
                  className="mt-2 h-10 w-full rounded-lg border border-line bg-white px-3"
                >
                  {[1, 2, 3, 4, 5, 10].filter((count) => count <= channels.length).map((count) => (
                    <option key={count} value={count}>
                      {count} channels
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-neutral-700">
                Reels per channel
                <select
                  value={reelsPerChannel}
                  onChange={(event) => setReelsPerChannel(Number(event.target.value))}
                  className="mt-2 h-10 w-full rounded-lg border border-line bg-white px-3"
                >
                  {[1, 2, 3, 4].map((count) => (
                    <option key={count} value={count}>
                      {count} reels
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-ink">Channel Playbooks</h2>
              <p className="mt-1 text-sm text-neutral-500">Reusable operating rules for each niche.</p>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {selectedChannels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
            <div>
              <h2 className="text-lg font-semibold text-ink">Production-Ready Reel Briefs</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Each card includes visible captions, hashtags, prompts, storyboard, voiceover, CTA, and edit notes.
              </p>
            </div>
            <span className="rounded-md bg-moss px-3 py-1 text-sm font-medium text-white">{briefs.length} briefs ready</span>
          </div>
          {generationStep !== null ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-line bg-white shadow-inner">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-coral" />
              <div className="flex flex-col items-center gap-2">
                {steps.map((step, index) => (
                  <p
                    key={step}
                    className={`text-sm font-medium transition-all duration-500 ${
                      index === generationStep
                        ? "text-ink scale-110"
                        : index < generationStep
                        ? "text-moss"
                        : "text-neutral-300"
                    }`}
                  >
                    {step} {index < generationStep && "✓"}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <BriefCardGrid briefs={briefs} onSelect={setSelectedBrief} />
          )}
        </section>

        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-ink">Assembly Line Summary</h2>
            <p className="mt-1 text-sm text-neutral-500">Compact calendar view for posting and production handoff.</p>
          </div>
          <PipelineTable briefs={briefs} onSelect={setSelectedBrief} />
        </section>

        <div className="mt-6">
          <AnalyticsPanel briefs={briefs} />
        </div>
      </div>
      <BriefDetailPanel
        brief={selectedBrief}
        onClose={() => setSelectedBrief(null)}
        onStatusChange={handleStatusChange}
      />
    </main>
  );
}
