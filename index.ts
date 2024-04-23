import setup_test from "./test/setup_test";
import setup_graph, { loadGraph } from "./graph/setup_graph";
import setup_drag from "./events/drag/setup_drag";
import setup_ui from "./ui/setup_ui";
import Graph from "./graph/graph";

setup_graph();
setup_drag();
Graph.loadGraph();
setup_ui();
// setup_test();
