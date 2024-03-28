import test_setup from "./test";
import graph_setup from "./graph_setup";
import drag_setup from "./drag_events";

let graf = graph_setup();
drag_setup(graf);
test_setup(graf);
