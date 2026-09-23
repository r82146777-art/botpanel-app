import { useState } from "react";
import { Card, Button, Badge, Toast } from "../components/ui";
import { getBot, updateBot, toggleBotStatus, deleteBot } from "../lib/storage";
import { getPlatformMeta, PlatformIcon } from "../lib/platforms";
import { ArrowRight, Play, Square, Trash2 } from "lucide-react";

export function BotDetail({ id, navigate }: { id: string; navigate: (path: string) => void }) {
  const [bot, setBot] = useState(getBot(id));
  const [toast, setToast] = useState<{ msg: string; type: "default" | "destructive" } | null>(null);

  if (!bot) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">ربات یافت نشد</p>
        <Button className="mt-4" onClick={() => navigate("/active")}>بازگشت</Button>
      </div>
    );
  }

  const meta = getPlatformMeta(bot.platform);
  const showToast = (msg: string) => { setToast({ msg, type: "default" }); setTimeout(() => setToast(null), 3000); };

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
      <button onClick={() => navigate("/active")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2">
        <ArrowRight size={16} /> بازگشت
      </button>

      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: meta.bgColor, color: meta.color }}>
            <PlatformIcon platform={bot.platform} size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold">{bot.name}</h2>
            <p className="text-sm text-muted-foreground">{meta.label}</p>
            <Badge variant={bot.status === "active" ? "default" : "secondary"} className="mt-1">
              {bot.status === "active" ? "فعال" : "غیرفعال"}
            </Badge>
          </div>
        </div>

        {bot.welcomeMessage && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">پیام خوش‌آمد</p>
            <p className="text-sm">{bot.welcomeMessage}</p>
          </div>
        )}

        {bot.code && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">کد ربات</p>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto font-mono">{bot.code.slice(0, 500)}{bot.code.length > 500 ? "..." : ""}</pre>
          </div>
        )}

        {bot.adminIds && bot.adminIds.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">مدیران</p>
            <p className="text-sm font-mono">{bot.adminIds.join(", ")}</p>
          </div>
        )}

        {bot.schedule && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">بازه زمانی</p>
            <p className="text-sm">{bot.schedule.is24h ? "۲۴ ساعته" : `${bot.schedule.start} تا ${bot.schedule.end}`}</p>
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t border-border">
          <Button onClick={() => { toggleBotStatus(bot.id); setBot(getBot(id)); showToast(bot.status === "active" ? "متوقف شد" : "فعال شد"); }}>
            {bot.status === "active" ? <><Square size={14} /> توقف</> : <><Play size={14} /> شروع</>}
          </Button>
          <Button variant="destructive" onClick={() => { if (confirm("حذف شود؟")) { deleteBot(bot.id); navigate("/active"); } }}>
            <Trash2 size={14} /> حذف
          </Button>
        </div>
      </Card>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
