import { Link } from "react-router-dom";
import { AppShell } from "@/components/confly/AppShell";
import { scenarios, recentSessions, personas } from "@/data/confly";
import { ArrowUpRight, Brain, Clock, TrendingUp, Plus, Award } from "lucide-react";
import { useI18n } from "@/i18n/i18n";

const categoryColors: Record<string, string> = {
  Startup: "from-orange-400/20 to-red-500/10 text-orange-300 border-orange-400/20",
  Academia: "from-cyan-400/20 to-blue-500/10 text-cyan-300 border-cyan-400/20",
  Competition: "from-violet-400/20 to-fuchsia-500/10 text-violet-300 border-violet-400/20",
  Work: "from-emerald-400/20 to-teal-500/10 text-emerald-300 border-emerald-400/20",
  Custom: "from-zinc-400/20 to-zinc-600/10 text-zinc-300 border-zinc-400/20",
};

const Index = () => {
  const { t } = useI18n();
  const featured = scenarios[0];
  const featuredPersona = personas.find(p => p.id === featured.recommendedPersonaIds[0])!;
  const rest = scenarios.slice(1);

  return (
    <AppShell
      title={t("idx.title")}
      subtitle={t("idx.subtitle")}
      action={
        <Link to="/setup/custom-upload" className="h-10 px-5 rounded-lg bg-foreground text-background font-semibold text-sm grid place-items-center hover:opacity-90 transition-opacity">
          {t("idx.createPitch")}
        </Link>
      }
    >
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: t("idx.stat.completed"), value: "24", icon: TrendingUp, hint: t("idx.stat.completedHint") },
          { label: t("idx.stat.composure"), value: "88", icon: Award, hint: t("idx.stat.composureHint") },
          { label: t("idx.stat.time"), value: "3h 42m", icon: Clock, hint: t("idx.stat.timeHint") },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-5 flex items-start gap-4">
            <div className="size-10 rounded-lg bg-secondary grid place-items-center text-primary">
              <s.icon className="size-4" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{s.label}</div>
              <div className="font-display text-3xl font-bold mt-1 leading-none">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1.5">{s.hint}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-border mb-10 glass">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
        <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-8 p-8 lg:p-10">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary/80 border border-border font-mono text-[10px] uppercase tracking-widest text-primary">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" /> {t("idx.featured.badge")}
              </div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight mt-5 leading-[1.05]">
                {t(`sc.${featured.id}.t`)}.<br />
                <span className="text-fluid">{t("idx.featured.headline")}</span>
              </h2>
              <p className="text-muted-foreground mt-4 max-w-lg">{t(`sc.${featured.id}.d`)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link to={`/setup/${featured.id}`} className="h-12 px-6 rounded-xl bg-fluid text-background font-semibold text-sm grid place-items-center shadow-glow-cyan hover:scale-[1.02] transition-transform">
                {t("idx.cta.init")}
              </Link>
              <button className="h-12 px-6 rounded-xl bg-secondary/60 border border-border font-semibold text-sm hover:bg-secondary transition-colors">
                {t("idx.cta.sample")}
              </button>
              <div className="ml-2 flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-widest">
                <Brain className="size-3.5 text-primary" /> {t("idx.intensity")} {featured.intensity}/10
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/5] lg:aspect-auto rounded-xl overflow-hidden border border-border bg-card">
            <img src={featuredPersona.image} alt={featuredPersona.name} loading="lazy" width={768} height={960} className="absolute inset-0 size-full object-cover mix-blend-luminosity opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <div className="glass rounded-md px-2.5 py-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
                <span className="size-1.5 rounded-full bg-destructive" /> Rec
              </div>
              <div className="glass rounded-md px-2.5 py-1 text-right">
                <div className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest">{t("idx.col.adversary")}</div>
                <div className="text-xs font-semibold">{t(`p.${featuredPersona.id}.role`)}</div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-4">
              <div className="flex justify-between text-xs">
                <span className="font-medium">{featuredPersona.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-2xl font-bold tracking-tight">{t("idx.allScenarios")}</h2>
          <span className="px-2 py-0.5 rounded-md bg-secondary/50 border border-border text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            {rest.length} {t("idx.available")}
          </span>
        </div>
        <Link 
          to="/setup/custom-upload" 
          className="h-9 px-4 rounded-lg bg-primary text-background font-semibold text-xs flex items-center gap-2 hover:shadow-glow-cyan/20 transition-all active:scale-95"
        >
          <Plus className="size-3.5" />
          {t("idx.createPitch")}
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-12">
        {rest.map((s) => (
          <Link
            to={s.id === "custom-upload" ? "/setup/custom-upload" : `/setup/${s.id}`}
            key={s.id}
            className="group relative rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 hover:border-primary/40 hover:bg-card transition-all overflow-hidden"
          >
            <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${categoryColors[s.category]} opacity-60`} />
            <div className="flex items-center justify-between">
              <div className={`inline-flex px-2 py-0.5 rounded-full bg-gradient-to-r ${categoryColors[s.category]} border text-[10px] font-mono uppercase tracking-widest`}>
                {t(`cat.${s.category}`)}
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
            </div>
            <h3 className="font-display text-xl font-bold mt-4 tracking-tight">{t(`sc.${s.id}.t`)}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{t(`sc.${s.id}.d`)}</p>
            <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="size-3" />{s.duration}</span>
              {s.intensity === 0 && (
                <span className="flex items-center gap-1.5 text-primary"><Plus className="size-3" />{t("idx.custom")}</span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight mb-5">{t("idx.recent")}</h2>
        <div className="rounded-xl border border-border overflow-hidden bg-card/40">
          <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_100px_80px] gap-4 px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground border-b border-border bg-secondary/30">
            <div>{t("idx.col.date")}</div><div>{t("idx.col.scenario")}</div><div>{t("idx.col.adversary")}</div><div>{t("idx.col.duration")}</div><div className="text-right">{t("idx.col.score")}</div>
          </div>
          {recentSessions.map((r) => (
            <div key={r.id} className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_100px_80px] gap-4 px-5 py-4 text-sm border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
              <div className="font-mono text-xs text-muted-foreground">{r.date}</div>
              <div className="font-medium">{r.scenario}</div>
              <div className="text-muted-foreground hidden md:block">{r.persona}</div>
              <div className="font-mono text-xs text-muted-foreground hidden md:block">{r.duration}</div>
              <div className="text-right font-display font-bold text-lg text-primary">{r.score}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Index;
