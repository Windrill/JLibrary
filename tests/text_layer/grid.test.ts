import {ExpandXdGrid, XNode} from "../../canvas/grid_area";
import {ArrToString} from "../../functions/array";

function assertNode(n : XNode, data : [number, boolean]) {
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
});
