import Graph from "../../graph/graph";
import move_around from "./move_around";
import move_nodes from "./move_nodes";
import move_io_connections from "./move_io_connections";

export default function drag_setup(graf: Graph) {
  move_around(graf);
  move_nodes(graf);
  move_io_connections(graf);
}
