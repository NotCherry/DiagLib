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

  abstract render(
    ctx: CanvasRenderingContext2D,
    ctc: Point,
    zoom: number
  ): void;
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

  render(ctx: CanvasRenderingContext2D, ctc: Point, zoom: number): void {
    const transform = ctx.getTransform();

    this.text_area.style.width = `${this.width * transform.a}px`;
    this.text_area.style.height = `${this.height * transform.d}px`;
    // this.text_area.style.transform = `translate(${ctc.x}, ${ctc.y}); scale(${
    //   transform.a
    // }, ${transform.d}) translate(${-ctc.x}, ${-ctc.y});`;

    this.text_area.style.left = `${this.pos.x}px`;
    this.text_area.style.top = `${this.pos.y}px`;
    this.text_area.style.transform = `scale(${zoom}))`;
    console.log(this.text_area.style.transform);
    console.log(ctc.x);
  }
}
