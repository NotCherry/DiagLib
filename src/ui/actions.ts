import Graph from "../Graph";
import GraphNodeIO from "../IO";
import GraphNode from "../Node";
import graph from "../setup/graph";
import Connection from "../util/connection";

export function addNode(type: string) {
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

export function deleteNode() {
  if (Graph.cursorAt.type != "node") {
    Graph.logs.addMessage({ type: "info", body: "Node not selected" });
    console.log(Graph.logs);
    return;
  }

  Graph.removeNode(Graph.nodeMap.get(Graph.cursorAt.id));
  Graph.render();
}

export function addIOToNode() {
  let node = Graph.nodeMap.get(Graph.cursorAt.id!);
  node.addIO({ name: (node.ioInputLength + 1).toString(), type: "input" });
  Graph.render();
}

export function removeIOFromNode() {
  let io = Graph.IOMap.get(Graph.cursorAt.id!);
  let node = Graph.nodeMap.get(io.owner);
  node.removeIO(io);
  Graph.render();
}

export function resizeNode(node: GraphNode, width: number, height: number) {
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
