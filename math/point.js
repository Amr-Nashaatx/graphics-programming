import { Vector } from "./vector.js";

export class Point {
  /**
   * Create a vector.
   * @param {number} [x=0] - The X coordinate.
   * @param {number} [y=0] - The Y coordinate.
   * @param {number} [z=0] - The Z coordinate.
   */
  constructor(x = 0, y = 0, z = 0) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    /** @type {number} */
    this.z = z;
    this.w = 1;
  }

  /**
   * @param {Vector} v - vector to translate the point
   * @returns {Point} - the new point
   */
  addVector(v) {
    return new Point(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  /**
   * @param {Point} p - point to which we calculate displacement
   * @returns {Vector} - displacement from this point to p.
   */
  getDisplacementVectorTo(p) {
    return new Vector(p.x - this.x, p.y - this.y, p.z - this.z);
  }
}
