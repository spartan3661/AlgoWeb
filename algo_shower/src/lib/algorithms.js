import { LogicGrid } from "./grid";

export class Algorithms {
  static async dumb_search(grid) {
    const snap = grid.getSnapshot();
    const [h, w] = grid.get_dimensions();

    let start = null;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        if (snap[r][c] === 1) start = [r, c];
      }
    }
    if (!start) return;

    let [r, c] = start;

    while (grid.get_cell(r, c) !== 3) {
      if (grid.get_cell(r, c) === 0) {
        grid.set_cell(r, c, 2);
      }

      const moves = [
        [r-1, c],
        [r+1, c],
        [r, c-1],
        [r, c+1],
      ];
      const [nr, nc] = moves[Math.floor(Math.random() * moves.length)];

      if (nr < 0 || nr >= h || nc < 0 || nc >= w) continue;

      r = nr;
      c = nc;
      await new Promise(res => setTimeout(res, 10));
    }
    console.log("Found target at", r, c);
  }
}
