import Graph from "./graph";
import { Point } from "./types";
import { drawCircle } from "./utility";
import { Widget } from "./widget";

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

  constructor(args: GraphNodeIO) {
    this.radius = args.radius || 5;
    this.name = args.name;
    this.type = args.type;
    this.pos = { x: args.pos.x, y: args.pos.y };
    this.pointingTo = [];
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
  draw_offset: number;
  graf: Graph | undefined;

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
    this.draw_offset = 30;
    this.graf = undefined;
  }
  render(ctx: CanvasRenderingContext2D) {
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

  addIO(args: { name: string; radius: number; type: "input" | "output" }) {
    args.radius = args.radius || 10;
    this.io.push(
      new GraphNodeIO({
        ...args,
        pos: { x: 0, y: 0 },
        type: args.type,
      })
    );
    if (args.type === "input") {
      this.io_input_length++;
    } else {
      this.io_output_length++;
    }
    this.io.sort((a, b) => (a.type === "input" ? -1 : 1));
  }

  removeIO(i: GraphNodeIO) {
    this.io = this.io.filter((io) => io !== i);
  }

  updateIOPos() {
    let inputs = 0;
    let outputs = 0;
    this.io.forEach((io, i) => {
      if (io.type === "input") {
        io.pos = {
          x: this.pos[0] + 15,
          y: this.pos[1] + 45 + inputs * this.draw_offset,
        };
        inputs++;
      } else {
        io.pos = {
          x: this.pos[0] + this.size[0] - 15,
          y: this.pos[1] + 45 + outputs * this.draw_offset,
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
          io.pointingTo?.push(node.io[dstIndex]);
          return;
        }
        srcIOindex++;
      }
    });
  }

  addWidget(widget: Widget) {
    this.widgets.push(widget);
    this.updateIOPos();
  }

  removeWidget(widget: Widget) {
    this.widgets = this.widgets.filter((w) => w !== widget);
  }

  updateWidgetsPos() {
    this.widgets.forEach((widget) => {
      widget.pos = {
        x: this.pos[0] + 10,
        y:
          this.pos[1] +
          Math.max(this.io_input_length, this.io_output_length) *
            this.draw_offset +
          40,
      };
      if (widget.width != this.size[0] - 20) {
        widget.width = this.size[0] - 20;
      }
      if (widget.height > this.size[1] - 40) {
        widget.height = this.size[1] - 40;
      }
    });
  }

  drawWidgets(ctx: CanvasRenderingContext2D, graf: Graph) {
    // this.updateWidgetsPos();
    this.widgets.forEach((widget) => {
      widget.render(ctx, graf.ctc, graf.zoom);
    });
  }
}

export default GraphNode;
