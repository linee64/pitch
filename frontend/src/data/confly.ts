import investor from "@/assets/persona-investor.jpg";
import professor from "@/assets/persona-professor.jpg";
import hacker from "@/assets/persona-hacker.jpg";
import exec from "@/assets/persona-exec.jpg";

export type Persona = {
  id: string;
  name: string;
  role: string;
  archetype: string;
  hostility: number; // 1-10
  style: string;
  image: string;
  tags: string[];
};

export const personas: Persona[] = [
  {
    id: "vance",
    name: "Elias Vance",
    role: "Tier-1 VC Partner",
    archetype: "Skeptical Investor",
    hostility: 9,
    style: "Interrupts. Hunts for unit economics. Hates hand-waving.",
    image: investor,
    tags: ["Series A", "B2B SaaS", "Cold"],
  },
  {
    id: "karlsen",
    name: "Dr. Ingrid Karlsen",
    role: "Thesis Committee Chair",
    archetype: "Strict Professor",
    hostility: 7,
    style: "Methodology first. Will dismantle weak citations and assumptions.",
    image: professor,
    tags: ["Defense", "Academic", "Methodical"],
  },
  {
    id: "ren",
    name: "Marcus Ren",
    role: "Hackathon Lead Judge",
    archetype: "Tech Pragmatist",
    hostility: 6,
    style: "Wants to see the demo. Asks about stack, scale, what's real vs mock.",
    image: hacker,
    tags: ["Demo Day", "Hackathon", "Direct"],
  },
  {
    id: "moreau",
    name: "Claire Moreau",
    role: "Board Director",
    archetype: "Corporate Executive",
    hostility: 5,
    style: "Strategic. Risk-focused. Polite but uncompromising on numbers.",
    image: exec,
    tags: ["Board", "Strategy", "Corporate"],
  },
];

export type Scenario = {
  id: string;
  category: "Startup" | "Academia" | "Competition" | "Work" | "Custom";
  title: string;
  description: string;
  duration: string;
  intensity: number;
  recommendedPersonaIds: string[];
};

export const scenarios: Scenario[] = [
  {
    id: "yc-interview",
    category: "Startup",
    title: "YC Interview",
    description: "10-minute rapid-fire interview. One founder, two partners, no slides allowed.",
    duration: "10 min",
    intensity: 10,
    recommendedPersonaIds: ["vance", "ren"],
  },
  {
    id: "demo-day",
    category: "Startup",
    title: "Demo Day Pitch",
    description: "3-minute pitch + 5 minutes of investor Q&A under spotlight.",
    duration: "8 min",
    intensity: 9,
    recommendedPersonaIds: ["vance", "moreau"],
  },
  {
    id: "thesis-defense",
    category: "Academia",
    title: "Thesis Defense",
    description: "Present your dissertation to a hostile committee. Defend every claim.",
    duration: "30 min",
    intensity: 8,
    recommendedPersonaIds: ["karlsen"],
  },
  {
    id: "conference-talk",
    category: "Academia",
    title: "Academic Conference",
    description: "20-min talk, 10-min Q&A. Peers will probe novelty and rigor.",
    duration: "30 min",
    intensity: 6,
    recommendedPersonaIds: ["karlsen"],
  },
  {
    id: "case-champ",
    category: "Competition",
    title: "Case Championship",
    description: "Solve a business case live. Jury cross-examines your assumptions.",
    duration: "20 min",
    intensity: 8,
    recommendedPersonaIds: ["moreau", "vance"],
  },
  {
    id: "board-review",
    category: "Work",
    title: "Board Review",
    description: "Quarterly performance to the board. Strategic, formal, high stakes.",
    duration: "25 min",
    intensity: 7,
    recommendedPersonaIds: ["moreau"],
  },
  {
    id: "hackathon-jury",
    category: "Competition",
    title: "Hackathon Jury",
    description: "5-min demo to a panel of engineers. Show, don't tell.",
    duration: "8 min",
    intensity: 7,
    recommendedPersonaIds: ["ren"],
  },
  {
    id: "custom-upload",
    category: "Custom",
    title: "Custom Audience",
    description: "Upload a photo of anyone in your life. We'll bring them to life.",
    duration: "Variable",
    intensity: 0,
    recommendedPersonaIds: [],
  },
];

export type SessionRecord = {
  id: string;
  date: string;
  scenario: string;
  persona: string;
  score: number;
  duration: string;
};

export const recentSessions: SessionRecord[] = [
  { id: "s1", date: "Apr 27", scenario: "YC Interview", persona: "Elias Vance", score: 78, duration: "11:24" },
  { id: "s2", date: "Apr 25", scenario: "Thesis Defense", persona: "Dr. Karlsen", score: 84, duration: "28:10" },
  { id: "s3", date: "Apr 23", scenario: "Demo Day Pitch", persona: "Elias Vance", score: 71, duration: "07:55" },
  { id: "s4", date: "Apr 20", scenario: "Hackathon Jury", persona: "Marcus Ren", score: 88, duration: "06:12" },
];
