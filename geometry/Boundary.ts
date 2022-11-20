import * as THREE from 'three'
import {R_Canvas} from "../canvas/canvas";
import {ORG2} from "../r_three";
import {C_CROSS} from "../functions/algebra";

class CObject {
  public name : string
  constructor() {
    this.name = "";
  }
}
// jlibrary->rthree
// why boundary is separate from ray??
// totally a static object, no la it's just the static thing that a ray casts against, boundaries
// done't need to cast anything they're the objects inside a map, so always use this
class Boundary extends CObject{
  points : THREE.Vector2[];
  constructor(p1 = ORG2, p2 = ORG2) {
    super();
    this.points = [p1, p2];
  }

  set(x: THREE.Vector2, y: THREE.Vector2) {
    this.points = [x, y];
  }

  draw(canvas : R_Canvas) {
    canvas.cline(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y, {
      fillStyle: "#167a7a",
      lineWidth: 8,
      debug: false
    });
  }

  getDirection() {
    return this.points[1].clone().sub(this.points[0]);
  }

  getOppoDirection() {
    return this.points[0].clone().sub(this.points[1]);
  }

  getNormal() {
    return C_CROSS(this.points[0], this.points[1]);
  }

  toString() {
    return `(${this.points[0].x},${this.points[0].y})  -> (${this.points[1].x},${this.points[1].y})`;
  }
}

class Plane {

  draw() {

  }
}

export {
  Boundary
}