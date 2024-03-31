import Graph from "./graph";
import GraphNode from "./node";
import { Point } from "./types";

export default function drag_setup(graf: Graph) {
  function getTransformedPoint(x, y) {
    const originalPoint = new DOMPoint(x, y);
    return graf.ctx.getTransform().invertSelf().transformPoint(originalPoint);
  }
  var selected_node: GraphNode | undefined = undefined;
  var starting_pos_offset: Point = { x: 0, y: 0 };
  let zoom: number = 1.0;

  let drag_start_pos: Point = { x: 0, y: 0 };
  let wheelPress: boolean = false;

  let scale;

  addEventListener("wheel", (event) => {
    zoom = event.deltaY < 0 ? 1.1 : 0.9;

    graf.ctx.translate(graf.ctc.x, graf.ctc.y);
    graf.ctx.scale(zoom, zoom);
    graf.ctx.translate(-graf.ctc.x, -graf.ctc.y);
    graf.render();
    event.preventDefault();
  });

  // Draging graph with cursor wheel
  addEventListener("mousedown", (event) => {
    if (event.button === 1) {
      drag_start_pos = getTransformedPoint(event.offsetX, event.offsetY);
      wheelPress = true;
    }
  });
  addEventListener("mousemove", (event) => {
    graf.ctc = getTransformedPoint(event.offsetX, event.offsetY);

    if (wheelPress === true) {
      graf.ctx.translate(
        graf.ctc.x - drag_start_pos.x,
        graf.ctc.y - drag_start_pos.y
      );
      graf.render();
    }
  });
  addEventListener("mouseup", (event) => {
    if (event.button === 1 && wheelPress === true) {
      wheelPress = false;
      graf.render();
    }
  });

  addEventListener("mousedown", (event) => {
    if (wheelPress != true) {
      graf.nodes.forEach((node) => {
        if (
          graf.ctc.x > node.pos[0] &&
          graf.ctc.x < node.pos[0] + node.size[0] &&
          graf.ctc.y > node.pos[1] &&
          graf.ctc.y < node.pos[1] + node.size[1]
        ) {
          selected_node = node;
          starting_pos_offset = {
            x: graf.ctc.x - drag_start_pos.x - node.pos[0],
            y: graf.ctc.y - drag_start_pos.y - node.pos[1],
          };
        }
      });
    }
  });

  addEventListener("mouseup", (event) => {
    selected_node = undefined;
  });

  addEventListener("mousemove", (event) => {
    if (selected_node != undefined) {
      selected_node.pos = [
        graf.ctc.x - drag_start_pos.x - starting_pos_offset.x,
        graf.ctc.y - drag_start_pos.y - starting_pos_offset.y,
      ];

      graf.render();
    }
  });
}
