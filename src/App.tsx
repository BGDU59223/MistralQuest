import { useEffect, useReducer, useState } from "react";
import { loadState, reducer, saveState } from "./game/state";
import { ITEMS_BY_ID } from "./game/data";
import type { GameState } from "./game/types";
import { Board } from "./components/Board";
import { HeroPanel } from "./components/HeroPanel";
import { Shop } from "./components/Shop";
import { Achievements } from "./components/Achievements";
import { PixelSprite } from "./components/PixelSprite";
import "./styles.css";

type Tab = "board" | "hero" | "shop" | "achievements";

const TABS: { id: Tab; label: string }[] = [
  { id: "board", label: "📋 Board" },
  { id: "hero", label: "🧙 Héros" },
  { id: "shop", label: "🛒 Boutique" },
  { id: "achievements", label: "🏆 Succès" },
];

const LOGO_ROWS = [
  "....gg....",
  "..gggggg..",
  ".gg gg gg.",
  ".gggggggg.",
  "..gg gg...",
  "..gg gg...",
];

function applyTheme(state: GameState) {
  const themeId = state.equipped.theme;
  const root = document.documentElement;
  const defaults: Record<string, string> = {
    "--bg": "#17110b",
    "--panel": "#241a10",
    "--card": "#2c2014",
    "--accent": "#ff7000",
    "--accent-dark": "#c25400",
    "--text": "#f5e6c8",
    "--muted": "#a08a68",
  };
  const theme = themeId ? ITEMS_BY_ID[themeId]?.theme : null;
  const vars = { ...defaults, ...(theme ?? {}) };
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [tab, setTab] = useState<Tab>("board");

  useEffect(() => {
    saveState(state);
    applyTheme(state);
  }, [state]);

  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: "clear-toast" }), 3200);
    return () => clearTimeout(t);
  }, [state.toast]);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <PixelSprite rows={LOGO_ROWS} palette={{ g: "#ff7000" }} scale={3} />
          <span className="brand-name">
            MISTRAL <em>QUEST</em>
          </span>
        </div>
        <div className="hud">
          <span className="hud-badge">⬆ Niv. {state.level}</span>
          <span className="hud-badge">🪙 {state.gold}</span>
          <span className="hud-badge">🔥 {state.streak}</span>
          <button
            className="btn btn-danger hud-reset"
            title="Effacer la sauvegarde"
            onClick={() => {
              if (confirm("Effacer toute la progression ?")) dispatch({ type: "reset" });
            }}
          >
            ⟲
          </button>
        </div>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={"tab" + (tab === t.id ? " tab-active" : "")}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main>
        {tab === "board" && <Board state={state} dispatch={dispatch} />}
        {tab === "hero" && <HeroPanel state={state} onOpenLootbox={() => dispatch({ type: "open-lootbox" })} />}
        {tab === "shop" && <Shop state={state} dispatch={dispatch} />}
        {tab === "achievements" && <Achievements state={state} />}
      </main>

      {state.toast && <div className="toast">{state.toast}</div>}

      <footer className="footer">
        Mistral Quest — tes données restent dans ce navigateur (localStorage).
      </footer>
    </div>
  );
}
