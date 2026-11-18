interface PixelSpriteProps {
  rows: string[];
  palette: Record<string, string>;
  scale?: number;
  className?: string;
}

export function PixelSprite({ rows, palette, scale = 4, className }: PixelSpriteProps) {
  const cols = Math.max(...rows.map((r) => r.length));
  return (
    <div
      className={"pixel-sprite" + (className ? " " + className : "")}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${scale}px)`,
        width: cols * scale,
        imageRendering: "pixelated",
      }}
      aria-hidden="true"
    >
      {rows.flatMap((row, y) =>
        row.split("").map((ch, x) => (
          <div
            key={`${x}-${y}`}
            style={{
              width: scale,
              height: scale,
              background: palette[ch] ?? "transparent",
            }}
          />
        ))
      )}
    </div>
  );
}
