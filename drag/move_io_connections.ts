import Graph from "../graph/graph";
import GraphNode, { GraphNodeIO } from "../nodes/node";
import { drawIOLineTo, isPointingTo } from "../utility";

export default (graf: Graph) => {
  addEventListener("mousedown", (event) => {
    // grab selected node if are currently connnected and reconnect it into new place
    if (
      graf.selected_io != undefined &&
      graf.selected_node != undefined &&
      graf.selected_io.pointedBy != undefined &&
      graf.selected_io.type === "input"
    ) {
      graf.LineStart = graf.selected_io.pointedBy!.pos;

      // the io that is beging of the line (output) remove connection to selected io
      graf.selected_io.pointedBy!.pointingTo! =
        graf.selected_io.pointedBy!.pointingTo!.filter(
          (io) => io != graf.selected_io
        );

      graf.selected_node = graf.selected_io.pointedBy?.owner;
      let output_node = graf.selected_io.pointedBy;
      graf.selected_io.pointedBy = undefined;
      graf.selected_io = output_node;
    }
    graf.render();
  });

  addEventListener("mousemove", (event) => {
    if (graf.drawLine && graf.selected_io?.pointedBy == undefined) {
      graf.render();
    }
  });

  addEventListener("mouseup", (event) => {
    if (graf.selected_io != undefined && graf.selected_node != undefined) {
      let begin_io: GraphNodeIO = graf.selected_io;
      let prev_node: GraphNode | undefined = graf.selected_node;

      graf.nodes.forEach((node) => {
        isPointingTo(node, graf);
      });

      // Check if the selected io is not the same as the begin io and connect it
      if (
        begin_io.type != graf.selected_io.type &&
        prev_node != graf.selected_node
      ) {
        console.log("connecting");
        begin_io.pointingTo?.push(graf.selected_io);
        graf.selected_io.pointedBy = begin_io;
      }
      console.log(graf.selected_io, begin_io);
    }

    graf.selected_node = undefined;
    graf.selected_io = undefined;
    graf.drawLine = false;

    graf.render();
  });
};
