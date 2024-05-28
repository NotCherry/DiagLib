import Graph from "../Graph";
import Widget, { AdjustElementPos, IWidget } from "./Widget";

export class TextArea extends Widget {
  constructor(args: IWidget) {
    super(args);
    //this.width = Graph.nodeMap.get(this.owner)!.;
    this.element = document.createElement("textarea");
    this.element.style.zIndex = "1";
    this.element.id = "TEXTAREA";
    this.element.style.position = "absolute";
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    document.body.appendChild(this.element);
  }

  setup() {
    let data = Graph.nodeMap.get(this.owner)!.data;
    if (data["text"] == undefined) data["text"] = "";
    this.element.addEventListener("input", (event) => {
      const target = event.currentTarget as HTMLTextAreaElement;
      data["text"] = target.value;
    });
    this.element.value = data["text"];
  }

  render(): void {
    AdjustElementPos(this.element, this.pos, this.width, this.height);
    let data = Graph.nodeMap.get(this.owner)!.data;
    this.element.value = data["text"];
  }

  validate(): boolean {
    let { data, title, io } = Graph.nodeMap.get(this.owner)!;

    let usedIOlenght = io
      .filter((io) => io.pointedBy)
      .map((io) => io.pointedBy)
      .flat().length;

    let bracketCount = Array.prototype.reduce.call(
      data["text"],
      (r, s) => {
        r += s === "}" ? 1 : 0;
        return r;
      },
      0
    );

    if (bracketCount != usedIOlenght) {
      Graph.nodeMap.get(this.owner)!.color = "red";
      Graph.render();
      alert(
        `The number of inputs to node do not matched required required ${bracketCount} vs ${usedIOlenght}  Node title: ${title}}`
      );
      return false;
    } else {
      Graph.render();
      Graph.nodeMap.get(this.owner)!.color = "";
      return true;
    }
  }

  remove() {
    this.element.parentNode?.removeChild(this.element);
  }
}
