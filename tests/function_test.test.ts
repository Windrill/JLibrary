import {ForEachArrayIndex, ForEachArrayItem, IndexSort} from "../functions/functional";
// import {i} from "mathjs";


describe('Function Tests', () => {
  test('Index Sort', () => {
    let unsorted: number[] = [2, 4, 1, 6, 7];
    let indexes = IndexSort<number>(unsorted, (a: number, b: number) => {
      return a - b;
    });
    // 2, 0, 1, 3, 4
    console.log(indexes);
    let expected = [2, 0, 1, 3, 4];
    ForEachArrayIndex((i: number) => {
      expect(indexes[i] == expected[i]);
    }, expected);
  });
});