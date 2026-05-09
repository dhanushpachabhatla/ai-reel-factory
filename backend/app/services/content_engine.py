from app.core.config import Settings
from app.schemas import AnalyticsRecord, Channel, ReelBrief
from app.services.gemini_service import generate_with_gemini, recommend_with_gemini
from app.services.mock_generator import generate_mock_briefs
from app.services.scoring import performance_label, performance_score


def generate_batch(settings: Settings, channels: list[Channel], reels_per_channel: int) -> tuple[str, list[ReelBrief], list[str]]:
    if not settings.gemini_api_keys:
        return "mock", generate_mock_briefs(channels, reels_per_channel), []

    errors: list[str] = []
    for index, api_key in enumerate(settings.gemini_api_keys, start=1):
        try:
            return (
                f"gemini-key-{index}:{settings.gemini_model}",
                generate_with_gemini(api_key, settings.gemini_model, channels, reels_per_channel),
                [],
            )
        except Exception as error:
            errors.append(f"key-{index}: {type(error).__name__}: {str(error)[:220]}")
            continue

    return "fallback", generate_mock_briefs(channels, reels_per_channel), errors


def recommend_next_batch(settings: Settings, briefs: list[ReelBrief], analytics: list[AnalyticsRecord]) -> tuple[str, list[str]]:
    scored = [
        {
            **record.model_dump(),
            "score": performance_score(record),
            "label": performance_label(performance_score(record)),
        }
        for record in analytics
    ]

    for index, api_key in enumerate(settings.gemini_api_keys, start=1):
        try:
            return (
                f"gemini-key-{index}:{settings.gemini_model}",
                recommend_with_gemini(api_key, settings.gemini_model, briefs, scored),
            )
        except Exception:
            continue

    winner_ids = {item["contentId"] for item in scored if item["label"] in {"Winner", "Promising"}}
    winning_briefs = [brief for brief in briefs if brief.id in winner_ids]
    formats = sorted({brief.format for brief in winning_briefs or briefs})
    channels = sorted({brief.channelId for brief in briefs})
    return (
        "fallback",
        [
            f"Reuse strongest formats across {len(channels)} channels: {', '.join(formats[:4])}.",
            "Generate the next batch from hooks with concrete tension, not generic curiosity.",
            "Prioritize shareable formats: myth busts, mistake lists, and contrarian frameworks.",
            "Move low-confidence ideas back to research instead of sending them to editing.",
        ],
    )
