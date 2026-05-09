import json
import re
from datetime import date, timedelta
from time import time_ns

import google.generativeai as genai

from app.schemas import Channel, ReelBrief


def _extract_json_array(text: str) -> list[dict]:
    match = re.search(r"\[[\s\S]*\]", text)
    if not match:
        raise ValueError("Gemini returned no JSON array")
    data = json.loads(match.group(0))
    if not isinstance(data, list):
        raise ValueError("Gemini response was not a JSON array")
    return data


def _string_list(value: object) -> list[str]:
    if not isinstance(value, list):
        return []

    normalized: list[str] = []
    for item in value:
        if isinstance(item, str):
            normalized.append(item)
        elif isinstance(item, dict):
            parts = [str(part) for part in item.values() if part]
            normalized.append(" - ".join(parts))
        elif item:
            normalized.append(str(item))

    return normalized


def generate_with_gemini(api_key: str, model_name: str, channels: list[Channel], reels_per_channel: int) -> list[ReelBrief]:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)
    prompt = f"""
You are an AI-first short-form content operations system.
Generate {reels_per_channel} Instagram reel briefs for each channel.
Return only a valid JSON array. Do not include markdown.

Each item must include:
channelId, title, hook, script, voiceover, storyboard, visualPrompts, editingNotes, caption, hashtags, cta, format.

Operational quality rules:
- Hooks should be high-retention and specific.
- Scripts should be 80-130 words.
- Voiceover should be ready to paste into ElevenLabs or another TTS tool.
- Storyboard should be 4-6 timestamped scenes.
- Visual prompts should be usable by video/image generation tools.
- Avoid forbidden topics for each channel.
- Make each channel feel distinct.

Channels:
{json.dumps([channel.model_dump() for channel in channels], indent=2)}
"""
    response = model.generate_content(prompt)
    parsed = _extract_json_array(response.text)
    today = date.today()

    return [
        ReelBrief(
            id=f"gemini-{time_ns()}-{index}",
            channelId=item["channelId"],
            title=item["title"],
            hook=item["hook"],
            script=item["script"],
            voiceover=item.get("voiceover", item["script"]),
            storyboard=_string_list(item.get("storyboard", [])),
            visualPrompts=_string_list(item.get("visualPrompts", [])),
            editingNotes=item["editingNotes"],
            caption=item["caption"],
            hashtags=item.get("hashtags", []),
            cta=item.get("cta", "Save this for later."),
            status="Script",
            scheduledDate=(today + timedelta(days=(index // max(len(channels), 1)) + 1)).isoformat(),
            format=item["format"],
        )
        for index, item in enumerate(parsed)
    ]


def recommend_with_gemini(api_key: str, model_name: str, briefs: list[ReelBrief], analytics: list[dict]) -> list[str]:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)
    prompt = f"""
You are the analytics brain for an AI short-form content factory.
Given generated reel briefs and performance analytics, recommend the next production batch.
Return only a valid JSON array of 4-6 concise recommendations. No markdown.

Focus on:
- winning hooks and formats
- what to repeat
- what to pause
- what to change in scripts/visuals
- what the operator should do next

Briefs:
{json.dumps([brief.model_dump() for brief in briefs], indent=2)}

Analytics:
{json.dumps(analytics, indent=2)}
"""
    response = model.generate_content(prompt)
    data = _extract_json_array(response.text)
    return [str(item) for item in data]
