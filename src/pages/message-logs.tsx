import { Card } from "../components/ui";
import { getMessageLogs } from "../lib/storage";

export function MessageLogs() {
  const logs = getMessageLogs();
  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">لاگ پیام‌ها</h2>
      {logs.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-muted-foreground">هنوز پیامی ثبت نشده</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {logs.slice(0, 50).map((log: any) => (
            <Card key={log.id} className="text-sm">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{log.senderName || "کاربر"}</span>
                <span>{new Date(log.timestamp).toLocaleString("fa-IR")}</span>
              </div>
              <p>{log.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
