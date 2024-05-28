import Graph from "../Graph";
import { isPointingTo } from "../util/utility";

export default () => {
  addEventListener("mousedown", (event) => {
    if (
      Graph.wheelPress != true &&
      (Graph.selectedNode == undefined || Graph.selectedIO == undefined) &&
      event.target === Graph.canvas
    ) {
      Graph.nodes.forEach((node) => {
        isPointingTo(node);
      });
    }
  });

  addEventListener("mousemove", (event) => {
    if (Graph.selectedNode != undefined && Graph.selectedIO == undefined) {
      Graph.nodeMap.get(Graph.selectedNode!)!.pos = {
        x: Graph.cursorPos.x - Graph.dragStartingPosOffset.x,
        y: Graph.cursorPos.y - Graph.dragStartingPosOffset.y,
      };

      Graph.render();
    }
  });
};
