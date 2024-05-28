import Graph from "../Graph";
import GraphNodeIO from "../IO";
import GraphNode from "../Node";
import { drawIOLineTo, isPointingTo } from "../util/utility";

export default () => {
  addEventListener("mousedown", (event) => {
    // grab selected node if are currently connnected and reconnect it into new place
    if (Graph.selectedIO != undefined && Graph.selectedNode != undefined) {
      let selected_io = Graph.IOMap.get(Graph.selectedIO)!;
      // let selected_node = Graph.nodeMap.get(Graph.selected_node);
      if (selected_io.pointedBy != undefined && selected_io.type === "input") {
        let src_io = Graph.IOMap.get(selected_io.pointedBy!)!;
        Graph.LineStart = src_io.pos;
        // the io that is beging of the line (output) remove connection to selected io
        src_io!.pointingTo! = src_io!.pointingTo!.filter(
          (io) => io != Graph.selectedIO
        );

        Graph.selectedNode = src_io.owner;
        // let new_selected_io = src_io;
        selected_io.pointedBy = undefined;
        Graph.selectedIO = src_io.id;
      }
      Graph.render();
    }
  });

  addEventListener("mousemove", (event) => {
    if (Graph.drawLine && Graph.selectedIO != undefined) {
      Graph.IOMap.get(Graph.selectedIO!)!.pointedBy == undefined
        ? Graph.render()
        : null;
    }
  });

  addEventListener("mouseup", (event) => {
    if (Graph.selectedIO != undefined && Graph.selectedNode != undefined) {
      let begin_io: GraphNodeIO = Graph.IOMap.get(Graph.selectedIO)!;
      let prev_node: GraphNode = Graph.nodeMap.get(Graph.selectedNode!)!;

      Graph.nodes.forEach((node) => {
        isPointingTo(node);
      });

      let selected_node: GraphNode | undefined = Graph.nodeMap.get(
        Graph.selectedNode!
      )!;
      let selected_io = Graph.IOMap.get(Graph.selectedIO)!;
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
    }

    Graph.selectedNode = undefined;
    Graph.selectedIO = undefined;
    Graph.drawLine = false;

    Graph.render();
  });
};
