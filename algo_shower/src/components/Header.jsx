import React from "react";

export default function Header({
  onStart,
  onSelectAlgo,
  currentAlgo,
  onSetStart,
  onSetTarget,
}) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        background: "#222",
        color: "#fff",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.4rem" }}>
        Algorithm Visualizer
      </h1>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {/* Algorithm dropdown */}
        <select
          value={currentAlgo}
          onChange={(e) => onSelectAlgo(e.target.value)}
          style={{
            padding: "6px 10px",
            background: "#333",
            color: "#fff",
            border: "1px solid #555",
            borderRadius: "4px",
          }}
        >
          <option value="dumb_search">Dumb Search</option>
          <option value="bfs">BFS</option>
          <option value="dfs">DFS</option>
        </select>

        {/* Set start button */}
        <button
          onClick={onSetStart}
          style={{
            padding: "6px 10px",
            background: "#2196F3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Set Start
        </button>

        {/* Set target button */}
        <button
          onClick={onSetTarget}
          style={{
            padding: "6px 10px",
            background: "#E91E63",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Set Target
        </button>

        {/* Start algorithm button */}
        <button
          onClick={onStart}
          style={{
            padding: "6px 14px",
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Start
        </button>
      </div>
    </header>
  );
}
