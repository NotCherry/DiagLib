import Graph from "../../graph/graph";
import move_around from "./move_around";
import move_nodes from "./move_nodes";
import move_io_connections from "./move_io_connections";

export default function drag_setup() {
  move_nodes();
  move_around();
  move_io_connections();
}
