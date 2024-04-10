import GraphNode, { GraphNodeIO } from "../nodes/Node";
import { Widget } from "../nodes/widgets/Widget";
import { Point } from "../types";
import { drawIOLineTo } from "../utility";
import { v4 as uuidv4 } from "uuid";

class Graph {
  id: string = uuidv4();
  name: string = "Graph";
  nodes: GraphNode[] = [];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  // where the mouse is with applied transformations
  ctc: Point = { x: 0, y: 0 };
  connectedIO: GraphNodeIO[] = [];
  zoom: number = 1.0;
  selected_node?: string = undefined;
  starting_pos_offset: Point = { x: 0, y: 0 };

  wheelPress: boolean = false;
  mouse_out: boolean = false;
  drag_offset: Point = { x: 0, y: 0 };

  drawLine: boolean = false;
  LineStart: Point = { x: 0, y: 0 };
  selected_io?: string = undefined;
  stop: boolean;

  nodeMap: Map<string, GraphNode> = new Map();
  IOMap: Map<string, GraphNodeIO> = new Map();
  widgetMap: Map<string, Widget> = new Map();

  constructor(canvas: HTMLCanvasElement) {
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
      node.io.forEach((io) => {
        if (io.pointingTo != undefined) {
          this.connectedIO.push(io);
        }
      });
    });

    this.connectedIO.forEach((io) => {
      io.pointingTo?.forEach((dstNode) => {
        drawIOLineTo(this.ctx, io.pos, this.IOMap.get(dstNode)!.pos);
      });
    });

    // draf line from current io grabbed
    if (this.drawLine) {
      drawIOLineTo(this.ctx, this.LineStart, this.ctc);
    }
    this.connectedIO = [];
    // console.log(this.serializeNodes());
    // console.log("hello world");
    // console.log(this.nodes);
  }

  addNode(node: GraphNode) {
    this.nodes.push(node);
    this.nodeMap.set(node.id, node);
  }

  removeNode(node: GraphNode) {
    this.nodes = this.nodes.filter((n) => n !== node);
    this.nodeMap.delete(node.id);
  }

  serializeNodes() {
    return this.nodes.map((node) => node.serialize());
  }

  saveGraph() {
    let diagram = {
      id: this.id,
      graph_name: this.name,
      nodes: this.nodes.map((node) => node.save()),
    };
    console.log(JSON.stringify(diagram));
    return JSON.stringify(diagram);
  }
}

export default Graph;
