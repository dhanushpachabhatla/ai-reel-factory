import { Channel, ReelBrief } from "./types";

const formats = ["Myth bust", "Contrarian take", "Checklist", "Mini story", "Before/after"];

export function mockGenerate(channels: Channel[], reelsPerChannel: number): ReelBrief[] {
  return channels.flatMap((channel) =>
    Array.from({ length: reelsPerChannel }, (_, index) => {
      const pillar = channel.contentPillars[index % channel.contentPillars.length];
      const format = formats[index % formats.length];
      return {
        id: `${channel.id}-${Date.now()}-${index}`,
        channelId: channel.id,
        title: `${format}: ${pillar}`,
        hook: `Most people misunderstand ${pillar}. Here is the simpler version.`,
        script: `Start with a fast pattern interrupt about ${pillar}. Explain the common mistake in one sentence. Show the better model with three crisp points. End with a practical takeaway that fits ${channel.audience}.`,
        voiceover: `Most people misunderstand ${pillar}. Here is the simpler version. First, spot the mistake. Then use the better model. Finally, save this framework before creating your next reel.`,
        storyboard: [
          "0-2s: Bold hook text with fast visual interruption.",
          "2-8s: Show the common mistake.",
          "8-22s: Explain three points with kinetic captions.",
          "22-30s: Practical takeaway and save CTA."
        ],
        visualPrompts: [
          `${channel.visualStyle} opening frame for ${pillar}`,
          `Three-step visual breakdown for ${pillar}`,
          `Final checklist frame with one practical takeaway`
        ],
        editingNotes: `Use ${channel.tone} pacing. Cut every 1.5 seconds, add subtitles, and highlight the key phrase in each sentence.`,
        caption: `${pillar} gets easier when the system is clear.`,
        hashtags: [`#${channel.niche.split(" ")[0].toLowerCase()}`, "#shortform", "#aitools"],
        cta: "Save this and use it before your next content batch.",
        status: "Script",
        scheduledDate: new Date(Date.now() + (index + 1) * 86400000).toISOString().slice(0, 10),
        format
      };
    })
  );
}
