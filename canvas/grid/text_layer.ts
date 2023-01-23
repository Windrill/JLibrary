import {QuadPoint, QuadTree} from "../structures/QuadTree";
import {D_Rect, Quackable} from "../../functions/structures";
import {CObject} from "../../geometry/Boundary";
import {ForEachArrayIndex, ForEachArrayItem, IndexSort} from "../../functions/functional";
import {R_Canvas} from "../canvas";
import {ExpandXdGrid} from "./grid_area";

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

  gridArea: ExpandXdGrid;

  constructor(rCanvas: R_Canvas) {
    this.rCanvas = rCanvas;
    let canvasSize = this.rCanvas.context.canvasSize;
    this.qt = new QuadTree(new D_Rect(0, 0, canvasSize.W, canvasSize.H));
    this.boxes = [];
    this.gridArea = new ExpandXdGrid([0, 0], [canvasSize.W, canvasSize.H]);
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
  addText(text: string, x: number, y: number, w: number = 200, h:number = 100): DrawingSize {
    // I need to add this properly into the text layer... How to make sure it's added? Get the id.
    // What's the quadpoint associated to you? Every text should have a tree representation.
    let newDraw: DrawingSize = new DrawingSize(text, {x: x, y: y}, w, h);
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
    // Constants again!!!
    this.gridArea.add([x, y], [x + w, y + h]);

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

    // Boxes on the boundary being added at runtime....
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

    // on top = poorly sorted indices. making guesses at best.
    // in comparison, XGrid is properly sorted at all times.
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
      if (i < rightXIntervalsSI.length - 1) {
        return; // didn't find any intervals that were valid. please write somes test cases related to this.
      }
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
    console.log("Finding foundRect: ", foundRect);

    // let foundLeft: QuadPoint[] = [];
    // Do the same thing to the left:
    // this.qt.query(new D_Rect(qtBounds.x,
    //   // quadArea.pos.y,
    //   qtBounds.y,
    //   quadArea.pos.x,
    //   qtBounds.y + qtBounds.height), foundLeft);
    return foundRect;
  }

  // Doesn't have to lie within text layer. It's the 'empty spaceSearch' area.
  // you have really poor data organization.
  slowSearchSpace(quadArea: QuadPoint) : [number, number, boolean] {
    // 1. Divide Grid
    // should move to upper level. in current 'design' slowsearch already means you can't find intervals correctly
    // let grid : number[][] = [[0]];
    let tryAdd = this.gridArea.add([quadArea.pos.x, quadArea.pos.y],
        [quadArea.pos.width, quadArea.pos.height]);
    if (tryAdd) {
      console.log("Add is empty so successful.");
      // this.addText();
      return [quadArea.pos.x, quadArea.pos.y, true];
    }

    // Lowest number that is higher than threahold x.
    let comparatorGen = (threshold : number)=> {
      return (a : number, b : number) : number => {
        // if any is < threshold,
        return (a > threshold || b > threshold) ? (a - b) : b - a;
      };
    }
    /*
    1. get intervals of boxesToRight.

     */
    let horDim = false;
    let vertDim = false;
    let resultPos = [0, 0];
    for (let dimI=0;dimI<this.gridArea.dimensions;dimI++) {
        let intervalFromNumDiff : number[] = [];
        ForEachArrayIndex((diffIdx : number) => {
          if (diffIdx == 0) return;
          intervalFromNumDiff.push(this.gridArea.grid[dimI][diffIdx].fromNum - this.gridArea.grid[dimI][diffIdx-1].fromNum);
        }, this.gridArea.grid[dimI]);

        // "Index sort"
        let intervalFromNumDiffSI : number[] = IndexSort<number>(intervalFromNumDiff, comparatorGen(quadArea.pos.x));

        // Actually it just takes the first result, no need for so many.
        ForEachArrayItem((i : number) => {
          if (i == 0) return;
          if (dimI == 0 && horDim) return;
          if (dimI == 1 && vertDim) return;
          // the difference is, i want the actual boxes. but these grids store smth different don't they...

          // wait. you're only going to return an interval that is empty!!! Don't relate the 2 data structures.
          let leftD : number = intervalFromNumDiff[i-1];
          let rightD : number = intervalFromNumDiff[i];
          // If space is greater than space it takes to insert, ok
          // A bit hacky, because posture is 2 dimensional only for now. While grid suppports multi-dimensional, your data structures here aren't necessarily 2D
          if (dimI == 0 && rightD - leftD > quadArea.pos.width) {
            resultPos[0] = leftD;
            horDim = true;
          }
          if (dimI == 1 && rightD - leftD > quadArea.pos.height) {
            resultPos[1] = leftD;
            vertDim = true;
          }
        }, intervalFromNumDiffSI);
        console.log("Got empty position in : ", resultPos);
        // I can't add text legally here. You're just querying the first valid area.
      // If you really need to this place can do some caaching also. For search queries. But not the others......
        // console.log("I'm just going to add the text here now.");
    } // End dimension for loop.

      if (horDim && vertDim) {
          return [resultPos[0], resultPos[1], true];
      }
      return [-1, -1, false];

    // actually don't need, because you're just calculating intervals that are free again.
    // so just do a read....
   // for all intervals in each dimension, if there is something that is free within interval,
   // sort them from large to small then take it. either that or take the first
   // ....
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