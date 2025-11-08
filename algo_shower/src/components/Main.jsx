import React, { useEffect, useState } from "react";
import Grid from "./Grid.jsx";
import { LogicGrid } from "../lib/grid.js";
import Footer from "./Footer.jsx";
import { Algorithms} from "../lib/algorithms.js";
import Header from "./Header.jsx";

export default function Main_Display() {
  const [grid] = useState(() => new LogicGrid(30, 30));

   useEffect(() => {
    // place target once
    grid.set_cell(10, 15, 3);

    // start search once
    Algorithms.dumb_search(grid);
  }, [grid]);



  return (
    <div>
        <Header />
      <div className="main_container">
        <Grid gridObject={grid} />
      </div>
      <Footer />
    </div>
  );
}
