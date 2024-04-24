import Connection from "../connection";
import Graph from "../graph/graph";
import add_node from "../events/edit/add_node";

const createButton = (text: string) => {
  let btn = document.createElement("button");
  btn.classList.add(..."btn".split(" "));
  btn.textContent = text;
  return btn;
};

const Run = () => {
  let btn = createButton("Run");
  btn.addEventListener("click", () => {
    let msg = { type: "run", data: Graph.serializeNodes() };
    Connection.send(JSON.stringify(msg));
  });
  return btn;
};

const Save = () => {
  let btn = createButton("Save");
  btn.addEventListener("click", () => {
    let graph = Graph.saveGraph();
    localStorage.setItem("graph", JSON.stringify(graph));
  });
  return btn;
};

const Load = () => {
  let btn = createButton("Load");
  btn.addEventListener("click", () => {
    Graph.loadGraph();
  });
  return btn;
};

function tcss(classes: string) {
  return classes.split(" ");
}

export default () => {
  console.log("setup_ui");
  new Connection();
  let panel = document.createElement("div");
  panel.classList.add(
    ..."absolute top-0 left-0 w-full flex justify-end".split(" ")
  );
  panel.appendChild(Run());
  panel.appendChild(Load());
  panel.appendChild(Save());
  document.body.appendChild(panel);
  add_node();
};
