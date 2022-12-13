import {QuadPoint, QuadTree} from "../../boids/QuadTree";
import {D_Rect, Quackable} from "../functions/structures";
import {CObject} from "../geometry/Boundary";
import {ForEachArrayIndex, ForEachArrayItem, IndexSort} from "../functions/functional";
import {R_Canvas} from "./canvas";

/**
 * Special data structure for text
 */
class DrawingSize extends CObject {
  // Location of where the text should point to
  drawingLocation: Quackable;

  // Needs quadpoint to be indexable, which also has the drawing box
  public qPoint: QuadPoint;
  drawId: number;
  // Load this on startup????
  static DrawID: number = 0;
  // draw text also contains font size and color, reference to that.
  text: string;

  constructor(text: string, point: Quackable, w: number = 200, h: number = 100) {
    super();
    this.qPoint = new QuadPoint(point.x, point.y, w, h);
    this.text = text;
    // I'm worried about static being lost on save & reload......
    this.drawId = DrawingSize.DrawID++;
    this.drawingLocation = point; // if point is ok then you need to calculate boundary....
  }


  getId() {
    return this.drawId;
  }

  draw() {

  }
}

/**
 * Manager class for all text drawn on canvas.
 * Contents
 * 1. QuadTree for query and inserting text locations
 * 2. List of text boxes
 * R_Canvas for rendering with
 */
class TextLayer {
  // all text should have a drawing spot that doesn't overlap with another.
  qt: QuadTree;
  boxes: DrawingSize[];
  rCanvas: R_Canvas;

  constructor(rCanvas: R_Canvas) {
    this.rCanvas = rCanvas;
    let canvasSize = this.rCanvas.context.canvasSize;
    this.qt = new QuadTree(new D_Rect(0, 0, canvasSize.W, canvasSize.H));
    this.boxes = [];
  }

  // maybe only create these drawings in this factory function...
  // newText : DrawingSize
  // cwrite in canvas.ts
  // x, y is intended draw location.
  // one thing is when you do cwrite, it will render once each time you change a text or add a text
  // but having it as an object you need to invoke it differently. how will you choose to invoke it?
  // Most of the time, I want to annotate something. Which means I want this thing to be somewhere close
  // which is not on a point. Maybe 20 pixels away by default at a 45 degree angle.
  // Text's line color, and text's color.... another customization object.
  addText(text: string, x: number, y: number): DrawingSize {
    // I need to add this properly into the text layer... How to make sure it's added? Get the id.
    // What's the quadpoint associated to you? Every text should have a tree representation.
    let newDraw: DrawingSize = new DrawingSize(text, {x: x, y: y});
    this.boxes.push(newDraw);
    // private points: {
    //     // object's keys are string[]....
    //     // specifies index's type for object
    //     [index: number]: Point;
    //   };
    let points: QuadPoint[] = [];
    // These are all tree representations, but how do they store the drawings with them?
    this.qt.query(newDraw.qPoint.pos, points);
    // If some points overlap, set a new boundary via quick search
    if (points.length > 0) {
      let emptySpace = this.quickSearchSpace(newDraw.qPoint);
      if (emptySpace) {
        console.log("Found empty space nearby the rect", emptySpace);
        newDraw.qPoint.pos = emptySpace; // tries to set it properly
      } else {
        console.log("Cannot find any space easily.");
      }
    } else {
      console.log("Adding in empty space", newDraw.qPoint.pos);
    }

    this.qt.insert(newDraw.qPoint.pos);
    return newDraw;
    // how to find closest free rectangle?
    // if (newDraw.boundary.intersects(otherRectangle)) {
    // other rectangle finds nearest empty space in 4 directions.
    // }
  }

  draw() {
    ForEachArrayItem((box: DrawingSize) => {
      this.rCanvas.clineo(box.qPoint.getLocation(), box.drawingLocation);
      this.rCanvas.crectd(box.qPoint.pos);
      this.rCanvas.write(box.text, box.qPoint.pos.x, box.qPoint.pos.y);
    }, this.boxes);
  }

