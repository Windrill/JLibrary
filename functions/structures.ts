import {C_ARRAY_COPY} from "./algebra";
import {R_Canvas} from "../canvas/canvas";
import {PointDrawSettings} from "../canvas/draw_settings";

export function getInstance<T extends Object>(type: (new (...args: any[]) => T), ...args: any[]): T {
  return new type(...args);
}

let DEFAULT2D: QuackingV2 = {
  x: 0, y: 0
};


// Quacking Vector2: It quacks like a D_Point and also like a THREE.Vector2
interface QuackingV2 {
  // [index: number]: any <- what's the reason I commented this out????? i was using it for
  //const C_DOT = (a: Quackable, v: Quackable) => {
  x: number,
  y: number
}

interface QuackingV3 {
  // [index: number]: any
  x: number,
  y: number,
  z: number
}

// All this work is already done in CPP
type Quackable = QuackingV2 | QuackingV3;
// @ts-ignore
const QuackableV2 = (x: Quackable): x is QuackingV2 => true;
// @ts-ignore
const QuackableV3 = (x: Quackable): x is QuackingV3 => true;

function Quack2(x : number, y : number) {
  return {x: x, y: y};
}
function QuackAdd(x: QuackingV2, y: QuackingV2) {
  return {
    x: x.x + y.x,
    y: x.y + y.y
  };
}
function QuackMultiply(x: QuackingV2, y: QuackingV2) {
  return {
    x: x.x * y.x,
    y: x.y * y.y
  };
}
function QuackCopy(a : QuackingV2) {
  return {x: a.x, y: a.y};
}

function QuackSubtract(x: QuackingV2, y: QuackingV2) {
  return {
    x: x.x - y.x,
    y: x.y - y.y
  };
}
function QuackScalar(s : number) {
  return {
    x: s,
    y: s
  };
}

interface WidthHeight {
  W: number,
  H: number
}

enum BackendType {
  HTML5Backend,
  THREEBackend
}

// Object
interface CanvasContext {
  ctx: CanvasRenderingContext2D
  canvasSize: WidthHeight // W, H
  element: HTMLElement // optional to assign eventListener inputs on; you could put a default of 'body', that
  // listens to some global numbers such as mouseX and mouseY locations

  // Currently mixing HTML5 backend and THREE backend....organize into 2 types in the near future
  camera?: any // dont want any three.js dependencies here
  backendType: BackendType;// = BackendType::HTML5Backend;
}

// Canvas context is almost common for html canvas objects
// Can be a THREE context too.
class CanvasPassAlong {
  public context: CanvasContext;

  constructor(context: CanvasContext) {
    this.context = context;
    // console.log("Try: ", this.context);
  }

  // Temporary
  cleanup() {

  }

  // following Actionable but actually deosn't override anything
  action(_t = -1) {

  }
}

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

type boxTuple = [number, number, number, number];


function MidPointToTopLeftBoxTuple(...args: boxTuple): boxTuple {
  let addedReturns = MidPointToTopLeft(...args);
  let defaults = [0, 0, 0, 0]
  let firstFour: number[] = [...addedReturns, ...defaults];
  firstFour = firstFour.slice(0, 4);
  return [firstFour[0], firstFour[1], firstFour[2], firstFour[3]];
}

/**
 * Expects the first half of parameters to be specifying the midpoint, and the second half specifying the size
 * @param args
 * @constructor
 */
// haven't used before, lol, looks very eveil
// 100,100,20,20 --> 80,80? or should have been 90,90-110,110?
function MidPointToTopLeft(...args: number[]): number[] {
  let halfLength = args.length / 2;
  let returns = C_ARRAY_COPY(args);
  for (let i = 0; i < halfLength; i++) {
    if (i < halfLength) {
      returns[i] -= returns[i + halfLength] / 2;
    } else {
      returns[i] = returns[i - halfLength] + args[i];
    }
  }
  return returns;
}

function MidPointToBottomLeft(...args: number[]) {
  let halfLength = args.length / 2;
  let d_rect_params = [];
  for (let i = 0; i < halfLength; i++) {
    d_rect_params.push(
      args[i] - args[halfLength + i] / 2
    );
  }

  for (let i = 0; i < halfLength; i++) {
    d_rect_params.push(args[halfLength + i]
    );
  }
  return d_rect_params;
}

