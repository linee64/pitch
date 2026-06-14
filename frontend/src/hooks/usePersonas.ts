import { useState, useEffect } from "react";
import { Persona, personas as defaultPersonas } from "@/data/confly";

const STORAGE_KEY = "pitch_ai_custom_personas";

export const usePersonas = () => {
  const [customPersonas, setCustomPersonas] = useState<Persona[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCustomPersonas(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load custom personas", e);
      }
    }
  }, []);

  const allPersonas = [...defaultPersonas, ...customPersonas];

  const addPersona = (persona: Omit<Persona, "id">) => {
    const newPersona: Persona = {
      ...persona,
      id: `custom-${Date.now()}`,
    };
    const updated = [...customPersonas, newPersona];
    setCustomPersonas(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newPersona;
  };

  const deletePersona = (id: string) => {
    const updated = customPersonas.filter(p => p.id !== id);
    setCustomPersonas(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return {
    personas: allPersonas,
    customPersonas,
    addPersona,
    deletePersona,
  };
};
