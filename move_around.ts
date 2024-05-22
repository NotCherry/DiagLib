import Graph from "./graph";
import { getTransformedPoint } from "./utility";

export default () => {
  addEventListener("wheel", (event) => {
    event.preventDefault();
    Graph.zoom = event.deltaY < 0 ? 1.1 : 0.9;

    Graph.ctx.translate(Graph.ctc.x, Graph.ctc.y);
    Graph.ctx.scale(Graph.zoom, Graph.zoom);
    Graph.ctx.translate(-Graph.ctc.x, -Graph.ctc.y);

    Graph.render();
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
      Graph.switchHTMLElements();
      Graph.wheelPress = true;
      Graph.drawIO = false;
      Graph.eventButton == 1;
      event.target == Graph.canvas;
      Graph.drag_offset = getTransformedPoint(event.clientX, event.clientY);
    }
    if (event.button === 0) {
      Graph.eventButton == 0;
      if (event.target == Graph.canvas) Graph.switchHTMLElements();
    }
  });

  addEventListener("mouseup", (event) => {
    if (event.button === 1 && Graph.wheelPress === true) {
      Graph.wheelPress = false;
    }
    if (event.button === 1) {
      Graph.drawIO = true;
      Graph.switchHTMLElements();
    }
    if (event.button === 0) {
      if (event.target == Graph.canvas) Graph.switchHTMLElements();
    }

    Graph.eventButton == 0;
  });

  // with mouse wheel press grab and change postion of the camera
  addEventListener("mousemove", (event) => {
    if (!Graph.mouse_out)
      Graph.ctc = getTransformedPoint(event.pageX, event.pageY);
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
