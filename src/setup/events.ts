import Graph from "../Graph";
import Connection from "../util/connection";
import { isPointingTo } from "../util/utility";

export default (WsApiURL) => {
  Graph.canvas.addEventListener("contextmenu", (event) => {
    Graph.cursorAt = isPointingTo();
    // Graph.drawLine = false;
  });

  new Connection(WsApiURL);
};
