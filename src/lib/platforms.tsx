import type { Platform } from "./types";

interface PlatformMeta {
  label: string;
  color: string;
  bgColor: string;
  apiBase: string;
  createBotUrl: string;
  createBotInstructions: string;
}

const platformMeta: Record<Platform, PlatformMeta> = {
  telegram: {
    label: "تلگرام",
    color: "#0088cc",
    bgColor: "rgba(0, 136, 204, 0.12)",
    apiBase: "https://api.telegram.org/bot",
    createBotUrl: "https://t.me/BotFather",
    createBotInstructions: "در تلگرام به @BotFather پیام دهید، دستور /newbot را بفرستید و دستورالعمل‌ها را دنبال کنید.",
  },
  rubika: {
    label: "روبیکا",
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.12)",
    apiBase: "https://botapi.rubika.ir/v3/",
    createBotUrl: "https://rubika.ir",
    createBotInstructions: "در اپلیکیشن روبیکا به ربات رسمی ساخت ربات مراجعه کنید و دستور /newbot را بفرستید.",
  },
  soroush: {
    label: "سروش",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.12)",
    apiBase: "https://api.uniom.ir/bot",
    createBotUrl: "https://splus.ir/developers",
    createBotInstructions: "در سروش‌پلاس به @soroushplus_bot پیام دهید، دستور /newbot را بفرستید. سپس /token را بفرستید تا توکن ربات را دریافت کنید.",
  },
  bale: {
    label: "بله",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.12)",
    apiBase: "https://api.bale.ai/bot",
    createBotUrl: "https://bale.ai",
    createBotInstructions: "در بله به @BotFather پیام دهید و دستور /newbot را بفرستید.",
  },
};

export function getPlatformMeta(platform: Platform): PlatformMeta {
  return platformMeta[platform];
}

export function getApiUrl(platform: Platform, token: string, method: string): string {
  const meta = platformMeta[platform];
  return `${meta.apiBase}${token}/${method}`;
}

interface PlatformIconProps {
  platform: Platform;
  size?: number;
  className?: string;
}

export function PlatformIcon({ platform, size = 20, className = "" }: PlatformIconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    className,
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (platform) {
    case "telegram":
      return (
        <svg {...props}>
          <path d="M21.5 4.5L2.5 11.8C1.7 12.1 1.7 13.2 2.5 13.5L7 15L8.5 19.5C8.7 20.1 9.4 20.2 9.8 19.7L12 17L16.5 20.3C17.1 20.7 17.9 20.4 18.1 19.7L21.8 5.5C22 4.7 21.3 4.2 21.5 4.5Z" fill="currentColor"/>
        </svg>
      );
    case "rubika":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M8 14C8 11.8 9.8 10 12 10C14.2 10 16 11.8 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <circle cx="12" cy="7.5" r="1.5" fill="currentColor"/>
        </svg>
      );
    case "soroush":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case "bale":
      return (
        <svg {...props}>
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      );
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/></svg>;
  }
}

export async function validateToken(platform: Platform, token: string): Promise<{ valid: boolean; botName?: string; error?: string }> {
  try {
    if (platform === "telegram") {
      const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await res.json();
      if (data.ok) return { valid: true, botName: data.result?.first_name || data.result?.username };
      return { valid: false, error: data.description || "توکن نامعتبر" };
    }
    // For other platforms, basic check
    if (token.length > 10) return { valid: true, botName: getPlatformMeta(platform).label + " Bot" };
    return { valid: false, error: "توکن کوتاه است" };
  } catch (e) {
    return { valid: false, error: "خطا در ارتباط با سرور" };
  }
}
