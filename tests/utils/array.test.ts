import {BinarySearch} from "../../functions/array";


describe('Binary search array', () => {
  test('BS Regular', () => {
    //         0  1  2  3  4  5  6   7   8   9   10
    let arr = [1, 3, 4, 5, 6, 9, 11, 15, 22, 40, 56];
    {
      let r = BinarySearch(arr, 8);
      expect(r).toBe(5);
    }
    {
      let r = BinarySearch(arr, 9, true);
      expect(r).toBe(5);
    }
    {
      let r = BinarySearch(arr, 9, false);
      expect(r).toBe(6);
    }
    {
      let r = BinarySearch(arr, 999, false);
      expect(r).toBe(arr.length);
    }
    {
      // If search fails, insert at first, because this searches for the nearest index.
      // , (x: any, y: any) => (x.valueOf()) - y.valueOf(), true
      let r = BinarySearch(arr, -1, false);
      expect(r).toBe(0);
    }
  });

  test("BS Repeating Values", () => {
    let arrRep = [10, 10, 10, 20, 20, 20, 30, 30];
    {
      let r = BinarySearch(arrRep, 20, true);
      expect(r).toBe(3);
    }
    {
      let r = BinarySearch(arrRep, 20, false);
      expect(r).toBe(6);
    }

    {
      let r = BinarySearch(arrRep, 30, false);
      expect(r).toBe(8);
    }
    {
      let r = BinarySearch(arrRep, 31, false);
      expect(r).toBe(8);
    }
  });

  test("BS Short Array", () => {
    let endsArr = [0, 500];
    {
      let r = BinarySearch(endsArr, 0, true);
      expect(r).toBe(0);
    }

    {
      let r = BinarySearch(endsArr, 500, true);
      expect(r).toBe(1);
    }
    {
      let r = BinarySearch(endsArr, 1, true);
      expect(r).toBe(1);
    }

    {
      let r = BinarySearch(endsArr, 200, true);
      expect(r).toBe(1);
    }

    {
      let r = BinarySearch(endsArr, 200, false);
      expect(r).toBe(1);
    }
  });
});