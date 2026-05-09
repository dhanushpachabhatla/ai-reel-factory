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
import { ThemeToggle } from "@/components/ThemeToggle";
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
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
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

  async function handleStatusChange(id: string, newStatus: ContentStatus) {
    if (newStatus === "Rejected") {
      setRegeneratingId(id);
      const briefToRegen = briefs.find((b) => b.id === id);
      const channel = channels.find((c) => c.id === briefToRegen?.channelId);

      let newBriefData: Partial<ReelBrief> | null = null;

      if (channel) {
        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
          const response = await fetch(`${apiBaseUrl}/generate/batch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ channels: [channel], reelsPerChannel: 1 })
          });
          if (response.ok) {
            const data = (await response.json()) as { briefs: ReelBrief[] };
            if (data.briefs && data.briefs.length > 0) {
              newBriefData = data.briefs[0];
            }
          }
        } catch (error) {
          console.error("Regeneration failed", error);
        }
      }

      setBriefs((prev) =>
        prev.map((b) => {
          if (b.id === id) {
            const vMatch = b.title.match(/V(\d+)/);
            const nextV = vMatch ? parseInt(vMatch[1]) + 1 : 2;
            
            // Use real backend data if available, otherwise fallback to mock
            const updatedBrief: ReelBrief = newBriefData
              ? {
                  ...(newBriefData as ReelBrief),
                  id: b.id, // keep the same ID
                  title: newBriefData.title.replace(/\s*\(V\d+\)/, "") + ` (V${nextV})`,
                  status: "Generated"
                }
              : {
                  ...b,
                  status: "Generated",
                  hook: `[REGENERATED] Let's try a totally new angle. This is a fresh hook.`,
                  script: `[REGENERATED] We rewrote the script based on your rejection. The pacing is faster, the visual cues are clearer, and the CTA is stronger.`,
                  voiceover: `[REGENERATED] Let's try a totally new angle. This is a fresh hook. We rewrote the script. The pacing is faster.`,
                  title: b.title.replace(/\s*\(V\d+\)/, "") + ` (V${nextV})`
                };
                
            setSelectedBrief((curr) => (curr?.id === id ? updatedBrief : curr));
            return updatedBrief;
          }
          return b;
        })
      );
      setRegeneratingId(null);
    } else {
      setBriefs((prev) => prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
      setSelectedBrief((prev) => (prev?.id === id ? { ...prev, status: newStatus } : prev));
    }
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
    <main className="min-h-screen bg-base">
      <section className="border-b border-line bg-elevated/50 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg gradient-primary text-white shadow-soft">
                <Factory size={22} aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-coral">Matiks assignment prototype</p>
                <h1 className="text-2xl font-bold text-ink md:text-3xl">AI Reel Factory</h1>
              </div>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted md:text-base">
              One operator can generate multi-channel reel briefs, move them through a production pipeline,
              export a posting calendar, and feed analytics back into the next batch.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <ThemeToggle />
            <button
              onClick={generateBatch}
              disabled={generationStep !== null}
              className="inline-flex h-11 items-center gap-2 rounded-lg gradient-primary px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generationStep !== null ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Generate Batch
            </button>
            <button
              onClick={exportCsv}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-elevated px-4 text-sm font-semibold text-ink hover:bg-base transition-colors"
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

        <section className="mt-6 rounded-2xl border border-line glass p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">Batch Controls</h2>
              <p className="mt-1 text-sm text-muted">Simulate the exact Matiks scale equation.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-ink">
                Channels
                <select
                  value={selectedCount}
                  onChange={(event) => setSelectedCount(Number(event.target.value))}
                  className="mt-2 h-10 w-full rounded-lg border border-line bg-elevated px-3 shadow-sm transition-colors focus:border-cobalt focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 10].filter((count) => count <= channels.length).map((count) => (
                    <option key={count} value={count}>
                      {count} channels
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-semibold text-ink">
                Reels per channel
                <select
                  value={reelsPerChannel}
                  onChange={(event) => setReelsPerChannel(Number(event.target.value))}
                  className="mt-2 h-10 w-full rounded-lg border border-line bg-elevated px-3 shadow-sm transition-colors focus:border-cobalt focus:outline-none"
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
              <h2 className="text-lg font-bold text-ink">Channel Playbooks</h2>
              <p className="mt-1 text-sm text-muted">Reusable operating rules for each niche.</p>
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
              <h2 className="text-lg font-bold text-ink">Production-Ready Reel Briefs</h2>
              <p className="mt-1 text-sm text-muted">
                Each card includes visible captions, hashtags, prompts, storyboard, voiceover, CTA, and edit notes.
              </p>
            </div>
            <span className="rounded-full bg-moss/20 border border-moss/30 px-3 py-1 text-sm font-bold text-moss shadow-sm">{briefs.length} briefs ready</span>
          </div>
          <BriefCardGrid briefs={briefs} onSelect={setSelectedBrief} />
        </section>

        <section className="mt-6">
            <div>
              <h2 className="text-lg font-bold text-ink">Assembly Line Summary</h2>
              <p className="mt-1 text-sm text-muted">Compact calendar view for posting and production handoff.</p>
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
        isRegenerating={regeneratingId === selectedBrief?.id}
      />

      {/* Full-screen Generation Modal */}
      {generationStep !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-md animate-fade-in">
          <div className="flex w-full max-w-md flex-col items-center justify-center rounded-3xl bg-elevated p-10 shadow-soft border border-line">
            <Loader2 className="mb-8 h-12 w-12 animate-spin text-cobalt" />
            <div className="flex w-full flex-col gap-4">
              {steps.map((step, index) => {
                const isActive = index === generationStep;
                const isPast = index < generationStep;
                return (
                  <div key={step} className="flex items-center gap-4">
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors duration-500 ${
                        isActive
                          ? "bg-cobalt text-white shadow-md scale-110"
                          : isPast
                          ? "bg-moss text-white"
                          : "bg-base border border-line text-muted"
                      }`}
                    >
                      {isPast ? "✓" : index + 1}
                    </div>
                    <p
                      className={`text-base font-semibold transition-all duration-500 ${
                        isActive ? "text-cobalt scale-105" : isPast ? "text-ink" : "text-muted"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
