import Graph from "../../graph/graph";
import { AdjusthtlmElementPos, IWidget, Widget } from "./Widget";

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

  setup() {
    let data = Graph.nodeMap.get(this.owner)!.data;
    if (data["text"] == undefined) data["text"] = "";
    this.text_area.addEventListener("input", (event) => {
      const target = event.currentTarget as HTMLTextAreaElement;
      data["text"] = target.value;
    });
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
