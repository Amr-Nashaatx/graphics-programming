import { Point } from "./point.js";
import { Sphere } from "./sphere.js";
import { Vector } from "./vector.js";

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
 *
 * @param {Point} S Starting point of ray
 * @param {Vector} D Ray direction vector
 * @return {Vector[]} Two points of intersection
 */
export function IntersectRaySphere(S, D) {
  const r = 1;
  const CO = S.getDisplacementVectorTo(new Point(0, 0, 0));

  // By Solving the both the ray equation and the sphere equation, we get this quadratic formula
  // t^2 (D . D) + 2t (CO . D) + (CO . CO) - r^2 = 0 which we solve in this function

  const a = D.dot(D);
  const b = -2 * CO.dot(D);
  const c = CO.dot(CO) - r * r;

  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) return [Infinity, Infinity];

  const sqrtDisc = Math.sqrt(discriminant);
  const root1 = (-b + sqrtDisc) / (2 * a);
  const root2 = (-b - sqrtDisc) / (2 * a);

  return [root1, root2];
}

/**
 * computes the intersection of the ray with every sphere and returns the color of the sphere at the nearest intersection
 *  inside the requested range of t
 * @param {Point} O - Starting position of the ray
 * @param {Vector} D - Ray direction vector
 * @param {number} tMin - minimum point in the ray after which we start capturing colors the ray passes through
 * @param {number} tMax - Maximum point in the ray after which we stop capturing any intersections
 * @param {Sphere[]} objects - Array of objects with which the ray intersects
 * @returns {{
 *   closestSphere: Sphere|null,
 *   closestT: Number,
 *   Oobj: Point,
 *   Dobj: Vector
 * }} - An object containing the closest intersected sphere (or null if none), the intersection distance t in object space,
 *  along with initial point and direction of ray in object space.
 */

export function closestIntersection(O, D, tMin = 1, tMax = Infinity, objects) {
  /**@type {Number} */
  let closestT = Infinity;
  /**@type {Sphere} */
  let closestSphere = null;
  /**@type {Point} */
  let closestOobj;
  /**@type {Vector} */
  let closestDobj;
  for (let object of objects) {
    // transform P, D into object space
    const invModelMatrix = object.invModelMatrix;

    const Oobj = invModelMatrix.multiplyPoint(O);
    const Dobj = invModelMatrix.multiplyVector(D);
    // intersect with sphere in object space, where sphere radius = 1 with center at (0, 0 , 0)
    const [t1, t2] = IntersectRaySphere(Oobj, Dobj, object);
    const isTinRange = (t) => t >= tMin && t <= tMax;
    if (isTinRange(t1) && t1 < closestT) {
      closestT = t1;
      closestSphere = object;
      closestDobj = Dobj;
      closestOobj = Oobj;
    }
    if (isTinRange(t2) && t2 < closestT) {
      closestT = t2;
      closestSphere = object;
      closestDobj = Dobj;
      closestOobj = Oobj;
    }
  }
  return { closestSphere, closestT, Oobj: closestOobj, Dobj: closestDobj };
}
