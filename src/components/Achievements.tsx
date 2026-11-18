import type { GameState } from "../game/types";
import { ACHIEVEMENTS } from "../game/data";

export function Achievements({ state }: { state: GameState }) {
  const unlocked = state.achievements.length;
  return (
    <div className="achievements">
      <div className="panel shop-banner">
        <h3 className="panel-title">🏆 Succès</h3>
        <p>
          {unlocked}/{ACHIEVEMENTS.length} débloqués
        </p>
      </div>
      <div className="ach-grid">
        {ACHIEVEMENTS.map((a) => {
          const got = state.achievements.includes(a.id);
          return (
            <div key={a.id} className={"panel ach-card" + (got ? " ach-unlocked" : " ach-locked")}>
              <div className="ach-icon">{got ? "🏆" : "🔒"}</div>
              <div>
                <div className="ach-name">{a.name}</div>
                <div className="ach-desc">{a.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
