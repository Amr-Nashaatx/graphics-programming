import { closestIntersection, reflect } from "./math/functions.js";
import { BACKGROUND_COLOR } from "./constants.js";
import { LightSource } from "./light/lightSource.js";
import { LightingComputer } from "./light/lightComputer.js";
import { Vector } from "./math/vector.js";
/**
 * Raytracer class that traces a ray from camera through viewport and returns the color of the first object hit. lighting calculations is included as well.
 *
 */
export class Raytracer {
  /**
   * @param {object[]} objects - Array of objects with which the ray intersects
   * @param {LightSource[]} lights - Array of lights in the scene
   */
  constructor(objects, lights) {
    this.objects = objects;
    this.lights = lights;
    this.lightingComputer = new LightingComputer(objects, lights);
  }
  /**
   * Trace a ray from camera through viewport and returns the color of the first object hit. lighting calculations is included as well.
   * @param {Point} S - Starting point of the ray
   * @param {Vector} D - Ray direction vector
   * @param {number} tMin - minimum point in the ray after which we start capturing colors the ray passes through
   * @param {number} tMax - Maximum point in the ray after which we stop capturing any intersections
   * @param {number} recursionDepth - Recursion depth
   * @returns {Color}
   */
  traceRay(S, D, tMin = 1, tMax = Infinity, recursionDepth = 3) {
    const { closestSphere, closestT, Dobj, Oobj } = closestIntersection(
      S,
      D,
      tMin,
      tMax,
      this.objects
    );

    if (!closestSphere) return BACKGROUND_COLOR;
    // Transform ray origin and direction to world space

    const Pobj = Oobj.addVector(Dobj.scale(closestT)); // hitpoint in object space

    const P = closestSphere.modelMatrix.multiplyPoint(Pobj); //hitpoint in world space
    let Nobj = new Vector(Pobj.x, Pobj.y, Pobj.z).normalize(); // normal in object space

    // Compute normal in world space Nworld​=normalize((M−1)T⋅Nobj​)
    const N = closestSphere.invModelMatrix.transpose().multiplyVector(Nobj);

    // V  is a vector that points from the object to the camera(the viewer).
    // but D (ray vector) points from the camera to the object
    // hence in this case V = - D

    let V = D.scale(-1);

    const intensity = this.lightingComputer.computeLighting(
      P,
      N,
      V,
      closestSphere.specular
    );
    const localColor = closestSphere.color.scale(intensity);

    // If we hit the recursion limit or the object is not reflective, we're done
    const r = closestSphere.reflective;
    if (recursionDepth <= 0 || r <= 0) {
      return localColor;
    }

    // Compute the reflected color
    // The direction of the reflected ray is the direction of the incoming ray bouncing off P.
    //  in traceRay() we have D , the direction of the incoming ray towards P, we want the reflected ray pointing out of the surface.
    // so we first flip the direction of D (-D) which means the ray outgoing from P then we reflect it with respect to N

    const R = reflect(D.scale(-1), N).normalize();
    const reflectedColor = this.traceRay(
      P,
      R,
      0.001,
      Infinity,
      recursionDepth - 1
    );
    return localColor.scale(1 - r).add(reflectedColor.scale(r));
  }
}
