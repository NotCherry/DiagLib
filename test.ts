import Graph from "./graph";
import GraphNode from "./node";

function test_setup(graf: Graph) {
  var node = new GraphNode({ title: "Test", pos: [100, 100] });
  node.addIO({ name: "Input 1", radius: 7, type: "input" });
  node.addIO({ name: "Input 2", radius: 7, type: "output" });
  graf.addNode(node);

  var node = new GraphNode({ title: "Test 2", pos: [500, 100] });
  node.addIO({ name: "Input 1", radius: 7, type: "input" });
  node.addIO({ name: "Input 2", radius: 7, type: "output" });
  graf.addNode(node);

  graf.render();
}

export default test_setup;
