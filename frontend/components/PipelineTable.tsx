import { channels } from "@/lib/data";
import { ReelBrief } from "@/lib/types";

export function PipelineTable({ briefs, onSelect }: { briefs: ReelBrief[], onSelect?: (brief: ReelBrief) => void }) {
  const getStatusColor = (status: string) => {
    if (status === "Approved") return "bg-moss text-white";
    if (status === "Rejected") return "bg-coral text-white";
    if (status === "Generated") return "bg-cobalt text-white";
    return "bg-base text-muted border border-line";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-line glass shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <thead className="bg-base border-b border-line text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Channel</th>
              <th className="px-4 py-3 font-medium">Reel</th>
              <th className="px-4 py-3 font-medium">Hook</th>
              <th className="px-4 py-3 font-medium">Caption / Hashtags</th>
              <th className="px-4 py-3 font-medium">Format</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {briefs.map((brief) => {
              const channel = channels.find((item) => item.id === brief.channelId);
              return (
                <tr key={brief.id} className="border-t border-line align-top hover:bg-base/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-muted">{channel?.name ?? brief.channelId}</td>
                  <td className="max-w-[220px] px-4 py-3 font-bold text-ink">{brief.title}</td>
                  <td className="max-w-[340px] px-4 py-3 text-ink/80">{brief.hook}</td>
                  <td className="max-w-[300px] px-4 py-3">
                    <p className="line-clamp-2 text-ink/80">{brief.caption}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {brief.hashtags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-md bg-base border border-line px-2 py-1 text-xs text-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-muted">{brief.format}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-1 text-xs font-bold shadow-sm ${getStatusColor(brief.status)}`}>{brief.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{brief.scheduledDate}</td>
                  <td className="px-4 py-3">
                    {onSelect && (
                      <button
                        onClick={() => onSelect(brief)}
                        className="inline-flex h-8 items-center justify-center rounded-md bg-base px-3 text-xs font-semibold text-ink border border-line hover:bg-elevated transition-colors shadow-sm"
                      >
                        View Brief
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
