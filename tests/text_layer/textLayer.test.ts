import {TextLayer} from "../../canvas/text_layer";


let textLayer : TextLayer;

describe('Text Layer', () => {
  test('1', () => {
    let textBox = textLayer.addText("Annotate", 100, 100);
    let textBox2 = textLayer.addText("Second Annotation", 100, 100);
    let textBox3 = textLayer.addText("Third Annotation", 100, 100);
    // cant see draw results...
    // assert each text box is in a different spot compared to the other 2
  });
});