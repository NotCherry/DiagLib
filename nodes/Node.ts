import Graph from "../graph/graph";
import { NodeType, Point } from "../types";
import { drawCircle } from "../utility";
import { Widget } from "./widgets/Widget";
import { v4 as uuidv4 } from "uuid";

export interface IGraphNodeOptions {
  color?: string;
}

export interface IGraphNode {
  id?: string;
  title: string;
  size?: number[];
  pos: Point;
  type?: string;
  owner: Graph;
  data?: KeyValue;
  options?: IGraphNodeOptions;
}

export interface IGraphNodeIO {
  id?: string;
  name: string;
  radius?: number;
  pos?: Point;
  type: "input" | "output";
  owner: string;
  pointingTo?: string[];
  pointedBy?: string;
}

export interface IAddGraphNodeIO {
  id?: string;
  name: string;
  radius?: number;
  type: "input" | "output";
}

export class GraphNodeIO {
  id: string = uuidv4();
  name: string;
  radius: number;
  pos: Point;
  type: "input" | "output";
  pointingTo: string[];
  pointedBy?: string;
  owner: string;
  constructor(args: IGraphNodeIO) {
    this.id = args.id || uuidv4();
    this.radius = args.radius || 7;
    this.name = args.name;
    this.type = args.type;
    this.pos = args.pos ? { x: args.pos.x, y: args.pos.y } : { x: 0, y: 0 };
    this.pointingTo = args.pointingTo || [];
    this.pointedBy = args.pointedBy;
    this.owner = args.owner;
  }
  save() {
    return {
      type: this.type,
      name: this.name,
      id: this.id,
      owner: this.owner,
      pointedBy: this.pointedBy,
      pointingTo: this.pointingTo,
    };
  }
}

export type KeyValue = {
  [key: string]: any;
};

class GraphNode {
  id: string;
  title: string;
  type: string;
  size: number[];
  pos: Point;
  color: string;
  io: GraphNodeIO[] = [];
  io_input_length: number = 0;
  io_output_length: number = 0;
  data: KeyValue = {};
  widgets: Widget[] = [];

  // variables for calculating size of node
  io_spacing_y: number = 30;
  elements_y_spacing: number = 45; // between io, widgest, etc
  elements_x_spacing: number = 15;
  total_widgets_height: number = 0;
  total_io_height: number = 0;
  owner: Graph;

  constructor(args: IGraphNode) {
    this.id = args.id || uuidv4();
    this.title = args.title || "Node";
    this.type = args.type || "default";
    this.size = args.size || [500, 300];
    this.pos = args.pos || { x: 100, y: 100 };
    if (args.options) {
      this.color = "black";
    }
    this.owner = args.owner;
    this.data = args.data || {};
  }

  serialize() {
    let pointedBy = this.io
      .filter((io) => io.pointedBy)
      .map((io) => io.pointedBy)
      .flat();
    pointedBy = pointedBy.map((id) => Graph.IOMap.get(id!)?.owner);
    let pointingTo = this.io
      .filter((io) => io.pointingTo)
      .map((io) => io.pointingTo)
      .flat();

    this.widgets.map((w) => {
      if (w.validate() !== true) {
        throw new Error("Validation failed");
      } else null;
    });

    pointingTo = pointingTo.map((id) => Graph.IOMap.get(id!)?.owner!);

    let a = {
      id: this.id,
      nodeType: this.type,
      data: this.data,
      pointedBy: pointedBy.length > 0 ? pointedBy : undefined,
      pointingTo: pointingTo.length > 0 ? pointingTo : undefined,
    };

    return a;
  }

  save() {
    return {
      id: this.id,
      title: this.title,
      type: this.type,
      size: this.size,
      pos: this.pos,
      data: this.data,
      // options: this.options != undefined ? this.options
      io: this.io.map((io) => {
        return io.save();
      }),
      widgets: this.widgets.map((w) => w.save()),
    };
  }

  render(ctx: CanvasRenderingContext2D) {
    this.updateNodeSize();
    ctx.fillStyle = this.color || "#222";
    ctx.fillRect(this.pos.x, this.pos.y, this.size[0], this.size[1]);

    ctx.shadowBlur = 10;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    ctx.fillStyle = this.color || "#444";
    ctx.fillRect(this.pos.x, this.pos.y + 30, this.size[0], 1);

    ctx.font = "20px monospace";
    ctx.fillStyle = "white";
    ctx.fillText(this.title, this.pos.x + 10, this.pos.y + 20);

    if (this.size[0] > 100 && this.size[1] > 50) {
      if (this.io.length > 0) {
        this.drawIO(ctx);
      }
      if (this.widgets.length > 0) {
        this.drawWidgets(ctx);
      }
    }
  }

