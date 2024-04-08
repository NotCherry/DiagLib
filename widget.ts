import Graph from "./graph/graph";
import { Point } from "./types";

interface IWidget {
  width?: number;
  height?: number;
}

export abstract class Widget {
  pos: Point;
  width: number;
  height: number;

  constructor(args: IWidget) {
    this.pos = { x: 0, y: 0 };
    this.width = args.width || 100;
    this.height = args.height || 100;
  }

  abstract render(ctx: CanvasRenderingContext2D): void;
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

  element.style.width = `${width * scale}px`;
  element.style.height = `${height * scale}px`;

  element.style.left = `${pos.x * scale + t.e}px`;
  element.style.top = `${pos.y * scale + t.f}px`;
}

export class TeaxtArea extends Widget {
  text_area: HTMLTextAreaElement;
  constructor(args: IWidget) {
    super(args);
    this.text_area = document.createElement("textarea");
    this.text_area.id = "TEXTAREA";
    this.text_area.style.position = "absolute";
    this.text_area.style.width = `${this.width}px`;
    this.text_area.style.height = `${this.height}px`;
    document.body.appendChild(this.text_area);
  }

  render(ctx: CanvasRenderingContext2D): void {
    AdjusthtlmElementPos(
      ctx,
      this.text_area,
      this.pos,
      this.width,
      this.height
    );
  }
}
