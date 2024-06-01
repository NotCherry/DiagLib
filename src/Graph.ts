import GraphNode from "./Node";
import GraphNodeIO from "./IO";
import Widget from "./widgets/Widget";
import { GUIElement, Point } from "./types";
import { drawIOLineTo } from "./util/utility";
import { v4 as uuidv4 } from "uuid";
import setup_test from "./setup/test";
import Log from "./util/log";

import { loadGraph } from "./setup/graph";

export function setViewportSize(width: number, height: number) {
  Graph.viewportWidth = width;
  Graph.viewportHeight = height;
}

export class Graph {
  static id: string = uuidv4();
  static graph_name: string = "Graph";
  static nodes: GraphNode[] = [];
  static canvas: HTMLCanvasElement;
  static ctx: CanvasRenderingContext2D;

  // where the mouse is with applied transformations
  static cursorPos: Point = { x: 0, y: 0 };
  static connectedIO: GraphNodeIO[] = [];
  static zoom: number = 1.0;
  static selectedNode?: string = undefined;
  static dragStartingPosOffset: Point = { x: 0, y: 0 };

  static wheelPress: boolean = false;
  static mouseOut: boolean = false;
  static dragOffset: Point = { x: 0, y: 0 };

  static drawLine: boolean = false;
  static LineStart: Point = { x: 0, y: 0 };
  static selectedIO?: string = undefined;
  static stop: boolean;
  static drawIO: boolean = true;
  static eventButton: number = 0;
  static cursorAt: GUIElement = { type: undefined, id: undefined };

  static nodeMap: Map<string, GraphNode> = new Map();
  static IOMap: Map<string, GraphNodeIO> = new Map();
  static widgetMap: Map<string, Widget> = new Map();

  static viewportWidth: number = 0;
  static viewportHeight: number = 0;

  static widgetXOffset: number = 0;
  static widgetYOffset: number = 0;

  static transforms: DOMMatrix;
  static scale: number = 0;
  static mouse: Point = { x: 0, y: 0 };

  static logs: Log;
  static registeredNodes: any[] = [];

  static mouseBtn: number | undefined = undefined;

  constructor(canvas: HTMLCanvasElement) {
    Graph.canvas = canvas;
    Graph.ctx = canvas.getContext("2d")!;
    Graph.widgetXOffset = Graph.viewportWidth - Graph.canvas.width;
    Graph.widgetYOffset = Graph.viewportHeight - Graph.canvas.height;
    Graph.transforms = Graph.ctx.getTransform();
    Graph.scale = Graph.transforms.a;
    Graph.logs = new Log();
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
      if (Graph.selectedNode == undefined && Graph.eventButton != 0) {
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

    Graph.transforms = Graph.ctx.getTransform();
    Graph.scale = Graph.transforms.a;

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
      drawIOLineTo(Graph.ctx, Graph.LineStart, Graph.cursorPos);
    }
    Graph.connectedIO = [];
  }

  static registerNode(title: string, node: any) {
    Graph.registeredNodes.push({ title, node });
  }

  static addNode(node: GraphNode) {
    Graph.nodes.push(node);
    Graph.nodeMap.set(node.id, node);
    Graph.nodeMap.get(node.id)!.widgets.forEach((widget) => {
      widget.setup();
    });
    Graph.render();
  }

  static removeNode(node: GraphNode) {
    node.removeAllWidgets();
    node.io.forEach((io) => {
      if (io.type === "input" && io.pointedBy != undefined) {
        let srcIO = Graph.IOMap.get(io.pointedBy)!;
        srcIO.pointingTo = srcIO.pointingTo.filter((id) => id != io.id);
      } else {
        if (io.pointingTo != undefined) {
          io.pointingTo.forEach((id) => {
            let dstIO = Graph.IOMap.get(id)!;
            dstIO.pointedBy = undefined;
          });
        }
      }
    });
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

  // static getSelectedNode() {
  //   return Graph.selectedNode;
  // }
  // static getSelectedIO() {
  //   return Graph.selectedIO;
  // }
}

export default Graph;
