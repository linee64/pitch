import { useParams, useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { scenarios } from "@/data/confly";
import { usePersonas } from "@/hooks/usePersonas";
import { Mic, MicOff, Pause, X, Volume2, MessageSquare, User } from "lucide-react";
import { LangToggle } from "@/components/confly/LangToggle";
import { useI18n } from "@/i18n/i18n";

const Wave = () => (
  <div className="flex items-center gap-1 h-8">
    {Array.from({ length: 14 }).map((_, i) => (
      <span
        key={i}
        className="w-1 bg-primary rounded-full animate-wave origin-center"
        style={{ height: "100%", animationDelay: `${i * 0.07}s`, animationDuration: `${0.9 + (i % 3) * 0.15}s` }}
      />
    ))}
  </div>
);

const Session = () => {
  const { t } = useI18n();
  const { scenarioId } = useParams();
  const [params] = useSearchParams();
  const { personas } = usePersonas();
  const scenario = scenarios.find(s => s.id === scenarioId) ?? scenarios[0];
  const persona = personas.find(p => p.id === params.get("p")) ?? personas[0];
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const tm = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(tm);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-card/40 backdrop-blur-xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-destructive">
            <span className="size-2 rounded-full bg-destructive animate-pulse" /> {t("ses.recording")}
          </div>
          <div className="font-mono text-xl tabular-nums">{mm}:{ss}</div>
          <div className="hidden md:block text-sm text-muted-foreground">/ {scenario.duration}</div>
        </div>
        <div className="text-sm font-medium hidden md:block">{t(`sc.${scenario.id}.t`)}</div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <Link to="/" className="size-10 rounded-lg bg-secondary border border-border grid place-items-center hover:bg-destructive hover:border-destructive transition-colors">
            <X className="size-4" />
          </Link>
        </div>
      </header>

      <main className="flex-1 grid lg:grid-cols-[1fr_360px] gap-4 p-4 lg:p-6">
        <div className="relative rounded-2xl overflow-hidden border border-border bg-card min-h-[400px] flex items-center justify-center">
          {persona.image ? (
            <img src={persona.image} alt={persona.name} loading="lazy" width={768} height={960} className="absolute inset-0 size-full object-cover mix-blend-luminosity opacity-70" />
          ) : (
            <User className="size-32 text-muted-foreground opacity-10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40" />
          <div className="absolute top-5 left-5 right-5 flex justify-between gap-3">
            <div className="glass rounded-lg px-3 py-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" /> {t("ses.feedActive")}
            </div>
            <div className="glass rounded-lg px-3 py-2 text-right">
              <div className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest">{t("ses.hostility")}</div>
              <div className="font-display font-bold text-primary leading-none mt-0.5">{persona.hostility}/10</div>
            </div>
          </div>
          <div className="absolute bottom-5 left-5 right-5 glass rounded-2xl p-5 ring-1 ring-inset ring-white/5">
            <div className="flex items-end justify-between border-b border-border pb-3 mb-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-primary">{t("ses.nowSpeaking")}</div>
                <div className="font-display text-2xl font-bold tracking-tight mt-1">{persona.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {persona.id.startsWith("custom-") ? persona.role : t(`p.${persona.id}.role`)}
                </div>
              </div>
              <Wave />
            </div>
            <div className="p-4 rounded-xl bg-background/60 border-l-2 border-primary text-sm leading-relaxed font-mono">
              <span className="text-muted-foreground">&gt; </span>
              {t("ses.quote")}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{t("ses.currentSlide")}</div>
              <div className="font-mono text-xs">04 / 12</div>
            </div>
            <div className="aspect-video rounded-lg bg-secondary border border-border grid-bg grid place-items-center">
              <div className="text-center px-6">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">Unit Economics</div>
                <div className="font-display text-2xl font-bold">CAC : LTV</div>
                <div className="font-display text-4xl font-bold text-fluid mt-2">1 : 4.7</div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 h-9 rounded-md bg-secondary border border-border text-xs font-medium hover:bg-secondary/60">{t("ses.prev")}</button>
              <button className="flex-1 h-9 rounded-md bg-secondary border border-border text-xs font-medium hover:bg-secondary/60">{t("ses.next")}</button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="size-3.5 text-primary" />
              <div className="text-[10px] font-mono uppercase tracking-widest text-primary">{t("ses.coaching")}</div>
            </div>
            {[
              { label: t("ses.pace"), value: "168 wpm", warn: true, hint: t("ses.paceHint") },
              { label: t("ses.fillers"), value: "4", warn: false, hint: t("ses.fillersHint") },
              { label: t("ses.eye"), value: "82%", warn: false, hint: t("ses.eyeHint") },
              { label: t("ses.tone"), value: "B+", warn: false, hint: t("ses.toneHint") },
            ].map(m => (
              <div key={m.label} className="py-3 border-b border-border last:border-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className={`font-mono font-semibold ${m.warn ? "text-destructive" : "text-primary"}`}>{m.value}</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{m.hint}</div>
              </div>
            ))}
          </div>
        </aside>
      </main>

      <footer className="border-t border-border bg-card/40 backdrop-blur-xl px-6 py-4 flex items-center justify-center gap-3">
        <button onClick={() => setMuted(m => !m)} className={`size-12 rounded-full grid place-items-center border transition-colors ${muted ? "bg-destructive border-destructive text-foreground" : "bg-secondary border-border hover:bg-secondary/60"}`}>
          {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
        </button>
        <button className="size-12 rounded-full bg-secondary border border-border grid place-items-center hover:bg-secondary/60">
          <Pause className="size-5" />
        </button>
        <button className="size-12 rounded-full bg-secondary border border-border grid place-items-center hover:bg-secondary/60">
          <Volume2 className="size-5" />
        </button>
        <Link to="/" className="ml-3 h-12 px-6 rounded-full bg-fluid text-background font-semibold text-sm grid place-items-center shadow-glow-cyan">
          {t("ses.end")}
        </Link>
      </footer>
    </div>
  );
};

export default Session;
