import Graph from "./graph";
import GraphNode, { GraphNodeIO } from "./node";
import { drawIOLineTo } from "./utility";

export default function drag_setup(graf: Graph) {
  function getTransformedPoint(x, y) {
    const originalPoint = new DOMPoint(x, y);
    return graf.ctx.getTransform().invertSelf().transformPoint(originalPoint);
  }

  function isPointInCircle(pointX, pointY, circleX, circleY, radius) {
    const distance = Math.sqrt(
      (pointX - circleX) ** 2 + (pointY - circleY) ** 2
    );
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

    // grab selected node if are currently connnected and reconnect it into new place
    if (
      graf.selected_io != undefined &&
      graf.selected_node != undefined &&
      graf.selected_io.pointedBy != undefined
    ) {
      console.log("reconnecting");
      if (graf.selected_io.type === "input") {
        graf.LineStart = graf.selected_io.pointedBy!.pos;

        // the io that is beging of the line (output) remove connection to selected io
        graf.selected_io.pointedBy!.pointingTo! =
          graf.selected_io.pointedBy!.pointingTo!.filter(
            (io) => io != graf.selected_io
          );
        // console.log(pointingTo);
        graf.selected_node = graf.selected_io.pointedBy?.owner;
        graf.selected_io = graf.selected_io.pointedBy;
        graf.selected_io.pointedBy = undefined;
      }
    }
  });

  addEventListener("mouseout", (event) => {
    graf.mouse_out = true;
  });

  graf.canvas.addEventListener("mouseenter", (event) => {
    graf.mouse_out = false;
  });

  addEventListener("mousemove", (event) => {
    if (!graf.mouse_out)
      graf.ctc = getTransformedPoint(event.offsetX, event.offsetY);
    if (graf.wheelPress === true) {
      graf.ctx.translate(
        graf.ctc.x - graf.drag_offset.x,
        graf.ctc.y - graf.drag_offset.y
      );
      graf.render();
    }

    if (graf.selected_node != undefined && graf.selected_io == undefined) {
      graf.selected_node.pos = [
        graf.ctc.x - graf.starting_pos_offset.x,
        graf.ctc.y - graf.starting_pos_offset.y,
      ];

      graf.render();
    }
    if (graf.drawLine && graf.selected_io?.pointedBy == undefined) {
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
      let prev_node: GraphNode | undefined = graf.selected_node;

      graf.nodes.forEach((node) => {
        isPointingTo(node);
      });

      console.log(graf.selected_io, begin_io);

      // Check if the selected io is not the same as the begin io and connect it
      if (
        begin_io.type != graf.selected_io.type &&
        prev_node != graf.selected_node
      ) {
        console.log("connecting");
        begin_io.pointingTo?.push(graf.selected_io);
        graf.selected_io.pointedBy = begin_io;
      }
    }

    graf.selected_node = undefined;
    graf.selected_io = undefined;
    graf.drawLine = false;
    graf.render();
  });
}
