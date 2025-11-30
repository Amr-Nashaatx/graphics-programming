import { Vector } from "./math/vector.js";
import { Color } from "./math/color.js";
const canvas = document.getElementById("canvas");

export const VIEWPORT_HEIGHT = 1;
export const VIEWPORT_WIDTH = 1;
export const O = new Vector(0, 0, 0); // Camera position in the scene
export const CANVAS_WIDTH = canvas.width;
export const CANVAS_HEIGHT = canvas.height;
export const BACKGROUND_COLOR = new Color(175, 191, 217);
export const VIEWPORT_DISTANCE = 1;
