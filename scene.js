import { Canvas } from "./canvas.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";
import { LightSource } from "./light/lightSource.js";
import { Vector } from "./math/vector.js";
import { Point } from "./math/point.js";
import { Camera } from "./camera.js";
import { Raytracer } from "./raytracer.js";
/**
 * Represents a 3D scene containing objects, lights, and a camera.
 */
export class Scene {
  constructor() {
    /**
     *   @type {object[]}
     */
    this.objects = [];
    /**
     *   @type {LightSource[]}
     */
    this.lights = [];
    /**
     *   @type {Canvas}
     */
    this.canvas = new Canvas();

    /**
     * @type {Vector}
     */
    this.camera = new Camera();
    /**
     * @type {Raytracer}
     */
    this.raytracer = new Raytracer(this.objects, this.lights);
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
   * @param {LightSource} light
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
    this.camera.lookAt(new Point(0, 0.2, 1));
    const { forward, right, up } = this.camera;
    console.log("F", forward, "R", right, "U", up);
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
        const color = this.raytracer.traceRay(this.camera.position, D);
        this.canvas.putPixel(
          this.canvas.convertToScreenCoordinates(currentPixel),
          color
        );
      }
    }

    this.canvas.updateCanvas();
  }
}
