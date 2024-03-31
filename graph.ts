import GraphNode from "./node";
import { Point } from "./types";

class Graph {
  nodes: GraphNode[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ctc: Point = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement) {
    this.nodes = [];
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
  }

  render() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "#111";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();

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
