import type { GameState, ItemSlot, ShopItem } from "../game/types";
import { LOOTBOX_PRICE, RARITY_CLASS, SHOP_ITEMS } from "../game/data";
import type { Action } from "../game/state";
import { PixelSprite } from "./PixelSprite";

const SLOT_LABEL: Record<ItemSlot, string> = {
  hat: "Tête",
  cape: "Cape",
  pet: "Familier",
  theme: "Thème",
};

interface ShopProps {
  state: GameState;
  dispatch: (a: Action) => void;
}

export function Shop({ state, dispatch }: ShopProps) {
  return (
    <div className="shop">
      <div className="panel shop-banner">
        <h3 className="panel-title">🛒 Boutique de la Guilde</h3>
        <p>
          Ton or : <strong className="gold-text">🪙 {state.gold}</strong>
        </p>
        <button
          className="btn"
          onClick={() => dispatch({ type: "buy-lootbox" })}
          disabled={state.gold < LOOTBOX_PRICE}
        >
          🎁 Acheter une loot box — {LOOTBOX_PRICE} 🪙
        </button>
      </div>
      <div className="shop-grid">
        {SHOP_ITEMS.map((item) => (
          <ShopCard key={item.id} item={item} state={state} dispatch={dispatch} />
        ))}
      </div>
    </div>
  );
}

function ShopCard({
  item,
  state,
  dispatch,
}: {
  item: ShopItem;
  state: GameState;
  dispatch: (a: Action) => void;
}) {
  const owned = state.ownedItems.includes(item.id);
  const equipped = state.equipped[item.slot] === item.id;
  const affordable = state.gold >= item.price;

  return (
    <div className={`shop-card panel ${RARITY_CLASS[item.rarity]}`}>
      <div className="shop-preview">
        {item.sprite ? (
          <PixelSprite rows={item.sprite} palette={item.palette ?? {}} scale={4} />
        ) : (
          <div className="theme-swatches">
            {item.theme &&
              Object.entries(item.theme).map(([k, v]) => (
                <span key={k} className="theme-swatch" style={{ background: v }} />
              ))}
          </div>
        )}
      </div>
      <div className="shop-item-name">{item.name}</div>
      <div className="shop-item-meta">
        <span className="rarity-tag">{item.rarity}</span>
        <span className="slot-tag">{SLOT_LABEL[item.slot]}</span>
      </div>
      <div className="shop-item-desc">{item.desc}</div>
      {owned ? (
        <button className="btn btn-accent" onClick={() => dispatch({ type: "equip-item", item })}>
          {equipped ? "Retirer" : "Équiper"}
        </button>
      ) : (
        <button
          className="btn"
          disabled={!affordable}
          onClick={() => dispatch({ type: "buy-item", item })}
        >
          🪙 {item.price}
        </button>
      )}
    </div>
  );
}
