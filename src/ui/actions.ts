import Graph from "../Graph";
import GraphNode from "../Node";
import Connection from "../util/connection";

function addNode(type: string) {
  let nodeClass = Graph.registeredNodes.find((n) => n.title == type);

  if (nodeClass == undefined) {
    Graph.logs.addMessage({ type: "error", body: "Node not found" });
    return;
  }

  Graph.addNode(
    new nodeClass({ owner: Graph, title: type, pos: Graph.cursorPos })
  );

  Graph.render();
}

function deleteNode() {
  if (Graph.selectedNode != undefined || Graph.selectedNode != "") {
    Graph.logs.addMessage({ type: "info", body: "Node not selected" });
    return;
  }

  Graph.removeNode(Graph.nodeMap.get(Graph.selectedNode));
  Graph.render();
}

function addIOToNode(node: GraphNode, type: "input" | "output", name) {
  node.addIO({ name, type });
  Graph.render();
}

function removeIOFromNode(node: GraphNode, io) {
  node.removeIO(io);
  Graph.render();
}

function resizeNode(node: GraphNode, width: number, height: number) {
  node.size = [width, height];
  Graph.render();
}

export function callRun() {
  let msg = { type: "run", data: Graph.serializeNodes() };
  Connection.send(JSON.stringify(msg));
}

export function callSave() {
  return Graph.saveGraph();
}

export function callLoad(graph?: string) {
  graph = graph || "";
  Graph.loadGraph(graph);
}
