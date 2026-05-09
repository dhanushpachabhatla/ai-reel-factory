from datetime import date, timedelta
from time import time_ns

from app.schemas import Channel, ReelBrief

FORMATS = ["Myth bust", "Contrarian take", "Checklist", "Mini story", "Before/after"]


def generate_mock_briefs(channels: list[Channel], reels_per_channel: int) -> list[ReelBrief]:
    briefs: list[ReelBrief] = []
    today = date.today()

    for channel in channels:
        for index in range(reels_per_channel):
            pillar = channel.contentPillars[index % len(channel.contentPillars)] if channel.contentPillars else channel.niche
            reel_format = FORMATS[index % len(FORMATS)]
            briefs.append(
                ReelBrief(
                    id=f"{channel.id}-{time_ns()}-{index}",
                    channelId=channel.id,
                    title=f"{reel_format}: {pillar}",
                    hook=f"Most people misunderstand {pillar}. Here is the simpler version.",
                    script=(
                        f"Start with a fast pattern interrupt about {pillar}. Explain the common mistake "
                        f"in one sentence. Show the better model with three crisp points. End with a "
                        f"practical takeaway that fits {channel.audience}."
                    ),
                    voiceover=(
                        f"Most people misunderstand {pillar}. Here is the simpler version. First, name the "
                        "mistake. Second, show the better model. Third, give one action viewers can use today."
                    ),
                    storyboard=[
                        "0-2s: Pattern interrupt with bold hook text.",
                        "2-8s: Show the common mistake with fast visual contrast.",
                        "8-22s: Break down three proof points with captions.",
                        "22-30s: End on practical takeaway and CTA.",
                    ],
                    visualPrompts=[
                        f"{channel.visualStyle} opening frame for {pillar}",
                        f"Three-step visual breakdown for {pillar}",
                        "Final checklist frame with one practical takeaway",
                    ],
                    editingNotes=(
                        f"Use {channel.tone} pacing. Cut every 1.5 seconds, add subtitles, and highlight "
                        "the key phrase in each sentence."
                    ),
                    caption=f"{pillar} gets easier when the system is clear.",
                    hashtags=[f"#{channel.niche.split()[0].lower()}", "#shortform", "#aitools"],
                    cta="Save this and test the framework on your next piece of content.",
                    status="Script",
                    scheduledDate=(today + timedelta(days=index + 1)).isoformat(),
                    format=reel_format,
                )
            )

    return briefs
