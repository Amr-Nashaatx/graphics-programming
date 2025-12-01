import { Matrix4 } from "./math/matrix4.js";
import { Point } from "./math/point.js";
import { Vector } from "./math/vector.js";
import { Matrix3 } from "./math/matrix3.js";

export class Camera {
  constructor() {
    this.cameraWorld = Matrix4.identity();
  }
  getRotationMatrix() {
    return this.cameraWorld.extractRotation();
  }
  getTranslationVector() {
    return this.cameraWorld.extractPosition();
  }

  /**
   * @description LOCAL rotation: rotate about axis expressed in CAMERA space
   * @param {Vector} axis - the axis to rotate about in camera space
   * @param {number} angle - the angle to rotate by in radians
   */
  rotateLocal(axis, angle) {
    const rotationMatrix3 = Matrix3.createRotationMatrixFromRodrigues(
      axis.normalize(),
      angle
    );
    const rotationMatrix4 = Matrix4.embedRotation(rotationMatrix3);
    this.cameraWorld = this.cameraWorld.multiply(rotationMatrix4);
  }

  /**
   * @description World rotation: rotate about axis expressed in WORLD space
   * @param {Vector} axis - the axis to rotate about in world space
   * @param {number} angle - the angle to rotate by in radians
   */
  rotateWorld(axis, angle) {
    const rotationMatrix3 = Matrix3.createRotationMatrixFromRodrigues(
      axis.normalize(),
      angle
    );
    const rotationMatrix4 = Matrix4.embedRotation(rotationMatrix3);
    this.cameraWorld = rotationMatrix4.multiply(this.cameraWorld);
  }

  /**
   * @description LOCAL translation: move in camera space
   * @param {number} r - the distance to move in the right direction
   * @param {number} u - the distance to move in the up direction
   * @param {number} f - the distance to move in the forward direction
   */
  moveLocal(r, u, f) {
    const T = Matrix4.createTranslationMatrix4(r, u, f);
    this.cameraWorld = this.cameraWorld.multiply(T); //left-multiply
  }

  /**
   * @description GLOBAL translation: move in world space
   * @param {number} dx - the distance to move in the x direction
   * @param {number} dy - the distance to move in the y direction
   * @param {number} dz - the distance to move in the z direction
   */
  moveWorld(dx, dy, dz) {
    const T = Matrix4.createTranslationMatrix4(dx, dy, dz);
    this.cameraWorld = T.multiply(this.cameraWorld); //right-multiply
  }

  /**
   * @description Set the camera to look at a target point
   * @param {Point} eye - the eye point
   * @param {Point} target - the target point
   * @param {Vector} worldUp - the world up vector
   */
  lookAt(eye, target, worldUp = new Vector(0, 1, 0)) {
    const forward = eye.getDisplacementVectorTo(target).normalize();
    const right = worldUp.cross(forward).normalize();
    const up = forward.cross(right).normalize();

    const rotationMatrix3 = new Matrix3([
      right.x,
      right.y,
      right.z,
      up.x,
      up.y,
      up.z,
      forward.x,
      forward.y,
      forward.z,
    ]);
    const rotationMatrix4 = Matrix4.embedRotation(rotationMatrix3);
    const translationMatrix = Matrix4.createTranslationMatrix4(
      eye.x,
      eye.y,
      eye.z
    );
    this.cameraWorld = translationMatrix.multiply(rotationMatrix4);
  }

  // View =
  // [ Rᵀ   -Rᵀ*pos ]
  // [ 0        1   ]
  /**
   * @description Get the view matrix
   * @returns {Matrix4}
   */
  getViewMatrix() {
    const rotationMatrix = this.cameraWorld.extractRotation();
    const translationVector = this.cameraWorld.extractPosition();

    const inverseRotationMatrix = rotationMatrix.transpose();

    // negate translation vector and transform it to camera space
    const inverseTranslationVector = inverseRotationMatrix.multiplyVector(
      translationVector.scale(-1)
    );

    return new Matrix4([
      inverseRotationMatrix.m[0],
      inverseRotationMatrix.m[1],
      inverseRotationMatrix.m[2],
      0,
      inverseRotationMatrix.m[3],
      inverseRotationMatrix.m[4],
      inverseRotationMatrix.m[5],
      0,
      inverseRotationMatrix.m[6],
      inverseRotationMatrix.m[7],
      inverseRotationMatrix.m[8],
      0,
      inverseTranslationVector.x,
      inverseTranslationVector.y,
      inverseTranslationVector.z,
      1,
    ]);
  }
}
