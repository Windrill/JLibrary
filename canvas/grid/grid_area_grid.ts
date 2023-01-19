import {Accumulator, ForEachArrayIndex} from "../../functions/functional";
import {ArrToString, BinarySearch} from "../../functions/array";
// it's like, you can use a binary tree for querying numbers, inserting numbers
// but not for finding which interval between numbers is the greatest
// how to find greatest interval?
// or i just store the intervals in a binary tree, and see which
// side of the branched tree is heavier?
// how to find sum of weights of subtree? just do a log(n) weight tree calculation
// eg. each insertion takes log(n).
// is gridarea a linked list? is it a map? it is a map! and a linked list. oh no that question after all.
class GridArea {
  gridMap : {}
  gridList : any[]
  constructor() {
    // unordered map
    this.gridMap = {};
  }
  addArea(areaNum: [], approx = 1) {
    /*
    1. insert in the xth position
    2. expand with approximation value
     */

  }
}
class XNode {
  fromNum: number;
  // List
  beforeNode?: XNode;
  nextNode?: XNode;
  // = 1 means occupied, 0 means not occupied. I could just make this very specific, aka bolean.... Fine..
  data: boolean;

  constructor(from: number, data: boolean) {
    this.fromNum = from;
    this.data = data;
  }

  toString() {
    return `${this.beforeNode ? "<-" : ""}(${this.fromNum}, ${this.data})${this.nextNode ? "->" : ""}`;
  }

  static compare = (x: XNode, y: XNode): number => {
    return x.fromNum - y.fromNum;
  }

  // boolean 'coercion'..... try to make it more generic that's why. but you aren't able to compare so easily to 'order'.... oh well you can mimic this time
  static compareData = (x: XNode, y: XNode): number => {
    if (x.data == y.data) {
      return 0;
    }
    if (x.data) {
      return 1;
    }
    return -1;
  }

  // no need tro ever use
  clone(): XNode {
    let cloned = new XNode(this.fromNum, this.data);
    cloned.beforeNode = this.beforeNode;
    cloned.nextNode = this.nextNode;
    return cloned;
  }
}

class ExpandXdGrid {
  dimensions = 2;
  maxDimension: number[];
  grid: XNode[][];

  // What format will you take...again?
  // i guess default start = 0,0.
  // maxgriddims: [500, 500]
  constructor(minGridDims: number[], maxGridDims: number[]) {
    this.grid = [];
    this.maxDimension = maxGridDims;
    ForEachArrayIndex((i: number) => {
      let start = new XNode(minGridDims[i], false);
      // let fin = new Node(maxGridDims[i], false);
      this.grid.push([start]);
    }, minGridDims);
  }


  // Removes the next interval number if previous interval number value is the same.
  dedupe(dimNum: number, index: number) {
    if (index >= 0 && index < this.grid[dimNum].length - 1 && this.grid[dimNum][index].data == this.grid[dimNum][index + 1].data) {
      this.grid[dimNum].splice(index + 1, 1);
      this.glue(dimNum, index, this.grid[dimNum][index]);
    }
  }

  queryRange(dimNum: number, from: XNode, to: XNode): boolean {
    // if 0, 500 adding 100, 200 then check if 0 is false if 100 is true
    // then check if you ened to add 200. if 500 is 200, then ? Then if 200 is false then you put false, if 200 is true then you put the value there. Basically you put original value back.
    // For everything in between, remove if it's the same later.
    // verify to.data != from.data
    // verify to > from.
    let fromLoc = BinarySearch(this.grid[dimNum], from, true, XNode.compare);
    let toLoc = BinarySearch(this.grid[dimNum], to, true, XNode.compare);
    // Don't keep equal values.... For toLoc.
    // Also if toLoc is 0, what to do.
    for (let i = fromLoc; i < toLoc; i++) {
      // if grid has no data and insert  got data, it's ok. if that has no data * grid has no date. ok
      // if grid has data & insert got data
      if (this.grid[dimNum][i].data && from.data) {
        return false;
      }
    }
    return true;
  }

  remove(start: number[], end: number[]) {
    this.add(start, end, false);
  }

