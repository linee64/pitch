import { NavLink } from "react-router-dom";
import { LayoutGrid, Users, History, Settings, Mic, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n";

export const Sidebar = () => {
  const { t } = useI18n();
  const nav = [
    { to: "/", label: t("nav.scenarios"), icon: LayoutGrid, end: true },
    { to: "/personas", label: t("nav.personas"), icon: Users },
    { to: "/history", label: t("nav.history"), icon: History },
    { to: "/settings", label: t("nav.settings"), icon: Settings },
  ];
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur-xl sticky top-0 h-dvh">
      <div className="px-6 py-6 border-b border-border flex items-center gap-2.5">
        <div className="size-8 rounded-lg bg-fluid grid place-items-center shadow-glow-cyan">
          <Mic className="size-4 text-background" strokeWidth={2.5} />
        </div>
        <div>
          <div className="font-display font-bold text-lg leading-none tracking-tight">Confly</div>
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{t("side.tagline")}</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
              )
            }
          >
            <Icon className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 p-4 rounded-xl border border-border bg-gradient-fluid/[0.04] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-50 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-primary mb-2">
            <Sparkles className="size-3" /> Pro
          </div>
          <div className="text-sm font-medium leading-snug">{t("side.proHint")}</div>
          <button className="mt-3 w-full text-xs font-semibold py-2 rounded-md bg-foreground text-background">
            {t("side.upgrade")}
          </button>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-border flex items-center gap-3">
        <div className="size-8 rounded-full bg-secondary grid place-items-center text-xs font-semibold">AK</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">Anya Kovac</div>
          <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">{t("side.role")}</div>
        </div>
      </div>
    </aside>
  );
};
