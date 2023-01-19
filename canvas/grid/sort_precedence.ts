/**
 * Sorted by dimension ordering, eg. x first, then y, then z.
 */
import {ArrToString, BinarySearchNonUniform} from "../../functions/array";
import {ForEachArrayIndex, ForEachArrayItem} from "../../functions/functional";
import {AllZeroArray, StrIndexable} from "../../functions/algebra";
import {number, re} from "mathjs";
import {getInstance} from "../../functions/structures";
import {found} from "@jridgewell/trace-mapping/dist/types/binary-search";

// Can you remove this??
class CustomData {
  // dimType : string; // x, y, z
  dimNum: number; // x = 100
  // dimType : string
  constructor(dimNum: number) {
    this.dimNum = dimNum;
    // this.dimType = dimType;
  }

  // actually this ought to be your custom data type.
}

// I guess I cannot add this generic function.
// Most generic function remember to add it to your basic sources.
// function compare<T extends Object>(a : T, b : T) : number {
//   return Number(a.valueOf()) - Number(b.valueOf());
// }
// function compare(a : number, b: number) {
// }
function compare<T extends CustomData>(a: T, b: T) {
  return a.dimNum - b.dimNum;
}

// What is this for?
interface StringRepresentationInterface<T> extends Object {
  getPoint(): T;

  setPoint(t: T): void;
}

// can you just serialize and deserialize outside of your logic code?

/**
 * wait i thought the whole point was to separate custom data from the inidex. now i've related it together.
 */
class SortNode<T extends StringRepresentationInterface<any>> {
  // Only 1 component in a point. eg. the x component
  nodeData: T;
  sortedTree: SortNode<T>[];

  dimPrecedence: string[];
  sortedDepth: number; // basically the index for the sorted axis.
  dimComparator: (dim: string) => (a: SortNode<T>, b: T) => number;

  optionalFactory: (() => T) | undefined; // this is jus a workaround, you can't support true multi-class in javascript
  extents: StrIndexable; // Boundaries
  toString() {
    let depthStr = `root(${this.sortedDepth}): `;
    if (this.sortedDepth > -1) {
      depthStr = `${this.dimPrecedence[this.sortedDepth]}:`
    }
    // Why does the array print out CData instead of SortNode<CData>?
    return `${depthStr} ${this.nodeData.toString()}\n\ttree: ${ArrToString(this.sortedTree)}`;
  }

  constructor(nodeData: T,
              comparator: (dim: string) => (a: SortNode<T>, b: T) => number,
              dimPrecedence: string[] = ['x', 'y'],
              sortedDepth: number = -1,
              extents: StrIndexable = {'x': 500, 'y': 500}
  ) {
    this.optionalFactory = undefined;
    this.sortedDepth = sortedDepth;
    // TODO: Make an optional value
    this.nodeData = nodeData;
    this.dimPrecedence = dimPrecedence;
    this.sortedTree = [];

    this.dimComparator = comparator;
    this.extents = extents;
  }

  // convenience function for binary search
  // Also assuming elements are unique! true/false shouldn't matter
  searchData(data: T): T {
    let datPtr: SortNode<T> = this;
    // Can you search this data thoroughly too.
    // Also I think...
    for (let x = 0; x < this.dimPrecedence.length; x++) {
      let i = BinarySearchNonUniform<SortNode<T>, T>(
        this.sortedTree,
        data,
        true,
        this.dimComparator(this.dimPrecedence[this.sortedDepth + 1]));
      datPtr = datPtr.sortedTree[i];
    }
    return datPtr.nodeData;
  }

  can (point: T, dim : number) {
    let a = BinarySearchNonUniform<SortNode<T>, T>(
      this.sortedTree,
      point,
      false,
      this.dimComparator(this.dimPrecedence[dim]));
    if (a >= 0 && a < this.sortedTree.length) {
      return [true, a];
    } else return [false, -1];
  }
  // only queries for the closest, without any questions. if may return results that are too low numbered for you
  // sequence: 1 for yes, 0 for no
  /*
  examples:
  find x axis & y axis for a point
  find next x axis that is > y axis. which means you'll have to look through all x axis f
   */
  ndFind(point : T, sequenceOfQueries : number[]) {
    let ndResults = [];
    ForEachArrayIndex((sequence : number) => {
      if (sequenceOfQueries[sequence] == 0) {

      }
      let sameAxis = BinarySearchNonUniform<SortNode<T>, T>(
        this.sortedTree,
        point,
        false,
        this.dimComparator(this.dimPrecedence[sequence]));
    }, sequenceOfQueries);

  }

