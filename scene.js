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
    for (let x = -CANVAS_WIDTH / 2; x < CANVAS_WIDTH / 2; x++) {
      for (let y = -CANVAS_HEIGHT / 2; y < CANVAS_HEIGHT / 2; y++) {
        // Pixel in canvas-space
        const currentPixel = new Vector(x, y, 0);
        // convert canvas coordinate to viewport coordinate
        // (This gives a local camera-space vector: Vp = (vx, vy, vz))
        const Vp = this.canvas.canvasToViewPort(currentPixel);

        if (x === 0 && y === 0) {
          let u = new Vector(0, 1, 0);
          let r = new Vector(1, 0, 0).rotateVectorAroundAxis(u, Math.PI / 2);
          console.log(r);
        }

        // construct ray direction using the camera basis
        // D = vx*right + vy*up + vz*forward
        const D = this.camera.orientationMatrix.multiplyVector(Vp);

        // trace the ray
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
