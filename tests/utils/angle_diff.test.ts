import * as THREE from 'three'

// 160 and -20
// 110 and -70

/*
don't equal: 110 and -70 degrees. <- the shortest distance is 180. but from the other way around, it is actually > 360. which means
                                     this algebra is warping in a weird manner!
0 and 180 degrees
 */
// when red arrow points to the top it's -180, when bottom it's 180.

import {AngleDiff, NormalizeWithinPeriod} from "../../angle/normalization";
import {Algebra, Cartesian2Polar, RAD2DEG} from "../../functions/algebra";

describe('Description for group of tests', () => {
  test('A test', () => {

  });

  test('A second test', () => {

    AngleDiff(-70, 110);
  });
  test('flipping the y axis doesn\'t change the difference of 2 angles\' differences' , () => {
    let borderFrom = new THREE.Vector2(123, 456);
    let borderTo = new THREE.Vector2(234, 567);

    let frameOfReferenceAngleDiff = Algebra.GetRad(borderFrom.clone().sub(borderTo)) * RAD2DEG;
    let frameOfReferenceAngleOppoDiff = Algebra.GetRad(borderTo.clone().sub(borderFrom)) * RAD2DEG;
    let normalizeOpposite = NormalizeWithinPeriod(frameOfReferenceAngleDiff - frameOfReferenceAngleOppoDiff, -360, 360);
    console.assert(Algebra.Approx(Math.abs(normalizeOpposite), 180));


    let frameOfReferenceAngleAbs = Cartesian2Polar(borderFrom.clone().sub(borderTo), true) * RAD2DEG;
    let frameOfReferenceAngleOppoAbs = Cartesian2Polar(borderTo.clone().sub(borderFrom), true) * RAD2DEG;

    console.assert(Algebra.Approx(Math.abs(NormalizeWithinPeriod(frameOfReferenceAngleDiff - frameOfReferenceAngleOppoDiff, -360, 360)), 180));

  });

});

export {}