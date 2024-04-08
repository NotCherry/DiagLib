import Graph from "./graph/graph";
import { GraphNodeIO } from "./nodes/node";
import { Point } from "./types";

function formatStringFromInputs(node, format) {
  if (!node || !node.inputs) {
    console.error("Node or inputs array not found.");
    return null;
  }

  // Extract input values from the node
  let inputValues = node.inputs.map((input, i) => node.getInputData(i));

  // Replace placeholders with input values
  return format.replace(/{(\d+)}/g, (match, index) => {
    let inputValue = inputValues[index];
    return typeof inputValue !== "undefined" ? inputValue : match;
  });
}

export function drawCircle(
  ctx: CanvasRenderingContext2D,
  pos: Point,
  radius: number
) {
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}
export function drawIOLineTo(
  ctx: CanvasRenderingContext2D,
  LineStart: Point,
  LineEnd: Point
) {
  let x = 50;
  let sideOffset = LineEnd.x > LineStart.x ? x : -x;
  ctx.beginPath();
  ctx.moveTo(LineStart.x, LineStart.y);
  ctx.bezierCurveTo(
    LineStart.x + sideOffset,
    LineStart.y,
    LineEnd.x - sideOffset,
    LineEnd.y,
    LineEnd.x,
    LineEnd.y
  );
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.lineWidth = 1;
}

export function getTransformedPoint(x, y, graf: Graph) {
  const originalPoint = new DOMPoint(x, y);
  return graf.ctx.getTransform().invertSelf().transformPoint(originalPoint);
}

export function isPointInCircle(pointX, pointY, circleX, circleY, radius) {
  const distance = Math.sqrt((pointX - circleX) ** 2 + (pointY - circleY) ** 2);
  return distance <= radius;
}

export function ioDrag(io: GraphNodeIO, graf: Graph) {
  if (isPointInCircle(graf.ctc.x, graf.ctc.y, io.pos.x, io.pos.y, io.radius)) {
    graf.drawLine = true;
    graf.LineStart = io.pos;
    graf.selected_io = io;
    return true;
  } else {
    return false;
  }
}

export function isPointingTo(node, graf: Graph) {
  if (
    graf.ctc.x > node.pos[0] &&
    graf.ctc.x < node.pos[0] + node.size[0] &&
    graf.ctc.y > node.pos[1] &&
    graf.ctc.y < node.pos[1] + node.size[1]
  ) {
    node.io.forEach((io) => {
      if (ioDrag(io, graf)) return;
    });

    graf.selected_node = node;
    graf.starting_pos_offset = {
      x: graf.ctc.x - node.pos[0],
      y: graf.ctc.y - node.pos[1],
    };
  }
}
