import setup_test from "./test/setup_test";
import setup_graph, { loadGraph } from "./graph/setup_graph";
import setup_drag from "./events/drag/setup_drag";
import Graph from "./graph/graph";

setup_graph();
setup_drag();
setup_test();
