class D_Rect {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x = 0, y = 0, w = 0, h = 0) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
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
      this.x + (this.w/2),
      this.y + (this.h/2)
    ]
  }

  // array: range for x, range for y...
  toArray() {
    return [
      [this.x,this.x + this.w],
      [this.y,this.y + this.h]
    ];
  }
}
// convert d_rect into multidimensional array accessible.....
// D: Data only
// Constant types
interface D_Point {
  x: number;
  y: number;
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
  singleDimensional
}