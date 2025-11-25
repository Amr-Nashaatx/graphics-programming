import { Color } from "./canvas.js";
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

// Semantic alias: use Point when the value semantically represents a position.
export const Point = Vector; // simple alias for clarity in code; adopt in usage

/**
 *
 * @param {Vector} D - Incident ray
 * @param {Vector} N - Surface normal at that point
 * @returns {Vector} - Reflected ray around the normal
 */
export function reflect(D, N) {
  // r = D - 2*(D·N)*N
  // const dDotN = D.dot(N);
  // return D.subtract(N.scale(2 * dDotN));
  return N.scale(2 * N.dot(D)).subtract(D);
}

/**
 * Defines a sphere in 3D space
 */
export class Sphere {
  /**
   * Create a point.
   * @param {Vector}  - Center point of the sphere
   * @param {number} [radius=1] - Radius of the sphere
   * @param {Color}  - Diffuse color of the sphere
   */
  constructor(center, radius, color) {
    this.center = center;
    this.radius = radius;
    this.color = color;
    this.specular = -1;
    this.reflective = 0;
  }
  /**
   *
   * @param {s} specular - The specular exponent
   * @returns {Sphere}
   */
  addSpecularity(specular) {
    this.specular = specular;
    return this;
  }

  addReflectiveness(reflective) {
    this.reflective = reflective;
    return this;
  }
}

/**
 *
 * @param {Vector} O Starting point of ray
 * @param {Vector} D Ray direction vector
 * @param {Sphere} sphere Sphere with which the ray intersects
 * @return {Vector[]} Two points of intersection
 */
export function IntersectRaySphere(O, D, sphere) {
  const r = sphere.radius;
  const CO = O.subtract(sphere.center);

  // By Solving the both the ray equation and the sphere equation, we get this quadratic formula
  // t^2 (D . D) + 2t (CO . D) + (CO . CO) - r^2 = 0 which we solve in this function

  const a = D.dot(D);
  const b = 2 * CO.dot(D);
  const c = CO.dot(CO) - r * r;

  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) return [Infinity, Infinity];

  const sqrtDisc = Math.sqrt(discriminant);
  const root1 = (-b + sqrtDisc) / (2 * a);
  const root2 = (-b - sqrtDisc) / (2 * a);

  return [root1, root2];
}
