import Graph from "../graph/graph";
import { getTransformedPoint } from "../utility";

export default (graf: Graph) => {
  addEventListener("wheel", (event) => {
    graf.zoom = event.deltaY < 0 ? 1.1 : 0.9;

    graf.ctx.translate(graf.ctc.x, graf.ctc.y);
    graf.ctx.scale(graf.zoom, graf.zoom);
    graf.ctx.translate(-graf.ctc.x, -graf.ctc.y);

    graf.render();
    event.preventDefault();
  });
  addEventListener("mouseout", (event) => {
    graf.mouse_out = true;
  });

  graf.canvas.addEventListener("mouseenter", (event) => {
    graf.mouse_out = false;
  });

  // with middle mouse click get starting postion to moving objects
  addEventListener("mousedown", (event) => {
    if (event.button === 1) {
      graf.drag_offset = getTransformedPoint(
        event.offsetX,
        event.offsetY,
        graf
      );
      graf.wheelPress = true;
    }
  });

  addEventListener("mouseup", (event) => {
    if (event.button === 1 && graf.wheelPress === true) {
      graf.wheelPress = false;
    }
  });

  // with mouse wheel press grab and change postion of the camera
  addEventListener("mousemove", (event) => {
    if (!graf.mouse_out)
      graf.ctc = getTransformedPoint(event.offsetX, event.offsetY, graf);
    if (graf.wheelPress === true) {
      graf.ctx.translate(
        graf.ctc.x - graf.drag_offset.x,
        graf.ctc.y - graf.drag_offset.y
      );
      graf.render();
    }
  });

  graf.render();
};
