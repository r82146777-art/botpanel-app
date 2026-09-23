import { useState } from "react";
import { Card, Button, Badge, Toast } from "../components/ui";
import { PlatformIcon, getPlatformMeta } from "../lib/platforms";
import { getBots, toggleBotStatus, deleteBot, startAllBots, stopAllBots } from "../lib/storage";
import type { Bot } from "../lib/types";
import { Play, Square, Trash2, Settings2, Plus } from "lucide-react";

export function ActiveBots({ navigate }: { navigate: (path: string) => void }) {
  const [bots, setBots] = useState<Bot[]>(getBots());
  const [toast, setToast] = useState<{ msg: string; type: "default" | "destructive" } | null>(null);

  const showToast = (msg: string, type: "default" | "destructive" = "default") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refresh = () => setBots(getBots());

  const handleToggle = (id: string) => {
    toggleBotStatus(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    if (confirm("آیا از حذف این ربات مطمئن هستید؟")) {
      deleteBot(id);
      refresh();
      showToast("ربات حذف شد");
    }
  };

  const activeCount = bots.filter((b) => b.status === "active").length;

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Badge variant="default">{activeCount} فعال</Badge>
          <Badge variant="secondary">{bots.length - activeCount} غیرفعال</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { startAllBots(); refresh(); showToast("همه ربات‌ها فعال شدند"); }}>
            <Play size={14} /> شروع همه
          </Button>
          <Button variant="outline" size="sm" onClick={() => { stopAllBots(); refresh(); showToast("همه ربات‌ها متوقف شدند"); }}>
            <Square size={14} /> توقف همه
          </Button>
          <Button size="sm" onClick={() => navigate("/create")}>
            <Plus size={14} /> ربات جدید
          </Button>
        </div>
      </div>

      {bots.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-muted-foreground mb-4">هنوز رباتی ساخته نشده</p>
          <Button onClick={() => navigate("/create")}><Plus size={16} /> ساخت ربات جدید</Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot) => {
            const meta = getPlatformMeta(bot.platform);
            return (
              <Card key={bot.id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl" style={{ backgroundColor: meta.bgColor, color: meta.color }}>
                      <PlatformIcon platform={bot.platform} size={22} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{bot.name}</h3>
                      <p className="text-xs text-muted-foreground">{meta.label}</p>
                    </div>
                  </div>
                  <Badge variant={bot.status === "active" ? "default" : "secondary"}>
                    {bot.status === "active" ? "فعال" : "غیرفعال"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <button onClick={() => navigate(`/bot/${bot.id}`)} className="flex-1 h-8 flex items-center justify-center gap-1 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                    <Settings2 size={14} /> تنظیمات
                  </button>
                  <button onClick={() => handleToggle(bot.id)} className={`h-8 w-8 flex items-center justify-center rounded-lg border border-border ${bot.status === "active" ? "text-destructive" : "text-green-500"} hover:bg-muted`}>
                    {bot.status === "active" ? <Square size={14} /> : <Play size={14} />}
                  </button>
                  <button onClick={() => handleDelete(bot.id)} className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-destructive hover:bg-muted">
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
