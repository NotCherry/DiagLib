import Graph from "../Graph";
import GraphNodeIO from "../IO";
import { Point } from "../types";

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

export function getTransformedPoint(x, y) {
  const originalPoint = new DOMPoint(x, y);
  return Graph.ctx.getTransform().invertSelf().transformPoint(originalPoint);
}

export function isPointInCircle(pointX, pointY, circleX, circleY, radius) {
  const distance = Math.sqrt((pointX - circleX) ** 2 + (pointY - circleY) ** 2);
  return distance <= radius;
}

export function ioDrag(io: GraphNodeIO) {
  if (
    isPointInCircle(
      Graph.cursorPos.x,
      Graph.cursorPos.y,
      io.pos.x,
      io.pos.y,
      io.radius
    )
  ) {
    Graph.drawLine = true;
    Graph.LineStart = io.pos;
    Graph.selectedIO = io.id;
    return true;
  } else {
    return false;
  }
}

export function isPointingTo(node) {
  if (
    Graph.cursorPos.x > node.pos.x &&
    Graph.cursorPos.x < node.pos.x + node.size[0] &&
    Graph.cursorPos.y > node.pos.y &&
    Graph.cursorPos.y < node.pos.y + node.size[1]
  ) {
    node.io.forEach((io) => {
      if (ioDrag(io)) return;
    });

    Graph.selectedNode = node.id;
    Graph.dragStartingPosOffset = {
      x: Graph.cursorPos.x - node.pos.x,
      y: Graph.cursorPos.y - node.pos.y,
    };
  }
}
