import Graph from "./graph";
import GraphNode from "../nodes/Node";
import { GenerateNode } from "../nodes/Generate";
import { InputNode } from "../nodes/InputNode";

export default () => {
  let canv = document.createElement("canvas");
  canv.id = "canv";
  canv.width = window.innerWidth;
  canv.height = window.innerHeight;
  canv.style.cursor = "crosshair";

  document.body.appendChild(canv);

  var graf = new Graph(canv);

  addEventListener("resize", (event) => {
    canv.width = window.innerWidth;
    canv.height = window.innerHeight;
    graf.render();
  });
  return graf;
};

let NodeType = {
  input: InputNode,
  generate: GenerateNode,
};

function loadGraph(config: string, graf: Graph) {
  let spec = JSON.parse(config);
  graf.id = spec.id;
  graf.name = spec.graph_name;
  spec.nodes.forEach((node: any) => {
    let { title, type, size, pos, io } = node;
    let n = new GraphNode({ title, type, size, pos, owner: graf });
    node.io.map((io: any) => {
      let args = {
        id: io.id,
        name: io.name,
        type: io.type,
        pos: io.pos,
      };
      n.addIO(args);
    });
    // TODO: add widgets

    graf.addNode(n);
  });
  graf.render();
}
