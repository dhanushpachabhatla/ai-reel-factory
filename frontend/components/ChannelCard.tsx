import { Channel } from "@/lib/types";

export function ChannelCard({ channel }: { channel: Channel }) {
  return (
    <article className="rounded-lg border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-ink">{channel.name}</h3>
          <p className="mt-1 text-sm text-neutral-500">{channel.niche}</p>
        </div>
        <span className="rounded-md bg-moss px-2 py-1 text-xs font-medium text-white">{channel.postingFrequency}</span>
      </div>
      <p className="mt-4 text-sm leading-6 text-neutral-700">{channel.audience}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {channel.contentPillars.map((pillar) => (
          <span key={pillar} className="rounded-md border border-line px-2 py-1 text-xs text-neutral-600">
            {pillar}
          </span>
        ))}
      </div>
    </article>
  );
}
