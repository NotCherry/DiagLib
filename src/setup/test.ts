import Graph from "../Graph";
import { GenerateNode } from "../nodes/GenerateNode";
import { InputNode } from "../nodes/InputNode";
import { OutputNode } from "../nodes/OutputNode";

export default () => {
  console.info("Test setup");

  var inputNode1 = new InputNode({
    title: "Input",
    pos: { x: 100, y: 100 },
    owner: Graph,
  });
  Graph.addNode(inputNode1);

  var inputNode2 = new InputNode({
    title: "Input",
    pos: { x: 100, y: 200 },
    owner: Graph,
  });
  Graph.addNode(inputNode2);

  var genNode1 = new GenerateNode({
    title: "Test",
    pos: { x: 300, y: 100 },
    owner: Graph,
    data: { text: "{1} is better than {2}" },
  });
  Graph.addNode(genNode1);

  var outputNode1 = new OutputNode({
    title: "Test",
    pos: { x: 900, y: 100 },
    owner: Graph,
  });
  Graph.addNode(outputNode1);

  inputNode1.connect(0, 0, genNode1);
  inputNode2.connect(0, 1, genNode1);
  genNode1.connect(0, 0, outputNode1);

  Graph.render();
};