  reset() {
    this.widgets.map((w) => w.remove());
  }

  updateData(data: KeyValue) {
    this.data = data;
  }

  updateNodeSize() {
    this.updateIOSize();
    this.updateWidgetsSize();
    let size =
      this.total_io_height +
      this.total_widgets_height +
      this.elements_y_spacing -
      (this.io.length > 0 ? this.io[0].radius : 0);
    this.size[1] = this.size[1] < size ? size : this.size[1];
  }

  updateIOSize() {
    this.total_io_height =
      Math.max(this.io_input_length, this.io_output_length) * this.io_spacing_y;
  }

  updateWidgetsSize() {
    this.total_widgets_height = this.widgets.reduce(
      (acc, widget) => acc + widget.height,
      0 + this.elements_y_spacing * this.widgets.length
    );
  }

  addIO(args: IAddGraphNodeIO) {
    let io = new GraphNodeIO({
      ...args,
      pos: { x: 0, y: 0 },
      type: args.type,
      owner: this.id,
      radius: args.radius || 10,
    });

    Graph.IOMap.set(io.id, io);
    this.io.push(io);

    if (args.type === "input") {
      this.io_input_length++;
    } else {
      this.io_output_length++;
    }
    this.io.sort((a, b) => (a.type === "input" ? -1 : 1));

    this.updateNodeSize();
  }

  removeIO(i: GraphNodeIO) {
    this.io = this.io.filter((io) => io !== i);
    Graph.IOMap.delete(i.id);
    this.updateNodeSize();
  }

  updateIOPos() {
    let inputs = 0;
    let outputs = 0;
    this.io.forEach((io, i) => {
      if (io.type === "input") {
        io.pos = {
          x: this.pos.x + this.elements_x_spacing,
          y: this.pos.y + this.elements_y_spacing + inputs * this.io_spacing_y,
        };
        inputs++;
      } else {
        io.pos = {
          x: this.pos.x + this.size[0] - this.elements_x_spacing,
          y: this.pos.y + this.elements_y_spacing + outputs * this.io_spacing_y,
        };
        outputs++;
      }
    });
  }

  drawIO(ctx: CanvasRenderingContext2D) {
    this.updateIOPos();
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
    this.io.forEach((io) => {
      drawCircle(ctx, io.pos, io.radius);
      if (io.type === "input") {
        ctx.fillText(
          io.name,
          io.pos.x + this.elements_x_spacing,
          io.pos.y + io.radius / 1.2
        );
      } else {
        ctx.fillText(
          io.name,
          io.pos.x - ctx.measureText(io.name).width - this.elements_x_spacing,
          io.pos.y + io.radius / 2
        );
      }
    });
  }

  connect(srcIndex: number, dstIndex: number, node: GraphNode) {
    let srcIOindex = 0;
    this.io.forEach((io, i) => {
      if (io.type === "output") {
        if (srcIOindex === srcIndex) {
          this.io[i].pointingTo?.push(node.io[dstIndex].id);
          node.io[dstIndex].pointedBy = this.io[i].id;
          return;
        }
        srcIOindex++;
      }
    });
  }

  addWidget(widget: Widget) {
    this.widgets.push(widget);
    Graph.widgetMap.set(widget.id, widget);
    this.updateNodeSize();
  }

  removeWidget(widget: Widget) {
    this.widgets = this.widgets.filter((w) => w !== widget);
    Graph.widgetMap.delete(widget.id);
    this.updateNodeSize();
  }

  updateWidgetsPos() {
    let index = 1;
    this.widgets.forEach((widget) => {
      widget.pos = {
        x: this.pos.x + 10,
        y: this.pos.y + this.total_io_height + this.elements_y_spacing * index,
      };
      if (widget.width != this.size[0] - 20) {
        widget.width = this.size[0] - 20;
      }
      index++;
    });
  }

  drawWidgets(ctx: CanvasRenderingContext2D) {
    this.updateWidgetsPos();
    this.widgets.forEach((widget) => {
      widget.render(ctx);
    });
  }
}

export default GraphNode;
