import Connection from "../connection";
import Graph from "../graph/graph";
import { loadGraph } from "../graph/setup_graph";
import add_node from "../events/edit/add_node";

const Run = (c: Connection) => {
  let runBtn = document.createElement("button");
  runBtn.id = "run-btn";
  runBtn.textContent = "Run";
  runBtn.style.position = "absolute";
  runBtn.style.top = "10px";
  runBtn.style.right = "10px";
  runBtn.addEventListener("click", () => {
    let msg = { type: "run", data: Graph.serializeNodes() };
    c.send(JSON.stringify(msg));
  });
  document.body.appendChild(runBtn);
};

const Save = () => {
  let runBtn = document.createElement("button");
  runBtn.id = "save-btn";
  runBtn.textContent = "Save";
  runBtn.style.position = "absolute";
  runBtn.style.top = "40px";
  runBtn.style.right = "10px";
  runBtn.addEventListener("click", () => {
    let graph = Graph.saveGraph();
    localStorage.setItem("graph", JSON.stringify(graph));
  });
  document.body.appendChild(runBtn);
};

const Load = () => {
  let runBtn = document.createElement("button");
  runBtn.id = "load-btn";
  runBtn.textContent = "Load";
  runBtn.style.position = "absolute";
  runBtn.style.top = "70px";
  runBtn.style.right = "10px";
  runBtn.addEventListener("click", () => {
    Graph.loadGraph();
  });
  document.body.appendChild(runBtn);
};

export default () => {
  console.log("setup_ui");
  let c = new Connection();
  Run(c);
  Save();
  Load();

  add_node();
};
