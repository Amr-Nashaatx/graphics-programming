import { Canvas, Color } from "./canvas.js";
import { BACKGROUND_COLOR, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { DirectionalLight, Light, PointLight } from "./light.js";
import { IntersectRaySphere, Vector, reflect } from "./math.js";

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
    // STEP 0 — Define the (currently fixed) camera basis.
    // Right now, your camera is at origin looking +Z with world-up +Y.
    // This is an identity orthonormal basis, but we write it explicitly:
    const forward = new Vector(0, 0, 1); // camera looks along +Z
    const right = new Vector(1, 0, 0); // camera right = +X
    const up = new Vector(0, 1, 0); // camera up = +Y

    for (let x = -CANVAS_WIDTH / 2; x < CANVAS_WIDTH / 2; x++) {
      for (let y = -CANVAS_HEIGHT / 2; y < CANVAS_HEIGHT / 2; y++) {
        // Pixel in canvas-space
        const currentPixel = new Vector(x, y, 0);

        // STEP 1 — convert canvas coordinate to viewport coordinate
        // (This gives a local camera-space vector: Vp = (vx, vy, vz))
        const Vp = this.canvas.canvasToViewPort(currentPixel);

        // STEP 2 — construct ray direction using the camera basis
        // D = vx*right + vy*up + vz*forward
        let D = right
          .scale(Vp.x)
          .add(up.scale(Vp.y))
          .add(forward.scale(Vp.z))
          .normalize();

        // STEP 3 — trace the ray
        const color = this.traceRay(this.O, D);
        this.canvas.putPixel(
          this.canvas.convertToScreenCoordinates(currentPixel),
          color
        );
      }
    }

    this.canvas.updateCanvas();
  }

  /**
   *  Trace a ray from camera through viewport and returns the color of the first object hit. lighting calculations is included as well.
   * @param {Vector} D - Ray direction vector
   * @param {number} tMin - minimum point in the ray after which we start capturing colors the ray passes through
   * @param {number} tMax - Maximum point in the ray after which we stop capturing any intersections
   * @returns {Color}
   */
  traceRay(S, D, tMin = 1, tMax = Infinity, recursionDepth = 3) {
    const [closestSphere, closestT] = this.closestIntersection(
      S,
      D,
      tMin,
      tMax
    );

    if (!closestSphere) return BACKGROUND_COLOR;
    const P = S.add(D.scale(closestT)); //compute the point on the sphere
    let N = P.subtract(closestSphere.center).normalize(); // compute the normal

    // V  is a vector that points from the object to the camera(the viewer).
    // but D (ray vector) points from the camera to the object
    // hence in this case V = - D

    let V = D.scale(-1);

    const intensity = this.computeLighting(P, N, V, closestSphere.specular);
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
  /**
   * computes the intersection of the ray with every sphere and returns the color of the sphere at the nearest intersection
   *  inside the requested range of t
   * @param {Vector} P - Starting position of the ray
   * @param {Vector} D - Ray direction vector
   * @param {number} tMin - minimum point in the ray after which we start capturing colors the ray passes through
   * @param {number} tMax - Maximum point in the ray after which we stop capturing any intersections
   * @returns {[Sphere, number]}
   */
  closestIntersection(P, D, tMin = 1, tMax = Infinity) {
    let closestT = Infinity;
    let closestSphere = null;
    for (let sphere of this.objects) {
      const [t1, t2] = IntersectRaySphere(P, D, sphere);
      const isTinRange = (t) => t >= tMin && t <= tMax;
      if (isTinRange(t1) && t1 < closestT) {
        closestT = t1;
        closestSphere = sphere;
      }
      if (isTinRange(t2) && t2 < closestT) {
        closestT = t2;
        closestSphere = sphere;
      }
    }
    return [closestSphere, closestT];
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
        let tMax = 0;
        if (light.constructor === PointLight) {
          L = light.position.subtract(P).normalize(); // ray direction
          tMax = 1;
        } else if (light.constructor === DirectionalLight) {
          L = light.direction.normalize();
          tMax = Infinity;
        }
        // shadow check ---> Send ray from the point P in the direction of light L.
        //  if the it hits an object it means this point is in shadow of that object hence we ignore lighting computation for that point
        const [shadowObject, shadowT] = this.closestIntersection(
          P,
          L,
          0.001,
          tMax
        );
        if (shadowObject) {
          continue;
        }
        // diffuse
        const nDotL = N.dot(L);
        if (nDotL > 0) {
          i += light.intensity * (nDotL / (N.magnitude() * L.magnitude()));
        }
        // specular
        if (!(s === -1)) {
          const R = reflect(L, N).normalize(); // reflected ray
          const RdotV = R.dot(V);
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
