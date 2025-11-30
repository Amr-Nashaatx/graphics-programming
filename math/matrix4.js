import { Vector } from "./vector.js";
import { Point } from "./point.js";

export class Matrix4 {
  constructor(values) {
    // values should be a 16-element array in column-major order
    this.m = values;
  }

  static createTranslationMatrix4(tx, ty, tz) {
    return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1]);
  }
  static createScaleMatrix4(sx, sy, sz) {
    return new Matrix4([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1]);
  }
  static createRotationXMatrix(theta) {
    const c = Math.cos(theta),
      s = Math.sin(theta);
    return new Matrix4([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
  }
  static createRotationYMatrix(theta) {
    const c = Math.cos(theta),
      s = Math.sin(theta);
    return new Matrix4([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
  }
  static createRotationZMatrix(theta) {
    const c = Math.cos(theta),
      s = Math.sin(theta);
    return new Matrix4([c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  multiply(other) {
    const a = this.m;
    const b = other.m;
    const r = new Array(16).fill(0);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        for (let k = 0; k < 4; k++) {
          r[col * 4 + row] += a[k * 4 + row] * b[col * 4 + k];
        }
      }
    }
    return new Matrix4(r);
  }

  multiplyVector(v) {
    const m = this.m;
    const x = m[0] * v.x + m[4] * v.y + m[8] * v.z + m[12] * v.w;
    const y = m[1] * v.x + m[5] * v.y + m[9] * v.z + m[13] * v.w;
    const z = m[2] * v.x + m[6] * v.y + m[10] * v.z + m[14] * v.w;
    const w = m[3] * v.x + m[7] * v.y + m[11] * v.z + m[15] * v.w;
    const resVector = new Vector(x, y, z);
    resVector.w = w;
    return resVector;
  }

  multiplyPoint(v) {
    const m = this.m;
    const x = m[0] * v.x + m[4] * v.y + m[8] * v.z + m[12] * v.w;
    const y = m[1] * v.x + m[5] * v.y + m[9] * v.z + m[13] * v.w;
    const z = m[2] * v.x + m[6] * v.y + m[10] * v.z + m[14] * v.w;
    const w = m[3] * v.x + m[7] * v.y + m[11] * v.z + m[15] * v.w;
    const resPoint = new Point(x, y, z);
    resPoint.w = 1;
    return resPoint;
  }

  static identity() {
    return new Matrix4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }
}
