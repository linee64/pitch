import { useI18n, Lang } from "@/i18n/i18n";
import { Languages } from "lucide-react";

export const LangToggle = () => {
  const { lang, setLang } = useI18n();
  const next: Lang = lang === "en" ? "ru" : "en";
  return (
    <button
      onClick={() => setLang(next)}
      title={`Switch to ${next.toUpperCase()}`}
      className="h-10 px-3 rounded-lg bg-secondary/60 border border-border flex items-center gap-2 hover:bg-secondary transition-colors text-xs font-mono uppercase tracking-widest"
    >
      <Languages className="size-4" />
      <span className={lang === "en" ? "text-primary" : "text-muted-foreground"}>EN</span>
      <span className="text-muted-foreground">/</span>
      <span className={lang === "ru" ? "text-primary" : "text-muted-foreground"}>RU</span>
    </button>
  );
};
