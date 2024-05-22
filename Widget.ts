import GraphNode from "./Node";
import { Point } from "./types";
import { v4 as uuidv4 } from "uuid";
import Graph from "./graph";

export interface IWidget {
  width?: number;
  height?: number;
  type?: string;
  id?: string;
  owner: string;
  // graf: Graph;
}

export abstract class Widget {
  id: string;
  pos: Point;
  width: number;
  height: number;
  type: string;
  owner: string;
  element: HTMLTextAreaElement;
  // graf: Graph;
  constructor(args: IWidget) {
    this.id = args.id || uuidv4();
    this.type = args.type || "widget";
    this.pos = { x: 0, y: 0 };
    this.width = args.width || 100;
    this.height = args.height !== undefined ? args.height : 100;
    this.owner = args.owner;
    if (this.owner == undefined) {
      throw new Error("Owner is undefined");
    }
  }

  abstract render(ctx: CanvasRenderingContext2D): void;
  abstract setup();
  abstract validate(): boolean;
  abstract remove();
  save() {
    return { type: this.type, id: this.id, owner: this.owner };
  }
}

export function AdjusthtlmElementPos(
  ctx: CanvasRenderingContext2D,
  element: HTMLElement,
  pos: Point,
  width: number,
  height: number
): void {
  const t = ctx.getTransform();
  const scale = t.a;
  let x_offset = Graph.viewport_width - Graph.canvas.width;
  let y_offset = Graph.viewport_height - Graph.canvas.height;

  element.style.width = `${width * scale}px`;
  element.style.height = `${height * scale}px`;
  // console.log("e", t.e, "f", t.f);
  element.style.left = `${pos.x * scale + t.e + x_offset}px`;
  element.style.top = `${pos.y * scale + t.f + y_offset}px`;
}