type D_Line = {
  fromPoint: Quackable;
  toPoint: Quackable;
};

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

  // canvas.ts also has one
  show(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "#000000";
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.stroke();
  }

  contains(point: QuackingV2) {
    return (point.x >= (this.x)) &&
      (point.x <= (this.x + this.width)) &&
      (point.y >= (this.y)) &&
      (point.y <= (this.y + this.height));
  }

  // If i want to test this function against javascript graphing engine, I just have an 'interactive'?
  intersects(range: D_Rect, pointOverlap: boolean = false) {
    // If point overlap is enabled, don't allow boxes to share a common point.
    let point = pointOverlap ? 0 : 1;
    if (range.x > this.x + this.width - point || this.x > range.x + range.width - point) {
      return false;
    }
    if (range.y > this.y + this.height - point || this.y > range.y + range.height - point) {
      return false;
    }
    return true;
  }
}

class D_Circle {
  private hover: boolean;
  private readonly color: string;
  public y: number;
  public x: number;
  private readonly name: string;
  private readonly radius: number;

  constructor({name = "point", radius = 8, color = "#EE4433"} = {}) {
    // let's say this is the center point
    this.x = 20;
    this.y = 20;
    this.name = name;
    this.radius = radius;
    this.color = color;
    this.hover = false;
  }

  set(obj: QuackingV2) {
    this.x = obj.x;
    this.y = obj.y;
  }

  selected() {
    return this.hover;
  }

  select() {
    this.hover = true;
  }

  deselect() {
    this.hover = false;
  }

  within(x: number, y: number) {
    return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) < this.radius;
  }

  display(rCanvas: R_Canvas) {
    rCanvas.cpoint({x: this.x, y: this.y},
      new PointDrawSettings({
        name: this.name,
        radius: this.radius,
        startAngle: 0, endAngle: 360, _anticlockwise: false, fillStyle: this.color
      })
    );
    if (this.hover) {
      rCanvas.cpoint({x: this.x, y: this.y},
        new PointDrawSettings({
          name: this.name,
          radius: this.radius - 2,
          startAngle: 0,
          endAngle: 360,
          _anticlockwise: false,
          fillStyle: "#ffffff"
        }));
    }
  }

}

// Can this be quackable?
// D: Data only
// Constant types
class D_Point {
  [index: number]: any

  x: number;
  y: number;
  z: number = 0;
  zValid: boolean = false;

  constructor(x: number, y: number, z: number | undefined = undefined) {
    this.x = x;
    this.y = y;
    if (z) {
      this.z = z;
      this.zValid = true;
    } else {
      this.z = 0;
      this.zValid = false;
    }
  }

}

function NormalizeX(...args: number[]): number[] {
  let mag = 0;
  for (let i = 0; i < args.length; i++) {
    mag += args[i] * args[i];
  }
  mag = Math.sqrt(mag);
  let ret = [];
  for (let i = 0; i < args.length; i++) {
    ret.push(args[i] / mag);
  }
  return ret;
}

// TODO: Fix normalization, doesn't seem to draw a consistent angle????
function NormalizePoint(p: QuackingV2 | QuackingV3) {
  let mag = Math.sqrt(p.x * p.x + p.y * p.y);
  return {
    x: p.x / mag,
    y: p.y / mag
  }
}

// Also properties
type OneDArray = number[];
type NDArray = number[][];
type DArray = OneDArray | NDArray;
type ZeroOrOneD = number | OneDArray;

// Number_Indexed
interface NI_Object {
  [index: number]: any
}

// String_Indexed
interface SI_Object {
  [index: string]: any
}

// Multidimensional lambda: If the first element seems to be have length attribute
const multiDimensional = (x: any): x is NDArray => x.length && x[0].length;
const singleDimensional = (x: any): x is OneDArray => x.length && !(x[0].length); // typeof results.minmax[0] == "number"


type Pair = [number, number];
type NDPair = Pair | [number[], number[]];

// Canvas
export {
  D_Rect,
  D_Point,
  D_Circle,
  multiDimensional,
  singleDimensional,
  NormalizePoint,
  NormalizeX,

}

// Arrays, data structures
export type {
  ZeroOrOneD,
  OneDArray,
  NDArray,
  DArray,

  Pair,
  NDPair,

  NI_Object,
  SI_Object
}


// Midpoint functions
export {
  MidPointToTopLeft,
  MidPointToBottomLeft,
  MidPointToTopLeftBoxTuple
}

// Types
export {
  CanvasPassAlong,
  QuackableV2,
  QuackableV3,
  DEFAULT2D
}

// Structures
export type {
  QuackingV2,
  QuackingV3,
  CanvasContext,
  Quackable,
  D_Line
}

// Helper functions
export {
  BackendType,
  QuackAdd,
  Quack2,
  QuackSubtract,
  QuackScalar,
  QuackMultiply,
  QuackCopy
}