interface IGraphNodeOptions {
  color?: string;
}

interface IGraphNode {
  title: string;
  size?: number[];
  pos?: number[];
  options?: IGraphNodeOptions;
}

class GraphNode {
  title: string;
  size: number[];
  pos: number[];
  color: string;
  constructor(args: IGraphNode) {
    this.title = args.title || "Node";
    this.size = args.size || [300, 200];
    this.pos = args.pos || [100, 100];
    if (args.options) {
      this.color = args.options.color || "black";
    }
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
      ctx.fillStyle = "#F00";
      ctx.fi;
    }
  }
}

export default GraphNode;
