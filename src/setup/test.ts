import Graph from "../Graph";
import { GenerateNode, GenerateNode2 } from "../nodes/Generate";
import { InputNode } from "../nodes/InputNode";

export default () => {
  var inputNode = new InputNode({
    title: "Input",
    pos: { x: 100, y: 100 },
    owner: Graph,
  });
  Graph.addNode(inputNode);
  var node = new GenerateNode({
    title: "Test",
    pos: { x: 500, y: 400 },
    owner: Graph,
  });
  Graph.addNode(node);

  var node2 = new GenerateNode({
    title: "Test",
    pos: { x: 500, y: 700 },
    owner: Graph,
  });
  Graph.addNode(node2);

  var node3 = new GenerateNode2({
    title: "Test",
    pos: { x: 900, y: 500 },
    owner: Graph,
  });
  Graph.addNode(node3);

  inputNode.connect(0, 0, node);
  node.connect(0, 0, node3);
  node2.connect(0, 1, node3);

  Graph.render();
};
