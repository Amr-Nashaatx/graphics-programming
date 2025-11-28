import { fixZero } from "./utils.js";

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

/**
 * Represents or vector in 3D space.
 */
export class Vector {
  /**
   * Create a vector.
   * @param {number} [x=0] - The X coordinate.
   * @param {number} [y=0] - The Y coordinate.
   * @param {number} [z=0] - The Z coordinate.
   */
  constructor(x = 0, y = 0, z = 0) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    /** @type {number} */
    this.z = z;
    this.w = 0;
  }
  /**
   *
   * @param {Vector} v
   * @return {Vector}
   */
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  }
  /**
   *
   * @param {Vector} v
   * @return {Vector}
   */
  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
  }
  /**
   *
   * @param {number} s
   * @return {Vector}
   */
  scale(s) {
    return new Vector(this.x * s, this.y * s, this.z * s);
  }
  /**
   *
   * @param {Vector} v
   * @return {number}
   */
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  /**
   *
   * @param {Vector} v
   * @return {Vector}
   */
  cross(v) {
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }
  /**
   *
   * @return {number}
   */
  magnitude() {
    return Math.sqrt(this.dot(this));
  }
  /**
   *
   * @return {Vector}
   */
  normalize() {
    const m = this.magnitude();
    return m === 0 ? new Vector(0, 0, 0) : this.scale(1 / m);
  }
  // keep any other helpers you had (e.g., distanceTo, clone)
}

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
    return new Matrix4([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
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

export class Point {
  /**
   * Create a vector.
   * @param {number} [x=0] - The X coordinate.
   * @param {number} [y=0] - The Y coordinate.
   * @param {number} [z=0] - The Z coordinate.
   */
  constructor(x = 0, y = 0, z = 0) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
    /** @type {number} */
    this.z = z;
    this.w = 1;
  }

  /**
   * @param {Vector} v - vector to translate the point
   * @returns {Point} - the new point
   */
  addVector(v) {
    return new Point(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  /**
   * @param {Point} p - point to which we calculate displacement
   * @returns {Vector} - displacement from this point to p.
   */
  getDisplacementVectorTo(p) {
    return new Vector(p.x - this.x, p.y - this.y, p.z - this.z);
  }
}

/**
 *
 * @param {Vector} D - Incident ray
 * @param {Vector} N - Surface normal at that point
 * @returns {Vector} - Reflected ray around the normal
 */
export function reflect(D, N) {
  // r = D - 2*(D·N)*N
  // const dDotN = D.dot(N);
  // return D.subtract(N.scale(2 * dDotN));
  return N.scale(2 * N.dot(D)).subtract(D);
}

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

/**
 *
 * @param {Point} S Starting point of ray
 * @param {Vector} D Ray direction vector
 * @param {Sphere} sphere Sphere with which the ray intersects
 * @return {Vector[]} Two points of intersection
 */
export function IntersectRaySphere(S, D, sphere) {
  const r = sphere.radius;
  const CO = S.getDisplacementVectorTo(sphere.center);

  // By Solving the both the ray equation and the sphere equation, we get this quadratic formula
  // t^2 (D . D) + 2t (CO . D) + (CO . CO) - r^2 = 0 which we solve in this function

  const a = D.dot(D);
  const b = -2 * CO.dot(D);
  const c = CO.dot(CO) - r * r;

  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) return [Infinity, Infinity];

  const sqrtDisc = Math.sqrt(discriminant);
  const root1 = (-b + sqrtDisc) / (2 * a);
  const root2 = (-b - sqrtDisc) / (2 * a);

  return [root1, root2];
}
