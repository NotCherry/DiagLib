import setup_test from "./test/setup_test";
import setup_graph from "./graph/setup_graph";
import setup_drag from "./drag/setup_drag";

let graf = setup_graph();
setup_test(graf);
setup_drag(graf);
