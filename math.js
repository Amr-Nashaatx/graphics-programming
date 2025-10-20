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
   * @param {Vector} v
   * @return {number}
   */
  dotProduct(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
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
  }
}

/**
 *
 * @param {Vector} O Camera position vector
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
  const c = CO.dotProduct(CO) - Math.pow(r, 2);

  const discriminant = Math.pow(b, 2) - 4 * a * c;

  // complex roots case --> no intersection
  if (discriminant < 0)
    return [
      new Vector(Infinity, Infinity, Infinity),
      new Vector(Infinity, Infinity, Infinity),
    ];

  const root1 = ((-b + Math.sqrt(discriminant)) / 2) * a;
  const root2 = ((-b - Math.sqrt(discriminant)) / 2) * a;

  return [root1, root2];
}
