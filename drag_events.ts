import Graph from "./graph";
import GraphNode from "./node";

export default function drag_setup(graf: Graph) {
  var selected_node: GraphNode | undefined = undefined;
  var starting_pos_offset: number[] = [0, 0];

  addEventListener("wheel", (event) => {
    event.preventDefault();
    graf.zoom = true;

    let w = graf.MOUSE_POS[0] / graf.scale;
    let h = graf.MOUSE_POS[1] / graf.scale;

    const scaleFactor = 0.1;
    const zoomIntensity = event.deltaY > 0 ? -1 : 1;
    graf.scale = graf.scale + zoomIntensity * scaleFactor;
    graf.scale = Math.max(0.3, graf.scale);

    console.log(graf.MOUSE_POS[0] - graf.MOUSE_POS[0] / graf.scale);

    graf.render();
    graf.zoom = false;
  });

  // Draging graph with cursor wheel
  addEventListener("mousedown", (event) => {
    if (event.button === 1) {
      graf.START_MOUSE_POS = [
        event.pageX / graf.scale,
        event.pageY / graf.scale,
      ];
      graf.WHEEL_PRESS = true;
    }
  });
  addEventListener("mousemove", (event) => {
    if (graf.WHEEL_PRESS === true) {
      graf.PAGEX = event.pageX / graf.scale - graf.START_MOUSE_POS[0];
      graf.PAGEY = event.pageY / graf.scale - graf.START_MOUSE_POS[1];
      graf.render();
    }

    graf.MOUSE_POS = [event.pageX / graf.scale, event.pageY / graf.scale];
  });
  addEventListener("mouseup", (event) => {
    if (event.button === 1 && graf.WHEEL_PRESS === true) {
      graf.WHEEL_PRESS = false;
      graf.saveDisplay();
      graf.PAGEX = 0;
      graf.PAGEY = 0;
      graf.render();
    }
  });

  addEventListener("mousedown", (event) => {
    if (graf.WHEEL_PRESS != true) {
      console.log("Wheel");
      graf.nodes.forEach((node) => {
        if (
          event.clientX / graf.scale > node.pos[0] + graf.X_OFFSET &&
          event.clientX / graf.scale <
            node.pos[0] + node.size[0] + graf.X_OFFSET &&
          event.clientY / graf.scale > node.pos[1] + graf.Y_OFFSET &&
          event.clientY / graf.scale <
            node.pos[1] + node.size[1] + graf.Y_OFFSET
        ) {
          selected_node = node;
          starting_pos_offset = [
            event.clientX / graf.scale - node.pos[0] - graf.X_OFFSET,
            event.clientY / graf.scale - node.pos[1] - graf.Y_OFFSET,
          ];
        }
      });
    }
  });

  addEventListener("mouseup", (event) => {
    selected_node = undefined;
  });

  addEventListener("mousemove", (event) => {
    if (selected_node != undefined) {
      selected_node.pos = [
        event.clientX / graf.scale - starting_pos_offset[0] - graf.X_OFFSET,
        event.clientY / graf.scale - starting_pos_offset[1] - graf.Y_OFFSET,
      ];

      graf.render();
    }
  });
}
