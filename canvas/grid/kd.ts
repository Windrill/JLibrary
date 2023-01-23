/**
 * Sort by binary split depending on
 */


/**
 * Kd tree for 2D
 * what are we usimg it for????? dunno.....because i could only query it but i want to query
 * // all at x =100, im just gonna pu the list
 */
import {Accumulator} from "../../functions/functional";
import {BinarySearch} from "../../functions/array";

class DimNum {
 dimType : string; // x, y, z
  dimNum : number; // x = 100
  constructor(dimNum : number, dimType : string) {
    this.dimNum = dimNum;
    this.dimType = dimType;
  }
}
/*
Represents on point in x-dimension world.
How to simplify / unsimmplify?? Add annotations to the type? // 2D
 */
type DimPoint = DimNum[];

interface kdNode {
  parent : kdNode | undefined;
  children : kdNode[] | undefined; // as a list? if you know how many you split into.
  node : DimNum[];  // same dimension!!!
  // just 1 dimensional definition please, becauase only binary operations.
  // which means each of the dimnums in the dimnum array must be the same!!!!
}

// If it's just a binary node, theen you don't need this logic and it's just one compare. bbut i guess....
// comarparator for kdnode...and returns the node number...
let comareNode = (node : kdNode, value : DimPoint) => {
  // assert all values in node is same
  let firstDim = node.node[0].dimType;
  let assertNodeUniformDim = Accumulator<boolean, DimNum>((t,nodes)=> {
    return t && nodes.dimType == firstDim;
  }, node.node, true);
  console.assert(assertNodeUniformDim);

  let specificDimension = value.filter(v => v.dimType == firstDim);
  if (specificDimension.length == 0 || specificDimension.length > 1) {
    console.log(`Dimension value for node or input is incorrect; each dimeension should only have 1 uniquqe dimNum value. I should actually make this an object. ${specificDimension.length}`);
    return;
  }
  let index = BinarySearch<DimNum>(node.node, specificDimension[0], true, (x: DimNum, y : DimNum) => {
    return x.dimNum - y.dimNum;
  })
  return index;
}
let sampleNode : kdNode = {
  parent: undefined,
  children: [],
  node: [new DimNum(2, 'x'), new DimNum(3, 'y')]
};
comareNode(sampleNode, [new DimNum(1, 'x')]);
/*
type kdDifferentiate = DimNum;

class kdTree {
  height : number;
  root : kdDifferentiate;
  constructor(defaultDimensions = ['x']) {
    // but on the leaves you actually only have a diffferentiation
    this.height = 0;
    this.root = new DimNum(0, defaultDimensions[0]);
  }
  // parent dimnum, and the left or right indication child number
//   find(node : DimPoint) : [DimNum?, number?] {
//     // for each node find the correct branch,
//     // k could be either one or many.......
//     let r : DimNum = this.root;
//     while (r) {
//       let idx = (comareNode(r, node));
//       r = r
//     return [];
//   }
//   rebalance() {
//     // i think move the root around.
//   }
//   add(node : kdNode) {
//     // parent of node and its number
//     let findRes = find(node);
//     // if there is then youa dd it there. if there isn't....
//   }
}*/