import GraphNode, { IGraphNode } from "../Node";

export class InputNode extends GraphNode {
  constructor(args: IGraphNode) {
    super(args);
    this.type = "input";
    this.size = [150, 50];
    this.addIO({ name: "output", type: "output" });
  }
}
