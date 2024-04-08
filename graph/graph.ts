import GraphNode, { GraphNodeIO } from "../nodes/node";
import { Point } from "../types";
import { drawIOLineTo } from "../utility";

class Graph {
  nodes: GraphNode[];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  // where the mouse is with applied transformations
  ctc: Point;
  connectedIO: GraphNodeIO[];
  zoom: number;
  selected_node: GraphNode | undefined;
  starting_pos_offset: Point;

  wheelPress: boolean;
  mouse_out: boolean;
  drag_offset: Point;

  drawLine: boolean;
  LineStart: Point;
  selected_io: GraphNodeIO | undefined;
  stop: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.nodes = [];
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.ctc = { x: 0, y: 0 };
    this.connectedIO = [];
    this.zoom = 1.0;
    this.selected_node = undefined;
    this.starting_pos_offset = { x: 0, y: 0 };

    this.wheelPress = false;
    this.drag_offset = { x: 0, y: 0 };

    this.drawLine = false;
    this.LineStart = { x: 0, y: 0 };
    this.selected_io = undefined;
    this.mouse_out = false;
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
      node.io.forEach((io) => {
        if (io.pointingTo != undefined) {
          this.connectedIO.push(io);
        }
      });
    });

    this.connectedIO.forEach((io) => {
      io.pointingTo?.forEach((pointingTo) => {
        drawIOLineTo(this.ctx, io.pos, pointingTo!.pos);
      });
    });

    // draf line from current io grabbed
    if (this.drawLine) {
      drawIOLineTo(this.ctx, this.LineStart, this.ctc);
    }
    this.connectedIO = [];
  }

  addNode(node: GraphNode) {
    node.graf = this;
    this.nodes.push(node);
  }

  removeNode(node: GraphNode) {
    this.nodes = this.nodes.filter((n) => n !== node);
  }
}

export default Graph;
