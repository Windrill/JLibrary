/*
converts
       h
 |-----|----|
 |     v    |
 |     x<-->|
 |        w |
 |----------|

 to
 x----------| ^
 | <---w--->| |
 |          | h
 |          | |
 |----------| v
 */

import {ForEachArrayItem} from "./functional";
import {C_ARRAY_COPY, C_ARRAY_ELEMENT_ADD, C_ARRAY_ELEMENT_MULT, C_ARRAY_ELEMENT_SCALE} from "./algebra";

/**
 * Expects the first half of parameters to be specifying the midpoint, and the second half specifying the size
 * @param args
 * @constructor
 */
// haven't used before, lol, looks very eveil
// 100,100,20,20 --> 80,80? or should have been 90,90-110,110?
function MidPointToTopLeft(...args : number[]) {
  let halfLength = args.length/2;
  let secondHalf = C_ARRAY_COPY(args);
  secondHalf.splice(halfLength);
  C_ARRAY_ELEMENT_SCALE(secondHalf, -1);

  let addedReturns = C_ARRAY_COPY(args);
  C_ARRAY_ELEMENT_ADD(addedReturns, secondHalf);
  addedReturns.splice(halfLength);
  // copiedPoints.spli
  return addedReturns;
}

function MidPointToD_Rect(...args : number[]) {
  let halfLength = args.length/2;
  let d_rect_params = [];
  for (let i=0;i<halfLength;i++) {
    d_rect_params.push(
      args[i] - args[halfLength+i]/2
    );
  }

  for (let i=0;i<halfLength;i++) {
    d_rect_params.push(
      args[i] + args[halfLength+i]/2
    );
  }
  return new D_Rect(...d_rect_params);
}

class D_Rect {
  x: number;
  y: number;
  width: number;
  height: number;

  // Top left, width & height
  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    for (let i = 0; i < Object.keys(this).length; i++) {
      Object.defineProperty(this, i, {
        get: function () {
          // TS2550: Property 'values' does not exist on type 'ObjectConstructor'. Do you need to change your target library? Try changing the 'lib' compiler option to 'es2017' or later.
          return Object.values(this)[i]
        },
        set: function (newValue) {
          this[Object.keys(this)[i]] = newValue;
        }
      });
    }
  }

  getMidpoint() {
    return [
      this.x + (this.width / 2),
      this.y + (this.height / 2)
    ]
  }

  // array: range for x, range for y...
  toArray() {
    return [
      [this.x, this.x + this.width],
      [this.y, this.y + this.height]
    ];
  }

  show(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#000000";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }

  contains(point: D_Point) {
    return (point.x >= (this.x)) &&
      (point.x <= (this.x + this.width)) &&
      (point.y >= (this.y)) &&
      (point.y <= (this.y + this.height));
  }

  // If i want to test this function against javascript graphing engine, I just have an 'interactive'?
  intersects(range: D_Rect) {
    // first eval: left side of range rect is beyond (>) right side of this rect
    return !(range.x > this.x + this.width ||
      range.x < this.x - this.width ||
      range.y > this.y + this.height ||
      range.y < this.y - this.height);
  }
}

// convert d_rect into multidimensional array accessible.....
// D: Data only
// Constant types
interface D_Point {
  x: number;
  y: number;
}

// normalize as an array
function NormalizeX(...args : number[]) : number[] {
  let mag = 0;
  for (let i=0;i<args.length;i++) {
    mag += args[i]*args[i];
  }
  mag = Math.sqrt(mag);
  let ret = [];
  for (let i=0;i<args.length;i++) {
    ret.push(args[i]/mag);
  }
  return ret;
}

function NormalizePoint (p : D_Point) {
  let mag = Math.sqrt(p.x*p.x + p.y*p.y);
  return {
    x: p.x/mag,
    y: p.y/mag
  }
}
// Also properties
type OneDArray = number[];
type NDArray = number[][];
type DArray = OneDArray | NDArray;
type ZeroOrOneD = number | OneDArray;


// Multidimensional lambda: If the first element seems to be have length attribute
const multiDimensional = (x: any): x is NDArray => x.length && x[0].length;
const singleDimensional = (x: any): x is OneDArray => x.length && !(x[0].length); // typeof results.minmax[0] == "number"


type Pair = [number, number];
type NDPair = Pair | [number[], number[]];

export {
  D_Rect

}
export type {
  D_Point,
  ZeroOrOneD,
  OneDArray,
  NDArray,
  DArray,

  Pair,
  NDPair
}

export {
  multiDimensional,
  singleDimensional,
  NormalizePoint
  ,
  NormalizeX,
  MidPointToD_Rect,
}