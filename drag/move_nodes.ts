import Graph from "../graph/graph";
import { isPointingTo } from "../utility";

export default (graf: Graph) => {
  addEventListener("mousedown", (event) => {
    if (
      graf.wheelPress != true &&
      (graf.selected_node == undefined || graf.selected_io == undefined)
    ) {
      graf.nodes.forEach((node) => {
        isPointingTo(node, graf);
      });
    }
  });

  addEventListener("mousemove", (event) => {
    if (graf.selected_node != undefined && graf.selected_io == undefined) {
      graf.selected_node.pos = [
        graf.ctc.x - graf.starting_pos_offset.x,
        graf.ctc.y - graf.starting_pos_offset.y,
      ];

      graf.render();
    }
  });
};
