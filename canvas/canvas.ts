import {
  CanvasContext,
  CanvasPassAlong,
  D_Rect,
  NDArray,
  NormalizePoint, Quackable,
  QuackingV2
} from "../functions/structures";
import { ColorConversions } from "../tools/color_conversions"
import {Algebra, DEG2RAD} from "../functions/algebra";
import {DrawSettings} from "./draw_settings";


// Options settings....
interface DrawStyle {
  fillStyle: string;
  strokeStyle: string;
  fontStyle: string;
  debug: boolean;
  lineWidth: number;
  textStyle: string;
}

function initDrawStyle(options?: Partial<DrawStyle>): DrawStyle {
  const defaults = {
    // fillStyle: "#61adc4",
    fillStyle: "#000000",
    strokeStyle: "#ffffff",
    fontStyle: "16px serif",
    debug: false,
    lineWidth: 1,
    textStyle: "#bd9696",
  };

  return {
    ...defaults,
    ...options,
  };
}

// Have an object supply default values for this interface.


// No such thing as 'drawing context', more generic. with geometric and other shapes.
class R_Canvas extends CanvasPassAlong {
  public styles : DrawStyle;
  constructor(context: CanvasContext) {
    super(context);
    this.styles = initDrawStyle();
  }
  //easy project first x/z, y/z
  // CameraProjection(point: D_Point) {
  // takes in 3D dot, outputs 2D projection
  // you wanted this to also support 3d scaling..............

  // Convenience for 2 points, from and to.
  carrowo(bFrom: QuackingV2, bTo: QuackingV2, ...Args: any) {
    let quackDiff = {
      x: bTo.x - bFrom.x,
      y: bTo.y - bFrom.y
    };
    // magnitude and squareroot function here
    this.carrow(bFrom, quackDiff, Math.sqrt(quackDiff.x*quackDiff.x+quackDiff.y*quackDiff.y), ...Args);
  }

    /**
   * 1 is down, -1 is up
   * @param point: from location
   * @param direction: a ratio, magnitude is not referenced in this direction
   * @param magnitude
   * @param Args
   */
  carrow(point: QuackingV2, direction: QuackingV2, magnitude: number, ...Args: any) {
    let normDirection = NormalizePoint(direction);
    let endOfLine = {
      x: point.x + normDirection.x * magnitude,
      y: point.y + normDirection.y * magnitude
    };
    this.cline(point.x, point.y, endOfLine.x, endOfLine.y, Args[0]);
    //{fillStyle: "#126cb4", debug: false, lineWidth: 2}
    let arrowFlapFromTrunk = magnitude / 5;


    // let flapHorizontalLength = Math.tan(DEG2RAD * 40) * arrowFlapFromTrunk;
    // how to draw this line perpendicular from the main line
    let topFlap = Algebra.ProjectP(direction, arrowFlapFromTrunk, 40);
    this.cline(endOfLine.x, endOfLine.y, endOfLine.x - topFlap.x, endOfLine.y - topFlap.y, Args[0]);

    let bottomFlap = Algebra.ProjectP(direction, arrowFlapFromTrunk, -40);
    this.cline(endOfLine.x, endOfLine.y, endOfLine.x - bottomFlap.x, endOfLine.y - bottomFlap.y, Args[0]
    );
  }

  // draw such that there are angle/degree markings around the circle
  // direction = reference 'forward' direction
  cSpikes(point: QuackingV2, direction : QuackingV2, magnitude : number = 10) {
    for (let i = 0; i < 360; i += 30) {
      let tickF = Algebra.ProjectP(direction, magnitude, i);
      let tickT = Algebra.ProjectP(direction, magnitude*0.8, i);
      let col = ColorConversions.rgbToHex(40, 100+i/15, i/2);
      let lw = 2;
      if (i == 0) {
        lw = 7;
      }
      this.clineo(
        {x: point.x + tickF.x, y: point.y + tickF.y},
        {x: point.x + tickT.x, y: point.y + tickT.y},
        {fillStyle: col, debug: false, lineWidth: lw});
    }
  }

  // const DefaultCircleDrawSettings : DrawSettings = {
  //
  // };
  // cpoint(point: QuackingV2, drawSettings: DrawSettings = new DrawSettings()) {
// , radius : number = 5, startAngle : number = 0, endAngle : number = Math.PI*2
  cpoint(point: QuackingV2, drawSettings: DrawSettings = new DrawSettings()) {

    this.context.ctx.beginPath();
    this.context.ctx.fillStyle = drawSettings.color;
    this.context.ctx.arc(point.x, point.y, drawSettings.radius, drawSettings.startAngle, drawSettings.endAngle);
    this.context.ctx.fill();
    if (drawSettings.name != "") {
      this.write(drawSettings.name, point.x - 10, point.y - 10);
    }

    this.context.ctx.closePath();
  }

