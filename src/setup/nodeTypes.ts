import { GenerateNode, GenerateNode3 } from "../nodes/GenerateNode";
import Graph from "../Graph";
import { InputNode } from "../nodes/InputNode";
import { OutputNode } from "../nodes/OutputNode";

export default () => {
  Graph.registerNode("input", InputNode);
  Graph.registerNode("generate", GenerateNode);
  Graph.registerNode("generate3", GenerateNode3);
  Graph.registerNode("output", OutputNode);
};
