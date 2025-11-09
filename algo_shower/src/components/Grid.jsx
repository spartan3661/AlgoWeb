import React from "react";
import { useSyncExternalStore } from "react";

export default function Grid({ gridObject, mode = "none", onModeDone }) {
  const colors = {
    0: "white", // empty
    1: "black", // start
    2: "red",   // visited
    3: "blue",  // target
    4: "green",
  };

  const cells = useSyncExternalStore(
    gridObject.subscribe,
    gridObject.getSnapshot,
    gridObject.getSnapshot
  );

  const rows = cells.length || 0;
  const cols = rows ? cells[0].length : 0;
  if (!rows || !cols) return null;

  const handleCellClick = (r, c) => {
    if (!mode || mode === "none") return;

    if (mode === "set-start") {
      gridObject.set_start(r, c);
    } else if (mode === "set-target") {
      // ensure only one target exists: clear any existing '3'
      const snap = gridObject.getSnapshot();
      gridObject.mutate((g) => {
        for (let i = 0; i < snap.length; i++) {
          for (let j = 0; j < snap[0].length; j++) {
            if (g[i][j] === 3) g[i][j] = 0;
          }
        }
      });
      gridObject.set_cell(r, c, 3);
    }

    onModeDone?.("none"); // reset mode after setting
  };

  const cursor =
    mode === "set-start" ? "crosshair" :
    mode === "set-target" ? "cell" :
    "default";

  return (
    <div
      style={{
        width: `min(90vw, calc(90vh * ${cols} / ${rows}))`,
        aspectRatio: `${cols} / ${rows}`,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        margin: "0 auto",
        cursor,
      }}
    >
      {cells.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            onClick={() => handleCellClick(r, c)}
            title={
              mode === "set-start" ? "Click to set Start"
              : mode === "set-target" ? "Click to set Target"
              : undefined
            }
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
