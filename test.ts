import Graph from "./graph";
import GraphNode from "./node";

function test_setup(graf: Graph) {
  var node = new GraphNode({ title: "Test" });
  graf.addNode(node);

  var node = new GraphNode({ title: "Test 2", pos: [-1300, -200] });
  graf.addNode(node);

  graf.render();
}

export default test_setup;
