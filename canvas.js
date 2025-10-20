import { Vector } from "./math.js";
import {
  VIEWPORT_DISTANCE,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
} from "./constants.js";

/**
 * Represents a color using RGB components.
 */
export class Color {
  /**
   * Create a color.
   * @param {number} [r=0] - Red component (0–255).
   * @param {number} [g=0] - Green component (0–255).
   * @param {number} [b=0] - Blue component (0–255).
   */
  constructor(r = 0, g = 0, b = 0) {
    /** @type {number} */
    this.r = r;
    /** @type {number} */
    this.g = g;
    /** @type {number} */
    this.b = b;
  }
}

export class Canvas {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.image = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.pixels = this.image.data; // RGBA array
  }

  /**
   * Converts coordinates from a centered coordinate system
   * (origin at the screen center, negative to left and bottom)
   * to a screen coordinate system
   * (origin at the top-left corner, all positive values).
   *
   * @param {Vector} p - Position Vector (x, y) in centered space.
   * @returns {Vector}  Converted coordinates (x, y) in screen space.
   */
  convertToScreenCoordinates(p) {
    return new Vector(
      this.canvas.width / 2 + p.x,
      this.canvas.height / 2 - p.y
    );
  }

  /**
   * Takes a point/pixel (x, y) on the canvas and return the corresponding point on the viewport
   * @param {Vector} p - the (x, y) position of pixel on canvas, z value is ignored
   * @returns {Vector}
   */
  canvasToViewPort(p) {
    return new Vector(
      (p.x * VIEWPORT_WIDTH) / this.canvas.width,
      (p.y * VIEWPORT_HEIGHT) / this.canvas.height,
      VIEWPORT_DISTANCE
    );
  }

  /**
   * @returns {void}
   */
  updateCanvas() {
    this.ctx.putImageData(this.image, 0, 0);
  }
  /**
   * Sets the color of a single pixel in the canvas image buffer.
   * @param {Vector} p -  the pixel coordinate (x, y) the z coordinate is ignored
   * @param {Color} c - color repersented in RGB format, where each channel values range is (0 - 255)
   * @returns {void}
   */

  putPixel(p, c) {
    const x = Math.floor(p.x);
    const y = Math.floor(p.y);
    if (x < 0 || x >= this.canvas.width || y < 0 || y >= this.canvas.height)
      return;
    const index = 4 * (y * this.canvas.width + x);
    this.pixels[index] = c.r;
    this.pixels[index + 1] = c.g;
    this.pixels[index + 2] = c.b;
    this.pixels[index + 3] = 255;
  }
}
