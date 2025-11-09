import React, { useEffect, useState } from "react";
import Grid from "./Grid.jsx";
import { LogicGrid } from "../lib/grid.js";
import Footer from "./Footer.jsx";
import { Algorithms} from "../lib/algorithms.js";
import Header from "./Header.jsx";

export default function Main_Display() {
  const [grid] = useState(() => new LogicGrid(30, 30));

    useEffect(() => {
        grid.set_cell(10, 15, 3);
    }, [grid]);
  const [algo, setAlgo] = useState("dumb_search");
  const [mode, setMode] = useState("none");

  const startSearch = () => {
    grid.reset_grid();
    if (algo === "dumb_search") {
      Algorithms.dumb_search(grid);
    } else if (algo === "bfs") {
      console.log("Run BFS here");
      Algorithms.BFS(grid);
    } else if (algo === "dfs") {
      console.log("Run DFS here");
      // Algorithms.dfs(grid);
    }
  };
  return (
    <div>
        <Header
            currentAlgo={algo}
            onSelectAlgo={setAlgo}
            onStart={startSearch}
            onSetStart={() => setMode("set-start")}
            onSetTarget={() => setMode("set-target")}
        />

      <div className="main_container">
        <Grid
            gridObject={grid}
            mode={mode}
            onModeDone={setMode}
        />
      </div>
      <Footer />
    </div>
  );
}
