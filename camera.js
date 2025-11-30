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

    // Default orientation: looking toward +Z
    this.forward = new Vector(0, 0, 1);
    this.up = new Vector(0, 1, 0);
    this.right = new Vector(1, 0, 0);

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
    this.forward = this.position.getDisplacementVectorTo(target).normalize();
    this.right = up.cross(this.forward).normalize();
    this.up = this.forward.cross(this.right).normalize();
  }

  updateFromEuler() {
    const cosYaw = Math.cos(this.yaw);
    const sinYaw = Math.sin(this.yaw);
    const cosPitch = Math.cos(this.pitch);
    const sinPitch = Math.sin(this.pitch);

    this.forward = new Vector(
      cosYaw * cosPitch,
      sinPitch,
      sinYaw * cosPitch
    ).normalize();

    // Right = forward × worldUp
    this.right = this.forward.cross(up).normalize();

    // Up = right × forward
    this.up = this.right.cross(this.forward).normalize();
  }

  /**
   *
   * @param {Vector} O
   * @param {Vector} right
   * @param {Vector} up
   * @param {Vector} forward
   * @returns
   */

  createInverseViewMatrix() {
    const O = this.position;
    const r = this.right;
    const u = this.up;
    const f = this.forward;
    return new Matrix4([
      r.x,
      r.y,
      r.z,
      0,
      u.x,
      u.y,
      u.z,
      0,
      f.x,
      f.y,
      f.z,
      0,
      O.x,
      O.y,
      O.z,
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
