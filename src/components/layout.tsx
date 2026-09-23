import { type ReactNode, useState } from "react";
import { useTheme } from "../lib/theme";
import { Sun, Moon, Menu, X } from "lucide-react";

const navItems = [
  { path: "/", label: "داشبورد", icon: "📊" },
  { path: "/create", label: "ساخت ربات", icon: "➕" },
  { path: "/active", label: "ربات‌های فعال", icon: "🤖" },
  { path: "/logs", label: "پیام‌ها", icon: "💬" },
  { path: "/backup", label: "پشتیبان‌گیری", icon: "💾" },
  { path: "/settings", label: "تنظیمات", icon: "⚙️" },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shrink-0">
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <path d="M9 11.5C9 10.1 10.1 9 11.5 9H20.5C21.9 9 23 10.1 23 11.5V17.5C23 18.9 21.9 20 20.5 20H16L12 23.5V20H11.5C10.1 20 9 18.9 9 17.5V11.5Z" fill="currentColor"/>
          <circle cx="14" cy="14.5" r="1.3" fill="#4f46e5"/>
          <circle cx="18" cy="14.5" r="1.3" fill="#4f46e5"/>
        </svg>
      </div>
      <span className="text-lg font-bold text-sidebar-foreground tracking-tight">BotPanel</span>
    </div>
  );
}

export function Layout({ children, currentPath, navigate }: { children: ReactNode; currentPath: string; navigate: (path: string) => void }) {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => currentPath === path || (path !== "/" && currentPath.startsWith(path));

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-sidebar border-l border-sidebar-border shrink-0">
        <div className="flex items-center h-16 border-b border-sidebar-border"><Logo /></div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isActive(item.path)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-sidebar border-l border-sidebar-border h-full">
            <div className="flex items-center justify-between h-16 border-b border-sidebar-border px-3">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="text-sidebar-foreground p-2"><X size={20} /></button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive(item.path) ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between h-16 px-4 lg:px-6 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
            <h1 className="text-lg font-semibold hidden sm:block">
              {navItems.find((i) => isActive(i.path))?.label || "پنل مدیریت ربات‌ها"}
            </h1>
          </div>
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-muted" aria-label="تغییر تم">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>
        <main className="flex-1 overflow-y-auto scrollbar-thin overscroll-contain">{children}</main>
      </div>
    </div>
  );
}
