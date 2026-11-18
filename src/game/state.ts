import type { Difficulty, GameState, ShopItem, Status, Task } from "./types";
import {
  ACHIEVEMENTS,
  DIFFICULTIES,
  ITEMS_BY_ID,
  LOOT_WEIGHTS,
  SUBTASK_REWARD,
  todayKey,
  xpNeeded,
} from "./data";

const STORAGE_KEY = "mistral-quest-save-v1";

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function initialState(): GameState {
  return {
    tasks: [],
    xp: 0,
    level: 1,
    gold: 30,
    streak: 0,
    lastCompletedDay: "",
    ownedItems: [],
    equipped: {},
    achievements: [],
    lootBoxes: 1,
    nextLootLevel: 3,
    dailyLog: {},
    toast: null,
  };
}

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    return { ...initialState(), ...(JSON.parse(raw) as GameState) };
  } catch {
    return initialState();
  }
}

export function saveState(s: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...s, toast: null }));
  } catch {
    /* quota plein : on ignore */
  }
}

export function resetState(): GameState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return initialState();
}

export function dayDiff(from: string, to: string): number {
  if (!from) return Infinity;
  const a = new Date(from + "T00:00:00").getTime();
  const b = new Date(to + "T00:00:00").getTime();
  return Math.round((b - a) / 86400000);
}

export function taskReward(t: Task): { xp: number; gold: number } {
  const base = DIFFICULTIES[t.difficulty];
  return { xp: base.xp, gold: base.gold };
}

export function bossHp(t: Task): { done: number; total: number } {
  const total = t.subtasks.length;
  const done = t.subtasks.filter((st) => st.done).length;
  return { done, total };
}

export type Action =
  | { type: "add-task"; title: string; difficulty: Difficulty; subtasks: string[] }
  | { type: "move-task"; id: string; status: Status }
  | { type: "delete-task"; id: string }
  | { type: "toggle-subtask"; taskId: string; subtaskId: string }
  | { type: "add-subtask"; taskId: string; label: string }
  | { type: "buy-item"; item: ShopItem }
  | { type: "equip-item"; item: ShopItem }
  | { type: "open-lootbox" }
  | { type: "buy-lootbox" }
  | { type: "clear-toast" }
  | { type: "reset" };

function grantReward(s: GameState, xp: number, gold: number): GameState {
  let level = s.level;
  let totalXp = s.xp + xp;
  let levelUps = 0;
  while (totalXp >= xpNeeded(level)) {
    totalXp -= xpNeeded(level);
    level += 1;
    levelUps += 1;
  }
  let nextLootLevel = s.nextLootLevel;
  let lootBoxes = s.lootBoxes;
  if (levelUps > 0) {
    while (nextLootLevel <= level) {
      lootBoxes += 1;
      nextLootLevel += 3;
    }
  }
  const toast =
    levelUps > 0
      ? `⬆️ Niveau ${level} ! +${lootBoxes > s.lootBoxes ? "1 loot box" : ""}`.trim()
      : s.toast;
  return { ...s, xp: totalXp, level, gold: s.gold + gold, lootBoxes, nextLootLevel, toast };
}

function logDaily(s: GameState, xp: number): GameState {
  const key = todayKey();
  const prev = s.dailyLog[key] ?? { done: 0, xp: 0 };
  return {
    ...s,
    dailyLog: { ...s.dailyLog, [key]: { done: prev.done + 1, xp: prev.xp + xp } },
  };
}

function updateStreak(s: GameState): GameState {
  const key = todayKey();
  if (s.lastCompletedDay === key) return s;
  const gap = dayDiff(s.lastCompletedDay, key);
  const streak = gap === 1 ? s.streak + 1 : 1;
  let next: GameState = { ...s, streak, lastCompletedDay: key };
  const bonusXp = Math.min(streak, 7) * 5;
  if (bonusXp > 0) next = grantReward(next, bonusXp, 0);
  if (bonusXp > 5) next = { ...next, toast: `🔥 Streak ${streak} jours ! Bonus +${bonusXp} XP` };
  return next;
}

function checkAchievements(s: GameState): GameState {
  const unlocked: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (!s.achievements.includes(a.id) && a.check(s)) unlocked.push(a.id);
  }
  if (unlocked.length === 0) return s;
  const names = unlocked
    .map((id) => ACHIEVEMENTS.find((a) => a.id === id)?.name)
    .filter(Boolean)
    .join(", ");
  return {
    ...s,
    achievements: [...s.achievements, ...unlocked],
    toast: `🏆 Succès : ${names}`,
  };
}

