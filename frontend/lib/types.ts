export type Channel = {
  id: string;
  name: string;
  niche: string;
  audience: string;
  tone: string;
  contentPillars: string[];
  visualStyle: string;
  forbiddenTopics: string[];
  postingFrequency: string;
};

export type ContentStatus = "Idea" | "Script" | "Generated" | "Approved" | "Rejected" | "Edited" | "Scheduled" | "Posted";

export type ReelBrief = {
  id: string;
  channelId: string;
  title: string;
  hook: string;
  script: string;
  voiceover: string;
  storyboard: string[];
  visualPrompts: string[];
  editingNotes: string;
  caption: string;
  hashtags: string[];
  cta: string;
  status: ContentStatus;
  scheduledDate: string;
  format: string;
};

export type AnalyticsRecord = {
  contentId: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  avgWatchTime: number;
};

export type GenerateRequest = {
  channels: Channel[];
  reelsPerChannel: number;
};
