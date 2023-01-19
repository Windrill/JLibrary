import {R_Canvas} from "../../canvas/canvas";
import {BackendType, CanvasContext} from "../../functions/structures";
import {TextLayer} from "../../canvas/grid/text_layer";

let canvas = document.getElementsByTagName("canvas")[0];

function cleanCanvas(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#2f5430";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

if (canvas) {
  let ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (ctx) {
    let canvasContext: CanvasContext = {
      ctx: ctx,
      canvasSize: {W: 500, H: 500},
      element: canvas,
      backendType: BackendType.HTML5Backend
    };
    cleanCanvas(ctx);
    console.log("Hi");
    let rCanvas: R_Canvas = new R_Canvas(canvasContext);
    let textLayer = new TextLayer(rCanvas);
    textLayer.addText("Test 1", 200, 100);
    textLayer.addText("Test 2", 200, 100);
    textLayer.addText("Test 3", 200, 100);

    textLayer.draw();


    let midPoint = {x: 100, y: 100};
    // Just some extra space
    rCanvas.carrow(midPoint, {x: 40, y: 60}, 80);
    rCanvas.carrow(midPoint, {x: 40, y: 60}, 60);

    rCanvas.carrow(midPoint, {x: -40, y: 60}, 80);
    rCanvas.carrow(midPoint, {x: -40, y: -60}, 80);

    rCanvas.carrow(midPoint, {x: 40, y: -60}, 80);
  }
}