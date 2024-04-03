import Graph from "./graph";
import GraphNode, { GraphNodeIO } from "./node";
import { Point } from "./types";
import { drawIOLineTo } from "./utility";

export default function drag_setup(graf: Graph) {
  function getTransformedPoint(x, y) {
    const originalPoint = new DOMPoint(x, y);
    return graf.ctx.getTransform().invertSelf().transformPoint(originalPoint);
  }

  function isPointInCircle(pointX, pointY, circleX, circleY, radius) {
    // Calculate the distance between the point and the center of the circle
    const distance = Math.sqrt(
      (pointX - circleX) ** 2 + (pointY - circleY) ** 2
    );

    // Check if the distance is less than the radius of the circle
    return distance <= radius;
  }

  function ioDrag(io: GraphNodeIO) {
    if (
      isPointInCircle(graf.ctc.x, graf.ctc.y, io.pos.x, io.pos.y, io.radius)
    ) {
      drawLine = true;
      LineStart = io.pos;
      selected_io = io;
      return true;
    } else {
      return false;
    }
  }

  function isPointingTo(node) {
    if (
      graf.ctc.x > node.pos[0] &&
      graf.ctc.x < node.pos[0] + node.size[0] &&
      graf.ctc.y > node.pos[1] &&
      graf.ctc.y < node.pos[1] + node.size[1]
    ) {
      stop = false;
      // node.Input.forEach((io) => {
      //   if (ioDrag(io)) return;
      // });
      // node.Output.forEach((io) => {
      //   if (ioDrag(io)) return;
      // });
      node.io.forEach((io) => {
        if (ioDrag(io)) return;
      });

      selected_node = node;
      starting_pos_offset = {
        x: graf.ctc.x - node.pos[0],
        y: graf.ctc.y - node.pos[1],
      };
    }
  }

  var selected_node: GraphNode | undefined = undefined;
  var starting_pos_offset: Point = { x: 0, y: 0 };
  let zoom: number = 1.0;

  let drag_offset: Point = { x: 0, y: 0 };
  let wheelPress: boolean = false;

  let drawLine: boolean = false;
  let LineStart: Point = { x: 0, y: 0 };
  let begin_io: GraphNodeIO | undefined = undefined;
  let selected_io: GraphNodeIO | undefined = undefined;
  let stop = false;

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
      drag_offset = getTransformedPoint(event.offsetX, event.offsetY);
      wheelPress = true;
    }

    if (
      wheelPress != true &&
      (selected_node == undefined || selected_io == undefined)
    ) {
      graf.nodes.forEach((node) => {
        isPointingTo(node);
      });
    }
  });

  addEventListener("mousemove", (event) => {
    graf.ctc = getTransformedPoint(event.offsetX, event.offsetY);
    graf.ctc.x -= drag_offset.x;
    graf.ctc.y -= drag_offset.y;

    if (wheelPress === true) {
      graf.ctx.translate(graf.ctc.x, graf.ctc.y);
      graf.render();
    }

    if (selected_node != undefined && selected_io == undefined) {
      selected_node.pos = [
        graf.ctc.x - starting_pos_offset.x,
        graf.ctc.y - starting_pos_offset.y,
      ];

      graf.render();
    }
    if (drawLine) {
      graf.render();
      drawIOLineTo(graf.ctx, graf.ctc, LineStart, graf.ctc);
    }
  });
  addEventListener("mouseup", (event) => {
    if (event.button === 1 && wheelPress === true) {
      wheelPress = false;
    }
    // if (selected_io == undefined) {
    //   begin_io = selected_io;
    //   graf.nodes.forEach((node) => {
    //     isPointingTo(node);
    //   });
    //   selected_node.
    // }
    selected_node = undefined;
    selected_io = undefined;
    drawLine = false;
    graf.render();
  });
}
