import {ExpandXdGrid, XNode} from "../../canvas/grid_area";
import {ArrToString} from "../../functions/array";

let assertNode = (n: XNode, data : [number, boolean]) =>{
  // also you might want to check links.... unfortunately you're not checking them now.
  return n.data == data[1] && n.fromNum == data[0];
}

describe('Interval Grid Test', () => {
  test('Add intervals basic', () => {
    let ge = new ExpandXdGrid([0, 0], [500, 500]);

    ge.add([100, 200], [200, 400]);
    ge.add([100, 200], [200, 400]);

    expect(assertNode(ge.grid[0][0], [0, false])).toBe(true);
    expect(assertNode(ge.grid[0][1], [100, true])).toBe(true);
    expect(assertNode(ge.grid[0][2], [200, false])).toBe(true);

    expect(assertNode(ge.grid[1][0], [0, false])).toBe(true);
    expect(assertNode(ge.grid[1][1], [200, true])).toBe(true);
    expect(assertNode(ge.grid[1][2], [400, false])).toBe(true);

    ge.add([200, 400], [300,600]);

    expect(assertNode(ge.grid[0][0], [0, false])).toBe(true);
    expect(assertNode(ge.grid[0][1], [100, true])).toBe(true);
    expect(assertNode(ge.grid[0][2], [300, false])).toBe(true);

    expect(assertNode(ge.grid[1][0], [0, false])).toBe(true);
    expect(assertNode(ge.grid[1][1], [200, true])).toBe(true);
    expect(assertNode(ge.grid[1][2], [500, false])).toBe(true);
    let b = 2;
    expect(1 == b);
    // console.log(ArrToString<XNode>(ge.grid[0]));
    // console.log(ArrToString<XNode>(ge.grid[1]));
  });


  test('Add void intervals', () => {
    let ge = new ExpandXdGrid([0, 0], [500, 500]);
    ge.add([0, 0], [0, 0]);
    ge.add([0, 0], [1, 1]);

    ge.add([1, 1], [1, 1]);
    // console.log(ArrToString<XNode>(ge.grid[0]));
    // console.log(ArrToString<XNode>(ge.grid[1]));
    expect(assertNode(ge.grid[0][0], [0, true])).toBe(true);
    expect(assertNode(ge.grid[0][1], [1, false])).toBe(true);
  });

  test('Add overlapping intervals', () => {
    let ge = new ExpandXdGrid([0, 0], [500, 500]);
    ge.add([0, 0], [10, 10]);
    ge.add([20, 20], [30, 30]);
    ge.add([10, 10], [20, 20]);

    // console.log(ArrToString<XNode>(ge.grid[0]));
    // console.log(ArrToString<XNode>(ge.grid[1]));
    expect(assertNode(ge.grid[0][0], [0, true])).toBe(true);
    expect(assertNode(ge.grid[0][1], [30, false])).toBe(true);
  });



  test('Test interval removal', () => {
    let ge = new ExpandXdGrid([0, 0], [500, 500]);
    ge.add([1,1],[200,200]);
    ge.remove([50, 50], [70,70]);

    expect(assertNode(ge.grid[0][1], [1, true])).toBe(true);
    expect(assertNode(ge.grid[0][2], [50, false])).toBe(true);
    expect(assertNode(ge.grid[0][3], [70, true])).toBe(true);
  });


  // Doesnt work
  /**
   * New implementation proposal:
   * convert to a 2d grid. at most (n) space taken but you'll want to set a smallest
   * of 20 by 20 i guess? it's like in draw.io's grid....
   */
  test('Test interval impossible insertion...', () => {
    let ge = new ExpandXdGrid([0, 0], [500, 500]);
    ge.add([0,0], [100, 200]);
    ge.add([200, 100], [300, 300]);
    expect(assertNode(ge.grid[1][1], [100, true])).toBe(true);
    // expect(assertNode(ge.grid[1][1], [200, false])).toBe(true);
    console.log(ge.toString());
    ge.add([100,100],[200,300]);
    // ge.add([100, 200], [250, 200]);
    console.log(ge.toString());
  });



});


