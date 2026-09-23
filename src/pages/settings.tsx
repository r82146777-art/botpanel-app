import { Card } from "../components/ui";
import { useTheme } from "../lib/theme";

export function Settings() {
  const { theme, toggle } = useTheme();
  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">تنظیمات</h2>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">تم تاریک / روشن</p>
            <p className="text-xs text-muted-foreground">تم فعلی: {theme === "dark" ? "تاریک" : "روشن"}</p>
          </div>
          <button onClick={toggle} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
            تغییر تم
          </button>
        </div>
      </Card>
      <Card>
        <p className="text-sm text-muted-foreground">BotPanel v1.0 — مدیریت ربات‌ها روی گوشی</p>
      </Card>
    </div>
  );
}
