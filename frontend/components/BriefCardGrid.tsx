import { Eye, Hash, MessageSquareText } from "lucide-react";
import { channels } from "@/lib/data";
import { ReelBrief } from "@/lib/types";

type BriefCardGridProps = {
  briefs: ReelBrief[];
  onSelect: (brief: ReelBrief) => void;
};

export function BriefCardGrid({ briefs, onSelect }: BriefCardGridProps) {
  const getStatusColor = (status: string) => {
    if (status === "Approved") return "bg-moss text-white";
    if (status === "Rejected") return "bg-coral text-white";
    if (status === "Generated") return "bg-cobalt text-white";
    return "bg-paper text-neutral-700 border border-line";
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      {briefs.map((brief) => {
        const channel = channels.find((item) => item.id === brief.channelId);
        return (
          <article key={brief.id} className="rounded-lg border border-line bg-white p-4 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-coral">{channel?.name ?? brief.channelId}</p>
                <h3 className="mt-2 text-lg font-semibold leading-6 text-ink">{brief.title}</h3>
              </div>
              <span className={`rounded-md px-2 py-1 text-xs font-medium ${getStatusColor(brief.status)}`}>{brief.status}</span>
            </div>
            <p className="mt-3 text-sm font-medium leading-6 text-neutral-800">{brief.hook}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {brief.hashtags.slice(0, 4).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs text-neutral-600">
                  <Hash size={12} />
                  {tag.replace("#", "")}
                </span>
              ))}
            </div>
            <div className="mt-4 rounded-lg bg-paper p-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <MessageSquareText size={14} />
                Caption
              </div>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-700">{brief.caption}</p>
            </div>
            <button
              onClick={() => onSelect(brief)}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-ink px-3 text-sm font-semibold text-white"
            >
              <Eye size={17} />
              View Brief
            </button>
          </article>
        );
      })}
    </div>
  );
}