  cpoint_offset(x: number,y: number, point: QuackingV2) {
    this.cpoint({x: point.x + x, y: point.y + y});
  }

  // Change to points.
  cngon(listOfPoints: number[], {fillStyle, debug} = {fillStyle: "#000000", debug: false}) {
    listOfPoints.push(listOfPoints[0]);
    listOfPoints.push(listOfPoints[1]);
    if (debug) {
      console.log("Ngon is OK");
    }
    this.context.ctx.fillStyle = fillStyle;
    this.context.ctx.beginPath();
    for (let i = 0; i < listOfPoints.length - 2; i += 2) {
      this.context.ctx.moveTo(listOfPoints[i], listOfPoints[i + 1]);
      this.context.ctx.lineTo(listOfPoints[i + 2], listOfPoints[i + 3]);
      this.context.ctx.stroke();
    }
    this.context.ctx.closePath();
  }

  clineo(first: QuackingV2, second: QuackingV2, {fillStyle, debug, lineWidth} = {
    fillStyle: "#000000",
    debug: false,
    lineWidth: 1
  }) {
  return this.cline(first.x, first.y, second.x, second.y, {fillStyle, debug, lineWidth});
  }

  // Slowly remove this
  // TODO: Organize styles and document, fix it such that these options are optional
  // {fillStyle: "#126cb4", debug: false, lineWidth: 2}
  // cline<T>(a: T, b: T, x: T, y: T, {fillStyle, debug, lineWidth} = {
    cline(a: number, b: number, x: number, y: number, {fillStyle, debug, lineWidth} = {
    fillStyle: "#000000",
    debug: false,
    lineWidth: 1
  }) {
    if (debug) {
      console.log(`${a},${b} to ${x},${y}`);
    }
    this.context.ctx.lineWidth = lineWidth;
    this.context.ctx.fillStyle = fillStyle;
    // TODO, make more proper
    this.context.ctx.strokeStyle = fillStyle;
    this.context.ctx.beginPath();
    this.context.ctx.moveTo(a, b);
    this.context.ctx.lineTo(x, y);
    this.context.ctx.stroke();
    this.context.ctx.closePath();
  }

  // structures.ts D_Rect also has one
  crect(a: number, b: number, w: number, h: number, {fillStyle, debug, lineWidth} = {
    fillStyle: "#000000",
    debug: false,
    lineWidth: 1
  }) {
    if (debug) {
      console.log("Debugging crect");
    }
    this.context.ctx.beginPath();
    this.context.ctx.fillStyle = fillStyle;
    this.context.ctx.lineWidth = lineWidth;
    this.context.ctx.rect(a, b, w, h);
    this.context.ctx.fill();
    this.context.ctx.closePath();
  }

  crectd(drect : D_Rect, {fillStyle, debug, lineWidth} = {
    fillStyle: "#000000",
    debug: false,
    lineWidth: 1
  }) {
    this.crect(drect.x, drect.y, drect.width, drect.height, {fillStyle, debug, lineWidth});
  }

  // ?? See MidPointToBottomLeft, structures.ts
  cline_offset(a: any, b: any, x: any, y: any) {
    this.cline(a, b, x + a, y + b);
  }

  clear(rect: D_Rect) {
    (this.context.ctx).clearRect(rect.x, rect.y, rect.width, rect.height);
  }

