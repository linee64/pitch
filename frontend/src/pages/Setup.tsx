import { useParams, Link, useNavigate } from "react-router-dom";
import { AppShell } from "@/components/confly/AppShell";
import { scenarios } from "@/data/confly";
import { usePersonas } from "@/hooks/usePersonas";
import { Upload, FileText, Check, ArrowRight, Clock, ChevronLeft, User, Trash2 } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/i18n";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddAdvisorDialog } from "@/components/confly/AddAdvisorDialog";

const Setup = () => {
  const { t } = useI18n();
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const { personas, deletePersona } = usePersonas();
  
  const [currentScenarioId, setCurrentScenarioId] = useState(scenarioId || "custom-upload");
  const scenario = scenarios.find(s => s.id === currentScenarioId) ?? scenarios[0];
  
  const [picked, setPicked] = useState(scenario.recommendedPersonaIds[0] ?? personas[0].id);
  const [intensity, setIntensity] = useState(scenario.intensity || 7);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  
  const pickedPersona = personas.find(p => p.id === picked) || personas[0];

  const handlePresentationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const intensityLabel = (key: "support" | "detail") => {
    if (key === "support") return intensity > 7 ? t("setup.critical") : intensity > 4 ? t("setup.encouraging") : t("setup.friendly");
    return intensity > 7 ? t("setup.deep") : intensity > 4 ? t("setup.comprehensive") : t("setup.concise");
  };

  return (
    <AppShell title={t(`sc.${scenario.id}.t`)} subtitle={t(`sc.${scenario.id}.d`)}>
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group">
        <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
        {t("setup.back")}
      </Link>
      
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card/60 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-7 rounded-md bg-fluid text-background grid place-items-center font-display text-sm font-bold">1</div>
              <h3 className="font-display text-xl font-bold tracking-tight">{t("setup.step1")}</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {personas.map(p => {
                const active = picked === p.id;
                const isCustom = p.id.startsWith("custom-");
                return (
                  <button
                    key={p.id}
                    onClick={() => setPicked(p.id)}
                    className={`relative text-left rounded-xl overflow-hidden border transition-all ${active ? "border-primary shadow-glow-cyan" : "border-border hover:border-primary/40"}`}
                  >
                    <div className="flex gap-4 p-3">
                      <div className="relative size-20 rounded-lg overflow-hidden shrink-0 bg-secondary flex items-center justify-center">
                        {p.image ? (
                          <img src={p.image} alt={p.name} loading="lazy" width={768} height={960} className="size-full object-cover mix-blend-luminosity opacity-90" />
                        ) : (
                          <User className="size-8 text-muted-foreground opacity-40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="text-[10px] font-mono uppercase tracking-widest text-primary truncate">
                          {isCustom ? t("idx.custom") : t("setup.conflyAdvisor")}
                        </div>
                        <div className="font-display font-bold mt-0.5 truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {isCustom ? p.role : t(`p.${p.id}.role`)}
                        </div>
                      </div>
                      {active && <div className="size-5 rounded-full bg-primary text-background grid place-items-center shrink-0"><Check className="size-3" strokeWidth={3} /></div>}
                      {isCustom && !active && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePersona(p.id);
                          }}
                          className="size-5 rounded-lg border border-border bg-secondary/50 text-muted-foreground flex items-center justify-center hover:text-destructive hover:bg-background transition-all shrink-0"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      )}
                    </div>
                  </button>
                );
              })}
              <AddAdvisorDialog onSave={(p) => setPicked(p.id)} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card/60 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-7 rounded-md bg-fluid text-background grid place-items-center font-display text-sm font-bold">2</div>
              <h3 className="font-display text-xl font-bold tracking-tight">{t("setup.step2")}</h3>
            </div>
            {!uploadedFile ? (
              <label className="w-full rounded-xl border-2 border-dashed border-border bg-secondary/20 hover:border-primary/40 hover:bg-secondary/40 transition-all py-12 flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground cursor-pointer">
                <input type="file" className="hidden" accept=".pdf,.pptx,.key" onChange={handlePresentationUpload} />
                <div className="size-12 rounded-full bg-secondary grid place-items-center"><Upload className="size-5" /></div>
                <div className="font-display text-lg font-semibold">{t("setup.drop")}</div>
                <div className="text-xs">{t("setup.dropHint")}</div>
              </label>
            ) : (
              <div className="rounded-xl border border-border bg-secondary/40 p-4 flex items-center gap-4">
                <div className="size-12 rounded-lg bg-fluid grid place-items-center text-background"><FileText className="size-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{uploadedFile}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{t("setup.slidesLoaded")}</div>
                </div>
                <button onClick={() => setUploadedFile(null)} className="text-xs text-muted-foreground hover:text-destructive transition-colors uppercase font-mono tracking-widest px-2 py-1">Remove</button>
                <div className="size-6 rounded-full bg-primary text-background grid place-items-center"><Check className="size-3.5" strokeWidth={3} /></div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card/60 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-7 rounded-md bg-fluid text-background grid place-items-center font-display text-sm font-bold">3</div>
              <h3 className="font-display text-xl font-bold tracking-tight">{t("setup.step3")}</h3>
            </div>
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">
              <span>{t("setup.mentor")}</span>
              <span className="text-primary">{intensity}/10</span>
              <span>{t("setup.brutal")}</span>
            </div>
            <input type="range" min="1" max="10" value={intensity} onChange={(e) => setIntensity(+e.target.value)} className="w-full accent-primary" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 text-xs">
              <div className="rounded-lg bg-secondary/40 border border-border p-3 flex flex-col justify-center min-h-[72px]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground leading-none">{t("setup.support")}</div>
                <div className="font-display text-base font-bold mt-2 leading-tight break-words">{intensityLabel("support")}</div>
              </div>
              <div className="rounded-lg bg-secondary/40 border border-border p-3 flex flex-col justify-center min-h-[72px]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground leading-none">{t("setup.detail")}</div>
                <div className="font-display text-base font-bold mt-2 leading-tight break-words">{intensityLabel("detail")}</div>
              </div>
              <div className="rounded-lg bg-secondary/40 border border-border p-3 flex flex-col justify-center min-h-[72px]">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground leading-none">{t("setup.followups")}</div>
                <div className="font-display text-base font-bold mt-2 leading-tight break-words">{intensityLabel("support") === t("setup.critical") ? t("setup.frequent") : intensityLabel("support") === t("setup.encouraging") ? t("setup.moderate") : t("setup.rare")}</div>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-32 h-fit">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="relative aspect-[4/5] bg-secondary flex items-center justify-center">
              {pickedPersona.image ? (
                <img src={pickedPersona.image} alt="" loading="lazy" width={768} height={960} className="size-full object-cover mix-blend-luminosity opacity-80" />
              ) : (
                <User className="size-20 text-muted-foreground opacity-20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-primary">{t("setup.locked")}</div>
                <div className="font-display text-2xl font-bold mt-1">{pickedPersona.name}</div>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{t("setup.scenario")}</div>
                <Select value={currentScenarioId} onValueChange={setCurrentScenarioId}>
                  <SelectTrigger className="w-full h-10 bg-secondary/40 border-border text-sm font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {scenarios.map(s => (
                      <SelectItem key={s.id} value={s.id} className="text-sm">{t(`sc.${s.id}.t`)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("setup.duration")}</span><span className="font-mono flex items-center gap-1.5"><Clock className="size-3.5" />{scenario.duration}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("setup.slides")}</span><span className="font-medium">{uploadedFile ? "Loaded" : "—"}</span></div>
              <button onClick={() => navigate(`/session/${scenario.id}?p=${picked}`)} className="w-full h-12 rounded-xl bg-fluid text-background font-semibold text-sm grid place-items-center shadow-glow-cyan hover:scale-[1.01] transition-transform">
                {t("setup.enter")} <ArrowRight className="inline ml-2 size-4" />
              </button>
              <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">{t("setup.cancel")}</Link>
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
};

export default Setup;
