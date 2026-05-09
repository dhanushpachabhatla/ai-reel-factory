import { CalendarDays, Clapperboard, Hash, Megaphone, Mic2, Wand2, X, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { channels } from "@/lib/data";
import { ReelBrief, ContentStatus } from "@/lib/types";
import { MockVideoPlayer } from "@/components/MockVideoPlayer";

type BriefDetailPanelProps = {
  brief: ReelBrief | null;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: ContentStatus) => void;
  isRegenerating?: boolean;
};

export function BriefDetailPanel({ brief, onClose, onStatusChange, isRegenerating }: BriefDetailPanelProps) {
  if (!brief) return null;

  const getStatusColor = (status: string) => {
    if (status === "Approved") return "bg-moss text-white";
    if (status === "Rejected") return "bg-coral text-white";
    if (status === "Generated") return "bg-cobalt text-white";
    return "bg-base border border-line text-muted";
  };

  const channel = channels.find((item) => item.id === brief.channelId);

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 px-4 py-5 backdrop-blur-md animate-fade-in">
      <aside className="ml-auto relative flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-elevated shadow-soft border border-line animate-slide-up">
        
        {/* Regenerating Overlay */}
        {isRegenerating && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-elevated/80 backdrop-blur-md">
            <Loader2 className="h-12 w-12 animate-spin text-cobalt" />
            <p className="mt-4 text-xl font-bold text-ink">Regenerating Brief...</p>
            <p className="mt-1 text-base text-muted">AI is writing a new hook and script.</p>
          </div>
        )}

        <div className="border-b border-line p-6 bg-base">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-coral">{channel?.name ?? brief.channelId}</p>
              <h2 className="mt-1 text-2xl font-bold text-ink">{brief.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-md bg-cobalt px-2 py-1 text-white shadow-sm">{brief.format}</span>
                <span className={`rounded-md px-2 py-1 shadow-sm ${getStatusColor(brief.status)}`}>{brief.status}</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-elevated border border-line px-2 py-1 text-muted shadow-sm">
                  <CalendarDays size={13} />
                  {brief.scheduledDate}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-muted hover:bg-base hover:text-ink transition-colors"
              aria-label="Close brief"
            >
              <X size={20} />
            </button>
          </div>
          {onStatusChange && brief.status !== "Approved" && (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  onStatusChange(brief.id, "Approved");
                  onClose();
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-moss px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-moss/90 hover:-translate-y-0.5"
              >
                <CheckCircle size={18} />
                Approve for Production
              </button>
              <button
                onClick={() => {
                  onStatusChange(brief.id, "Rejected");
                }}
                disabled={isRegenerating}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-coral px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-coral/90 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              >
                <XCircle size={18} />
                Reject & Regenerate
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-elevated">
          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
            {/* Left: Mock Video Player */}
            <div className="hidden lg:block">
              <div className="sticky top-0 rounded-2xl glass p-4">
                <h3 className="mb-4 text-xs font-bold text-muted uppercase tracking-wider text-center">Video Preview</h3>
                <MockVideoPlayer brief={brief} />
              </div>
            </div>

            {/* Right: Brief Details */}
            <div className="flex flex-col gap-6">
              <section className="rounded-xl border border-line bg-base p-5 shadow-sm">
                <p className="text-sm font-bold text-cobalt flex items-center gap-2">
                   <Megaphone size={16} /> Hook
                </p>
                <p className="mt-2 text-lg font-bold leading-7 text-ink">{brief.hook}</p>
              </section>

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-xl border border-line glass p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-bold text-cobalt">
                    <Mic2 size={16} />
                    Voiceover
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink/90">{brief.voiceover || brief.script}</p>
                </section>

                <section className="rounded-xl border border-line glass p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-bold text-cobalt">
                    <Megaphone size={16} />
                    CTA
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink/90">{brief.cta || "Save this for later."}</p>
                </section>
              </div>

              <section className="rounded-xl border border-line glass p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-cobalt">
                  <Clapperboard size={16} />
                  Scene-By-Scene Storyboard
                </div>
                <div className="mt-4 grid gap-2">
                  {(brief.storyboard.length ? brief.storyboard : ["0-2s: Hook", "2-20s: Explain", "20-30s: CTA"]).map((scene) => (
                    <p key={scene} className="rounded-md bg-base border border-line/50 px-3 py-2 text-sm text-ink/80">
                      {scene}
                    </p>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-line glass p-5 shadow-sm">
                <p className="text-sm font-bold text-cobalt">Full Script</p>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink/90">{brief.script}</p>
              </section>

              <section className="rounded-xl border border-line glass p-5 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-cobalt">
                  <Wand2 size={16} />
                  Image / Video Generation Prompts
                </div>
                <div className="mt-4 grid gap-2">
                  {brief.visualPrompts.map((prompt) => (
                    <p key={prompt} className="rounded-md bg-base border border-line/50 px-3 py-2 text-sm text-ink/80">
                      {prompt}
                    </p>
                  ))}
                </div>
              </section>

              <section className="rounded-xl border border-line glass p-5 shadow-sm">
                <p className="text-sm font-bold text-cobalt">Editing Instructions</p>
                <p className="mt-3 text-sm leading-6 text-ink/90">{brief.editingNotes}</p>
              </section>

              <section className="rounded-xl border border-line glass p-5 shadow-sm">
                <p className="text-sm font-bold text-cobalt">Caption</p>
                <p className="mt-3 text-sm leading-6 text-ink/90">{brief.caption}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-cobalt">
                  <Hash size={16} />
                  Hashtags
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {brief.hashtags.map((tag) => (
                    <span key={tag} className="rounded-md gradient-primary px-2 py-1 text-xs font-bold text-white shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
