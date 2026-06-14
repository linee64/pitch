import { useState } from "react";
import { Plus, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/i18n";
import { usePersonas } from "@/hooks/usePersonas";
import { Persona } from "@/data/confly";

interface AddAdvisorDialogProps {
  onSave?: (persona: Persona) => void;
  trigger?: React.ReactNode;
}

export const AddAdvisorDialog = ({ onSave, trigger }: AddAdvisorDialogProps) => {
  const { t } = useI18n();
  const { addPersona } = usePersonas();
  const [isOpen, setIsOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Use a reasonable quality to keep base64 size manageable for localStorage
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          setPhoto(dataUrl);
          setIsProcessing(false);
        };
        img.onerror = () => setIsProcessing(false);
        img.src = event.target?.result as string;
      };
      reader.onerror = () => setIsProcessing(false);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name || !role) return;
    
    const newPersona = addPersona({
      name,
      role,
      archetype: "Custom Advisor",
      hostility: 5,
      style: "Custom style based on user definition.",
      image: photo || "",
      tags: ["Custom"],
    });
    
    onSave?.(newPersona);
    setIsOpen(false);
    setName("");
    setRole("");
    setPhoto(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setPhoto(null);
        setName("");
        setRole("");
      }
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="flex items-center gap-4 p-3 rounded-xl border border-dashed border-border bg-secondary/10 hover:bg-secondary/30 hover:border-primary/40 transition-all text-left group">
            <div className="size-20 rounded-lg bg-secondary/50 border border-border grid place-items-center shrink-0 group-hover:bg-secondary transition-colors">
              <Plus className="size-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold truncate group-hover:text-primary transition-colors">{t("setup.addAdvisor")}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1 line-clamp-2 leading-tight">
                {t("per.uploadTitle")}
              </div>
            </div>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold">{t("setup.addAdvisor")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="photo" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{t("setup.advisorPhoto")}</Label>
            <label className="relative h-32 rounded-xl border-2 border-dashed border-border bg-secondary/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/40 transition-colors overflow-hidden">
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              {photo ? (
                <>
                  <img src={photo} alt="Preview" className="absolute inset-0 size-full object-cover mix-blend-luminosity opacity-60" />
                  <div className="relative glass px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon className="size-3" /> Change Photo
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon className="size-6 text-muted-foreground" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">PNG, JPG up to 5MB</span>
                </>
              )}
            </label>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{t("setup.advisorName")}</Label>
            <Input 
              id="name" 
              placeholder="Elias Vance" 
              className="bg-secondary/40 border-border"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role" className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{t("setup.advisorRole")}</Label>
            <Input 
              id="role" 
              placeholder="Product Manager" 
              className="bg-secondary/40 border-border"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <button 
            onClick={handleSave}
            className="w-full h-11 rounded-xl bg-fluid text-background font-semibold text-sm shadow-glow-cyan hover:scale-[1.01] transition-transform disabled:opacity-50 disabled:hover:scale-100"
            disabled={!name || !role || !photo || isProcessing}
          >
            {isProcessing ? "Processing..." : t("setup.saveAdvisor")}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
