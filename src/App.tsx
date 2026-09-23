import { useState, useEffect } from "react";
import { ThemeProvider } from "./lib/theme";
import { Layout } from "./components/layout";
import { Dashboard } from "./pages/dashboard";
import { CreateBot } from "./pages/create-bot";
import { ActiveBots } from "./pages/active-bots";
import { BotDetail } from "./pages/bot-detail";
import { MessageLogs } from "./pages/message-logs";
import { BackupPage } from "./pages/backup";
import { Settings } from "./pages/settings";

function getRoute(): string {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  return hash;
}

export function App() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const handler = () => setRoute(getRoute());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setRoute(path);
  };

  // Parse route
  const botMatch = route.match(/^\/bot\/(.+)$/);
  const botId = botMatch?.[1];

  return (
    <ThemeProvider>
      <Layout currentPath={route} navigate={navigate}>
        {route === "/" && <Dashboard navigate={navigate} />}
        {route === "/create" && <CreateBot navigate={navigate} />}
        {route === "/active" && <ActiveBots navigate={navigate} />}
        {botId && <BotDetail id={botId} navigate={navigate} />}
        {route === "/logs" && <MessageLogs />}
        {route === "/backup" && <BackupPage navigate={navigate} />}
        {route === "/settings" && <Settings />}
        {!["/", "/create", "/active", "/logs", "/backup", "/settings"].includes(route) && !botMatch && (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">صفحه یافت نشد</p>
            <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">بازگشت به داشبورد</button>
          </div>
        )}
      </Layout>
    </ThemeProvider>
  );
}
