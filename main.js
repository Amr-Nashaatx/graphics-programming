import { O } from "./constants.js";
import { Scene } from "./scene.js";
import { Vector, Sphere } from "./math.js";
import { Color } from "./canvas.js";
import { DirectionalLight, Light, PointLight } from "./light.js";

const scene = new Scene(O);

//Add Lights
scene.addLight(new Light(0.2));
scene.addLight(new PointLight(0.6, new Vector(2, 1, 0)));
scene.addLight(new DirectionalLight(0.2, new Vector(1, 4, 4)));

// objects
//red
const obj1 = new Sphere(new Vector(0, -1, 3), 1, new Color(255, 0, 0))
  .addSpecularity(500)
  .addReflectiveness(0.2);

//blue
const obj2 = new Sphere(
  new Vector(2, 0, 4),
  1,
  new Color(0, 0, 255)
).addReflectiveness(0.3);

//green
const obj3 = new Sphere(new Vector(-2, 0, 4), 1, new Color(0, 255, 0))
  .addSpecularity(10)
  .addReflectiveness(0.4);

//yellow
const obj4 = new Sphere(new Vector(0, -5001, 0), 5000, new Color(255, 255, 0));

scene.addObject(obj1);
scene.addObject(obj2);
scene.addObject(obj3);
scene.addObject(obj4);

scene.render();
1;
