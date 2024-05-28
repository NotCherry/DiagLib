import Graph from "../Graph";
import io from "socket.io-client";
type SocketMessage = {
  type: string;
  data: any;
};

export default class Connection {
  static conn: any;
  static lastUpdatedNode: string = "";
  constructor() {
    Connection.conn = io("ws://cherrydev.duckdns.org:5000");
    Connection.conn.onopen = () => {
      console.log("Connection established");
    };
    Connection.conn.onmessage = (msg: SocketMessage) => {
      // console.log(msg);
      const req: SocketMessage = JSON.parse(msg.data);
      if (req.type === "update_node") {
        let node = req.data;
        if (Connection.lastUpdatedNode !== node.id) {
          Graph.nodeMap.get(node.id)!.color = "green";
          if (Connection.lastUpdatedNode !== "") {
            Graph.nodeMap.get(Connection.lastUpdatedNode)!.color = "";
          }
          Graph.render();
        }

        Connection.lastUpdatedNode = node.id;
        Graph.nodeMap.get(node.id)?.updateData(node.data);
        Graph.render();
      }
      Connection.lastUpdatedNode = "";
    };
  }
  static send(data: any) {
    Connection.conn.send(data);
  }
}
