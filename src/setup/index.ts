import setupDrag from "./drag";
import setupGraph from "./graph";
import setupNodeTypes from "./nodeTypes";
import {setupEvents} from "./events";
import Graph from "../Graph";

export function setup(WsApiURL: string = "", graph_config?: string) {
  setupNodeTypes();
  setupGraph();
  setupDrag();
  setupEvents(WsApiURL);
  Graph.loadGraph(graph_config);
}
