import Graph from "./graph";
import GraphNode from "./node";

export default function drag_setup(graf: Graph) {
  var selected_node: GraphNode | undefined = undefined;
  var starting_pos_offset: number[] = [0, 0];

  addEventListener("mousedown", (event) => {
    graf.nodes.forEach((node) => {
      if (
        event.clientX > node.pos[0] &&
        event.clientX < node.pos[0] + node.size[0] &&
        event.clientY > node.pos[1] &&
        event.clientY < node.pos[1] + node.size[1]
      ) {
        selected_node = node;
        starting_pos_offset = [
          event.clientX - node.pos[0],
          event.clientY - node.pos[1],
        ];
      }
    });
  });

  addEventListener("mouseup", (event) => {
    selected_node = undefined;
  });

  addEventListener("mousemove", (event) => {
    if (selected_node != undefined) {
      selected_node.pos = [
        event.clientX - starting_pos_offset[0],
        event.clientY - starting_pos_offset[1],
      ];

      graf.render();
    }
  });

  addEventListener("wheel", (event) => {
    event.preventDefault();
    const scaleFactor = 0.1;
    const zoomIntensity = event.deltaY > 0 ? -1 : 1;
    graf.scale = graf.scale + zoomIntensity * scaleFactor;
    graf.scale = Math.max(0.1, graf.scale); // Minimum scale

    graf.render();
  });

  addEventListener("mousemove", (event) => {
    if (event.button === 1) {
      graf.TRANSLATE_X = event.clientX;
      graf.TRANSLATE_Y = event.clientY;
    }
  });
  // addEventListener("mouseup", (event) => {
  //   if (event.button === 1) {
  //     graf.WHEEL_PRESS = false;
  //   }
  // });

  addEventListener("mousedown", (event) => {
    if (event.button === 1) {
      graf.START_MOUSE_POS = [event.pageX, event.pageY];
      graf.WHEEL_PRESS = true;
    }
  });
  addEventListener("mousemove", (event) => {
    if (graf.WHEEL_PRESS === true) {
      graf.END_MOUSE_POS = [event.pageX, event.pageY];
      graf.updateDisplay();
      graf.render();
    }
  });
  addEventListener("mouseup", (event) => {
    if (event.button === 1) {
      graf.WHEEL_PRESS = false;
    }
  });
}