  /**
   * Steps:
   * 1. Within canvas, find the largest of all intervals between key points.
   * 2.
   *
   * @param quadArea
   */
  // Try to write tests for this!!!!!
  quickSearchSpace(quadArea: QuadPoint): D_Rect | null {
    let qtBounds = this.qt.getBoundary();

    // If quadArea's pos is different from bounds....using quadArea is OK. i think.
    // Right half of QT
    let boxesToRight: QuadPoint[] = this.qt.query(new D_Rect(
      quadArea.pos.x, qtBounds.y,
      qtBounds.x + qtBounds.width, qtBounds.y + qtBounds.height));

    // Boxes on the side
    let leftMost = new QuadPoint(0, 0);
    let rightMost = new QuadPoint(qtBounds.x + qtBounds.width, qtBounds.y + qtBounds.height);
    boxesToRight.push(rightMost);
    // not very sure if i should be adding, because it's 'left' of the box
    boxesToRight.push(leftMost);

    // 10, 100, 40, 80...
    // Sort starting points.
    let boxesToRightSI: number[] = IndexSort<QuadPoint>(boxesToRight, (a: QuadPoint, b: QuadPoint) => {
      return a.pos.x > b.pos.x ? 1 : a.pos.x == b.pos.x ? 0 : -1;
    });

    console.log("Boxes to right starting point: ", boxesToRightSI);
    console.log("All boxes to ur right, ", boxesToRight);
    // Intervals between each X.
    let rightXIntervals: number[] = [];
    ForEachArrayIndex((i: number) => {
      if (i == 0) return;
      rightXIntervals.push(boxesToRight[boxesToRightSI[i]].pos.x - boxesToRight[boxesToRightSI[i - 1]].pos.x);
    }, boxesToRightSI);
    // xindex:
    // 0, 2, 3, 1 <--
    // 30, 40, 20
    // sorts into:
    // 40, 30, 20
    console.log("intervals: ", rightXIntervals);
    // sorted indices by space in-between
    let rightXIntervalsSI = IndexSort<number>(rightXIntervals, (a: number, b: number) => {
      return a - b;
    });
    console.log("Actual indices: ", rightXIntervalsSI);
    // after sorting the spaces, you get [1, 0, 2]

    // In debug mode, draw the available intervals in red, for each textlayer....
    // From most interval to least interval, get twice
    let foundRect: D_Rect = new D_Rect();
    let foundOne = false;
    ForEachArrayItem((i: number) => {
      // 1, 0, 2 <-- 1 is 30-40, 1 = index of actual point
      if (foundOne) {
        return;
      }
      // si is 0,1,2 when there are 4 boxes. So it's 0 is box-0-1.
      let si = rightXIntervalsSI[i];
      let leftBox: QuadPoint = boxesToRight[si];
      console.log("left box: ", leftBox, si);
      let rightBox: QuadPoint = boxesToRight[si+1];
      console.log("right box: ", rightBox);

      let boxWidth = quadArea.pos.width;
      let boxHeight = quadArea.pos.height;
      if (leftBox) {
        let topLeft: QuadPoint[] = this.qt.query(new D_Rect(leftBox.pos.x, leftBox.pos.y + leftBox.pos.height, boxWidth, boxHeight));
        if (topLeft) {
          foundOne = true;
          foundRect = new D_Rect(leftBox.pos.x, leftBox.pos.y + leftBox.pos.height, boxWidth, boxHeight);
          return;
        }
      }
      if (rightBox) {
        let botRight: QuadPoint[] = this.qt.query(new D_Rect(leftBox.pos.x + leftBox.pos.width, leftBox.pos.y, boxWidth, boxHeight));
        if (botRight) {
          foundOne = true;
          foundRect = new D_Rect(leftBox.pos.x + leftBox.pos.width, leftBox.pos.y, boxWidth, boxHeight);
          return;
        }
      }
    }, rightXIntervalsSI);

    console.log("Finding foundrect: ", foundRect);

    // let foundLeft: QuadPoint[] = [];
    // Do the same thing to the left:
    // this.qt.query(new D_Rect(qtBounds.x,
    //   // quadArea.pos.y,
    //   qtBounds.y,
    //   quadArea.pos.x,
    //   qtBounds.y + qtBounds.height), foundLeft);

    return foundRect;
  }

  slowSearchSpace() {
    // 1. Divide Grid
    let grid : number[][] = [[0]];
    // Top left of grid is always 0.
    // for every unique area, check....if it's there. Basically have an array with all unique areas represented
    // then go through each section and cross it out for all areas this section(object) occupies
    /*
    [] [] [] [] []
    [] [] [] [] []
    [] [] [] [] []
    -->

    [x] [] [] [] []
    [] [] [x] [x] []
    [x] [x] [x] [x] []
    then for the rest, just sort out the rectangular areas starting from top left.

    [x] [] [] [1] [1]
    [] [] [x] [x] []
    [x] [x] [x] [x] []


    [x] [] [] [] [1]
    [] [] [x] [x] [1]
    [x] [x] [x] [x] [1]

    how to do without overlap??
    after you select all these areas, see if any can be 'resized' to this spot(Future feature only) or basically stick into.
     */
  }
}

// let canvas = document.getElementsByTagName("canvas")[0];
// if (canvas) {
//   let ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
//   if (ctx) {
//     let canvasContext: CanvasContext = {
//       ctx: ctx,
//       canvasSize: {W: 500, H: 500},
//       element: canvas,
//       backendType: BackendType.HTML5Backend
//     };
//     let textLayer: TextLayer = new TextLayer(canvasContext);
//     textLayer.addText("", 200, 100);
//   }
// }

export {
  TextLayer,
  DrawingSize
}