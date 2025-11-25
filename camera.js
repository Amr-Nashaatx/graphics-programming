import { Point, Vector } from "./math";
/**
 *
 * @param {Point} eye
 * @param {Point} target
 * @param {Vector} worldUp
 * @returns {object{Vector, vector, vector}}
 */
function buildCameraBasis(eye, target, worldUp = new Vector(0, 1, 0)) {
  const forward = target.subtract(eye).normalize(); // e.g., look direction
  let right = forward.cross(worldUp).normalize();
  // handle degenerate case when forward nearly parallel to worldUp
  if (right.magnitude() === 0) {
    // Choose a different up (if forward ~ worldUp), e.g. use (1,0,0)
    right = forward.cross(new Vector(1, 0, 0)).normalize();
  }
  const up = right.cross(forward).normalize();
  return { right, up, forward };
}
