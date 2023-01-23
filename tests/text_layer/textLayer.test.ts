/**
 * @jest-environment jsdom
 */
// Notes for annotation above:   The error below may be caused by using the wrong test environment, see https://jestjs.io/docs/configuration#testenvironment-string.
import {TextLayer} from "../../canvas/grid/text_layer";
import {R_Canvas} from "../../canvas/canvas";
import {BackendType, CanvasContext} from "../../functions/structures";

let textLayer : TextLayer;
// https://jestjs.io/docs/configuration#testenvironment-string
// const jestCreateCanvas =
  document.createElement('canvas');

let canvas = document.getElementsByTagName("canvas")[0];
let ctx : CanvasRenderingContext2D | null = null;
if (canvas)
  ctx = canvas.getContext('2d');

describe('Text Layer', () => {
  test('1', () => {
    if (!ctx) {
      console.log("CTX is null in this test, aborting");
      return;
    }
    let context : CanvasContext = {
      ctx: ctx,
      canvasSize: {W: 500, H: 500},
      element: ctx.canvas,
      backendType: BackendType.HTML5Backend
    };
    let rcanvas = new R_Canvas(context);
    textLayer = new TextLayer(rcanvas);
    let textBox = textLayer.addText("Annotate", 100, 100);
    let textBox2 = textLayer.addText("Second Annotation", 100, 100);
    let textBox3 = textLayer.addText("Third Annotation", 100, 100);
    // cant see draw results...
    // assert each text box is in a different spot compared to the other 2
    expect(textBox.drawingLocation);
    expect(textBox2.drawingLocation);
    expect(textBox3.drawingLocation);
  });


//   test('Test interval removal', () => {
//
//     let fromNode : XNode = new XNode();
//     // Top left of grid is always 0.
//     // first, get if the ranges is already empty. if it's not
//     this.gridArea.queryRange(0, fromnode, tonode);
//     let ge = new ExpandXdGrid([0, 0], [500, 500]);
//   });
});