  findP(point : T) : number[] {
    let axes : number[] = [];
    let foundTree : undefined | SortNode<T>[] = this.sortedTree;
    ForEachArrayIndex((dim : number) => {
      if (!foundTree) {
        axes.push(-1);
        return;
      }
      let a : number = BinarySearchNonUniform<SortNode<T>, T>(
        foundTree,
        point,
        false,
        this.dimComparator(this.dimPrecedence[dim]));
      axes.push(a);
      if (!foundTree[a]) foundTree = undefined;
      else foundTree = foundTree[a].sortedTree;
    }, this.dimPrecedence);
    return axes;
  }
  // basically you want points to
  // Finds next available node based on sort precedence.
  // Can you have it as a point??
  findClosest(point: T, closestRealPoint = false, debug : boolean = false): T {
    if (debug) {
      console.log("Finding point " + point.toString() + " for: ", this.toString(), "with dimensions val: ", this.dimPrecedence);
    }
    console.assert(this.sortedDepth == -1, "Find these points from root, assert sortedDepth");
    let firstDims = this.findP(point);
    let sameAxis = firstDims[0];
    let nextPoint = firstDims[1];
    if (debug) {
      console.log("First 2 searches for 2D: ", sameAxis, nextPoint);
    }

    if (sameAxis >= this.sortedTree.length) {
      if (closestRealPoint) {
          console.warn("There's no next point on this axis, aborting");
          return point;
      } else {
        if (!this.optionalFactory) {
          console.warn("optional factory dne for last axis");
        } else {        // the furthest of axis 1?
          let emptyArr: T = this.optionalFactory();
          let newBoundaryPoint: StrIndexable = {};
          ForEachArrayItem((d: string) => {
            // @ts-ignore
            // emptyArr[d] = 0;
            newBoundaryPoint[d] = point.getPoint()[d]; // duplicate of point, except for the boundary selection!!!
          }, this.dimPrecedence);
          // let emptyArr = AllZeroArray(this.dimPrecedence.length);
          // TODO: Figure out.....
          newBoundaryPoint[this.dimPrecedence[0]] = this.extents[this.dimPrecedence[0]]; // indeed this is the first dimension
          // @ts-ignore
          // emptyArr[this.dimPrecedence[0]] = this.extents[this.dimPrecedence[0]];
          emptyArr.setPoint(newBoundaryPoint);
          if (debug) {
            console.log("Empty array boundaries: ", (emptyArr));
          }
          return emptyArr;
        }
      }
    }

    let axisTree: SortNode<T> = this.sortedTree[sameAxis];
    // point does not exist.
    let doesNotExistOnAxis1: boolean = this.dimComparator(this.dimPrecedence[0])(axisTree, point) != 0;
    // make sure sameAxis is the same, or else
    if (doesNotExistOnAxis1 || nextPoint >= axisTree.sortedTree.length) {
      // First dimension
      if (nextPoint >= axisTree.sortedTree.length) {
        // finds next closest real point?
        if (closestRealPoint) {
          // if dont hve, then have to return something sillly
          if (sameAxis >= this.sortedTree.length) {
            console.warn("first axis dimensions lookin for real points found no solutions");
            return this.nodeData;
          }
          return this.sortedTree[sameAxis + 1].sortedTree[0].nodeData;
        } else {
          if (!this.optionalFactory) {
            console.warn("Optional not avali;");
            return this.nodeData;
          } // refactor this into a function later.
          let emptyArr: T = this.optionalFactory();
          let newBoundaryPoint: StrIndexable = {};
          ForEachArrayItem((d: string) => {
            // @ts-ignore
            // emptyArr[d] = 0;
            newBoundaryPoint[d] = point.getPoint()[d]; // duplicate of point, except for the boundary selection!!!
          }, this.dimPrecedence);
          // let emptyArr = AllZeroArray(this.dimPrecedence.length);
          // TODO: Figure out.....
          newBoundaryPoint[this.dimPrecedence[0]] = this.extents[this.dimPrecedence[0]];
          // @ts-ignore
          // emptyArr[this.dimPrecedence[0]] = this.extents[this.dimPrecedence[0]];
          emptyArr.setPoint(newBoundaryPoint);
          if (debug) {
            console.log("Empty array boundaries: ", (emptyArr));
          }
          return emptyArr;
        }
      }
      // Other dimensions
      // no more in same axis, or no more points.
      if (closestRealPoint && sameAxis >= this.sortedTree.length) {
        if (debug) {
          console.log("Shoulddnt find this valid point!");
        }
        return point;
        // console.log(this.sortedTree.length, sameAxis);
        // console.log(this.sortedTree.toString());
        // console.log("Found next valid point in next line: ", this.sortedTree[sameAxis + 1].sortedTree[0].toString());
        // return this.sortedTree[sameAxis + 1].sortedTree[0].nodeData;
        // return [sameAxis+1, 0];
      } else if (closestRealPoint) {
        if (debug) {
          console.log("Getting the next closest real point");
        }
        // just to check if values exceeded expected.
        if (doesNotExistOnAxis1) {
          let doesNotExistOnAxis2: boolean = this.dimComparator(this.dimPrecedence[1])(axisTree.sortedTree[nextPoint], point) != 0;
          if (doesNotExistOnAxis2) {
            return this.sortedTree[sameAxis].sortedTree[nextPoint].nodeData;
          } else {
            return this.sortedTree[sameAxis].sortedTree[nextPoint + 1].nodeData;
          }
        }
      } else {
        if (!this.optionalFactory) {
          console.warn("Factory function to create a none set without boundary does not exist");
          return this.nodeData;
        } else {
          // https://stackoverflow.com/questions/17382143/create-a-new-object-from-type-parameter-in-generic-class
          let emptyArr: T = this.optionalFactory();
          let newBoundaryPoint: StrIndexable = {};
          ForEachArrayItem((d: string) => {
            // @ts-ignore
            // emptyArr[d] = 0;
            newBoundaryPoint[d] = point.getPoint()[d]; // duplicate of point, except for the boundary selection!!!
          }, this.dimPrecedence);
          // let emptyArr = AllZeroArray(this.dimPrecedence.length);
          // TODO: Figure out.....
          newBoundaryPoint[this.dimPrecedence[0]] = this.extents[this.dimPrecedence[0]];
          // @ts-ignore
          // emptyArr[this.dimPrecedence[0]] = this.extents[this.dimPrecedence[0]];
          emptyArr.setPoint(newBoundaryPoint);
          if (debug) {
            console.log("Empty array boundaries: ", (emptyArr));
          }
          return emptyArr;
        }
      }
    }
    if (debug) {
      console.log("Found: ", axisTree.sortedTree[nextPoint].nodeData.toString());
    }
    return axisTree.sortedTree[nextPoint].nodeData;
    // return [sameAxis, nextPoint];

    // This node is 0 at 0, so next available node starts looking from sub-tree
  }

