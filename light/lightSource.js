import { Point } from "../math/point.js";
import { Vector } from "../math/vector.js";

/**
 * Base class that represents a light intensity or ambient light
 */
export class LightSource {
  /**
   * Create a point light.
   * @param {number} [intensity=0] - The instensity of the light.
   */
  constructor(intensity) {
    /**
     * Create a point.
     * @type {number}
     */
    this.intensity = intensity;
    this.scanDistanceForShadow = 0;
  }
  getLightDirectionFromPoint(point) {
    return null;
  }
  getShadowMaxDistance(point) {
    return null;
  }
}

/**
 * Represents a point light
 */
export class PointLightSource extends LightSource {
  /**
   * @param {number} [intensity=0] - The instensity of the light.
   * @param {Point} position - the point light position
   */
  constructor(intensity, position) {
    super(intensity);
    /**
     * @type {Point}
     */
    this.position = position;
    this.scanDistanceForShadow = 1;
  }
  getLightDirectionFromPoint(point) {
    return this.position.getDisplacementVectorTo(point).scale(-1).normalize();
  }
  getShadowMaxDistance(point) {
    return this.getLightDirectionFromPoint(point).magnitude();
  }
}

/**
 * Represents a directional light
 */
export class DirectionalLightSource extends LightSource {
  /**
   * @param {number} [intensity=0] - The instensity of the light.
   * @param {Vector} direction - The direction on the directional light
   */
  constructor(intensity, direction) {
    super(intensity);
    /**
     * @type {Vector}
     */
    this.direction = direction;
    this.scanDistanceForShadow = Infinity;
  }
  getLightDirectionFromPoint(point) {
    return this.direction;
  }
  getShadowMaxDistance(point) {
    return Infinity;
  }
}
