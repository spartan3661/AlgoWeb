import { LogicGrid } from "./grid";

export class Algorithms {
  static sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  static async BFS(grid) {
    // Ensure we have a start and a target
    const start = grid.get_start?.() ?? null;
    const target = grid.get_target?.() ?? null;

    if (!start || start.length !== 2) return;
    if (!target || target.length !== 2) return;

    const [h, w] = grid.get_dimensions();
    const [sr, sc] = start;
    const [tr, tc] = target;


    grid.beginBatch();
    try {
      grid.mutate((g) => {
        for (let r = 0; r < h; r++) {
          for (let c = 0; c < w; c++) {
            if (g[r][c] === 2 || g[r][c] === 4) g[r][c] = 0;
          }
        }
        g[sr][sc] = 1;
        g[tr][tc] = 3;
      });
    } finally {
      grid.endBatch();
    }

    // BFS setup
    const inBounds = (r, c) => r >= 0 && r < h && c >= 0 && c < w;
    const key = (r, c) => `${r},${c}`;

    const visited = new Array(h).fill(null).map(() => new Array(w).fill(false));
    const parent = new Map();

    const q = [];
    let qi = 0;

    q.push([sr, sc]);
    visited[sr][sc] = true;

    const dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    let found = false;

    while (qi < q.length) {
      const [r, c] = q[qi++];
      if (r === tr && c === tc) {
        found = true;
        break;
      }

      for (const [dr, dc] of dirs) {
        const nr = r + dr,
          nc = c + dc;
        if (!inBounds(nr, nc)) continue;
        if (visited[nr][nc]) continue;

        const cell = grid.get_cell(nr, nc);
        if (cell === 0 || cell === 3) {
          visited[nr][nc] = true;
          parent.set(key(nr, nc), key(r, c));
          q.push([nr, nc]);

          if (!(nr === tr && nc === tc)) {
            grid.set_cell(nr, nc, 2);
            await Algorithms.sleep(10);
          }
        }
      }
    }

    if (!found) {
      return;
    }

    const path = [];
    let curKey = key(tr, tc);
    while (curKey !== key(sr, sc)) {
      const [rr, cc] = curKey.split(",").map(Number);
      path.push([rr, cc]);
      const pKey = parent.get(curKey);
      if (pKey == null) break; // safety
      curKey = pKey;
    }
    // Exclude the start; include target
    path.reverse();

    // Draw the shortest path in green (4), without overwriting start(1)/target(3)
    for (const [r, c] of path) {
      if (r === sr && c === sc) continue;
      if (r === tr && c === tc) continue;
      grid.set_cell(r, c, 4);
      await Algorithms.sleep(20); // slightly slower to highlight the path
    }
  }

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
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1],
      ];
      const [nr, nc] = moves[Math.floor(Math.random() * moves.length)];

      if (nr < 0 || nr >= h || nc < 0 || nc >= w) continue;

      r = nr;
      c = nc;
      await new Promise((res) => setTimeout(res, 10));
    }
    console.log("Found target at", r, c);
  }
}
