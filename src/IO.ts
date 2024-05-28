import { v4 as uuidv4 } from "uuid";
import { Point } from "./types";

export interface IGraphNodeIO {
  id?: string;
  name: string;
  radius?: number;
  pos?: Point;
  type: "input" | "output";
  owner: string;
  pointingTo?: string[];
  pointedBy?: string;
}

export interface IAddGraphNodeIO {
  id?: string;
  name: string;
  radius?: number;
  type: "input" | "output";
}

export default class GraphNodeIO {
  id: string = uuidv4();
  name: string;
  radius: number;
  pos: Point;
  type: "input" | "output";
  pointingTo: string[];
  pointedBy?: string;
  owner: string;
  constructor(args: IGraphNodeIO) {
    this.id = args.id || uuidv4();
    this.radius = args.radius || 7;
    this.name = args.name;
    this.type = args.type;
    this.pos = args.pos ? { x: args.pos.x, y: args.pos.y } : { x: 0, y: 0 };
    this.pointingTo = args.pointingTo || [];
    this.pointedBy = args.pointedBy;
    this.owner = args.owner;
  }
  save() {
    return {
      type: this.type,
      name: this.name,
      id: this.id,
      owner: this.owner,
      pointedBy: this.pointedBy,
      pointingTo: this.pointingTo,
    };
  }
}
