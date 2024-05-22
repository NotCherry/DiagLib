import Graph from "./graph";
import GraphNode from "./Node";
import { GenerateNode } from "./Generate";
import { InputNode } from "./InputNode";
import { TeaxtArea } from "./TextInput";
import setup_test from "./setup_test";

export default () => {
  let canv = document.getElementById("canvas") as HTMLCanvasElement;
  // document.body.appendChild(canv);
  new Graph(canv);

  addEventListener("resize", (event) => {
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    Graph.render();
  });
  document.onload = () => {
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    Graph.render();
  };
};

let NodeType = {
  input: InputNode,
  generate: GenerateNode,
};

export function loadGraph(config: string) {
  if (config === "") {
    setup_test();
    return;
  }
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
