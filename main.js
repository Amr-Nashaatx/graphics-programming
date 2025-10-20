import { O } from "./constants.js";
import { Scene } from "./scene.js";
import { Vector, Sphere } from "./math.js";
import { Color } from "./canvas.js";

const center1 = new Vector(0, -1, 3);
const center2 = new Vector(2, 0, 4);
const center3 = new Vector(-2, 0, 4);

const scene = new Scene(O);
scene.addObject(new Sphere(center1, 1, new Color(255, 0, 0)));
scene.addObject(new Sphere(center2, 1, new Color(0, 0, 255)));
scene.addObject(new Sphere(center3, 1, new Color(0, 255, 0)));

scene.render();
