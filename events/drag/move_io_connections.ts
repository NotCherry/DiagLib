import Graph from "../../graph/graph";
import GraphNode, { GraphNodeIO } from "../../nodes/Node";
import { drawIOLineTo, isPointingTo } from "../../utility";

export default (graf: Graph) => {
  addEventListener("mousedown", (event) => {
    // grab selected node if are currently connnected and reconnect it into new place
    if (graf.selected_io != undefined && graf.selected_node != undefined) {
      let selected_io = graf.IOMap.get(graf.selected_io)!;
      // let selected_node = graf.nodeMap.get(graf.selected_node);
      if (selected_io.pointedBy != undefined && selected_io.type === "input") {
        let src_io = graf.IOMap.get(selected_io.pointedBy!)!;
        graf.LineStart = src_io.pos;
        // the io that is beging of the line (output) remove connection to selected io
        src_io!.pointingTo! = src_io!.pointingTo!.filter(
          (io) => io != graf.selected_io
        );

        graf.selected_node = src_io.owner.id;
        // let new_selected_io = src_io;
        selected_io.pointedBy = undefined;
        graf.selected_io = src_io.id;
      }
      graf.render();
    }
  });

  addEventListener("mousemove", (event) => {
    if (graf.drawLine && graf.selected_io != undefined) {
      graf.IOMap.get(graf.selected_io!)!.pointedBy == undefined
        ? graf.render()
        : null;
    }
  });

  addEventListener("mouseup", (event) => {
    if (graf.selected_io != undefined && graf.selected_node != undefined) {
      let begin_io: GraphNodeIO = graf.IOMap.get(graf.selected_io)!;
      let prev_node: GraphNode = graf.nodeMap.get(graf.selected_node!)!;

      graf.nodes.forEach((node) => {
        isPointingTo(node, graf);
      });

      let selected_node: GraphNode | undefined = graf.nodeMap.get(
        graf.selected_node!
      )!;
      let selected_io = graf.IOMap.get(graf.selected_io)!;
      // Check if the selected io is not the same as the begin io and connect it
      if (
        begin_io.type != selected_io.type &&
        prev_node != selected_node &&
        selected_io.pointedBy == undefined
      ) {
        if (begin_io.type === "output") {
          begin_io.pointingTo?.push(selected_io.id);
          selected_io.pointedBy = begin_io.id;
        } else {
          selected_io.pointingTo?.push(begin_io.id);
          begin_io.pointedBy = selected_io.id;
        }
      }
      // console.log(selected_io.id, begin_io.id);
    }

    graf.selected_node = undefined;
    graf.selected_io = undefined;
    graf.drawLine = false;

    graf.render();
  });
};
