import Graph from "../graph/graph";
import { GenerateNode, GenerateNode2 } from "../nodes/Generate";
import { InputNode } from "../nodes/InputNode";
import GraphNode from "../nodes/Node";
import { TeaxtArea } from "../nodes/widgets/TextInput";

export default (graf: Graph) => {
  var inputNode = new InputNode({
    title: "Input",
    pos: { x: 100, y: 100 },
    owner: graf,
  });
  graf.addNode(inputNode);
  var node = new GenerateNode({
    title: "Test",
    pos: { x: 500, y: 400 },
    owner: graf,
  });
  graf.addNode(node);

  var node2 = new GenerateNode({
    title: "Test",
    pos: { x: 500, y: 700 },
    owner: graf,
  });
  graf.addNode(node2);

  var node3 = new GenerateNode2({
    title: "Test",
    pos: { x: 900, y: 500 },
    owner: graf,
  });
  graf.addNode(node3);

  inputNode.connect(0, 0, node);
  node.connect(0, 0, node3);
  node2.connect(0, 1, node3);
};
