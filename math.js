import { Color } from "./canvas.js";
/**
 * Represents a point or vector in 3D space.
 */
export class Vector {
  /**
   * Create a point.
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
   * @param {Vector} p
   * @return {Vector}
   */
  add(p) {
    return new Vector(this.x + p.x, this.y + p.y, this.z + p.z);
  }
  /**
   *
   * @param {Vector} p
   * @return {Vector}
   */
  subtract(p) {
    return new Vector(this.x - p.x, this.y - p.y, this.z - p.z);
  }
  /**
   *
   * @param {number} multiplier - scale value
   * @return {Vector}
   */
  scale(multiplier) {
    return new Vector(
      this.x * multiplier,
      this.y * multiplier,
      this.z * multiplier
    );
  }
  /**
   *
   * @param {Vector} v
   * @return {number}
   */
  dotProduct(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize() {
    const mag = this.magnitude();
    return this.scale(1 / mag);
  }
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

  const a = D.dotProduct(D);
  const b = 2 * CO.dotProduct(D);
  const c = CO.dotProduct(CO) - r * r;

  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) return [Infinity, Infinity];

  const sqrtDisc = Math.sqrt(discriminant);
  const root1 = (-b + sqrtDisc) / (2 * a);
  const root2 = (-b - sqrtDisc) / (2 * a);

  return [root1, root2];
}

/**
 *
 * @param {Vector} D - Incident ray
 * @param {Vector} N - Surface normal at that point
 * @returns {Vector} - Reflected ray around the normal
 */
export function reflectRay(D, N) {
  return N.scale(2 * N.dotProduct(D)).subtract(D);
}
