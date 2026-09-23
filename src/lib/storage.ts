import type { AppData, Bot, AutoReply, MessageLog, PlatformConfig, BackupData } from "./types";

const STORAGE_KEY = "botpanel_data";

const defaultData: AppData = {
  bots: [],
  platformConfigs: [
    { platform: "telegram", webhookUrl: "", apiConnected: false, apiKey: "" },
    { platform: "rubika", webhookUrl: "", apiConnected: false, apiKey: "" },
    { platform: "soroush", webhookUrl: "", apiConnected: false, apiKey: "" },
    { platform: "bale", webhookUrl: "", apiConnected: false, apiKey: "" },
  ],
  serverUrl: "",
};

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultData };
    const parsed = JSON.parse(raw);
    return {
      bots: parsed.bots || [],
      platformConfigs: parsed.platformConfigs || defaultData.platformConfigs,
      serverUrl: parsed.serverUrl || "",
    };
  } catch {
    return { ...defaultData };
  }
}

function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getBots(): Bot[] {
  return loadData().bots;
}

export function getBot(id: string): Bot | undefined {
  return loadData().bots.find((b) => b.id === id);
}

export function createBot(data: Omit<Bot, "id" | "createdAt" | "autoReplies" | "messageLogs">): Bot {
  const app = loadData();
  const bot: Bot = {
    ...data,
    id: genId(),
    createdAt: new Date().toISOString(),
    autoReplies: [],
    messageLogs: [],
  };
  app.bots.unshift(bot);
  saveData(app);
  return bot;
}

export function updateBot(id: string, data: Partial<Bot>): Bot | undefined {
  const app = loadData();
  const idx = app.bots.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  app.bots[idx] = { ...app.bots[idx], ...data };
  saveData(app);
  return app.bots[idx];
}

export function deleteBot(id: string): void {
  const app = loadData();
  app.bots = app.bots.filter((b) => b.id !== id);
  saveData(app);
}

export function toggleBotStatus(id: string): Bot | undefined {
  const bot = getBot(id);
  if (!bot) return undefined;
  return updateBot(id, { status: bot.status === "active" ? "inactive" : "active" });
}

export function startAllBots(): Bot[] {
  const app = loadData();
  app.bots = app.bots.map((b) => ({ ...b, status: "active" as const }));
  saveData(app);
  return app.bots;
}

export function stopAllBots(): Bot[] {
  const app = loadData();
  app.bots = app.bots.map((b) => ({ ...b, status: "inactive" as const }));
  saveData(app);
  return app.bots;
}

export function addAutoReply(botId: string, data: Omit<AutoReply, "id">): AutoReply | undefined {
  const app = loadData();
  const bot = app.bots.find((b) => b.id === botId);
  if (!bot) return undefined;
  const reply: AutoReply = { ...data, id: genId() };
  bot.autoReplies.push(reply);
  saveData(app);
  return reply;
}

export function updateAutoReply(botId: string, replyId: string, data: Partial<AutoReply>): AutoReply | undefined {
  const app = loadData();
  const bot = app.bots.find((b) => b.id === botId);
  if (!bot) return undefined;
  const idx = bot.autoReplies.findIndex((r) => r.id === replyId);
  if (idx === -1) return undefined;
  bot.autoReplies[idx] = { ...bot.autoReplies[idx], ...data };
  saveData(app);
  return bot.autoReplies[idx];
}

export function deleteAutoReply(botId: string, replyId: string): void {
  const app = loadData();
  const bot = app.bots.find((b) => b.id === botId);
  if (!bot) return;
  bot.autoReplies = bot.autoReplies.filter((r) => r.id !== replyId);
  saveData(app);
}

export function getMessageLogs(botId?: string): MessageLog[] {
  const app = loadData();
  if (botId) {
    const bot = app.bots.find((b) => b.id === botId);
    return bot?.messageLogs || [];
  }
  return app.bots.flatMap((b) => b.messageLogs.map((l) => ({ ...l, botId: b.id, botName: b.name, platform: b.platform } as any)));
}

export function addMessageLog(botId: string, data: Omit<MessageLog, "id" | "timestamp">): MessageLog | undefined {
  const app = loadData();
  const bot = app.bots.find((b) => b.id === botId);
  if (!bot) return undefined;
  const log: MessageLog = { ...data, id: genId(), timestamp: new Date().toISOString() };
  bot.messageLogs.unshift(log);
  if (bot.messageLogs.length > 500) bot.messageLogs = bot.messageLogs.slice(0, 500);
  saveData(app);
  return log;
}

export function getPlatformConfigs(): PlatformConfig[] {
  return loadData().platformConfigs;
}

export function updatePlatformConfig(platform: string, data: Partial<PlatformConfig>): PlatformConfig | undefined {
  const app = loadData();
  const idx = app.platformConfigs.findIndex((c) => c.platform === platform);
  if (idx === -1) return undefined;
  app.platformConfigs[idx] = { ...app.platformConfigs[idx], ...data };
  saveData(app);
  return app.platformConfigs[idx];
}

export function getServerUrl(): string {
  return loadData().serverUrl;
}

export function setServerUrl(url: string): void {
  const app = loadData();
  app.serverUrl = url;
  saveData(app);
}

export function exportBackup(): BackupData {
  const app = loadData();
  return {
    version: "1.0",
    exportDate: new Date().toISOString(),
    bots: app.bots,
    platformConfigs: app.platformConfigs,
    serverUrl: app.serverUrl,
  };
}

export function importBackup(backup: BackupData): boolean {
  try {
    const app: AppData = {
      bots: backup.bots || [],
      platformConfigs: backup.platformConfigs || defaultData.platformConfigs,
      serverUrl: backup.serverUrl || "",
    };
    saveData(app);
    return true;
  } catch {
    return false;
  }
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
