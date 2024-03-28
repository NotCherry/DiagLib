import GraphNode from "./node";

class Graph {
  nodes: GraphNode[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scale: number = 1.0;
  TRANSLATE_X: number = 0;
  TRANSLATE_Y: number = 0;
  PAGEX: number = 0;
  PAGEY: number = 0;
  START_MOUSE_POS: number[] = [0, 0];
  END_MOUSE_POS: number[] = [0, 0];
  WHEEL_PRESS: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.nodes = [];
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
  }

  updateDisplay() {
    this.PAGEX = this.START_MOUSE_POS[0] - this.END_MOUSE_POS[0];
    this.PAGEY = this.START_MOUSE_POS[1] - this.END_MOUSE_POS[1];
    // console.log(this.PAGEX, this.PAGEY);
  }

  saveDisplay() {
    this.TRANSLATE_X += this.PAGEX;
    this.TRANSLATE_Y += this.PAGEY;
  }

  render() {
    // console.log(PAGEX, PAGEY, "hello");

    // console.log(this.TRANSLATE_X, this.TRANSLATE_Y);
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.translate(this.TRANSLATE_X, this.TRANSLATE_X);
    this.ctx.scale(this.scale, this.scale);
    this.ctx.translate(-this.TRANSLATE_X, -this.TRANSLATE_X);

    this.ctx.clearRect(
      0,
      0,
      this.canvas.width / this.scale,
      this.canvas.height / this.scale
    );
    this.ctx.fillStyle = "#111";
    this.ctx.fillRect(
      0,
      0,
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
