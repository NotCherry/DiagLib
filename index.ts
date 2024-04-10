import setup_test from "./test/setup_test";
import setup_graph from "./graph/setup_graph";
import setup_drag from "./events/drag/setup_drag";
import Graph from "./graph/graph";

let graf = setup_graph();
setup_test();

// console.log(Graph.saveGraph());
// loadGraph(
//   '{"id":"78fbb0cf-cdef-4776-9be4-acceb8805f7e","graph_name":"Graph","nodes":[{"title":"Input","type":"input","size":[300,200],"pos":[100,100],"io":[{"type":"output","name":"output"}],"widgets":[]},{"title":"Generate","type":"generate","size":[300,210],"pos":[500,400],"io":[{"type":"input","name":"1"},{"type":"output","name":"output"}],"widgets":[null]},{"title":"Generate","type":"generate","size":[300,210],"pos":[500,700],"io":[{"type":"input","name":"1"},{"type":"output","name":"output"}],"widgets":[null]},{"title":"Generate 2","type":"generate","size":[300,240],"pos":[900,500],"io":[{"type":"input","name":"1"},{"type":"input","name":"2"},{"type":"output","name":"output"}],"widgets":[null]}]}'
// );
setup_drag(graf);
