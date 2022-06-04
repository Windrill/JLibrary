import {R_Canvas} from "../canvas/canvas";

let canvas = document.getElementsByTagName("canvas")[0];
if (canvas) {
  let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

  let regularCanvas = new R_Canvas(ctx);
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
// carrow

}