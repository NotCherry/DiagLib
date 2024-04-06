import Graph from "./graph";
import GraphNode from "./node";
import { TeaxtArea } from "./widget";

function test_setup(graf: Graph) {
  var node = new GraphNode({ title: "Test", pos: [100, 100] });
  node.addIO({ name: "Input 1", radius: 7, type: "input" });
  node.addIO({ name: "Output 2", radius: 7, type: "output" });
  graf.addNode(node);

  var node2 = new GraphNode({ title: "Test 2", pos: [500, 100] });
  node2.addIO({ name: "Input 1", radius: 7, type: "input" });
  node2.addIO({ name: "Output 2", radius: 7, type: "output" });
  graf.addNode(node2);
  node.connect(0, 0, node2);

  var node3 = new GraphNode({ title: "Test 3", pos: [900, 100] });
  node3.addIO({ name: "Input 1", radius: 7, type: "input" });
  node3.addIO({ name: "Input 2", radius: 7, type: "input" });
  graf.addNode(node3);

  var node4 = new GraphNode({ title: "Test 4", pos: [900, 400] });
  node4.addIO({ name: "Input r4", radius: 7, type: "input" });
  node4.addIO({ name: "Input 1", radius: 7, type: "input" });
  node4.addIO({ name: "Input 1", radius: 7, type: "input" });
  graf.addNode(node4);
  node2.connect(0, 0, node3);
  node2.connect(0, 0, node4);

  node4.addWidget(new TeaxtArea({}));

  graf.render();
}

export default test_setup;
