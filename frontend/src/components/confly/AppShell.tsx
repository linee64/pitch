import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { LangToggle } from "./LangToggle";
import { Bell, Search } from "lucide-react";
import { useI18n } from "@/i18n/i18n";

export const AppShell = ({ children, title, subtitle, action }: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) => {
  const { t } = useI18n();
  return (
    <div className="min-h-dvh flex">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/70 border-b border-border">
          <div className="px-6 lg:px-10 py-3 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">{title}</h1>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder={t("hdr.search")}
                  className="w-64 h-10 pl-9 pr-3 rounded-lg bg-secondary/60 border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <LangToggle />
              <button className="size-10 rounded-lg bg-secondary/60 border border-border grid place-items-center hover:bg-secondary transition-colors">
                <Bell className="size-4" />
              </button>
              {action}
            </div>
            <div className="md:hidden flex items-center"><LangToggle /></div>
          </div>
        </header>
        <div className="px-6 lg:px-10 py-8 animate-fade-up">{children}</div>
      </main>
    </div>
  );
};
