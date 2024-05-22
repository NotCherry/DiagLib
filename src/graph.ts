import GraphNode, { GraphNodeIO } from "./Node";
import { Widget } from "./Widget";
import { Point } from "./types";
import { drawIOLineTo } from "./utility";
import { v4 as uuidv4 } from "uuid";
import setup_test from "./setup_test";

import setup_graph, { loadGraph } from "./setup_graph";
import setup_drag from "./setup_drag";
export function setup(graph?: string) {
  graph = graph || "";
  setup_graph();
  setup_drag();
  loadGraph(graph);
}

export function setViewportSize(width: number, height: number) {
  Graph.viewport_width = width;
  Graph.viewport_height = height;
}

class Graph {
  static id: string = uuidv4();
  static graph_name: string = "Graph";
  static nodes: GraphNode[] = [];
  static canvas: HTMLCanvasElement;
  static ctx: CanvasRenderingContext2D;
  // where the mouse is with applied transformations
  static ctc: Point = { x: 0, y: 0 };
  static connectedIO: GraphNodeIO[] = [];
  static zoom: number = 1.0;
  static selected_node?: string = undefined;
  static starting_pos_offset: Point = { x: 0, y: 0 };

  static wheelPress: boolean = false;
  static mouse_out: boolean = false;
  static drag_offset: Point = { x: 0, y: 0 };

  static drawLine: boolean = false;
  static LineStart: Point = { x: 0, y: 0 };
  static selected_io?: string = undefined;
  static stop: boolean;
  static drawIO: boolean = true;
  static eventButton: number = 0;

  static nodeMap: Map<string, GraphNode> = new Map();
  static IOMap: Map<string, GraphNodeIO> = new Map();
  static widgetMap: Map<string, Widget> = new Map();

  static viewport_width: number = 0;
  static viewport_height: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    Graph.canvas = canvas;
    Graph.ctx = canvas.getContext("2d")!;
  }

  static reset() {
    Graph.nodeMap = new Map();
    Graph.IOMap = new Map();
    Graph.widgetMap = new Map();
    Graph.nodes.map((n) => n.reset());
    Graph.nodes = [];
    Graph.connectedIO = [];
  }

  static switchHTMLElements() {
    Graph.widgetMap.forEach((widget) => {
      if (Graph.selected_node == undefined && Graph.eventButton != 0) {
        widget.element.style.display =
          widget.element.style.display == "none" ? "block" : "none";
      }
      widget.element.style.pointerEvents =
        widget.element.style.pointerEvents == "none" ? "auto" : "none";
    });
  }

  static render() {
    Graph.ctx.save();
    Graph.ctx.setTransform(1, 0, 0, 1, 0, 0);
    Graph.ctx.clearRect(0, 0, Graph.canvas.width, Graph.canvas.height);
    Graph.ctx.fillStyle = "#111";
    Graph.ctx.fillRect(0, 0, Graph.canvas.width, Graph.canvas.height);
    Graph.ctx.restore();

    Graph.nodes.forEach((node) => {
      node.render(Graph.ctx);
      node.io.forEach((io) => {
        if (io.pointingTo != undefined) {
          Graph.connectedIO.push(io);
        }
      });
    });

    if (Graph.drawIO) {
      Graph.connectedIO.forEach((io) => {
        io.pointingTo?.forEach((dstNode) => {
          drawIOLineTo(Graph.ctx, io.pos, Graph.IOMap.get(dstNode)!.pos);
        });
      });
    }

    // draf line from current io grabbed
    if (Graph.drawLine) {
      drawIOLineTo(Graph.ctx, Graph.LineStart, Graph.ctc);
    }
    Graph.connectedIO = [];
  }

  static addNode(node: GraphNode) {
    Graph.nodes.push(node);
    Graph.nodeMap.set(node.id, node);
    Graph.nodeMap.get(node.id)!.widgets.forEach((widget) => {
      widget.setup();
    });
  }

  static removeNode(node: GraphNode) {
    Graph.nodes = Graph.nodes.filter((n) => n !== node);
    Graph.nodeMap.delete(node.id);
  }

  static serializeNodes() {
    return this.nodes.map((node) => node.serialize());
  }

  static saveGraph() {
    let diagram = {
      id: Graph.id,
      graph_name: Graph.name,
      nodes: Graph.nodes.map((node) => node.save()),
    };

    return diagram;
  }
  static loadGraph(graph: string) {
    Graph.reset();
    graph !== "" ? loadGraph(graph) : setup_test();
    // setup_test();
  }
}

export default Graph;
