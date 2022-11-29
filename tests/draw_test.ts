import {R_Canvas} from "../canvas/canvas";
import {BackendType, CanvasContext} from "../functions/structures";

let canvas = document.getElementsByTagName("canvas")[0];
if (canvas) {
  let ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (ctx) {
    let canvasContext : CanvasContext = {
      ctx: ctx,
      canvasSize: {W: 500, H: 500},
      element: canvas,
      backendType: BackendType.HTML5Backend
    };
    let regularCanvas = new R_Canvas(canvasContext);
    regularCanvas.carrow(
      {x: 100, y: 100}, {x: 40, y: 60}, 80
    );
    regularCanvas.carrow(
      {x: 100, y: 100}, {x: 40, y: 60}, 60
    );

    regularCanvas.carrow(
      {x: 100, y: 100}, {x: -40, y: 60}, 80
    );

    regularCanvas.carrow(
      {x: 100, y: 100}, {x: -40, y: -60}, 80
    );

    regularCanvas.carrow(
      {x: 100, y: 100}, {x: 40, y: -60}, 80
    );
  }
}