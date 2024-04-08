import Graph from "../graph/graph";
import { Point } from "../types";
import { drawCircle } from "../utility";
import { Widget } from "../widget";

export interface IGraphNodeOptions {
  color?: string;
}

export interface IGraphNode {
  title: string;
  size?: number[];
  pos: number[];
  options?: IGraphNodeOptions;
}

export interface GraphNodeIO {
  name: string;
  radius: number;
  pos: Point;
  type: "input" | "output";
}

export class GraphNodeIO {
  name: string;
  radius: number;
  type: "input" | "output";
  pointingTo?: GraphNodeIO[];
  pointedBy?: GraphNodeIO;
  owner: GraphNode;
  constructor(args: GraphNodeIO) {
    this.radius = args.radius || 5;
    this.name = args.name;
    this.type = args.type;
    this.pos = { x: args.pos.x, y: args.pos.y };
    this.pointingTo = [];
    this.pointedBy = undefined;
    this.owner = args.owner;
  }
}

class GraphNode {
  title: string;
  size: number[];
  pos: number[];
  color: string;
  io: GraphNodeIO[];
  io_input_length: number;
  io_output_length: number;
  content: string;
  widgets: Widget[];
  graf: Graph | undefined;

  // variables for calculating size of node
  io_spacing_y: number;
  elements_y_spacing: number; // between io, widgest, etc
  total_widgets_height: number;
  total_io_height: number;

  constructor(args: IGraphNode) {
    this.title = args.title || "Node";
    this.size = args.size || [300, 200];
    this.pos = args.pos || [100, 100];
    if (args.options) {
      this.color = args.options.color || "black";
    }
    this.io = [];
    this.io_input_length = 0;
    this.io_output_length = 0;
    this.content = "";
    this.widgets = [];
    this.io_spacing_y = 30;
    this.elements_y_spacing = 45;
    this.total_io_height = 0;
    this.graf = undefined;
    this.total_widgets_height = 0;
  }
  render(ctx: CanvasRenderingContext2D) {
    this.updateNodeSize();
    ctx.fillStyle = this.color || "#222";
    ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);

    ctx.shadowBlur = 10;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    ctx.fillStyle = "#444";
    ctx.fillRect(this.pos[0], this.pos[1] + 30, this.size[0], 1);

    ctx.font = "20px monospace";
    ctx.fillStyle = "white";
    ctx.fillText(this.title, this.pos[0] + 10, this.pos[1] + 20);

    if (this.size[0] > 100 && this.size[1] > 50) {
      this.drawIO(ctx);
      this.drawWidgets(ctx, this.graf!);
    }
  }

  updateNodeSize() {
    this.updateIOSize();
    this.updateWidgetsSize();
    let size =
      this.total_io_height +
      this.total_widgets_height +
      this.elements_y_spacing -
      (this.io ? this.io[0].radius : 0);
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

  addIO(args: { name: string; radius: number; type: "input" | "output" }) {
    args.radius = args.radius || 10;
    this.io.push(
      new GraphNodeIO({
        ...args,
        pos: { x: 0, y: 0 },
        type: args.type,
        owner: this,
      })
    );
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
    this.updateNodeSize();
  }

  updateIOPos() {
    let inputs = 0;
    let outputs = 0;
    this.io.forEach((io, i) => {
      if (io.type === "input") {
        io.pos = {
          x: this.pos[0] + 15,
          y: this.pos[1] + this.elements_y_spacing + inputs * this.io_spacing_y,
        };
        inputs++;
      } else {
        io.pos = {
          x: this.pos[0] + this.size[0] - 15,
          y:
            this.pos[1] + this.elements_y_spacing + outputs * this.io_spacing_y,
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
    });
  }

  connect(srcIndex: number, dstIndex: number, node: GraphNode) {
    let srcIOindex = 0;
    this.io.forEach((io, i) => {
      if (io.type === "output") {
        if (srcIOindex === srcIndex) {
          this.io[i].pointingTo?.push(node.io[dstIndex]);
          node.io[dstIndex].pointedBy = this.io[i];
          return;
        }
        srcIOindex++;
      }
    });
  }

  addWidget(widget: Widget) {
    this.widgets.push(widget);
    this.updateNodeSize();
  }

  removeWidget(widget: Widget) {
    this.widgets = this.widgets.filter((w) => w !== widget);
    this.updateNodeSize();
  }

  updateWidgetsPos() {
    let index = 1;
    this.widgets.forEach((widget) => {
      widget.pos = {
        x: this.pos[0] + 10,
        y: this.pos[1] + this.total_io_height + this.elements_y_spacing * index,
      };
      if (widget.width != this.size[0] - 20) {
        widget.width = this.size[0] - 20;
      }
      index++;
    });
  }

  drawWidgets(ctx: CanvasRenderingContext2D, graf: Graph) {
    this.updateWidgetsPos();
    this.widgets.forEach((widget) => {
      widget.render(ctx);
    });
  }
}

export default GraphNode;
