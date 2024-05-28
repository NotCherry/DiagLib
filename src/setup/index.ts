import setupDrag from "./drag";
import setupGraph, { loadGraph } from "./graph";
import setupNodeTypes from "./nodeTypes";

export function setup(graph?: string) {
  setupNodeTypes();
  setupGraph();
  setupDrag();

  graph = graph || "";
  loadGraph(graph);
}
