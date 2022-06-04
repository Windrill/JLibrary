import {D_Point, D_Rect, NDArray, OneDArray} from "../functions/structures";
import {Algebra} from "../functions/algebra";

class R_Canvas {
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  destructor() {

  }

  cpoint(point: D_Point) {
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.closePath();
  }

  cpoint_offset(x: any, y: any, point: { x: any; y: any; }) {
    this.cpoint({x: point.x + x, y: point.y + y});
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

  cline(a: number, b: number, x: number, y: number, {fillStyle, debug} = {fillStyle: "#000000", debug: false}) {
    if (debug) {
      console.log(`${a},${b} to ${x},${y}`);
    }
    this.ctx.fillStyle = fillStyle;
    this.ctx.beginPath();
    this.ctx.moveTo(a, b);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
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
  drawBoard(drawRect: D_Rect, dimensionRestraints: NDArray, spacing: number, clear = true, fractional: number = 0) {
    if (clear) {
      this.clear(drawRect);
    }
    // this.ctx.fillStyle = "#1e7cea";
    // this.ctx.fillRect(0, 0, width, height);
    this.ctx.font = '14px serif';
    this.ctx.fillStyle = "#000000";
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

    // X Axis
    for (let i = drawRect.x; i <= drawRect.x + drawRect.width; i += 40) {
      // this.cline(i, 5, i, 10);
      this.cline(
        i, drawRect.y,
        i, drawRect.y - spacing / 2
      );

      // console.log(`[canvas.ts 206] Drawing board now:", ${i},
      // ${dimensionRestraints},
      // ${drawRect.toArray()}`);
      console.assert((dimensionRestraints.length) > 0);
      let dimensionVals = Algebra.Project([i, drawRect.y], drawRect.toArray(), dimensionRestraints, false);
      // hmmm, fail then fail all mechanism --> designate point of catch explicitly?
      if (!dimensionVals.length) return;
      this.ctx.fillText(String(dimensionVals[0].toFixed(fractional)), i - spacing, drawRect.y - 23);
      // this.ctx.fillText(String(i-drawRect.x), i - spacing, drawRect.y - 23);
    }

    for (let i = drawRect.y; i <= drawRect.y + drawRect.height; i += 40) {
      // y axis
      this.cline(drawRect.x, i, drawRect.x - spacing / 2, i);
      // this.ctx.fillText(String(i-drawRect.y), drawRect.x - 32, i + 5);

      let dimensionVals = Algebra.Project([drawRect.x, i], drawRect.toArray(), dimensionRestraints, false);
      this.ctx.fillText(String((dimensionVals[1]).toFixed(fractional)), drawRect.x - 32, i + 5);
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