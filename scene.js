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
     * @type {Camera}
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

        // transform ray direction from camera -> world space
        const D = this.camera.cameraWorld.multiplyVector(Vp).normalize();

        // Get camera position from which we shoot rays
        const translation = this.camera.getTranslationVector();
        const cameraPosition = new Point(
          translation.x,
          translation.y,
          translation.z
        );
        // trace the ray
        const color = this.raytracer.traceRay(cameraPosition, D);
        this.canvas.putPixel(
          this.canvas.convertToScreenCoordinates(currentPixel),
          color
        );
      }
    }

    this.canvas.updateCanvas();
  }
}
