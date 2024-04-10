import Graph from "../../graph/graph";
import { getTransformedPoint } from "../../utility";

export default () => {
  addEventListener("wheel", (event) => {
    Graph.zoom = event.deltaY < 0 ? 1.1 : 0.9;

    Graph.ctx.translate(Graph.ctc.x, Graph.ctc.y);
    Graph.ctx.scale(Graph.zoom, Graph.zoom);
    Graph.ctx.translate(-Graph.ctc.x, -Graph.ctc.y);

    Graph.render();
    event.preventDefault();
  });
  addEventListener("mouseout", (event) => {
    Graph.mouse_out = true;
  });

  Graph.canvas.addEventListener("mouseenter", (event) => {
    Graph.mouse_out = false;
  });

  // with middle mouse click get starting postion to moving objects
  addEventListener("mousedown", (event) => {
    if (event.button === 1) {
      Graph.drag_offset = getTransformedPoint(event.offsetX, event.offsetY);
      Graph.wheelPress = true;
    }
  });

  addEventListener("mouseup", (event) => {
    if (event.button === 1 && Graph.wheelPress === true) {
      Graph.wheelPress = false;
    }
  });

  // with mouse wheel press grab and change postion of the camera
  addEventListener("mousemove", (event) => {
    if (!Graph.mouse_out)
      Graph.ctc = getTransformedPoint(event.offsetX, event.offsetY);
    if (Graph.wheelPress === true) {
      Graph.ctx.translate(
        Graph.ctc.x - Graph.drag_offset.x,
        Graph.ctc.y - Graph.drag_offset.y
      );
      Graph.render();
    }
  });

  Graph.render();
};
