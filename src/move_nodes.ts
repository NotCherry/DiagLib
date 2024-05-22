import Graph from "./graph";
import { isPointingTo } from "./utility";

export default () => {
  addEventListener("mousedown", (event) => {
    if (
      Graph.wheelPress != true &&
      (Graph.selected_node == undefined || Graph.selected_io == undefined) &&
      event.target === Graph.canvas
    ) {
      Graph.nodes.forEach((node) => {
        isPointingTo(node);
      });
    }
  });

  addEventListener("mousemove", (event) => {
    if (Graph.selected_node != undefined && Graph.selected_io == undefined) {
      Graph.nodeMap.get(Graph.selected_node!)!.pos = {
        x: Graph.ctc.x - Graph.starting_pos_offset.x,
        y: Graph.ctc.y - Graph.starting_pos_offset.y,
      };

      Graph.render();
    }
  });
};
