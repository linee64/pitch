import { AppShell } from "@/components/confly/AppShell";
import { recentSessions } from "@/data/confly";
import { useI18n } from "@/i18n/i18n";

const History = () => {
  const { t } = useI18n();
  return (
    <AppShell title={t("his.title")} subtitle={t("his.subtitle")}>
      <div className="grid lg:grid-cols-3 gap-4">
        {recentSessions.concat(recentSessions).map((r, i) => (
          <div key={i} className="rounded-xl border border-border bg-card/60 p-5 hover:border-primary/40 transition-colors">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              <span>{r.date}</span>
              <span>{r.duration}</span>
            </div>
            <h3 className="font-display text-xl font-bold mt-3 tracking-tight">{r.scenario}</h3>
            <div className="text-xs text-muted-foreground mt-1">{t("his.vs")} {r.persona}</div>
            <div className="mt-5 pt-4 border-t border-border flex items-end justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{t("his.composure")}</div>
                <div className="font-display text-3xl font-bold text-primary mt-1 leading-none">{r.score}</div>
              </div>
              <button className="text-xs font-semibold px-3 py-2 rounded-md bg-secondary border border-border hover:bg-secondary/60">{t("his.openReport")}</button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
};

export default History;
