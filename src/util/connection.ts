import { server } from "typescript";
import Graph from "../Graph";
import { OAIAPI, OAIResponse } from "../types";

type SocketMessage = {
  type: string;
  data: any;
};


export default class Connection {
  static restarting: boolean = false;
  static conn: any;
  static lastUpdatedNode: string = "";
  static url: string;
  static maxTokens: number;
  static temperature: number;
  constructor(apiURL: string, maxTokens: number, temperature: number) {
    Connection.setup_conn(apiURL);
    Connection.maxTokens = maxTokens;
    Connection.temperature = temperature;
  }
  static async reconnect(apiURL, data) {
      if (Connection.restarting) {
        console.warn("Do not abuse");
        return;
      }
      Connection.restarting = true;
      console.log("Reconnecting...");
      await Connection.setup_conn(apiURL)
      if (Connection.conn instanceof WebSocket) {
        setTimeout(()=>{Connection.send(data)}, 1000)
        return;
      }
      Connection.reconnect(apiURL, data);
  
  }

  static async setup_conn(apiURL: string) {
    Connection.url = apiURL;
    Connection.conn = await new WebSocket(apiURL);
    Connection.conn.onopen = () => {
      console.log("Connection established");
      Connection.restarting = false;
    };
    Connection.conn.onerror = () => {
      console.error("Hit error");
      Connection.destroy()
    }
    Connection.conn.onclose = () => {
      console.warn("Hit close")
      Connection.destroy()
    };
    Connection.conn.onmessage = (msg: SocketMessage) => {
      updateDiagram(msg)
    };
  }

  static destroy() {
    if (Connection.conn instanceof WebSocket) {
      console.log("Connection Destroyed");
      Connection.conn.close();
      Connection.conn = null;
    }
  }

  static send(data: any) {
    if (!(Connection.conn instanceof WebSocket)){
      Connection.reconnect(Connection.url, data);
    }
    if (Connection.restarting){
      return;
    }
    Connection.conn.send(data);
  }
}

async function update_node(node) {
  const targetNode = Graph.nodeMap.get(node.id);
  if (targetNode == undefined || targetNode.type == "output") {
    return;
  }
  targetNode.updateData(node.data);
}

async function updateDiagram(msg: SocketMessage) {
  const req: SocketMessage = JSON.parse(msg.data);
  console.warn(req.type)
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
    
    update_node(node);
    Graph.render();
  }
  if (req.type === "run_local") {
    let node = req.data;

    const requestPayload = {
      model: "gpt-3.5-turbo", // Replace with your model name
      prompt: node.data.prompt,
      max_tokens: Connection.maxTokens,
      temperature: 0.7,
    };

    const response = await fetch(node.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload), // Convert the payload to JSON
    });

    // Parse the response
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    const data: OAIAPI = await response.json();
    if (!data || data.choices.length < 1) {
      return;
    }
    const llmResponse = data.choices[0].text
    let server_back_message = {type:'local_llm', data: llmResponse}
    Connection.send(JSON.stringify(server_back_message));
    update_node({data: llmResponse, id: node.data.id})
  }
  if (req.type === "run_compleated") {
    Graph.generatingContent = false;
    console.log(req.type, req.data)
    Graph.returnLastContent(req.data.text)
  }
  Connection.lastUpdatedNode = "";
}