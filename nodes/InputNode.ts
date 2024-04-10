import GraphNode, { IGraphNode } from "./Node";
import { TeaxtArea } from "./widgets/TextInput";

export class InputNode extends GraphNode {
  constructor(args: IGraphNode) {
    super(args);
    this.title = "Input";
    this.type = "input";
    this.addIO({ name: "output", type: "output" });
    this.addWidget(new TeaxtArea({ owner: this }));
  }
}
