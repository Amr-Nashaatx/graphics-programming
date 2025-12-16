import { Scene } from "./scene.js";
import { Vector } from "./math/vector.js";
import { Sphere } from "./math/sphere.js";
import { Color } from "./math/color.js";
import { Point } from "./math/point.js";
import {
  DirectionalLightSource,
  LightSource,
  PointLightSource,
} from "./light/lightSource.js";

import { initInput } from "./input.js";

const scene = new Scene();

//Add Lights
scene.addLight(new LightSource(0.2));
scene.addLight(new PointLightSource(0.6, new Point(2, 1, 0)));
scene.addLight(new DirectionalLightSource(0.2, new Vector(1, 4, 4)));

// objects
//red
const obj1 = new Sphere(new Color(255, 0, 0))
  .addSpecularity(500)
  .addReflectiveness(0.2);

//blue
const obj2 = new Sphere(new Color(0, 0, 255)).addReflectiveness(0.3);

//green
const obj3 = new Sphere(new Color(0, 255, 0))
  .addSpecularity(10)
  .addReflectiveness(0.4);

//yellow
const obj4 = new Sphere(new Color(255, 255, 0))
  .setScale(1000, 1000, 100)
  .setPosition(0, -1001, 0);

scene.addObject(obj1);
scene.addObject(obj2);
scene.addObject(obj3);
scene.addObject(obj4);

scene.render();

initInput(scene);
