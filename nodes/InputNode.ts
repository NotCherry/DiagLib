import GraphNode, { IGraphNode } from "../node";

interface IInputNode extends IGraphNode {}

export default class InputNode extends GraphNode {
  constructor(args: IInputNode) {
    super(args);
  }

  render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
  }
}
