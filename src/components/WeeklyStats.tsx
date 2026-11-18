import type { GameState } from "../game/types";

interface WeeklyStatsProps {
  state: GameState;
}

export function WeeklyStats({ state }: WeeklyStatsProps) {
  const days: { label: string; done: number; xp: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = state.dailyLog[key] ?? { done: 0, xp: 0 };
    days.push({
      label: ["D", "L", "M", "M", "J", "V", "S"][d.getDay()],
      done: entry.done,
      xp: entry.xp,
    });
  }
  const max = Math.max(1, ...days.map((d) => d.done));
  const weekDone = days.reduce((a, b) => a + b.done, 0);
  const weekXp = days.reduce((a, b) => a + b.xp, 0);

  return (
    <div className="panel stats-card">
      <h3 className="panel-title">📊 7 derniers jours</h3>
      <div className="chart">
        {days.map((d, i) => (
          <div className="chart-col" key={i}>
            <div className="chart-bar-area">
              <div
                className="chart-bar"
                style={{ height: `${(d.done / max) * 100}%` }}
                title={`${d.done} tâche(s), ${d.xp} XP`}
              />
            </div>
            <div className="chart-label">{d.label}</div>
          </div>
        ))}
      </div>
      <div className="stats-summary">
        {weekDone} tâche{weekDone > 1 ? "s" : ""} · {weekXp} XP cette semaine
      </div>
    </div>
  );
}