  // spacing is to the left bottom direction
  // change to match relative axis!!!
  // boundary is drawsize..
  drawAxis(drawRect: D_Rect, dimensionRestraints: NDArray, spacing: number, clear = true, decimalPlaces: number = 0) {
    if (clear) {
      this.clear(drawRect);
    }

    let dimension2DOnly = [...dimensionRestraints]; // <---- is this useless code???
    for (let d = 0; d < dimension2DOnly.length; d++)
      if (dimension2DOnly[d].length > 2) {
        dimension2DOnly[d].pop();
      }
    // this.ctx.fillStyle = "#1e7cea";
    // this.ctx.fillRect(0, 0, width, height);
    this.context.ctx.font = this.styles.fontStyle;
    this.context.ctx.fillStyle = this.styles.fillStyle;
    this.context.ctx.strokeStyle = this.styles.strokeStyle;
    this.cline(drawRect.x - spacing, drawRect.y, drawRect.x + drawRect.width - spacing, drawRect.y);
    this.cline(drawRect.x, drawRect.y - spacing, drawRect.x, drawRect.y + drawRect.height - spacing);
    // TODO: Add axis labels
    /*
    | <-- line:
    |  ' <--tick:
    |  '
    |  '  tick2:
    |  '   |
    |  '   v
    |  .   .   .    .    .   .   .
    _________________________________ <--- line2:
     */
    let axisProj = Algebra.ScalarProjection(drawRect.toArray(), dimension2DOnly, false);

    // X Axis
    for (let i = drawRect.x; i <= drawRect.x + drawRect.width; i += 40) {
      // this.cline(i, 5, i, 10);
      this.cline(
        i, drawRect.y,
        i, drawRect.y - spacing / 2
      );
      console.assert((dimension2DOnly.length) > 0);

      let dimensionVals = Algebra.CMatrixMult(axisProj, [i, drawRect.y]);
      // hmmm, fail then fail all mechanism --> designate point of catch explicitly?
      if (!dimensionVals.length) return;
      this.context.ctx.fillText(String(dimensionVals[0].toFixed(decimalPlaces)), i - spacing, drawRect.y - 23);
      // this.ctx.fillText(String(i-drawRect.x), i - spacing, drawRect.y - 23);
    }

    for (let i = drawRect.y; i <= drawRect.y + drawRect.height; i += 40) {
      // y axis
      this.cline(drawRect.x, i, drawRect.x - spacing / 2, i);
      // this.ctx.fillText(String(i-drawRect.y), drawRect.x - 32, i + 5);
      let dimensionVals = Algebra.CMatrixMult(axisProj, [drawRect.x, i]);
      this.context.ctx.fillText(String((dimensionVals[1]).toFixed(decimalPlaces)), drawRect.x - 32, i + 5);
    }
  }

  drawBoard(clear = true) {
    let width = this.context.canvasSize.W;
    let height = this.context.canvasSize.H;

    if (clear) {
      this.clear(new D_Rect(0, 0, width, height));
    }

    // this.context.ctx.fillStyle = this.styles.fillStyle;
    // this.context.ctx.strokeStyle = this.styles.strokeStyle;
    // this.context.ctx.font = this.styles.fontStyle;
    this.cline(0, 5, width, 5, this.styles);
    this.cline(5, 0, 5, height, this.styles);
    for (let i = 0; i <= width; i += 40) {
      // X Axis
      this.cline(i, 5, i, 10, this.styles);
      this.context.ctx.fillText(String(i), i - 10, 23);
    }

    for (let i = 0; i <= height; i += 40) {
      // y axis
      this.cline(5, i, 10, i, this.styles);
      this.context.ctx.fillText(String(i), 13, i + 5);
    }
  }

  drawMouse(mouseX: number, mouseY: number) {
    this.context.ctx.fillText(mouseX + " " + mouseY, mouseX, mouseY);
  }

  rotatingSquare(x: number, y: number, w: number, h: number, degree: number) {
    this.context.ctx.save();
    this.context.ctx.translate(x, y);
    this.context.ctx.rotate(degree);
    this.context.ctx.fillStyle = "#000000";
    // Position of rect relative to the 'midpoint', the center of the rectangle
    this.context.ctx.rect(-w / 2, -h / 2, w, h);
    this.context.ctx.fill();
    this.context.ctx.translate(-x, -y);
    this.context.ctx.restore();
  }

  crotate(degrees: number  // , point=[0,0]
  ) {
    let c = Math.cos(DEG2RAD * degrees);
    let s = Math.sin(DEG2RAD * degrees);

    // @ts-ignore
    return math.matrix([[c, s, 0], [-s, c, 0], [0, 0, 1]]);
    // return math.matrix([[c,s,0],[-s,c,0],[0,0,1]]);
  }

  writeo(text: string, pt : Quackable) {
    return this.write(text, pt.x, pt.y);
  }

  write(text: string, x: number, y: number) {
    this.context.ctx.font = this.styles.fontStyle;
    this.context.ctx.fillStyle = this.styles.fillStyle;
    this.context.ctx.beginPath();
    this.context.ctx.fillText(text, x, y);
    this.context.ctx.closePath();
  }
}

export {
  R_Canvas,
}
