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
      graf.drawLine = true;
      graf.LineStart = io.pos;
      graf.selected_io = io;
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
      graf.stop = false;
      node.io.forEach((io) => {
        if (ioDrag(io)) return;
      });

      graf.selected_node = node;
      graf.starting_pos_offset = {
        x: graf.ctc.x - node.pos[0],
        y: graf.ctc.y - node.pos[1],
      };
    }
  }

  addEventListener("wheel", (event) => {
    graf.zoom = event.deltaY < 0 ? 1.1 : 0.9;

    graf.ctx.translate(graf.ctc.x, graf.ctc.y);
    graf.ctx.scale(graf.zoom, graf.zoom);
    graf.ctx.translate(-graf.ctc.x, -graf.ctc.y);
    graf.render();
    event.preventDefault();
  });

  // Draging graph with cursor wheel
  addEventListener("mousedown", (event) => {
    if (event.button === 1) {
      graf.drag_offset = getTransformedPoint(event.offsetX, event.offsetY);
      graf.wheelPress = true;
    }

    if (
      graf.wheelPress != true &&
      (graf.selected_node == undefined || graf.selected_io == undefined)
    ) {
      graf.nodes.forEach((node) => {
        isPointingTo(node);
      });
    }
  });

  addEventListener("mousemove", (event) => {
    graf.ctc = getTransformedPoint(event.offsetX, event.offsetY);
    graf.ctc.x -= graf.drag_offset.x;
    graf.ctc.y -= graf.drag_offset.y;

    // graf.drag_offset.x -= drag_offset.x;
    // graf.drag_offset.y -= drag_offset.y;

    if (graf.wheelPress === true) {
      graf.ctx.translate(graf.ctc.x, graf.ctc.y);
      graf.render();
    }

    if (graf.selected_node != undefined && graf.selected_io == undefined) {
      graf.selected_node.pos = [
        graf.ctc.x - graf.starting_pos_offset.x,
        graf.ctc.y - graf.starting_pos_offset.y,
      ];

      graf.render();
    }
    if (graf.drawLine) {
      graf.render();
      drawIOLineTo(graf.ctx, graf.LineStart, graf.ctc);
    }
  });
  addEventListener("mouseup", (event) => {
    if (event.button === 1 && graf.wheelPress === true) {
      graf.wheelPress = false;
    }

    if (graf.selected_io != undefined && graf.selected_node != undefined) {
      let begin_io: GraphNodeIO = graf.selected_io;
      let srcNodeIndex = graf.nodes.indexOf(graf.selected_node);
      let prev_node: GraphNode | undefined = undefined;
      prev_node = graf.selected_node;

      graf.nodes.forEach((node) => {
        isPointingTo(node);
      });

      if (
        begin_io.type != graf.selected_io.type &&
        prev_node != graf.selected_node
      ) {
        let srcIoIndex = graf.nodes[srcNodeIndex].io.indexOf(begin_io);
        graf.nodes[srcNodeIndex].io[srcIoIndex].pointingTo?.push(
          graf.selected_io
        );
      }
    }

    graf.selected_node = undefined;
    graf.selected_io = undefined;
    graf.drawLine = false;
    graf.render();
  });
}