function rollLoot(s: GameState): GameState {
  const pool = Object.values(ITEMS_BY_ID).filter((i) => !s.ownedItems.includes(i.id));
  if (pool.length === 0) {
    return { ...s, lootBoxes: s.lootBoxes - 1, gold: s.gold + 40, toast: "🎁 Loot box : déjà tout possédé ! +40 or" };
  }
  const weights = LOOT_WEIGHTS;
  const byRarity: Record<string, typeof pool> = {};
  for (const item of pool) (byRarity[item.rarity] ??= []).push(item);
  const total = Object.entries(weights).reduce((sum, [r, w]) => {
    return sum + (byRarity[r]?.length ? w : 0);
  }, 0);
  let roll = Math.random() * total;
  let picked: ShopItem = pool[0];
  for (const [rarity, w] of Object.entries(weights)) {
    const count = byRarity[rarity]?.length ?? 0;
    if (count === 0) continue;
    if (roll < w) {
      picked = byRarity[rarity][Math.floor(Math.random() * count)];
      break;
    }
    roll -= w;
  }
  return {
    ...s,
    lootBoxes: s.lootBoxes - 1,
    ownedItems: [...s.ownedItems, picked.id],
    toast: `🎁 Loot box : ${picked.name} (${picked.rarity}) !`,
  };
}

export function reducer(s: GameState, action: Action): GameState {
  switch (action.type) {
    case "add-task": {
      const task: Task = {
        id: uid(),
        title: action.title.trim() || "Tâche sans nom",
        difficulty: action.difficulty,
        status: "todo",
        createdAt: Date.now(),
        completedAt: null,
        subtasks: action.subtasks
          .map((label) => label.trim())
          .filter(Boolean)
          .map((label) => ({ id: uid(), label, done: false })),
      };
      return { ...s, tasks: [...s.tasks, task] };
    }
    case "move-task": {
      const task = s.tasks.find((t) => t.id === action.id);
      if (!task) return s;
      const wasDone = task.status === "done";
      let next: GameState = {
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === action.id
            ? {
                ...t,
                status: action.status,
                completedAt: action.status === "done" ? Date.now() : null,
              }
            : t
        ),
      };
      if (action.status === "done" && !wasDone) {
        const rw = DIFFICULTIES[task.difficulty];
        next = grantReward(next, rw.xp, rw.gold);
        next = logDaily(next, rw.xp);
        next = updateStreak(next);
        next = checkAchievements(next);
      }
      return next;
    }
    case "delete-task":
      return { ...s, tasks: s.tasks.filter((t) => t.id !== action.id) };
    case "toggle-subtask": {
      const task = s.tasks.find((t) => t.id === action.taskId);
      if (!task) return s;
      const sub = task.subtasks.find((st) => st.id === action.subtaskId);
      if (!sub) return s;
      const nowDone = !sub.done;
      let next: GameState = {
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === task.id
            ? {
                ...t,
                subtasks: t.subtasks.map((st) =>
                  st.id === sub.id ? { ...st, done: nowDone } : st
                ),
              }
            : t
        ),
      };
      if (nowDone) {
        next = grantReward(next, SUBTASK_REWARD.xp, SUBTASK_REWARD.gold);
        next = logDaily(next, SUBTASK_REWARD.xp);
        next = updateStreak(next);
        const updated = next.tasks.find((t) => t.id === task.id)!;
        const allDone = updated.subtasks.every((st) => st.done);
        if (allDone && updated.status !== "done") {
          const rw = DIFFICULTIES[task.difficulty];
          next = {
            ...next,
            tasks: next.tasks.map((t) =>
              t.id === task.id ? { ...t, status: "done", completedAt: Date.now() } : t
            ),
          };
          next = grantReward(next, rw.xp, rw.gold);
          next = logDaily(next, rw.xp);
          next = {
            ...next,
            toast: `☠️ Boss vaincu ! +${rw.xp} XP +${rw.gold} or`,
          };
        }
      }
      return checkAchievements(next);
    }
    case "add-subtask":
      return {
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === action.taskId
            ? {
                ...t,
                subtasks: [...t.subtasks, { id: uid(), label: action.label.trim(), done: false }],
              }
            : t
        ),
      };
    case "buy-item": {
      if (s.ownedItems.includes(action.item.id) || s.gold < action.item.price) return s;
      const next = { ...s, gold: s.gold - action.item.price, ownedItems: [...s.ownedItems, action.item.id] };
      return checkAchievements({ ...next, toast: `🛒 ${action.item.name} acheté !` });
    }
    case "equip-item": {
      const slot = action.item.slot;
      const equipped = { ...s.equipped };
      if (equipped[slot] === action.item.id) delete equipped[slot];
      else equipped[slot] = action.item.id;
      return { ...s, equipped };
    }
    case "open-lootbox": {
      if (s.lootBoxes <= 0) return s;
      return checkAchievements(rollLoot(s));
    }
    case "buy-lootbox": {
      if (s.gold < 60) return s;
      return { ...s, gold: s.gold - 60, lootBoxes: s.lootBoxes + 1 };
    }
    case "clear-toast":
      return { ...s, toast: null };
    case "reset":
      return resetState();
    default:
      return s;
  }
}
