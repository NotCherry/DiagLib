import Graph from "../Graph";
import move from "../drag/move";
import dragNodes from "../drag/nodes";
import dragIO from "../drag/ioConnections";

function debug(e) {
  console.log(Graph.mouse.y, Graph.transforms.f);
}

function setupDebug() {
  addEventListener("mousemove", (e) => debug(e));
  addEventListener("mousedown", (e) => debug(e));
}

export default function drag_setup() {
  dragNodes();
  move();
  dragIO();
  // setupDebug();
}
