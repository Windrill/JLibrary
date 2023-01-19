import {ForEachArrayIndex, ForEachArrayItem, ForEachObjectItem, IndexSort} from "../../functions/functional";

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
      expect(indexes[i]).toBe(expected[i]);
    }, expected);
  });
});


describe('Basic utilities', () => {
  test('Object Foreach', () => {
    let itemObject = {
      1: 2
    }
    let items: number[] = [];
    ForEachObjectItem((item: number) => {
      items.push(item);
    }, itemObject);

    expect(items[0]).toBe(2);
  });
});
