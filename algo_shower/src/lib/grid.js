export class LogicGrid {
  #height = 0;
  #width = 0;
  #grid = [];
  #start = [0, 0];

  #listeners = new Set();
  #batch = 0;
  #pending = false;

  #snapshot = [];
  #dirty = false;
    #target = []
  constructor(width, height) {
    this.set_new_dimensions(width, height);
    this.set_start(0, 0);
  }

  // ---- subscription API ----
  subscribe = (fn) => {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  };

  #rebuildSnapshot() {
    if (!this.#dirty) return;
    this.#snapshot = this.#grid.map(row => row.slice());
    this.#dirty = false;
  }

  // emits after ensuring snapshot is fresh
  #emit() {
    if (this.#batch > 0) { this.#pending = true; return; }
    this.#rebuildSnapshot();
    for (const fn of this.#listeners) fn();
  }

  beginBatch() { this.#batch++; }
  endBatch() {
    if (this.#batch > 0) this.#batch--;
    if (this.#batch === 0 && this.#pending) {
      this.#pending = false;
      this.#emit();
    }
  }

  getSnapshot = () => this.#snapshot;

  #inBounds(r, c) {
    return r >= 0 && r < this.#height && c >= 0 && c < this.#width;
  }

  get_dimensions() { return [this.#height, this.#width]; }

  set_new_dimensions(width, height) {
    this.#width = width;
    this.#height = height;
    this.#grid = Array.from({ length: height }, () => Array(width).fill(0));
    this.#dirty = true;
    this.#emit();
  }
  reset_grid(){
    this.beginBatch();
    try{
        for (let i = 0; i < this.#height; i++){
            for (let j = 0; j < this.#width; j++){
                if (this.#grid[i][j] == 2){
                    this.#grid[i][j] = 0;
                } 
            }
        }
    } finally {
        this.endBatch();
    }


  }
  set_start(row, col) {
    if (!this.#inBounds(row, col)) {
      console.error("Start not in grid");
      return;
    }
    const [sr, sc] = this.#start;
    if (this.#inBounds(sr, sc)) this.#grid[sr][sc] = 0;
    this.#start = [row, col];
    this.#grid[row][col] = 1;
    this.#dirty = true;
    this.#emit();
  }

  set_cell(row, col, value) {
    if (!this.#inBounds(row, col)) return;
    if (value == 1){
        this.#start = [row, col];
    }
    if (value == 3){
        this.#target = [row, col];
    }
    this.#grid[row][col] = value;
    this.#dirty = true;
    this.#emit();
  }

  mutate(fn) {
    this.beginBatch();
    try {
      fn(this.#grid, this);
      this.#dirty = true;
    } finally {
      this.endBatch();
    }
  }

  get_grid() { return this.getSnapshot(); }
  get_cell(r, c) { return this.#grid[r][c]; }

  print_grid() {
    for (let r = 0; r < this.#height; r++) {
      console.log(this.#grid[r].join(" "));
    }
  }

    get_start() {
        return this.#start;
    }

    get_target() {
        return this.#target;
    }
}
