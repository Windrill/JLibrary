import {D_Point, D_Rect, NDArray, NormalizePoint, QuackingV2} from "../functions/structures";
import {Algebra} from "../functions/algebra";

interface DrawStyle {
  fillStyle: string; // "#000000";
  debug: boolean; // false
  lineWidth: number; // 1;
}
// Have an object supply default values for this interface.

class R_Canvas {
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  destructor() {

  }

  //easy project first x/z, y/z
  // CameraProjection(point: D_Point) {
  // takes in 3D dot, outputs 2D projection
  // you wanted this to also support 3d scaling..............

  // THREE.Matrix4();
  // }

  // what does direction represent??? i think just a ratio.... lol, can be forced to represent magnitude too,
  // but it's just that magnitude didnt need to be so much 'implied'
  // pass down
  // 1 is down, -1 is up
  carrow(point: QuackingV2, direction: QuackingV2, magnitude: number, ...Args: any) {
    let normDirection = NormalizePoint(direction);
    let endOfLine = {
      x: point.x + normDirection.x * magnitude,
      y: point.y + normDirection.y * magnitude
    };
    this.cline(point.x, point.y, endOfLine.x, endOfLine.y,
      Args[0]
//{fillStyle: "#126cb4", debug: false, lineWidth: 2}
    );
    let arrowFlapFromTrunk = magnitude / 5;


    // let flapHorizontalLength = Math.tan(DEG2RAD * 40) * arrowFlapFromTrunk;
    // how to draw this line perpendicular from the main line
    let topFlap = Algebra.ProjectP(direction, arrowFlapFromTrunk, 40);
    this.cline(endOfLine.x, endOfLine.y, endOfLine.x - topFlap.x, endOfLine.y - topFlap.y, Args[0]
    );


    let bottomFlap = Algebra.ProjectP(direction, arrowFlapFromTrunk, -40);
    this.cline(endOfLine.x, endOfLine.y, endOfLine.x - bottomFlap.x, endOfLine.y - bottomFlap.y,
      Args[0]
      // {fillStyle: "#126cb4", debug: true, lineWidth: 3}
    );

  }

// , radius : number = 5, startAngle : number = 0, endAngle : number = Math.PI*2
  cpoint(point: QuackingV2) {
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }

  cngon(listofpoints: any[], {fillStyle, debug} = {fillStyle: "#000000", debug: false}) {
    listofpoints.push(listofpoints[0]);
    listofpoints.push(listofpoints[1]);
    if (debug) {
      console.log("Ngon is OK");
    }
    this.ctx.fillStyle = fillStyle;
    this.ctx.beginPath();
    for (let i = 0; i < listofpoints.length - 2; i += 2) {
      this.ctx.moveTo(listofpoints[i], listofpoints[i + 1]);
      this.ctx.lineTo(listofpoints[i + 2], listofpoints[i + 3]);
      this.ctx.stroke();
    }
    this.ctx.closePath();
  }

  // TODO: Organize styles and document, fix it such that these options are optional
  // {fillStyle: "#126cb4", debug: false, lineWidth: 2}
  cline(a: number, b: number, x: number, y: number, {fillStyle, debug, lineWidth} = {
    fillStyle: "#000000",
    debug: false,
    lineWidth: 1
  }) {
    if (debug) {
      console.log(`${a},${b} to ${x},${y}`);
    }
    this.ctx.lineWidth = lineWidth;
    this.ctx.fillStyle = fillStyle;
    // TODO, make more proper
    this.ctx.strokeStyle = fillStyle;
    this.ctx.beginPath();
    this.ctx.moveTo(a, b);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.closePath();
  }
  
  crect(a: number, b: number, w: number, h: number, {fillStyle, debug, lineWidth} = {
    fillStyle: "#000000",
    debug: false,
    lineWidth: 1
  }) {
    this.ctx.beginPath();
    this.ctx.fillStyle = fillStyle;
    this.ctx.rect(a, b, w, h);
    this.ctx.fill();
    this.ctx.closePath();

  }

  cline_offset(a: any, b: any, x: any, y: any) {
    this.cline(a, b, x + a, y + b);
  }

  clear(rect: D_Rect) {
    (this.ctx).clearRect(rect.x, rect.y, rect.width, rect.height);
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
    this.ctx.font = '14px serif';
    this.ctx.fillStyle = "#000000";
    this.ctx.strokeStyle = "#000000";
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
      // hmm???
      let dimensionVals = Algebra.CMatrixMult(axisProj, [i, drawRect.y]);
      // hmmm, fail then fail all mechanism --> designate point of catch explicitly?
      if (!dimensionVals.length) return;
      this.ctx.fillText(String(dimensionVals[0].toFixed(decimalPlaces)), i - spacing, drawRect.y - 23);
      // this.ctx.fillText(String(i-drawRect.x), i - spacing, drawRect.y - 23);
    }

    for (let i = drawRect.y; i <= drawRect.y + drawRect.height; i += 40) {
      // y axis
      this.cline(drawRect.x, i, drawRect.x - spacing / 2, i);
      // this.ctx.fillText(String(i-drawRect.y), drawRect.x - 32, i + 5);
      let dimensionVals = Algebra.CMatrixMult(axisProj, [drawRect.x, i]);
      this.ctx.fillText(String((dimensionVals[1]).toFixed(decimalPlaces)), drawRect.x - 32, i + 5);
    }
  }

  drawMouse(mouseX: number, mouseY: number) {
    this.ctx.fillText(mouseX + " " + mouseY, mouseX, mouseY);
  }

  rotatingSquare(x: number, y: number, w: number, h: number, degree: number) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(degree);
    this.ctx.fillStyle = "#000000";
    // Position of rect relative to the 'midpoint', the center of the rectangle
    this.ctx.rect(-w / 2, -h / 2, w, h);
    this.ctx.fill();
    this.ctx.translate(-x, -y);
    this.ctx.restore();
  }

  crad(degree: number) {
    return degree * Math.PI / 180;
  }

  crotate(d: number
          // , point=[0,0]
  ) {
    let c = Math.cos(this.crad(d));
    let s = Math.sin(this.crad(d));

    // @ts-ignore
    return math.matrix([[c, s, 0], [-s, c, 0], [0, 0, 1]]);
    // return math.matrix([[c,s,0],[-s,c,0],[0,0,1]]);
  }

  write(text: string, x: number, y: number) {
    this.ctx.font = '14px serif';
    this.ctx.fillStyle = "#000000";
    this.ctx.beginPath();
    this.ctx.fillText(text, x, y);
    this.ctx.closePath();
  }
}

export {
  R_Canvas,
}