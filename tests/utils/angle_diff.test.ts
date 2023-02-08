
// 160 and -20
// 110 and -70

/*
don't equal: 110 and -70 degrees. <- the shortest distance is 180. but from the other way around, it is actually > 360. which means
                                     this algebra is warping in a weird manner!
0 and 180 degrees
 */
// when red arrow points to the top it's -180, when bottom it's 180.

import {AngleDiff} from "../../angle/normalization";

describe('Description for group of tests', () => {
  test('A test', () => {

  });

  test('A second test', () => {

    AngleDiff(-70, 110);
  });
});

export {}