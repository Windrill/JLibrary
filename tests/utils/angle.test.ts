import {NormalizeWithinPeriod} from "../../angle/normalization";
import {Algebra, C_CROSS, C_DOT, CAngle} from "../../functions/algebra";
import {D_Point} from "../../functions/structures";

let diffBtwnAngles = (angle1: number, angle2: number, from: number, to: number) => {
  let normalized1 = NormalizeWithinPeriod(angle1, from, to);
  let normalized2 = NormalizeWithinPeriod(angle2, from, to);
  let normalized = NormalizeWithinPeriod(normalized1 - normalized2, from, to);
  // console.log(normalized, (to - from) - normalized);
  return Math.min(normalized, (to - from) - normalized);
}
describe('Angle Tests', () => {

  test('Look at angle and intersection representations', () => {
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

  test('Angle Normalization', () => {
    expect(NormalizeWithinPeriod(-360, -180, 180) == 0);
    expect(NormalizeWithinPeriod(36, -180, 180) == 36);
    expect(NormalizeWithinPeriod(160, -180, 180) == 160);
    expect(NormalizeWithinPeriod(360 + 160, -180, 180) == 160);
    expect(NormalizeWithinPeriod(350 + 160, -180, 180) == 150);
// console.log(
//   normalizeWithinPeriod(-350+160, -180, 180)); // 36
// console.log(
//   normalizeWithinPeriod(361, -180, 180)); // 1
// console.log(
//   normalizeWithinPeriod(-361, -180, 180)); // -1
// console.log(
//   normalizeWithinPeriod(-180, -180, 180)); // -180
// console.log(
//   normalizeWithinPeriod(997, -180, 180)); // -180
// console.log(
//   normalizeWithinPeriod(0, -180, 180));
// console.log(
//   normalizeWithinPeriod(180, -180, 180));
// console.log(
//   normalizeWithinPeriod(181, -180, 180));
// console.log(
//   normalizeWithinPeriod(720, -360, 0));
// console.log(
//   normalizeWithinPeriod(-720, -360, 0));
  });

  test("Angle Difference", () => {
    expect(diffBtwnAngles(-20, 60, -180, 180) == -80);
    expect(diffBtwnAngles(-120, 60, -180, 180) == -180);
    expect(diffBtwnAngles(-220, 60, -180, 180) == 80);
    expect(diffBtwnAngles(-0, 180, -180, 180) == -180);
    expect(diffBtwnAngles(-0, 360, -180, 180) == 0);
    expect(diffBtwnAngles(-20, 320, -180, 180) == -60);
    expect(diffBtwnAngles(-20, 360, -180, 180) == -20);
    expect(diffBtwnAngles(-20, -40, -180, 180) == -20);
    expect(diffBtwnAngles(40, 80, -180, 180) == -40);
    expect(diffBtwnAngles(-40, 180, -180, 180) == 140);
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