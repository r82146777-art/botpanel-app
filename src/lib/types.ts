export type Platform = "telegram" | "rubika" | "soroush" | "bale";
export type BotStatus = "active" | "inactive" | "error";
export type MatchType = "exact" | "contains" | "regex";

export interface Schedule {
  is24h: boolean;
  start: string; // HH:MM
  end: string;   // HH:MM
}

export interface Bot {
  id: string;
  name: string;
  platform: Platform;
  token: string;
  description: string;
  status: BotStatus;
  createdAt: string;
  adminIds: string[];       // empty = everyone
  code: string;             // bot logic / script
  welcomeMessage: string;   // optional
  schedule: Schedule;
  autoReplies: AutoReply[];
  messageLogs: MessageLog[];
}

export interface AutoReply {
  id: string;
  keyword: string;
  response: string;
  matchType: MatchType;
  isActive: boolean;
}

export interface MessageLog {
  id: string;
  direction: "incoming" | "outgoing";
  senderName: string;
  content: string;
  timestamp: string;
}

export interface PlatformConfig {
  platform: Platform;
  webhookUrl: string;
  apiConnected: boolean;
  apiKey: string;
}

export interface AppData {
  bots: Bot[];
  platformConfigs: PlatformConfig[];
  serverUrl: string;
}

export interface BackupData {
  version: string;
  exportDate: string;
  bots: Bot[];
  platformConfigs: PlatformConfig[];
  serverUrl: string;
}
