import GraphNode, { IGraphNode } from "../Node";

export class OutputNode extends GraphNode {
  constructor(args: IGraphNode) {
    super(args);
    this.title = "Output";
    this.type = "output";
    this.size = [150, 50];
    this.addIO({ name: "in", type: "input" });
  }
}
