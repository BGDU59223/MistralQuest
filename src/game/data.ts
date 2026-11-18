import type { Difficulty, GameState, Rarity, Reward, ShopItem } from "./types";

export const DIFFICULTIES: Record<
  Difficulty,
  { label: string; xp: number; gold: number; icon: string; cls: string }
> = {
  facile: { label: "Facile", xp: 10, gold: 6, icon: "·", cls: "diff-facile" },
  moyenne: { label: "Moyenne", xp: 25, gold: 14, icon: "◆", cls: "diff-moyenne" },
  difficile: { label: "Difficile", xp: 55, gold: 30, icon: "★", cls: "diff-difficile" },
  boss: { label: "Boss", xp: 140, gold: 75, icon: "☠", cls: "diff-boss" },
};

export const SUBTASK_REWARD: Reward = { xp: 18, gold: 9 };

export function xpNeeded(level: number): number {
  return 100 + (level - 1) * 80;
}

export function titleForLevel(level: number): string {
  if (level >= 16) return "Légende du Mistral";
  if (level >= 12) return "Maître des Tâches";
  if (level >= 8) return "Héros";
  if (level >= 5) return "Aventurier";
  if (level >= 3) return "Apprenti";
  return "Novice";
}

export const HERO_SPRITE: string[] = [
  "....hhhh....",
  "...hhhhhh...",
  "..hssssssh..",
  "..hsessesh..",
  "..hssssssh..",
  "...ssssss...",
  "..otttttto..",
  ".otttttttto.",
  ".otttttttto.",
  ".otggggggto.",
  "..otttttto..",
  "..ss....ss..",
  "..bb....bb..",
  ".bbb....bbb.",
];

export const HERO_PALETTE: Record<string, string> = {
  h: "#4a2c14",
  s: "#f4c08a",
  e: "#241505",
  o: "#c25400",
  t: "#ff7000",
  g: "#ffc46b",
  b: "#3a2410",
};

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "hat-beret",
    name: "Béret du Dev",
    slot: "hat",
    rarity: "commun",
    price: 40,
    desc: "Classique mais efficace.",
    sprite: ["............", "...rrrrrr...", ".rrrrrrrrr..", "....rr......"],
    palette: { r: "#d43d2a" },
  },
  {
    id: "hat-cap",
    name: "Casquette Mistral",
    slot: "hat",
    rarity: "commun",
    price: 55,
    desc: "Aux couleurs de la maison.",
    sprite: ["...tttttt...", "..tttttttt..", "vvvvvvvvvv.."],
    palette: { t: "#ff7000", v: "#c25400" },
  },
  {
    id: "hat-wizard",
    name: "Chapeau de Sorcier",
    slot: "hat",
    rarity: "rare",
    price: 120,
    desc: "+10 en productivité magique.",
    sprite: [".....ww.....", "....wwww....", "....wwww....", "...wwwwww...", "..wwwwwwww..", "wwwwwwwwwwww"],
    palette: { w: "#8a4fff" },
  },
  {
    id: "hat-crown",
    name: "Couronne",
    slot: "hat",
    rarity: "epique",
    price: 240,
    desc: "Pour les rois du Kanban.",
    sprite: [".g.g.g.g.g..", ".gggggggggg.", ".ggrgggrggg."],
    palette: { g: "#ffc46b", r: "#ff4d4d" },
  },
  {
    id: "cape-red",
    name: "Cape Écarlate",
    slot: "cape",
    rarity: "commun",
    price: 60,
    desc: "Flotte au vent des deadlines.",
    sprite: [
      "............",
      "............",
      "cc........cc",
      "ccc......ccc",
      "cccc....cccc",
      "cccc....cccc",
      "cccc....cccc",
      "cccc....cccc",
      "cccc....cccc",
      "cccc....cccc",
      "ccc......ccc",
    ],
    palette: { c: "#d43d2a" },
  },
  {
    id: "cape-gold",
    name: "Cape Dorée",
    slot: "cape",
    rarity: "epique",
    price: 220,
    desc: "Tissée dans la lumière.",
    sprite: [
      "............",
      "............",
      "cc........cc",
      "ccc......ccc",
      "cccc....cccc",
      "cccc....cccc",
      "cccc....cccc",
      "cccc....cccc",
      "cccc....cccc",
      "cccc....cccc",
      "ccc......ccc",
    ],
    palette: { c: "#ffc46b" },
  },
  {
    id: "pet-fox",
    name: "Renard Pixel",
    slot: "pet",
    rarity: "rare",
    price: 150,
    desc: "Le mascot officiel.",
    sprite: ["f.f.....", "fffw....", "ffffff..", "fkffkf..", ".fffff..", "..f.f..."],
    palette: { f: "#ff7000", w: "#fff3e0", k: "#241505" },
  },
  {
    id: "pet-owl",
    name: "Hibou Sage",
    slot: "pet",
    rarity: "rare",
    price: 140,
    desc: "Rappelle tes deadlines en hulant.",
    sprite: ["o.o.....", "ooooo...", "owowo...", "ooooo...", ".o.o...."],
    palette: { o: "#8a6b4a", w: "#ffffff" },
  },
  {
    id: "pet-slime",
    name: "Slime de Stockage",
    slot: "pet",
    rarity: "commun",
    price: 45,
    desc: "Avale tes tâches terminées.",
    sprite: ["........", "..ssss..", ".ssssss.", ".skssks.", "ssssssss", ".ssssss."],
    palette: { s: "#6fdc8c", k: "#0d3a1c" },
  },
  {
    id: "pet-dragon",
    name: "Bébé Dragon",
    slot: "pet",
    rarity: "legendaire",
    price: 450,
    desc: "Crache des flammelettes sur la procrastination.",
    sprite: ["d..d....", "ddddd...", "ddddd...", "dkddkd..", ".ddddd..", "..d.d..."],
    palette: { d: "#ff4d4d", k: "#3a0a0a" },
  },
  {
    id: "theme-nuit",
    name: "Thème : Nuit Étoilée",
    slot: "theme",
    rarity: "rare",
    price: 100,
    desc: "Code sous les étoiles.",
    theme: {
      "--bg": "#0b0e1a",
      "--panel": "#141a2e",
      "--card": "#1a2240",
      "--accent": "#7aa2ff",
      "--accent-dark": "#4a6ad4",
      "--text": "#dfe6ff",
      "--muted": "#8a94b8",
    },
  },
  {
    id: "theme-foret",
    name: "Thème : Forêt",
    slot: "theme",
    rarity: "rare",
    price: 100,
    desc: "Productivité en pleine nature.",
    theme: {
      "--bg": "#0d1a10",
      "--panel": "#16281a",
      "--card": "#1d3322",
      "--accent": "#6fdc8c",
      "--accent-dark": "#3ea85e",
      "--text": "#e2f5e6",
      "--muted": "#7ea88a",
    },
  },
  {
    id: "theme-or",
    name: "Thème : Sable d'Or",
    slot: "theme",
    rarity: "epique",
    price: 200,
    desc: "La chaleur du désert dans ton board.",
    theme: {
      "--bg": "#1c150a",
      "--panel": "#2a2010",
      "--card": "#332814",
      "--accent": "#ffc46b",
      "--accent-dark": "#d4943a",
      "--text": "#fff3e0",
      "--muted": "#b8a07a",
    },
  },
];

