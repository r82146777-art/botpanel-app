import { useState } from "react";
import { Card, Button, Toast } from "../components/ui";
import { exportBackup, importBackup, getBots, clearAllData } from "../lib/storage";
import type { BackupData } from "../lib/types";
import { Download, Upload, Database, Trash2 } from "lucide-react";

export function BackupPage({ navigate }: { navigate: (path: string) => void }) {
  const [toast, setToast] = useState<{ msg: string; type: "default" | "destructive" } | null>(null);
  const [importedData, setImportedData] = useState<BackupData | null>(null);

  const showToast = (msg: string, type: "default" | "destructive" = "default") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    const data = exportBackup();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `botpanel-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("فایل پشتیبان دانلود شد");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as BackupData;
        if (!data.bots) { showToast("فایل نامعتبر است", "destructive"); return; }
        setImportedData(data);
        showToast(`فایل بارگذاری شد: ${data.bots.length} ربات`);
      } catch {
        showToast("خطا در خواندن فایل", "destructive");
      }
    };
    reader.readAsText(file);
  };

  const handleRestore = () => {
    if (!importedData) return;
    if (confirm(`آیا از جایگذاری داده‌ها مطمئن هستید؟ ${importedData.bots.length} ربات جایگزین می‌شود.`)) {
      if (importBackup(importedData)) {
        showToast("داده‌ها با موفقیت بازیابی شد");
        setImportedData(null);
        setTimeout(() => navigate("/active"), 1500);
      } else {
        showToast("خطا در بازیابی", "destructive");
      }
    }
  };

  const bots = getBots();

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-1">پشتیبان‌گیری و بازیابی</h2>
        <p className="text-sm text-muted-foreground">از کل ربات‌ها و تنظیمات پشتیبان بگیرید</p>
      </div>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Database size={20} /></div>
          <div>
            <p className="text-sm font-medium">داده‌های فعلی</p>
            <p className="text-xs text-muted-foreground">{bots.length} ربات ذخیره شده</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleExport} variant="outline"><Download size={16} /> دانلود پشتیبان</Button>
          <label className="cursor-pointer">
            <Button variant="outline" className="w-full" as-child={false} onClick={() => document.getElementById("import-file")?.click()}>
              <Upload size={16} /> وارد کردن فایل
            </Button>
            <input id="import-file" type="file" accept=".json" className="hidden" onChange={handleImportFile} />
          </label>
        </div>
      </Card>

      {importedData && (
        <Card>
          <p className="text-sm mb-3">{importedData.bots.length} ربات در فایل پیدا شد</p>
          <Button onClick={handleRestore}>بازیابی و جایگذاری</Button>
        </Card>
      )}

      <Card>
        <Button variant="destructive" onClick={() => { if (confirm("همه داده‌ها پاک شود؟")) { clearAllData(); showToast("پاک شد"); setTimeout(() => navigate("/"), 1000); } }}>
          <Trash2 size={16} /> پاک کردن همه داده‌ها
        </Button>
      </Card>

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
