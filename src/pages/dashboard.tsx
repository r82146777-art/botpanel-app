import { Card, Button, Badge } from "../components/ui";
import { getBots } from "../lib/storage";
import { PlatformIcon, getPlatformMeta } from "../lib/platforms";
import { Plus, Bot, Activity } from "lucide-react";

export function Dashboard({ navigate }: { navigate: (path: string) => void }) {
  const bots = getBots();
  const active = bots.filter((b) => b.status === "active").length;

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">داشبورد</h2>
        <p className="text-muted-foreground text-sm">مدیریت ربات‌های تلگرام، روبیکا، سروش و بله روی گوشی خودتان</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary"><Bot size={20} /></div>
            <div>
              <p className="text-2xl font-bold">{bots.length}</p>
              <p className="text-xs text-muted-foreground">کل ربات‌ها</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center text-green-500"><Activity size={20} /></div>
            <div>
              <p className="text-2xl font-bold">{active}</p>
              <p className="text-xs text-muted-foreground">فعال</p>
            </div>
          </div>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <Button className="w-full" onClick={() => navigate("/create")}>
            <Plus size={16} /> ساخت ربات جدید
          </Button>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold mb-3">ربات‌های اخیر</h3>
        {bots.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">هنوز رباتی ندارید</p>
        ) : (
          <div className="space-y-2">
            {bots.slice(0, 5).map((b) => {
              const meta = getPlatformMeta(b.platform);
              return (
                <div key={b.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer" onClick={() => navigate(`/bot/${b.id}`)}>
                  <div className="flex items-center gap-2">
                    <PlatformIcon platform={b.platform} size={18} />
                    <span className="text-sm font-medium">{b.name}</span>
                    <span className="text-xs text-muted-foreground">{meta.label}</span>
                  </div>
                  <Badge variant={b.status === "active" ? "default" : "secondary"}>{b.status === "active" ? "فعال" : "غیرفعال"}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