  /*
  If you add, then it's an insertion. If add is false, it's a removal.
   */
  add(start: number[], end: number[], add: boolean = true): boolean {
    console.assert(start.length == end.length);
    let startNodes: XNode[] = [];
    let endNodes: XNode[] = [];
    let canAdd: boolean = true;
    // Query all if this point is valid.
    ForEachArrayIndex((i: number) => {
      let startN = new XNode(start[i], add);
      let endN = new XNode(end[i], !add);
      startNodes.push(startN);
      endNodes.push(endN);
      canAdd = canAdd && (end[i] > start[i]) && this.queryRange(i, startN, endN);
    }, start);

    if (!canAdd) {
      console.log("Value cannot be added for this range, range is occupied, or interval = 0", start, end);
      return false;
    }
    // console.log("Add point, since grid is free here.", start, end);

    ForEachArrayIndex((i: number) => {
      this.addOneDim(i, startNodes[i], endNodes[i]);
    }, start);
    return true;
  }

  // After position already here
  // so last parameter isn't rly necessary
  glue(dimNum: number, location: number, node: XNode) {
    if (location > 0) {
      (this.grid[dimNum][location - 1]).nextNode = node;
      node.beforeNode = this.grid[dimNum][location - 1];
    }
    node.nextNode = undefined;
    if (location + 1 < this.grid[dimNum].length) {
      this.grid[dimNum][location + 1].beforeNode = node;
      node.nextNode = this.grid[dimNum][location + 1];
    }
  }

  insertNode(dimNum: number, location: number, node: XNode, setStart: boolean = false) {
    if (location < this.grid[dimNum].length && XNode.compare(this.grid[dimNum][location], node) == 0) {
      if (XNode.compareData(node, this.grid[dimNum][location]) != 0) {
        // Only if you're the beginning of the interval, change active state.
        if (setStart) {
          this.grid[dimNum][location].data = node.data;
        }
        // Deduping used only for endLocation, if you just set interval to true, and the next interval is also true.
        this.dedupe(dimNum, location - 1);
      }
      // Location is at 1 after the smaller number
    } else {
      // Add current end node, , then dedupe.. or don't dedupe
      this.grid[dimNum] = this.grid[dimNum].slice(0, location)
        .concat(node)
        .concat(this.grid[dimNum].slice(location));
      this.glue(dimNum, location, node);

      // If end location has the same type as the next, you still need to use this endLocation number. if they're different then don't need to dedupe
      this.dedupe(dimNum, location);
    }
  }

  // Add new dimension for what?
  addOneDim(dimNum: number, startNode: XNode, endNode: XNode) {
    console.assert(XNode.compare(startNode, this.grid[dimNum][0]) >= 0);
    console.assert(startNode.data != endNode.data); // Either insertion or removal.

    // Capping to maximum. Eg. ge.add([200, 400], [300,600]); -> (ge.grid[1][2], [500, false])) for [500,500]
    endNode.fromNum = Math.min(endNode.fromNum, this.maxDimension[dimNum]);
    // For toValue, just keep the original value.
    // 0, 0
    // if addLocation = 0 and smallest = 0, then add
    let addLocation = BinarySearch(this.grid[dimNum], startNode, true, XNode.compare);

    // Need to recompute indices after this!!
    this.insertNode(dimNum, addLocation, startNode, true);

    // Question: Do I need to dedupe at 0? Slice might include 0, so I think I need to.
    // console.log("Grid area 2", ArrToString<XNode>(this.grid[dimNum]));
    // Adjust at the end
    /*
// if at this number you have a value already... if u r false & that is true, then just remove that one, because same as next one
// if at this number hav value already, if u r false & that is false, do nothing.

// if at this number hav value, u r true & that is true, remove that number
// if hav value already, u r true & that is false, keep that one. (do nothing). do nothing is same as replace? yes.
*/
// Change Grid once, now you change it again
    let addEndLocation = BinarySearch(this.grid[dimNum], endNode, true, XNode.compare);
    let lastAdd: boolean = this.grid[dimNum][addEndLocation - 1].data;

    // If this interval & endNode is the same
    this.insertNode(dimNum, addEndLocation, endNode);

    // console.log("Grid area 3:", ArrToString<XNode>(this.grid[dimNum]));
    // Did not promise every interval is different yet.

    // If boundary got a 0,0 and you're inserting in (0, 0) a rect of 100, 200. Then you're just adding 'true' in 0,0 and
    // if 100, 200 is 'false', keep a false marker here.
    // If you were to do a removal, you

    // write some expected tests later
    // for each dimension, look for the smallest, then split it.
  }

  // This needed a double toString loop because it's a doule array [][].
  toString() {
    return Accumulator<string, XNode[]>((t, dim: XNode[]) =>
        t + Accumulator<string, XNode>((t, s) => t + s.toString(), dim, "") + "\n"
      , this.grid, "");
  }
}

export {
  ExpandXdGrid,
  XNode
}