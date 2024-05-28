import Graph from "../Graph";
import { getTransformedPoint } from "../util/utility";

export default () => {
  addEventListener("wheel", (event) => {
    event.preventDefault();
    Graph.zoom = event.deltaY < 0 ? 1.1 : 0.9;

    Graph.ctx.translate(Graph.cursorPos.x, Graph.cursorPos.y);
    Graph.ctx.scale(Graph.zoom, Graph.zoom);
    Graph.ctx.translate(-Graph.cursorPos.x, -Graph.cursorPos.y);

    Graph.render();
  });
  addEventListener("mouseout", (event) => {
    Graph.mouseOut = true;
  });

  Graph.canvas.addEventListener("mouseenter", (event) => {
    Graph.mouseOut = false;
  });

  // with middle mouse click get starting postion to moving objects
  addEventListener("mousedown", (event) => {
    if (event.button === 1) {
      Graph.switchHTMLElements();
      Graph.wheelPress = true;
      Graph.drawIO = false;
      Graph.eventButton == 1;
      event.target == Graph.canvas;
      Graph.dragOffset = getTransformedPoint(event.clientX, event.clientY);
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
    if (!Graph.mouseOut)
      Graph.mouse = {
        x: event.clientX - Graph.dragOffset.x - Graph.widgetXOffset,
        y: event.clientY - Graph.transforms.f - Graph.widgetYOffset,
      };
    Graph.cursorPos = getTransformedPoint(event.clientX, event.clientY);
    if (Graph.wheelPress === true) {
      Graph.ctx.translate(
        Graph.cursorPos.x - Graph.dragOffset.x,
        Graph.cursorPos.y - Graph.dragOffset.y
      );
      Graph.render();
    }
  });

  Graph.render();
};
