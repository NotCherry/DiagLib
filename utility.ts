import { Point } from "./types";

function formatStringFromInputs(node, format) {
  if (!node || !node.inputs) {
    console.error("Node or inputs array not found.");
    return null;
  }

  // Extract input values from the node
  let inputValues = node.inputs.map((input, i) => node.getInputData(i));
  console.log(inputValues);
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
