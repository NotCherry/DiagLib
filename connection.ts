import Graph from "./graph/graph";

type SocketMessage = {
  type: string;
  data: any;
};

export default class Connection {
  conn: WebSocket;
  lastUpdatedNode: string = "";
  constructor() {
    this.conn = new WebSocket("ws://cherrydev.duckdns.org:5000");
    this.conn.onopen = () => {
      console.log("Connection established");
    };
    this.conn.onmessage = (msg) => {
      // console.log(msg);
      const req: SocketMessage = JSON.parse(msg.data);
      if (req.type === "update_node") {
        let node = req.data;
        if (this.lastUpdatedNode !== node.id) {
          Graph.nodeMap.get(node.id)!.color = "green";
          if (this.lastUpdatedNode !== "") {
            Graph.nodeMap.get(this.lastUpdatedNode)!.color = "";
          }
          Graph.render();
        }

        this.lastUpdatedNode = node.id;
        Graph.nodeMap.get(node.id)?.updateData(node.data);
        Graph.render();
      }
      this.lastUpdatedNode = "";
    };
  }
  send(data: any) {
    this.conn.send(data);
  }
}
