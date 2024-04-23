import Graph from "./graph";
import GraphNode from "../nodes/Node";
import { GenerateNode } from "../nodes/Generate";
import { InputNode } from "../nodes/InputNode";
import { TeaxtArea } from "../nodes/widgets/TextInput";

export default () => {
  let canv = document.createElement("canvas");
  canv.id = "canv";
  canv.width = window.innerWidth;
  canv.height = window.innerHeight;
  canv.style.cursor = "crosshair";

  document.body.appendChild(canv);

  new Graph(canv);

  addEventListener("resize", (event) => {
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    Graph.render();
  });
};

let NodeType = {
  input: InputNode,
  generate: GenerateNode,
};

export function loadGraph(config: string) {
  let spec = JSON.parse(config);
  Graph.id = spec.id;
  Graph.graph_name = spec.graph_name;
  spec.nodes.forEach((node: any) => {
    let { id, title, type, size, pos, data } = node;
    let n = new GraphNode({
      id,
      title,
      type,
      size,
      pos,
      data,
      owner: Graph.id,
    });
    node.io.map((io: any) => {
      let args = {
        id: io.id,
        name: io.name,
        type: io.type,
        pos: io.pos,
        pointingTo: io.pointingTo,
        pointedBy: io.pointedBy,
      };
      n.addIO(args);
    });

    node.widgets.map((widget: any) => {
      let args = {
        id: widget.id,
        type: widget.type,
        owner: widget.owner,
      };
      n.addWidget(new TeaxtArea(args));
    });

    Graph.addNode(n);
  });
  Graph.render();
}
