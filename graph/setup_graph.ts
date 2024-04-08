import Graph from "./graph";

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
