import { closestIntersection, reflect } from "../math/functions.js";
import { Point } from "../math/point.js";
import { Vector } from "../math/vector.js";
import { DirectionalLightSource } from "./lightSource.js";

export class LightingComputer {
  /**
   * @param {object[]} objects - Array of objects with which the ray intersects
   * @param {LightSource[]} lights - Array of lights in the scene
   */
  constructor(objects, lights) {
    this.objects = objects;
    this.lights = lights;
  }
  /**
   *
   * @param {Point} P - Point to compute the light at
   * @param {Vector} N - Normal of surface at that point
   * @param {Vector} V - Viewer vector
   * @param {Vector} s - Specular exponent
   */
  computeLighting(P, N, V, s) {
    let i = 0;
    let L;
    for (let light of this.lights) {
      L = light.getLightDirectionFromPoint(P);
      if (!L) {
        i += light.intensity;
        continue;
      }
      if (this.isInShadow(P, L, light.getShadowMaxDistance(P))) {
        continue;
      }
      i += this.computeDiffuse(light, N, L);
      if (!(s === -1)) {
        i += this.computeSpecular(light, N, L, V, s);
      }
    }
    return i;
  }
  isInShadow(P, L, maxDistance) {
    // shadow check ---> Send ray from the point P in the direction of light L.
    //  if the it hits an object it means this point is in shadow of that object hence we ignore lighting computation for that point
    const { closestSphere: shadowObject } = closestIntersection(
      P,
      L,
      0.001,
      maxDistance,
      this.objects
    );
    if (shadowObject) {
      return true;
    }
    return false;
  }
  computeDiffuse(light, N, L) {
    const nDotL = N.dot(L);
    if (nDotL > 0) {
      return light.intensity * (nDotL / (N.magnitude() * L.magnitude()));
    }
    return 0;
  }
  computeSpecular(light, N, L, V, s) {
    const R = reflect(L, N).normalize(); // reflected ray
    const RdotV = R.dot(V);
    if (RdotV > 0) {
      return (
        light.intensity * Math.pow(RdotV / (R.magnitude() * V.magnitude()), s)
      );
    }
    return 0;
  }
}
