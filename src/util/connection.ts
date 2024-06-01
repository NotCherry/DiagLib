import Graph from "../Graph";

type SocketMessage = {
  type: string;
  data: any;
};

function reconnect(apiURL) {
  setTimeout(() => {
    console.log("Reconnecting...");
    Connection.conn = new Connection(apiURL);
    if (Connection.conn !== null) {
      return;
    }
    reconnect(apiURL);
  }, 2000);
}

export default class Connection {
  static conn: any;
  static lastUpdatedNode: string = "";
  constructor(apiURL: string) {
    Connection.conn = new WebSocket(apiURL);
    Connection.conn.onopen = () => {
      console.log("Connection established");
    };
    Connection.conn.onclose = () => {
      Connection.conn = null;
      reconnect(apiURL);
    };
    Connection.conn.onmessage = (msg: SocketMessage) => {
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
