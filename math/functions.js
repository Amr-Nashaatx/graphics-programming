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
 * @param {Sphere} sphere Sphere with which the ray intersects
 * @return {Vector[]} Two points of intersection
 */
export function IntersectRaySphere(S, D, sphere) {
  const r = sphere.radius;
  const CO = S.getDisplacementVectorTo(sphere.center);

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
 * @param {Vector} P - Starting position of the ray
 * @param {Vector} D - Ray direction vector
 * @param {number} tMin - minimum point in the ray after which we start capturing colors the ray passes through
 * @param {number} tMax - Maximum point in the ray after which we stop capturing any intersections
 * @param {object[]} objects - Array of objects with which the ray intersects
 * @returns {[Sphere, number]}
 */
export function closestIntersection(P, D, tMin = 1, tMax = Infinity, objects) {
  let closestT = Infinity;
  let closestSphere = null;
  for (let object of objects) {
    const [t1, t2] = IntersectRaySphere(P, D, object);
    const isTinRange = (t) => t >= tMin && t <= tMax;
    if (isTinRange(t1) && t1 < closestT) {
      closestT = t1;
      closestSphere = object;
    }
    if (isTinRange(t2) && t2 < closestT) {
      closestT = t2;
      closestSphere = object;
    }
  }
  return [closestSphere, closestT];
}
