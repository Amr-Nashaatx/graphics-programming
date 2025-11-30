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

  /**
   *
   * @param {s} s - multiplier lighten color
   */
  scale(s) {
    return new Color(
      Math.min(255, this.r * s),
      Math.min(255, this.g * s),
      Math.min(255, this.b * s)
    );
  }
  add(c) {
    return new Color(
      Math.min(255, this.r + c.r),
      Math.min(255, this.g + c.g),
      Math.min(255, this.b + c.b)
    );
  }
}
