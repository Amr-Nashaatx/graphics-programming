import { Matrix4 } from "./matrix4.js";
import { Vector } from "./vector.js";
import { Point } from "./point.js";
import { Color } from "./color.js";

/**
 * Defines a sphere in 3D space
 */
export class Sphere {
  /**
   * Create a point.
   * @param {Point}  - Center point of the sphere
   * @param {number} [radius=1] - Radius of the sphere
   * @param {Color}  - Diffuse color of the sphere
   */
  constructor(center, radius, color) {
    /**
     * @type {Point}
     */
    this.center = center;
    /**
     * @type {number}
     */
    this.radius = radius;
    /**
     * @type {Color}
     */
    this.color = color;
    /**
     * @type {number}
     */
    this.specular = -1;
    /**
     * @type {number}
     */
    this.reflective = 0;

    //local transform properties
    this.position = center;
    this.rotation = new Vector(0, 0, 0);
    this.scale = new Vector(radius, radius, radius);

    // matrices
    this.modelMatrix = Matrix4.identity();
    this.invModelMatrix = Matrix4.identity();

    this.updateMatrix(); // compute initial matrices
  }
  updateMatrix() {
    const T = Matrix4.createTranslationMatrix4(
      this.position.x,
      this.position.y,
      this.position.z
    );

    const RX = Matrix4.createRotationXMatrix(this.rotation.x);
    const RY = Matrix4.createRotationYMatrix(this.rotation.y);
    const RZ = Matrix4.createRotationZMatrix(this.rotation.z);

    const S = Matrix4.createScaleMatrix4(
      this.scale.x,
      this.scale.y,
      this.scale.z
    );

    // Model matrix = T * R * S
    this.modelMatrix = T.multiply(RZ).multiply(RY).multiply(RX).multiply(S);

    // Store inverse (will add inverseMatrix4 soon)
    // this.invModelMatrix = inverseMatrix4(this.modelMatrix);
  }
  setPosition(x, y, z) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.updateMatrix();
    return this;
  }

  setRotation(rx, ry, rz) {
    this.rotation.x = rx;
    this.rotation.y = ry;
    this.rotation.z = rz;
    this.updateMatrix();
    return this;
  }

  setScale(sx, sy, sz) {
    this.scale.x = sx;
    this.scale.y = sy;
    this.scale.z = sz;
    this.updateMatrix();
    return this;
  }
  /**
   *
   * @param {s} specular - The specular exponent
   * @returns {Sphere}
   */
  addSpecularity(specular) {
    this.specular = specular;
    return this;
  }

  addReflectiveness(reflective) {
    this.reflective = reflective;
    return this;
  }
}
