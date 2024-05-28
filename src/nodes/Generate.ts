import GraphNode, { IGraphNode } from "../Node";
import { TextArea } from "../widgets/TextInput";

export class GenerateNode extends GraphNode {
  constructor(args: IGraphNode) {
    super(args);
    this.title = "Generate";
    this.type = "generate";
    this.addIO({ name: "1", type: "input" });
    this.addIO({ name: "2", type: "input" });
    this.addIO({ name: "output", type: "output" });
    this.addWidget(new TextArea({ owner: this.id, height: 350 }));
  }
}

export class GenerateNode2 extends GraphNode {
  constructor(args: IGraphNode) {
    super(args);
    this.title = "Generate 2";
    this.type = "generate";
    this.addIO({ name: "1", type: "input" });
    this.addIO({ name: "2", type: "input" });
    this.addIO({ name: "output", type: "output" });
    this.addWidget(new TextArea({ owner: this.id }));
  }
}

export class GenerateNode3 extends GraphNode {
  constructor(args: IGraphNode) {
    super(args);
    this.title = "Generate 3";
    this.type = "generate";
    this.addIO({ name: "1", type: "input" });
    this.addIO({ name: "2", type: "input" });
    this.addIO({ name: "3", type: "input" });
    this.addIO({ name: "output", type: "output" });
    this.addWidget(new TextArea({ owner: this.id }));
  }
}
