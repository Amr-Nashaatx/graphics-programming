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
  constructor(color) {
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
    this.position = new Vector(1, 0.5, 1);
    this.scale = new Vector(0.1, 0.1, 0.1);
    this.rotation = new Vector(0, 0, 0);

    // matrices
    this.modelMatrix = Matrix4.identity();
    this.invModelMatrix = Matrix4.identity();

    this.updateModel(); // compute initial matrices
  }
  updateModel() {
    const T = Matrix4.createTranslationMatrix4(
      this.position.x,
      this.position.y,
      this.position.z
    );

    const RX = Matrix4.createRotationXMatrix(this.rotation.x);
    const RY = Matrix4.createRotationYMatrix(this.rotation.y);
    const RZ = Matrix4.createRotationZMatrix(this.rotation.z);

    const R = RZ.multiply(RY).multiply(RX); // rotation matrix

    const S = Matrix4.createScaleMatrix4(
      this.scale.x || 1,
      this.scale.y || 1,
      this.scale.z || 1
    );

    // Model matrix = T * R * S
    this.modelMatrix = T.multiply(R).multiply(S);

    const Tinv = Matrix4.createTranslationMatrix4(
      -this.position.x,
      -this.position.y,
      -this.position.z
    );
    const Rinv = R.transpose();
    const Sinv = Matrix4.createScaleMatrix4(
      1 / this.scale.x,
      1 / this.scale.y,
      1 / this.scale.z
    );

    // Inverse Model Matrix = S⁻¹ · R⁻¹ · T⁻¹
    this.invModelMatrix = Sinv.multiply(Rinv).multiply(Tinv);
  }
  setPosition(x, y, z) {
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.updateModel();
    return this;
  }

  setRotation(rx, ry, rz) {
    this.rotation.x = rx;
    this.rotation.y = ry;
    this.rotation.z = rz;
    this.updateModel();
    return this;
  }

  setScale(sx, sy, sz) {
    this.scale.x = sx;
    this.scale.y = sy;
    this.scale.z = sz;
    this.updateModel();
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
