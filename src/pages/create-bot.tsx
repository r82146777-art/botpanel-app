import { useState } from "react";
import { Card, Button, Input, Label, Textarea, Switch, Toast } from "../components/ui";
import { PlatformIcon, getPlatformMeta, validateToken } from "../lib/platforms";
import { createBot } from "../lib/storage";
import type { Platform, Schedule } from "../lib/types";
import { ArrowRight, Eye, EyeOff, CheckCircle2, Loader2, Clock, Code2, Users, MessageSquare } from "lucide-react";

const platforms: Platform[] = ["telegram", "rubika", "soroush", "bale"];

export function CreateBot({ navigate }: { navigate: (path: string) => void }) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<Platform>("telegram");
  const [token, setToken] = useState("");
  const [adminIds, setAdminIds] = useState("");
  const [code, setCode] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [is24h, setIs24h] = useState(true);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("22:00");
  const [showToken, setShowToken] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "default" | "destructive" } | null>(null);

  const showToast = (msg: string, type: "default" | "destructive" = "default") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleValidate = async () => {
    if (!token.trim()) { showToast("ابتدا توکن را وارد کنید", "destructive"); return; }
    setValidating(true);
    setValidated(false);
    const result = await validateToken(platform, token.trim());
    setValidating(false);
    if (result.valid) {
      setValidated(true);
      if (result.botName && !name) setName(result.botName);
      showToast(`اتصال تأیید شد: ${result.botName || "موفق"}`);
    } else {
      showToast(result.error || "توکن نامعتبر است", "destructive");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) { showToast("توکن الزامی است", "destructive"); return; }
    if (!code.trim()) { showToast("کد ربات الزامی است", "destructive"); return; }

    const schedule: Schedule = {
      is24h,
      start: startTime,
      end: endTime,
    };

    const ids = adminIds
      .split(/[\n,،\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const botName = name.trim() || getPlatformMeta(platform).label + " Bot";

    createBot({
      name: botName,
      platform,
      token: token.trim(),
      description: welcomeMessage.trim() || "",
      status: "active",
      adminIds: ids,
      code: code.trim(),
      welcomeMessage: welcomeMessage.trim(),
      schedule,
    });
    showToast("ربات با موفقیت ساخته و شروع به کار کرد");
    setTimeout(() => navigate("/active"), 1000);
  };

  const meta = getPlatformMeta(platform);

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowRight size={16} /> بازگشت به خانه
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">ساخت ربات جدید</h2>
        <p className="text-sm text-muted-foreground">ربات خود را برای پلتفرم‌های تلگرام، روبیکا، سروش و بله بسازید</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Platform Selection */}
        <Card>
          <h3 className="text-base font-semibold mb-3">انتخاب پلتفرم</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {platforms.map((p) => {
              const m = getPlatformMeta(p);
              const selected = platform === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setPlatform(p); setValidated(false); }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50 text-muted-foreground"
                  }`}
                >
                  <PlatformIcon platform={p} size={28} />
                  <span className="text-xs font-medium">{m.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">پلتفرم انتخاب‌شده: <span className="font-medium text-foreground">{meta.label}</span></p>
        </Card>

        {/* Token */}
        <Card>
          <h3 className="text-base font-semibold mb-3">توکن ربات</h3>
          <div>
            <Label>توکن / کلید API *</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showToken ? "text" : "password"}
                  value={token}
                  onChange={(e) => { setToken(e.target.value); setValidated(false); }}
                  placeholder="توکن دریافتی از پلتفرم"
                  required
                  className="pl-10"
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowToken(!showToken)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Button type="button" variant="outline" onClick={handleValidate} disabled={validating}>
                {validating ? <Loader2 size={14} className="animate-spin" /> : validated ? <CheckCircle2 size={14} className="text-green-500" /> : null}
                بررسی
              </Button>
            </div>
            {validated && <p className="text-xs text-green-500 mt-1">✓ توکن معتبر است</p>}
          </div>
        </Card>

        {/* Admin IDs */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Users size={18} className="text-primary" />
            <h3 className="text-base font-semibold">آیدی عددی مدیران</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2">اگر خالی بگذارید همه می‌توانند از ربات استفاده کنند. در غیر این صورت فقط آیدی‌های وارد شده دسترسی دارند.</p>
          <Textarea
            value={adminIds}
            onChange={(e) => setAdminIds(e.target.value)}
            placeholder="مثال: 123456789\nیا چند آیدی با کاما یا خط جدید"
            rows={3}
            dir="ltr"
          />
        </Card>

        {/* Bot Code */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Code2 size={18} className="text-primary" />
            <h3 className="text-base font-semibold">کد ربات *</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2">کد یا منطق ربات را اینجا وارد کنید. ربات بر اساس این کد عمل می‌کند.</p>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// کد ربات خود را اینجا بنویسید یا پیست کنید..."
            rows={8}
            dir="ltr"
            className="font-mono text-sm"
            required
          />
        </Card>

        {/* Welcome Message (optional) */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare size={18} className="text-primary" />
            <h3 className="text-base font-semibold">پیام خوش‌آمدگویی <span className="text-xs font-normal text-muted-foreground">(اختیاری)</span></h3>
          </div>
          <Textarea
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="پیامی که هنگام شروع ربات یا اولین پیام کاربر نمایش داده می‌شود..."
            rows={3}
          />
        </Card>

        {/* Schedule */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={18} className="text-primary" />
            <h3 className="text-base font-semibold">بازه زمانی فعالیت ربات</h3>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border mb-3">
            <div>
              <p className="text-sm font-medium">فعالیت ۲۴ ساعته</p>
              <p className="text-xs text-muted-foreground">ربات همیشه در دسترس باشد</p>
            </div>
            <Switch checked={is24h} onChange={setIs24h} />
          </div>
          {!is24h && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>شروع فعالیت</Label>
                <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} dir="ltr" />
              </div>
              <div>
                <Label>پایان فعالیت</Label>
                <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} dir="ltr" />
              </div>
            </div>
          )}
        </Card>

        {/* Name (optional extra) */}
        <Card>
          <div>
            <Label>نام ربات <span className="text-xs text-muted-foreground">(اختیاری - در صورت خالی از نام پلتفرم استفاده می‌شود)</span></Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً: ربات پشتیبانی فروش" />
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={() => navigate("/active")}>انصراف</Button>
          <Button type="submit" className="min-w-[140px]">
            ذخیره و شروع ربات
          </Button>
        </div>
      </form>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
