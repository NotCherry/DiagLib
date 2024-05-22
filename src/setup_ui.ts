import Connection from "./connection";
import Graph from "./graph";
import add_node from "./add_node";

const createButton = (text: string) => {
  let btn = document.createElement("button");
  btn.classList.add(..."btn".split(" "));
  btn.textContent = text;
  return btn;
};

export function call_run() {
  let msg = { type: "run", data: Graph.serializeNodes() };
  Connection.send(JSON.stringify(msg));
}

export function call_save() {
  return Graph.saveGraph();
}

export function call_load(graph?: string) {
  graph = graph || "";
  Graph.loadGraph(graph);
}

export default () => {
  // console.log("setup_ui");
  new Connection();
  // add_node();
};
