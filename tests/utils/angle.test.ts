import {AngleDiff, NormalizeWithinPeriod} from "../../angle/normalization";
import {Algebra, C_CROSS, C_DOT, CAngle} from "../../functions/algebra";
import {D_Point} from "../../functions/structures";

describe('Angle Tests', () => {
  test('Angle and intersection representations', () => {
    let lineC = [-22, -22];
    let lineA = [64, 64];
    let lineB = [0, 0]; // left to right.
    /*
    intersection means with each other as basis, one is left of the other. which means you can differentiate between
    left and right for the intersection points. so basis means it must intersect with both of the lines (or one of the lines
    then by commutative it intersects with both)

    from-to means the angle 'direction' aka cw, ccw
     */

    let intersectLine = (unit: CAngle) => {
      let fromAngle = new CAngle(unit.angle, unit.basis, unit.period);
      return {
        from: fromAngle,
        to: new CAngle(fromAngle.getComplementAngle(), unit.basis, unit.period)
      }
    };

    {
      let line1 = new CAngle(-22);
      let line2 = new CAngle(64);

      let line1T2: CAngle = Algebra.ConvertBasis(line1, line2.angle);
      let line1T2Complement = line1T2.getComplementAngle();
      console.log(`C:${line1.angle} A:${line2.angle} -> ${line1T2.angle}`);
    }

    {
      let line1 = new CAngle(-22);
      let line2 = new CAngle(-116);

      let line1T2: CAngle = Algebra.ConvertBasis(line1, line2.angle);
      let line1T2Complement = line1T2.getComplementAngle();
      console.log(`C:${line1.angle} A:${line2.angle} -> ${line1T2.angle}`);
    }

    {
      let line1 = new CAngle(158);
      let line2 = new CAngle(64);

      let line1T2: CAngle = Algebra.ConvertBasis(line1, line2.angle);
      let line1T2Complement = line1T2.getComplementAngle();
      console.log(`C:${line1.angle} A:${line2.angle} -> ${line1T2.angle}`);
    }

    {
      let line1 = new CAngle(158);
      let line2 = new CAngle(-116);

      let line1T2: CAngle = Algebra.ConvertBasis(line1, line2.angle);
      let line1T2Complement = line1T2.getComplementAngle();
      console.log(`C:${line1.angle} A:${line2.angle} -> ${line1T2.angle}`);
    }

    // let line2T1 = Algebra.ConvertBasis(line2, line1.angle); // 2t1 is 86
    // console.log(`Line1: ${line1T2}`);

    // now you just need to find which angle represents what....
    // find Af B Cf
  });

  test('Convert Basis Angle', () => {
    let basicAngle: CAngle = new CAngle(-22, 0);
    {
      let basicAngleSloped = Algebra.ConvertBasis(basicAngle, 1);
      expect(basicAngleSloped.angle).toBe(-23);
      expect(basicAngleSloped.basis).toBe(1);
    }
    {
      let basicAngleSloped = Algebra.ConvertBasis(basicAngle, 180);
      expect(basicAngleSloped.angle).toBe(158);
      expect(basicAngleSloped.basis).toBe(180);
    }
  });

  test('Angle Conversion equasion...', () => {
    let axisAngle = 23;
    let degreeMarkBBorder = -167;
    let boundaryTotoFromAngleB0 = 61;
    let totalAngleB0 = NormalizeWithinPeriod(axisAngle + degreeMarkBBorder + boundaryTotoFromAngleB0);
    let totalAngleCB0 = NormalizeWithinPeriod(new CAngle(axisAngle + degreeMarkBBorder, boundaryTotoFromAngleB0).convertBasis().angle);
    // these 2 should be the same....
    // For 2D angles
    // static ConvertBasis(angle1 : CAngle , newBasis : number) {
    //     return new CAngle(angle1.angle - (newBasis - angle1.basis), newBasis);
    //   }
  });

  test('Angle Normalization', () => {
    expect(NormalizeWithinPeriod(-360, -180, 180)).toBe(0);
    expect(NormalizeWithinPeriod(36, -180, 180)).toBe(36);
    expect(NormalizeWithinPeriod(-350 + 160, -180, 180)).toBe(170);
    expect(NormalizeWithinPeriod(361, -180, 180)).toBe(1);
    expect(NormalizeWithinPeriod(-361, -180, 180)).toBe(-1);
    expect(NormalizeWithinPeriod(181, -180, 180)).toBe(-179);
    expect(NormalizeWithinPeriod(180, -180, 180)).toBe(180);
    expect(NormalizeWithinPeriod(-180, -180, 180)).toBe(-180);
    // Note that NormalizeWithinPeriod doesn't quite differentiate between the 2 ends of the period.
    expect(NormalizeWithinPeriod(720, -360, 0)).toBe(-360);
    expect(NormalizeWithinPeriod(360, -360, 0)).toBe(-360);
    expect(NormalizeWithinPeriod(-720, -360, 0)).toBe(-360);
    expect(NormalizeWithinPeriod(0, -180, 180)).toBe(0);
    expect(NormalizeWithinPeriod(160, -180, 180)).toBe(160);
    expect(NormalizeWithinPeriod(360 + 160, -180, 180)).toBe(160);
    expect(NormalizeWithinPeriod(350 + 160, -180, 180)).toBe(150);
  });
  test("Angle Difference for 180 degrees", () => {
    expect(AngleDiff(-120, 60, -180, 180)).toBe(-180);
    expect(AngleDiff(240, 60, -180, 180)).toBe(-180);
    expect(AngleDiff(60, -120, -180, 180)).toBe(180);
    expect(AngleDiff(60, -480, -180, 180)).toBe(180);
// hmm???? see 240, 60 == -180.
    // got some errosr here that needs to be fixed.
    expect(AngleDiff(239, 60, -180, 180)).toBe(179);
    expect(AngleDiff(59, -480, -180, 180)).toBe(179);
  });
  test("Angle Difference", () => {
    expect(AngleDiff(-20, 60, -180, 180)).toBe(-80);
    expect(AngleDiff(-220, 60, -180, 180)).toBe(80);
    expect(AngleDiff(-0, 180, -180, 180)).toBe(-180);
    expect(AngleDiff(-0, 360, -180, 180)).toBe(-0);

    expect(AngleDiff(-20, 320, 0, 360)).toBe(20); // Distance when drawn around the circle in quadrant, is this
    expect(AngleDiff(-20, 320, -180, 180)).toBe(20);

    expect(AngleDiff(-20, -40, -180, 180)).toBe(20);
    // Big to small = difference is +
    expect(AngleDiff(40, 80, -180, 180)).toBe(-40);
    expect(AngleDiff(80, 40, -180, 180)).toBe(40);

    expect(AngleDiff(-40, 180, -180, 180)).toBe(140);
  });

  test("Dot Products", () => {
    {
      let a = {
        x: 1,
        y: 2
      };
      let b = {
        x: -2,
        y: -4
      };
      let dotResult = C_DOT(a, b);
      expect(dotResult).toBe(-10);
    }
    {
      let a = {
        x: 1,
        y: 2,
        z: 2.3
      };
      let b = {
        x: -2,
        y: -4,
        z: 8.9
      };
      let dotResult = C_DOT(a, b);
      expect(dotResult).toBeCloseTo(10.47, 3);
    }
  });
  test("Cross Products", () => {
    {
      let a = {
        x: 1.5,
        y: 2
      };
      let b = {
        x: -2,
        y: -4
      };
      let crossResult = C_CROSS(a, b);
      expect(crossResult).toBe(1.5 * -4 - 2 * -2);
    }
    {
      let a = {
        x: 1,
        y: 2,
        z: 2.3
      };
      let b = {
        x: -2,
        y: -4,
        z: 8.9
      };
      let crossProduct = C_CROSS(a, b);
      expect(crossProduct).toStrictEqual(new D_Point(27, -13.5, 0));
    }
  });
});