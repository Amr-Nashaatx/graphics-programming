import { Canvas, Color } from "./canvas.js";
import { BACKGROUND_COLOR, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { DirectionalLight, Light, PointLight } from "./light.js";
import { IntersectRaySphere, Vector } from "./math.js";

/**
 * Represents a 3D scene containing objects, lights, and a camera.
 */
export class Scene {
  /**
   *  @param {Vector} O - Camera position in the scene
   */
  constructor(O) {
    /**
     *   @type {object[]}
     */
    this.objects = [];
    /**
     *   @type {Light[]}
     */
    this.lights = [];
    /**
     *   @type {Canvas}
     */
    this.canvas = new Canvas();

    /**
     * @type {Vector}
     */
    this.O = O;
  }

  /**
   * Add an object to the scene.
   * @param {object} obj - The object to add.
   */
  addObject(obj) {
    this.objects.push(obj);
  }
  /**
   * Adds Light to the scene
   * @param {Light} light
   */
  addLight(light) {
    this.lights.push(light);
  }
  /**
   *  Draw an image of the current scene
   *  @return {void}
   */

  render() {
    for (let x = -CANVAS_WIDTH / 2; x < CANVAS_WIDTH / 2; x++) {
      for (let y = -CANVAS_HEIGHT / 2; y < CANVAS_HEIGHT / 2; y++) {
        const currentPixel = new Vector(x, y, 0);
        const D = this.canvas.canvasToViewPort(currentPixel).normalize(); // Ray direction vector
        const color = this.traceRay(D);
        this.canvas.putPixel(
          this.canvas.convertToScreenCoordinates(currentPixel),
          color
        );
      }
    }
    this.canvas.updateCanvas();
  }
  /**
   * computes the intersection of the ray with every sphere and returns the color of the sphere at the nearest intersection
   *  inside the requested range of t
   * @param {Vector} D - Ray direction vector
   * @param {number} tMin - minimum point in the ray after which we start capturing colors the ray passes through
   * @param {number} tMax - Maximum point in the ray after which we stop capturing any intersections
   * @returns {Color}
   */
  traceRay(D, tMin = 1, tMax = Infinity) {
    let closestT = Infinity;
    let closestSphere = null;
    let O = this.O;
    for (let sphere of this.objects) {
      const [t1, t2] = IntersectRaySphere(O, D, sphere);
      if (t1 >= tMin && t1 <= tMax && t1 < closestT) {
        closestT = t1;
        closestSphere = sphere;
      }
      if (t2 >= tMin && t2 <= tMax && t2 < closestT) {
        closestT = t2;
        closestSphere = sphere;
      }
    }

    if (!closestSphere) return BACKGROUND_COLOR;
    const P = this.O.add(D.scale(closestT)); //compute the point on the sphere
    let N = P.subtract(closestSphere.center).normalize(); // compute the normal

    // V  is a vector that points from the object to the camera(the viewer).
    // but D (ray vector) points from the camera to the object
    // hence in this case V = - D

    let V = D.scale(-1);

    const intensity = this.computeLighting(P, N, V, closestSphere.specular);
    return closestSphere.color.scale(intensity);
  }
  /**
   *
   * @param {Vector} P - Point to compute the light at
   * @param {Vector} N - Normal of surface at that point
   * @param {Vector} V - Viewer vector
   * @param {Vector} s - Specular exponent
   */
  computeLighting(P, N, V, s) {
    let i = 0;
    let L;
    for (let light of this.lights) {
      if (light.constructor === Light) {
        //ambient light
        i += light.intensity;
      } else {
        if (light.constructor === PointLight) {
          L = light.position.subtract(P); // ray direction
        } else if (light.constructor === DirectionalLight) {
          L = light.direction;
        }
        // diffuse
        const nDotL = N.dotProduct(L);
        if (nDotL > 0) {
          i += light.intensity * (nDotL / (N.magnitude() * L.magnitude()));
        }
        // specular
        if (!(s === -1)) {
          const R = N.scale(2 * N.dotProduct(L)).subtract(L); // R reflected ray vector
          const RdotV = R.dotProduct(V);
          if (RdotV > 0) {
            i +=
              light.intensity *
              Math.pow(RdotV / (R.magnitude() * V.magnitude()), s);
          }
        }
      }
    }

    return i;
  }
}
