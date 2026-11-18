import { HERO_PALETTE, HERO_SPRITE, ITEMS_BY_ID, titleForLevel, todayKey, xpNeeded } from "../game/data";
import type { GameState } from "../game/types";
import { dayDiff } from "../game/state";
import { PixelSprite } from "./PixelSprite";
import { WeeklyStats } from "./WeeklyStats";

interface HeroPanelProps {
  state: GameState;
  onOpenLootbox: () => void;
}

export function HeroPanel({ state, onOpenLootbox }: HeroPanelProps) {
  const hat = state.equipped.hat ? ITEMS_BY_ID[state.equipped.hat] : null;
  const cape = state.equipped.cape ? ITEMS_BY_ID[state.equipped.cape] : null;
  const pet = state.equipped.pet ? ITEMS_BY_ID[state.equipped.pet] : null;
  const scale = 6;
  const need = xpNeeded(state.level);
  const pct = Math.min(100, Math.round((state.xp / need) * 100));
  const gap = dayDiff(state.lastCompletedDay, todayKey());
  const displayStreak = gap <= 1 ? state.streak : 0;
  const doneCount = state.tasks.filter((t) => t.status === "done").length;

  return (
    <div className="hero-panel">
      <div className="hero-card panel">
        <div className="hero-stage">
          {cape && (
            <div className="hero-layer" style={{ zIndex: 0 }}>
              <PixelSprite rows={cape.sprite!} palette={cape.palette!} scale={scale} />
            </div>
          )}
          {/* le sprite de base est dans le flux, les calques se positionnent par-dessus */}
          <div className="hero-base hero-bob">
            <PixelSprite rows={HERO_SPRITE} palette={HERO_PALETTE} scale={scale} />
          </div>
          {hat && (
            <div
              className="hero-layer"
              style={{ zIndex: 2, top: -(hat.sprite!.length - 2) * scale }}
            >
              <PixelSprite rows={hat.sprite!} palette={hat.palette!} scale={scale} />
            </div>
          )}
          {pet && (
            <div className="hero-layer hero-pet" style={{ zIndex: 2 }}>
              <PixelSprite rows={pet.sprite!} palette={pet.palette!} scale={4} />
            </div>
          )}
        </div>
        <div className="hero-name">
          HÉROS <span className="hero-title">— {titleForLevel(state.level)}</span>
        </div>
        <div className="xp-bar" title={`${state.xp} / ${need} XP`}>
          <div className="xp-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="xp-label">
          NIVEAU {state.level} · {state.xp}/{need} XP
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-icon">🪙</span> {state.gold} or
          </div>
          <div className="stat">
            <span className="stat-icon">🔥</span> {displayStreak} jour{displayStreak > 1 ? "s" : ""} de streak
          </div>
          <div className="stat">
            <span className="stat-icon">✅</span> {doneCount} tâche{doneCount > 1 ? "s" : ""}
          </div>
        </div>
        <div className="lootbox-row">
          <button
            className="btn btn-accent"
            onClick={onOpenLootbox}
            disabled={state.lootBoxes <= 0}
          >
            🎁 Ouvrir une loot box ({state.lootBoxes})
          </button>
          <span className="lootbox-hint">
            1 box offerte tous les 3 niveaux (prochain : niv. {state.nextLootLevel})
          </span>
        </div>
      </div>
      <WeeklyStats state={state} />
    </div>
  );
}