export const ITEMS_BY_ID: Record<string, ShopItem> = Object.fromEntries(
  SHOP_ITEMS.map((i) => [i.id, i])
);

export const RARITY_CLASS: Record<Rarity, string> = {
  commun: "rarity-commun",
  rare: "rarity-rare",
  epique: "rarity-epique",
  legendaire: "rarity-legendaire",
};

export const LOOT_WEIGHTS: Record<Rarity, number> = {
  commun: 55,
  rare: 27,
  epique: 13,
  legendaire: 5,
};

export const LOOTBOX_PRICE = 60;

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  check: (s: GameState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-task", name: "Premier Pas", desc: "Terminer 1 tâche", check: (s) => totalDone(s) >= 1 },
  { id: "ten-tasks", name: "Cadreur", desc: "Terminer 10 tâches", check: (s) => totalDone(s) >= 10 },
  { id: "fifty-tasks", name: "Machine", desc: "Terminer 50 tâches", check: (s) => totalDone(s) >= 50 },
  { id: "streak-3", name: "Habitué", desc: "Streak de 3 jours", check: (s) => s.streak >= 3 },
  { id: "streak-7", name: "Semaine Parfaite", desc: "Streak de 7 jours", check: (s) => s.streak >= 7 },
  { id: "level-5", name: "Aventurier", desc: "Atteindre le niveau 5", check: (s) => s.level >= 5 },
  { id: "level-10", name: "Héros", desc: "Atteindre le niveau 10", check: (s) => s.level >= 10 },
  { id: "first-boss", name: "Tueur de Boss", desc: "Vaincre un Boss", check: (s) => s.tasks.some((t) => t.difficulty === "boss" && t.status === "done") },
  { id: "first-purchase", name: "Cliente Fidèle", desc: "Acheter un objet", check: (s) => s.ownedItems.length >= 1 },
  { id: "full-board", name: "Board Zéro", desc: "Vider son board (0 tâche restante)", check: (s) => s.tasks.length > 0 && s.tasks.every((t) => t.status === "done") },
];

export function totalDone(s: GameState): number {
  return s.tasks.filter((t) => t.status === "done").length;
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}
