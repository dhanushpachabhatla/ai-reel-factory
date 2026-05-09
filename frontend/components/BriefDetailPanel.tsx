import { CalendarDays, Clapperboard, Hash, Megaphone, Mic2, Wand2, X, CheckCircle, XCircle } from "lucide-react";
import { channels } from "@/lib/data";
import { ReelBrief, ContentStatus } from "@/lib/types";
import { MockVideoPlayer } from "@/components/MockVideoPlayer";

type BriefDetailPanelProps = {
  brief: ReelBrief | null;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: ContentStatus) => void;
};

export function BriefDetailPanel({ brief, onClose, onStatusChange }: BriefDetailPanelProps) {
  if (!brief) return null;

  const getStatusColor = (status: string) => {
    if (status === "Approved") return "bg-moss text-white";
    if (status === "Rejected") return "bg-coral text-white";
    if (status === "Generated") return "bg-cobalt text-white";
    return "bg-paper text-neutral-700 border border-line";
  };

  const channel = channels.find((item) => item.id === brief.channelId);

  return (
    <div className="fixed inset-0 z-50 bg-ink/35 px-4 py-5 backdrop-blur-sm">
      <aside className="ml-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-soft">
        <div className="border-b border-line p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-coral">{channel?.name ?? brief.channelId}</p>
              <h2 className="mt-1 text-2xl font-semibold text-ink">{brief.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-md bg-cobalt px-2 py-1 font-medium text-white">{brief.format}</span>
                <span className={`rounded-md px-2 py-1 ${getStatusColor(brief.status)}`}>{brief.status}</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-paper px-2 py-1 text-neutral-700">
                  <CalendarDays size={13} />
                  {brief.scheduledDate}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-white text-neutral-600"
              aria-label="Close brief"
            >
              <X size={18} />
            </button>
          </div>
          {onStatusChange && (
            <div className="mt-4 flex gap-3 border-t border-line pt-4">
              <button
                onClick={() => {
                  onStatusChange(brief.id, "Approved");
                  onClose();
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-moss px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-moss/90"
              >
                <CheckCircle size={18} />
                Approve for Production
              </button>
              <button
                onClick={() => {
                  onStatusChange(brief.id, "Rejected");
                  onClose();
                }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-coral px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-coral/90"
              >
                <XCircle size={18} />
                Reject & Regenerate
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            {/* Left: Mock Video Player */}
            <div className="hidden lg:block">
              <div className="sticky top-0">
                <MockVideoPlayer brief={brief} />
              </div>
            </div>

            {/* Right: Brief Details */}
            <div className="flex flex-col">
          <section className="rounded-lg border border-line bg-paper p-4">
            <p className="text-sm font-semibold text-ink">Hook</p>
            <p className="mt-2 text-lg font-medium leading-7 text-ink">{brief.hook}</p>
          </section>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <section className="rounded-lg border border-line p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Mic2 size={17} />
                Voiceover
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-700">{brief.voiceover || brief.script}</p>
            </section>

            <section className="rounded-lg border border-line p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Megaphone size={17} />
                CTA
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-700">{brief.cta || "Save this for later."}</p>
            </section>
          </div>

          <section className="mt-5 rounded-lg border border-line p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Clapperboard size={17} />
              Scene-By-Scene Storyboard
            </div>
            <div className="mt-3 grid gap-2">
              {(brief.storyboard.length ? brief.storyboard : ["0-2s: Hook", "2-20s: Explain", "20-30s: CTA"]).map((scene) => (
                <p key={scene} className="rounded-md bg-paper px-3 py-2 text-sm text-neutral-700">
                  {scene}
                </p>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-lg border border-line p-4">
            <p className="text-sm font-semibold text-ink">Full Script</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-neutral-700">{brief.script}</p>
          </section>

          <section className="mt-5 rounded-lg border border-line p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Wand2 size={17} />
              Image / Video Generation Prompts
            </div>
            <div className="mt-3 grid gap-2">
              {brief.visualPrompts.map((prompt) => (
                <p key={prompt} className="rounded-md bg-paper px-3 py-2 text-sm text-neutral-700">
                  {prompt}
                </p>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-lg border border-line p-4">
            <p className="text-sm font-semibold text-ink">Editing Instructions</p>
            <p className="mt-3 text-sm leading-6 text-neutral-700">{brief.editingNotes}</p>
          </section>

          <section className="mt-5 rounded-lg border border-line p-4">
            <p className="text-sm font-semibold text-ink">Caption</p>
            <p className="mt-3 text-sm leading-6 text-neutral-700">{brief.caption}</p>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-ink">
              <Hash size={17} />
              Hashtags
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {brief.hashtags.map((tag) => (
                <span key={tag} className="rounded-md bg-ink px-2 py-1 text-xs font-medium text-white">
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
