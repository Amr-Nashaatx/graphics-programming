import { Matrix4 } from "./math/matrix4.js";
import { Point } from "./math/point.js";
import { Vector } from "./math/vector.js";
/**
 *
 * @param {Point} eye
 * @param {Point} target
 * @param {Vector} worldUp
 * @returns {object{Vector, vector, vector}}
 */

export class Camera {
  constructor(position = new Point(0, 0, 0)) {
    this.position = position;

    this.orientationMatrix = Matrix4.identity();

    // For smooth movement/rotation
    this.yaw = 0; // left-right rotation
    this.pitch = 0; // up-down rotation
    this.roll = 0; // tilt
  }

  /**
   *
   * @param {Point} target - target point to look at.
   * @param {Vector} up - the up direction of the camera
   */
  lookAt(target, up = new Vector(0, 1, 0)) {
    const forward = this.position.getDisplacementVectorTo(target).normalize(); // Vector from camera to target
    const right = up.cross(forward).normalize(); // Right vector is perpendicular to world up and forward
    const cameraUp = forward.cross(right).normalize(); // Camera's actual up vector

    this.forward = forward;
    this.right = right;
    this.up = cameraUp;

    // Construct the orientation matrix (camera's world transformation)
    // The columns of the matrix are the right, up, and forward vectors, and the position.
    // This matrix transforms from camera space to world space.
    this.orientationMatrix = new Matrix4([
      right.x,
      cameraUp.x,
      forward.x,
      this.position.x,
      right.y,
      cameraUp.y,
      forward.y,
      this.position.y,
      right.z,
      cameraUp.z,
      forward.z,
      this.position.z,
      0,
      0,
      0,
      1,
    ]);
  }

  /**
   *
   * @param {Vector} O
   * @param {Vector} right
   * @param {Vector} up
   * @param {Vector} forward
   * @returns
   */
  createViewMatrix() {
    // NOTE: ADD f column to -f
    const O = this.position;
    const r = this.right;
    const u = this.up;
    const f = this.forward;
    return new Matrix4([
      r.x,
      u.x,
      f.x,
      0,
      r.y,
      u.y,
      f.y,
      0,
      r.z,
      u.z,
      f.z,
      0,
      -r.dot(O),
      -u.dot(O),
      -f.dot(O),
      1,
    ]);
  }
}
