/**
 * Represents or vector in 3D space.
 */
export class Vector {
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
    this.w = 0;
  }
  /**
   *
   * @param {Vector} v
   * @return {Vector}
   */
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  }
  /**
   *
   * @param {Vector} v
   * @return {Vector}
   */
  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
  }
  /**
   *
   * @param {number} s
   * @return {Vector}
   */
  scale(s) {
    return new Vector(this.x * s, this.y * s, this.z * s);
  }
  /**
   *
   * @param {Vector} v
   * @return {number}
   */
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  /**
   *
   * @param {Vector} u
   * @param {number} theta
   * @return {Vector}
   */
  rotateVectorAroundAxis(u, theta) {
    const v = this;
    // Make sure axis u is normalized
    const axis = u.normalize();

    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    // term1 = v cosθ
    const term1 = v.scale(cos);

    // term2 = (u × v) sinθ
    const term2 = axis.cross(v).scale(sin);

    // term3 = u (u · v) (1 - cosθ)
    const term3 = axis.scale(axis.dot(v) * (1 - cos));

    return term1.add(term2).add(term3);
  }

  /**
   *
   * @param {Vector} v
   * @return {Vector}
   */
  cross(v) {
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }
  /**
   *
   * @return {number}
   */
  magnitude() {
    return Math.sqrt(this.dot(this));
  }
  /**
   *
   * @return {Vector}
   */
  normalize() {
    const m = this.magnitude();
    return m === 0 ? new Vector(0, 0, 0) : this.scale(1 / m);
  }
  // keep any other helpers you had (e.g., distanceTo, clone)
}
