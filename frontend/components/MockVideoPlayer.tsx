import React, { useEffect, useState } from "react";
import { ReelBrief } from "@/lib/types";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";

export function MockVideoPlayer({ brief }: { brief: ReelBrief }) {
  const [captionIndex, setCaptionIndex] = useState(0);

  // Simple mock captions splitting
  const captions = brief.script.split(/(?<=[.?!])\s+/).filter(Boolean);
  const displayCaptions = captions.length > 0 ? captions : ["AI Generated Output", brief.hook];

  useEffect(() => {
    const interval = setInterval(() => {
      setCaptionIndex((prev) => (prev + 1) % displayCaptions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [displayCaptions.length]);

  return (
    <div className="relative h-[640px] w-[360px] overflow-hidden rounded-[24px] border-[6px] border-neutral-900 bg-black shadow-2xl">
      {/* Dynamic Background */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-800">
        <div className="px-6 text-center text-sm font-medium tracking-wide text-white/40">
          [Visual: {brief.visualPrompts[0] || "AI Generated Scene"}]
        </div>
      </div>

      {/* Top Pill */}
      <div className="absolute left-1/2 top-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/50 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
        <div className="h-2 w-2 animate-pulse rounded-full bg-coral"></div>
        AI Generated Output
      </div>

      {/* Animated Captions */}
      <div className="absolute bottom-[130px] left-0 w-full px-5 text-center z-10">
        <div
          key={captionIndex}
          className="animate-in fade-in zoom-in slide-in-from-bottom-2 inline-block text-2xl font-extrabold uppercase text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] duration-500"
          style={{ textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}
        >
          {displayCaptions[captionIndex]}
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="absolute bottom-[90px] right-3 flex flex-col items-center gap-5 z-20">
        <div className="flex flex-col items-center gap-1 text-white">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-sm">
            <Heart size={20} fill="white" />
          </div>
          <span className="text-[11px] font-medium drop-shadow-md">24.5K</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-white">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-sm">
            <MessageCircle size={20} fill="white" />
          </div>
          <span className="text-[11px] font-medium drop-shadow-md">128</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-white">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-sm">
            <Bookmark size={20} fill="white" />
          </div>
          <span className="text-[11px] font-medium drop-shadow-md">1.2K</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-white">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur-sm">
            <Share2 size={20} fill="white" />
          </div>
          <span className="text-[11px] font-medium drop-shadow-md">Share</span>
        </div>
      </div>

      {/* Bottom Details Overlay */}
      <div className="absolute bottom-4 left-4 right-[60px] z-20 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-coral text-xs font-bold text-white">
            {brief.channelId.substring(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-white drop-shadow-md">@{brief.channelId.replace(/\s+/g, '_')}</span>
        </div>
        <p className="line-clamp-2 text-[13px] leading-tight text-neutral-200 drop-shadow-md">
          {brief.caption}
        </p>
        <div className="flex flex-wrap gap-1">
          {brief.hashtags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[13px] font-semibold text-white drop-shadow-md">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-white/30 z-30">
        <div
          key={captionIndex}
          className="h-full bg-white animate-in slide-in-from-left duration-[3000ms] ease-linear"
        />
      </div>
    </div>
  );
}
