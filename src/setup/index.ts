import setupDrag from "./drag";
import setupGraph, { loadGraph } from "./graph";
import setupNodeTypes from "./nodeTypes";
import setupEvents from "./events";

export function setup(WsApiURL: string, graph?: string) {
  setupNodeTypes();
  setupGraph();
  setupDrag();
  setupEvents(WsApiURL);

  graph = graph || "";
  loadGraph(graph);
}
