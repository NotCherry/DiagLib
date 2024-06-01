import Graph from "../Graph";
import GraphNodeIO from "../IO";
import { setSelectedElements } from "../util/utility";

export default () => {
  addEventListener("mousedown", (event) => {
    // grab selected node if are currently connnected and reconnect it into new place
    setSelectedElements();

    if (Graph.selectedIO != undefined) {
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
    if (Graph.selectedIO != undefined) {
      let begin_io: GraphNodeIO = Graph.IOMap.get(Graph.selectedIO)!;
      setSelectedElements();
      let selected_io = Graph.IOMap.get(Graph.selectedIO)!;
      console.log(begin_io.id, selected_io.id);
      // Check if the selected io is not the same as the begin io and connect it
      if (
        begin_io.type != selected_io.type &&
        begin_io.owner != selected_io.owner &&
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
