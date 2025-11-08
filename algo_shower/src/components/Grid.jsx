import React from "react";
import { useSyncExternalStore } from "react";

export default function Grid({ gridObject }) {
    const colors = {
        0: "white",
        1: "black",
        2: "red",
        3: "blue",
        4: "green",
    };
  const cells = useSyncExternalStore(
    gridObject.subscribe,          // subscribe(fn) => unsubscribe
    gridObject.getSnapshot,        // returns the cached snapshot
    gridObject.getSnapshot         // server snapshot (same is fine here)
  );

  const rows = cells.length || 0;
  const cols = rows ? cells[0].length : 0;
  if (!rows || !cols) return null;

  return (
    <div
      style={{
        width: `min(90vw, calc(90vh * ${cols} / ${rows}))`,
        aspectRatio: `${cols} / ${rows}`,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        margin: "0 auto",
      }}
    >
      {cells.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              border: "1px solid #000",
              background: colors[cell] ?? "white",
            }}
          />
        ))
      )}
    </div>
  );
}
