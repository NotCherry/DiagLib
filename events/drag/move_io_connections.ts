import Graph from "../../graph/graph";
import GraphNode, { GraphNodeIO } from "../../nodes/Node";
import { drawIOLineTo, isPointingTo } from "../../utility";

export default () => {
  addEventListener("mousedown", (event) => {
    // grab selected node if are currently connnected and reconnect it into new place
    if (Graph.selected_io != undefined && Graph.selected_node != undefined) {
      let selected_io = Graph.IOMap.get(Graph.selected_io)!;
      // let selected_node = Graph.nodeMap.get(Graph.selected_node);
      if (selected_io.pointedBy != undefined && selected_io.type === "input") {
        let src_io = Graph.IOMap.get(selected_io.pointedBy!)!;
        Graph.LineStart = src_io.pos;
        // the io that is beging of the line (output) remove connection to selected io
        src_io!.pointingTo! = src_io!.pointingTo!.filter(
          (io) => io != Graph.selected_io
        );

        Graph.selected_node = src_io.owner;
        // let new_selected_io = src_io;
        selected_io.pointedBy = undefined;
        Graph.selected_io = src_io.id;
      }
      Graph.render();
    }
  });

  addEventListener("mousemove", (event) => {
    if (Graph.drawLine && Graph.selected_io != undefined) {
      Graph.IOMap.get(Graph.selected_io!)!.pointedBy == undefined
        ? Graph.render()
        : null;
    }
  });

  addEventListener("mouseup", (event) => {
    if (Graph.selected_io != undefined && Graph.selected_node != undefined) {
      let begin_io: GraphNodeIO = Graph.IOMap.get(Graph.selected_io)!;
      let prev_node: GraphNode = Graph.nodeMap.get(Graph.selected_node!)!;

      Graph.nodes.forEach((node) => {
        isPointingTo(node);
      });

      let selected_node: GraphNode | undefined = Graph.nodeMap.get(
        Graph.selected_node!
      )!;
      let selected_io = Graph.IOMap.get(Graph.selected_io)!;
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

    Graph.selected_node = undefined;
    Graph.selected_io = undefined;
    Graph.drawLine = false;

    Graph.render();
  });
};
