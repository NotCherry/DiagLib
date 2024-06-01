import GraphNode, { IGraphNode } from "../Node";
import { TextArea } from "../widgets/TextInput";

export class InputNode extends GraphNode {
  constructor(args: IGraphNode) {
    super(args);
    this.title = "Input";
    this.type = "input";
    this.size = [150, 50];
    this.addIO({ name: "output", type: "output" });
  }
}
