import { GenerateNode } from "../nodes/Generate";
import Graph from "../Graph";
import { InputNode } from "../nodes/InputNode";

export default () => {
  Graph.registerNode("input", InputNode);
  Graph.registerNode("generate", GenerateNode);
};
