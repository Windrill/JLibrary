import * as THREE from 'three'
import {R_Canvas} from "../canvas/canvas";
import {ORG2} from "../r_three";

// jlibrary->rthree
// why boundary is separate from ray??
// totally a static object, no la it's just the static thing that a ray casts against, boundaries
// done't need to cast anything they're the objects inside a map, so always use this
class Boundary {
  points : THREE.Vector2[];
  constructor() {
    this.points = [ORG2, ORG2];
  }

  set(x: THREE.Vector2, y: THREE.Vector2) {
    this.points = [x, y];
  }

  draw(canvas : R_Canvas) {
    canvas.cline(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
  }
}

export {
  Boundary
}