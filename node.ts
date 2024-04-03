import { Point } from "./types";
import { drawCircle } from "./utility";

interface IGraphNodeOptions {
  color?: string;
}

interface IGraphNode {
  title: string;
  size?: number[];
  pos: number[];
  pointingTo?: GraphNode;
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

  constructor(args: GraphNodeIO) {
    this.radius = args.radius || 5;
    this.name = args.name;
    this.type = args.type;
    this.pos = { x: args.pos.x, y: args.pos.y };
  }
}

class GraphNode {
  title: string;
  size: number[];
  pos: number[];
  color: string;
  io: GraphNodeIO[];
  Input: GraphNodeIO[];
  Output: GraphNodeIO[];

  constructor(args: IGraphNode) {
    this.title = args.title || "Node";
    this.size = args.size || [300, 200];
    this.pos = args.pos || [100, 100];
    if (args.options) {
      this.color = args.options.color || "black";
    }
    this.io = [];
    // this.Input = [];
    // this.Output = [];
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
    }
  }

  addIO(args: { name: string; radius: number; type: "input" | "output" }) {
    args.radius = args.radius || 10;
    // if (args.type === "input") {
    //   this.Input.push(
    //     new GraphNodeIO({
    //       ...args,
    //       pos: { x: 0, y: 0 },
    //     })
    //   );
    // } else if (args.type === "output") {
    //   this.Output.push(
    //     new GraphNodeIO({
    //       ...args,
    //       pos: { x: 0, y: 0 },
    //     })
    //   );
    // }
    this.io.push(
      new GraphNodeIO({
        ...args,
        pos: { x: 0, y: 0 },
        type: args.type,
      })
    );
  }

  updateIOPos() {
    let inputs = 0;
    let outputs = 0;

    this.io.forEach((io, i) => {
      if (io.type === "input") {
        io.pos = { x: this.pos[0] + 15, y: this.pos[1] + 45 + inputs * 30 };
        inputs++;
      } else {
        io.pos = {
          x: this.pos[0] + this.size[0] - 15,
          y: this.pos[1] + 45 + outputs * 30,
        };
        outputs++;
      }
      // io.pos = { x: this.pos[0] + 15, y: this.pos[1] + 45 + i * 30 };
    });
    // this.Output.forEach((io, i) => {
    //   io.pos = {
    //     x: this.pos[0] + this.size[0] - 15,
    //     y: this.pos[1] + 45 + i * 30,
    //   };
    // });
  }

  drawIO(ctx: CanvasRenderingContext2D) {
    this.updateIOPos();
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
    // this.Input.forEach((io) => {
    //   drawCircle(ctx, io.pos, io.radius);
    // });
    // this.Output.forEach((io) => {
    //   drawCircle(ctx, io.pos, io.radius);
    // });
    this.io.forEach((io) => {
      drawCircle(ctx, io.pos, io.radius);
    });
  }
}

export default GraphNode;
