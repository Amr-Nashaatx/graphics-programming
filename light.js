import { Point, Vector } from "./math.js";

/**
 * Base class that represents a light intensity or ambient light
 */
export class Light {
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
  }
}

/**
 * Represents a point light
 */
export class PointLight extends Light {
  /**
   * @param {number} [intensity=0] - The instensity of the light.
   * @param {Point} - the point light position
   */
  constructor(intensity, position) {
    super(intensity);
    /**
     *  @type {Point}
     */
    this.position = position;
  }
}

/**
 * Represents a directional light
 */
export class DirectionalLight extends Light {
  /**
   * @param {number} [intensity=0] - The instensity of the light.
   * @param {Vector} - The direction on the directional light
   */
  constructor(intensity, direction) {
    super(intensity);
    /**
     *  @type {Vector}
     */
    this.direction = direction;
  }
}
