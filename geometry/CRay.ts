import {R_Canvas} from "../canvas/canvas";
import * as THREE from 'three'
import {C_DOT, Polar2Cartesian, RAD2DEG} from "../functions/algebra";
import {Boundary} from "./Boundary";
import {MapStatic} from "../../scantraverse/map";

interface Drawable {
  draw(renderContext : R_Canvas) : void;
}

class CRay {
  private pos: THREE.Vector2;
  // For reference only
  private radians : number;
  public direction: THREE.Vector2;
  // This is a circle of lines around ray -- if disabled, the rays will be 'invisible'
  public drawDebug: boolean;


  constructor(pos : THREE.Vector2 = new THREE.Vector2(0, 0), radians : number = 1) {
    this.pos = pos;
    this.radians = radians;
    let relativeDirection = Polar2Cartesian(1, radians);
    this.direction = new THREE.Vector2(relativeDirection.x, relativeDirection.y);
    this.drawDebug = true;
    // this.direction = new THREE.Vector2(0,1);
    // this.direction = new THREE.Vector2(0,-1);
  }

  toString() {
    return (`${(RAD2DEG * this.radians).toFixed(1)}°`);
  }

  setPos(pos: THREE.Vector2) {
    this.pos = pos;
  }
  getPos() {
    return this.pos;
  }

  setDirection(dir: THREE.Vector2) {
    this.direction = dir;
  }

  pointTowards(dir: THREE.Vector2) {
    this.direction.x = dir.x - this.pos.x;
    this.direction.y = dir.y - this.pos.y;
  }

  draw(canvas : R_Canvas) {
    if (this.drawDebug) {
      canvas.carrow(this.pos, this.direction, 100);
    }
  }

  // overload??/
  castObject(obj : MapStatic) {

  }


  // Line line collision?
  // if cast successful, draw a circle at the section.
  cast(boundary : Boundary) {
    const x1 = boundary.points[0].x;
    const y1 = boundary.points[0].y;
    const x2 = boundary.points[1].x;
    const y2 = boundary.points[1].y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.direction.x;
    const y4 = this.pos.y + this.direction.y;

    const div = (x1 - x2) * (y3 - y4) - ((y1 - y2) * (x3 - x4));
    if (div == 0) return null;
    //

    const tNum = (x1 - x3) * (y3 - y4) - ((y1 - y3) * (x3 - x4));
    const t = tNum / div;
    const uNum = -1 * ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3));
    const u = uNum / div;

    if (t > 0 && t < 1 && u > 0) {
      // Collision vector
      let intersected = new THREE.Vector2();
      intersected.x = x1 + t * (x2 - x1);
      intersected.y = y1 + t * (y2 - y1);
      return intersected;
      // return true;
    }
    return null;
  }
}

export {
  CRay,
  Drawable
}