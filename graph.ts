import GraphNode from "./node";

class Graph {
  nodes: GraphNode[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scale: number = 1.0;
  zoom: boolean = false;

  // calculated offset of the graph including all factors
  X_OFFSET: number = 0;
  Y_OFFSET: number = 0;

  // saved last offset of the graph
  TRANSLATE_X: number = 0;
  TRANSLATE_Y: number = 0;

  // added current offset while dragging from startgin position
  PAGEX: number = 0;
  PAGEY: number = 0;

  START_MOUSE_POS: number[] = [0, 0];
  MOUSE_POS: number[] = [0, 0];
  WHEEL_PRESS: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.nodes = [];
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
  }

  saveDisplay() {
    this.TRANSLATE_X += this.PAGEX;
    this.TRANSLATE_Y += this.PAGEY;
  }

  render() {
    // set scale position in place
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    // calculate finall offset
    this.X_OFFSET =
      this.TRANSLATE_X +
      this.PAGEX +
      (this.MOUSE_POS[0] / this.scale - this.MOUSE_POS[0]);
    this.Y_OFFSET =
      this.TRANSLATE_Y +
      this.PAGEY +
      (this.MOUSE_POS[1] / this.scale - this.MOUSE_POS[1]);

    console.log(this.X_OFFSET, this.Y_OFFSET);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(this.X_OFFSET, this.Y_OFFSET);
    this;

    this.ctx.clearRect(
      0 - this.X_OFFSET,
      0 - this.Y_OFFSET,
      this.canvas.width / this.scale,
      this.canvas.height / this.scale
    );
    this.ctx.fillStyle = "#111";
    this.ctx.fillRect(
      0 - this.X_OFFSET,
      0 - this.Y_OFFSET,
      this.canvas.width / this.scale,
      this.canvas.height / this.scale
    );
    this.nodes.forEach((node) => {
      node.render(this.ctx);
    });
  }

  addNode(node: GraphNode) {
    this.nodes.push(node);
  }

  removeNode(node: GraphNode) {
    this.nodes = this.nodes.filter((n) => n !== node);
  }
}

export default Graph;
