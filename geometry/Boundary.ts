import * as THREE from 'three'
import {R_Canvas} from "../canvas/canvas";
import {ORG2} from "../r_three";
import {C_CROSS} from "../functions/algebra";

// jlibrary->rthree
// why boundary is separate from ray??
// totally a static object, no la it's just the static thing that a ray casts against, boundaries
// done't need to cast anything they're the objects inside a map, so always use this
class Boundary {
  points : THREE.Vector2[];
  constructor(p1 = ORG2, p2 = ORG2) {
    this.points = [p1, p2];
  }

  set(x: THREE.Vector2, y: THREE.Vector2) {
    this.points = [x, y];
  }

  draw(canvas : R_Canvas) {
    canvas.cline(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
  }

  getDirection() {
    let subtracted = this.points[1].clone().sub(this.points[0]);
    return subtracted;
  }

  getOppoDirection() {
    let subtracted = this.points[0].clone().sub(this.points[1]);
    return subtracted;
  }

  getNormal() {
    return C_CROSS(this.points[0], this.points[1]);
  }
}

export {
  Boundary
}