  // Internal, should only be used by index determined operations. also should be updated.
  insert(indices: number[], insert: boolean[], point: T, debug: boolean = false) {
    // needs to be proper get. for type . but this will defeat the purpose of having custom data. serializer?
    if (debug) {
      // console.log("Found indices/position: ", indices, insert);
      console.log("Point: ", point.getPoint());
    }
    if (Object.keys(point.getPoint()).length > this.dimPrecedence.length) {
      console.log("Point has more dimensions than this node is sized for!", point, this.dimPrecedence);
      return;
    }
    let xDim: SortNode<T> = this;
    // Need to make sure that this is not exactly equivalent to other nodes inside this tree.
    ForEachArrayIndex((index: number) => {
      let indexKey = indices[index];
      // console.log(!insert[index], xDim.sortedTree[indexKey] != undefined, index);
      if (!insert[index] && xDim.sortedTree[indexKey] != undefined) {
        // console.log("continue on");
        xDim = xDim.sortedTree[indexKey];
        return;
      }
      let insertedNode = new SortNode<T>(
        point, this.dimComparator,
        this.dimPrecedence, xDim.sortedDepth + 1,
      );

      xDim.sortedTree.splice(indexKey, 0, insertedNode);
      // my concern is after sortedTree splices, there's still no node inserted?
      // Oh you need to insert it dimension by dimension. Hence this might not be the best place to print.
      // console.log("After splicing: ", xDim.sortedTree.toString(), indices[i]);
      xDim = xDim.sortedTree[indexKey];
    }, indices);
    if (debug) {
      console.log("After inserting " + point.toString() + ": " + `(${this.sortedTree.length})` + "\n", this.toString());
    }
  }

  add(point: T, debug: boolean = false) {
    let insertPoints: number[] = [];
    let insertOrNot: boolean[] = [];
    let dimSortTree = this.sortedTree;
    let newNum = false;
    ForEachArrayItem((dim: string) => {
      let nDIdx: number = BinarySearchNonUniform<SortNode<T>, T>
      (dimSortTree, point, true, this.dimComparator(dim));
      let sameAndValid: boolean = dimSortTree[nDIdx] && dimSortTree[nDIdx].nodeData.getPoint()[dim] == point.getPoint()[dim];
      if (debug && !sameAndValid) {
        console.log("Different value is found by search");
      }
      // If any off prior dimensions = 0, it means everything after is 0 too.
      if (!newNum && sameAndValid) {
        dimSortTree = dimSortTree[nDIdx].sortedTree;
      } else {
        // console.log("Pushing to new for ", dim, point.getPoint());
        newNum = true;
        // Adds blank by default. To everything, if it's the first.
        // insertPoints.push(0);
      }
      insertPoints.push(nDIdx);
      insertOrNot.push(newNum);
    }, this.dimPrecedence);
    this.insert(insertPoints, insertOrNot, point, debug);
  }
}

// Node,
// class SortDimension {
//   dimensionPrecedence : string[];
//   sortedTree : SortNode[];
//   constructor(dimensionPrecedence = ['x', 'y']) {
//     this.dimensionPrecedence = dimensionPrecedence;
//   }
//
//   add(dm : CustomData) {
//
//   }
//
// }

export {
  CustomData,
  // DimPoint,
  SortNode,
  StringRepresentationInterface
}