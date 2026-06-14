import { AppShell } from "@/components/confly/AppShell";
import { useI18n } from "@/i18n/i18n";

const Row = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="grid md:grid-cols-[280px_1fr] gap-4 py-5 border-b border-border last:border-0">
    <div>
      <div className="font-medium">{label}</div>
      {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
    </div>
    <div>{children}</div>
  </div>
);

const Settings = () => {
  const { t } = useI18n();
  return (
    <AppShell title={t("set.title")} subtitle={t("set.subtitle")}>
      <div className="max-w-3xl rounded-2xl border border-border bg-card/60 p-6 lg:p-8">
        <Row label={t("set.diff")} hint={t("set.diffHint")}>
          <div className="grid grid-cols-3 gap-2">
            {[t("set.diff.mentor"), t("set.diff.real"), t("set.diff.brutal")].map((l, i) => (
              <button key={l} className={`h-10 rounded-lg text-sm font-medium border transition-colors ${i === 1 ? "bg-fluid text-background border-transparent" : "border-border bg-secondary/40 hover:bg-secondary"}`}>{l}</button>
            ))}
          </div>
        </Row>
        <Row label={t("set.lang")} hint={t("set.langHint")}>
          <select className="w-full h-10 rounded-lg bg-secondary/60 border border-border px-3 text-sm">
            <option>English (US)</option><option>Русский</option><option>Deutsch</option><option>Español</option>
          </select>
        </Row>
        <Row label={t("set.rec")} hint={t("set.recHint")}>
          <label className="inline-flex items-center gap-3">
            <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-fluid">
              <span className="inline-block size-5 transform rounded-full bg-background translate-x-5 transition" />
            </span>
            <span className="text-sm">{t("set.enabled")}</span>
          </label>
        </Row>
        <Row label={t("set.coach")} hint={t("set.coachHint")}>
          <label className="inline-flex items-center gap-3">
            <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-secondary border border-border">
              <span className="inline-block size-5 transform rounded-full bg-foreground translate-x-0.5 transition" />
            </span>
            <span className="text-sm text-muted-foreground">{t("set.off")}</span>
          </label>
        </Row>
      </div>
    </AppShell>
  );
};

export default Settings;
