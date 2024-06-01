import Graph from "../Graph";
import { isPointingTo, setSelectedElements } from "../util/utility";

export default () => {
  addEventListener("mousedown", (event) => {
    if (
      Graph.wheelPress != true &&
      (Graph.selectedNode == undefined || Graph.selectedIO == undefined) &&
      event.target === Graph.canvas
    ) {
      setSelectedElements();
      let node = Graph.nodeMap.get(Graph.selectedNode);
      if (node == undefined) return;
      Graph.dragStartingPosOffset = {
        x: Graph.cursorPos.x - node.pos.x,
        y: Graph.cursorPos.y - node.pos.y,
      };
    }
  });

  addEventListener("mousemove", (event) => {
    if (
      Graph.selectedNode != undefined &&
      Graph.selectedIO == undefined &&
      Graph.mouseOut === false &&
      Graph.wheelPress === false &&
      Graph.mouseBtn === 0
    ) {
      Graph.nodeMap.get(Graph.selectedNode!)!.pos = {
        x: Graph.cursorPos.x - Graph.dragStartingPosOffset.x,
        y: Graph.cursorPos.y - Graph.dragStartingPosOffset.y,
      };

      Graph.render();
    }
  });
};
