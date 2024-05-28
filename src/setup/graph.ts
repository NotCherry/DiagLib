import Graph, { setViewportSize } from "../Graph";
import GraphNode from "../Node";
import { TextArea } from "../widgets/TextInput";
import setup_test from "./test";

export function resizeCanvas() {
  let canvas = document.querySelector("canvas#canvas") as HTMLCanvasElement;
  if (!canvas) {
    return;
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let body = document.querySelector("body") as HTMLBodyElement;
  setViewportSize(body.clientWidth, body.clientHeight);

  Graph.widgetXOffset = Graph.viewportWidth - Graph.canvas.width;
  Graph.widgetYOffset = Graph.viewportHeight - Graph.canvas.height;
}

export default () => {
  let canv = document.getElementById("canvas") as HTMLCanvasElement;
  new Graph(canv);

  addEventListener("resize", (event) => {
    resizeCanvas();
    Graph.render();
  });
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
      n.addWidget(new TextArea(args));
    });

    Graph.addNode(n);
  });
  Graph.render();
}
