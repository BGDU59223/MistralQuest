export type Difficulty = "facile" | "moyenne" | "difficile" | "boss";
export type Status = "todo" | "doing" | "done";
export type ItemSlot = "hat" | "cape" | "pet" | "theme";
export type Rarity = "commun" | "rare" | "epique" | "legendaire";

export interface Subtask {
  id: string;
  label: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  difficulty: Difficulty;
  status: Status;
  createdAt: number;
  completedAt: number | null;
  subtasks: Subtask[];
}

export interface ShopItem {
  id: string;
  name: string;
  slot: ItemSlot;
  rarity: Rarity;
  price: number;
  sprite?: string[];
  palette?: Record<string, string>;
  theme?: Record<string, string>;
  desc: string;
}

export interface GameState {
  tasks: Task[];
  xp: number;
  level: number;
  gold: number;
  streak: number;
  lastCompletedDay: string;
  ownedItems: string[];
  equipped: Partial<Record<ItemSlot, string>>;
  achievements: string[];
  lootBoxes: number;
  nextLootLevel: number;
  dailyLog: Record<string, { done: number; xp: number }>;
  toast: string | null;
}

export interface Reward {
  xp: number;
  gold: number;
}
