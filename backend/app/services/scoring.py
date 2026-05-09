from app.schemas import AnalyticsRecord


def performance_score(record: AnalyticsRecord) -> int:
    engagement = record.likes + record.comments * 2 + record.shares * 4 + record.saves * 3
    engagement_rate = engagement / record.views if record.views else 0
    return round(record.avgWatchTime * 0.55 + engagement_rate * 1000 * 0.45)


def performance_label(score: int) -> str:
    if score >= 85:
        return "Winner"
    if score >= 65:
        return "Promising"
    if score >= 45:
        return "Average"
    return "Pause"
