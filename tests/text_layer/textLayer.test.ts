import {TextLayer} from "../../canvas/text_layer";
import {ExpandXdGrid, XNode} from "../../canvas/grid_area";


let textLayer : TextLayer;

describe('Text Layer', () => {
  test('1', () => {
    let textBox = textLayer.addText("Annotate", 100, 100);
    let textBox2 = textLayer.addText("Second Annotation", 100, 100);
    let textBox3 = textLayer.addText("Third Annotation", 100, 100);
    // cant see draw results...
    // assert each text box is in a different spot compared to the other 2
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