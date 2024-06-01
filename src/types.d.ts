export type Point = {
  x: number;
  y: number;
};

export type GUIElement = {
  type: string | undefined;
  id: string | undefined;
};

export enum NodeType {
  Generate,
  Input,
  Output,
}
