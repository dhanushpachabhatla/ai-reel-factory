import { Channel } from "@/lib/types";

export function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <article className="rounded-xl border border-line glass p-5 shadow-sm card-hover">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-ink">{channel.name}</h3>
          <p className="mt-1 text-sm font-semibold text-coral">{channel.niche}</p>
        </div>
        <div className="inline-flex shrink-0 items-center justify-center rounded-full bg-base border border-line px-3 py-1.5 text-xs font-bold text-cobalt shadow-sm whitespace-nowrap">
          {channel.postingFrequency}
        </div>
      </div>
      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Audience</p>
          <p className="mt-1 text-sm leading-6 text-ink/90">{channel.audience}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Core Content Pillars</p>
          <ul className="mt-2 space-y-1">
            {channel.contentPillars.map((pillar) => (
              <li key={pillar} className="flex items-start gap-2 text-sm leading-6 text-ink/90">
                <span className="mt-2 flex h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt/50"></span>
                {pillar}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Style & Tone</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-md bg-base border border-line px-2 py-1 text-xs font-semibold text-ink/80">
              {channel.visualStyle}
            </span>
            <span className="rounded-md bg-base border border-line px-2 py-1 text-xs font-semibold text-ink/80">
              {channel.tone}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
