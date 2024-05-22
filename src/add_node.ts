import Graph from "./graph";
import { InputNode } from "./InputNode";
import { Point } from "./types";
import { GenerateNode } from "./Generate";

var optHeight = 35;

var optStyle = {
  position: "relative",
  backgroundColor: "#222",
  color: "white",
  padding: "5px",
  margin: "0",
  width: "100%",
  height: `${optHeight}px`,
  zIndex: "1001",
  border: "1px solid white",
  left: "0px",
  boxSizing: "border-box",
};
let menu = document.createElement("div");

function createOption(
  name: string,
  pos: Point,
  callback: () => void
): HTMLElement {
  let opt = document.createElement("div");
  opt.id = "add-node";
  for (var prop in optStyle) {
    opt.style[prop] = optStyle[prop];
  }
  opt.textContent = name;

  opt.addEventListener("click", () => {
    callback();
    if (document.body.contains(menu)) {
      document.body.removeChild(menu);
    }
  });
  return opt;
}

export default () => {
  menu.id = "context-menu";
  menu.style.position = "absolute";
  menu.style.backgroundColor = "#222";
  menu.style.color = "white";
  menu.style.padding = "5px";
  menu.style.width = "100px";
  menu.style.zIndex = "1000";

  let options: HTMLElement[] = [];

  options.push(
    createOption("Add Gen", { x: 0, y: 0 }, () => {
      add_node("generate");
    })
  );

  options.push(
    createOption("Add Input ", { x: 0, y: 0 }, () => {
      add_node("input");
    })
  );

  options.push(
    createOption("Add Save ", { x: 0, y: 0 }, () => {
      add_node("input");
    })
  );

  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;

    options.forEach((opt, i) => {
      menu.appendChild(opt);
    });
    menu.style.height = `${options.length * optHeight}px`;
    document.body.appendChild(menu);
  });
  Graph.canvas.addEventListener("click", (event) => {
    event.preventDefault();
    if (event.button == 0 && document.body.contains(menu)) {
      document.body.removeChild(menu);
    }
  });
};

function add_node(type: string) {
  switch (type) {
    case "input":
      Graph.addNode(
        new InputNode({ owner: Graph, title: "Input", pos: Graph.ctc })
      );
      break;
    case "generate":
      Graph.addNode(
        new GenerateNode({
          owner: Graph,
          title: "Fenerate",
          pos: Graph.ctc,
        })
      );
      break;
  }
  Graph.render();
}
