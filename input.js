import { Vector } from "./math/vector.js";

export function initInput(scene) {
  const ROTATION_ANGLE = Math.PI / 12;
  const MOVEMENT_STEP = 0.5;

  // --- Rotation Controls ---

  // Look Left (Yaw) - Rotate around World Up (0, 1, 0)
  document.getElementById("look-left").addEventListener("click", () => {
    scene.camera.rotateWorld(new Vector(0, 1, 0), ROTATION_ANGLE);
    scene.render();
  });

  // Look Right (Yaw) - Rotate around World Up (0, 1, 0)
  document.getElementById("look-right").addEventListener("click", () => {
    scene.camera.rotateWorld(new Vector(0, 1, 0), -ROTATION_ANGLE);
    scene.render();
  });

  // Look Up (Pitch) - Rotate around Local Right (1, 0, 0)
  document.getElementById("look-up").addEventListener("click", () => {
    scene.camera.rotateLocal(new Vector(1, 0, 0), ROTATION_ANGLE);
    scene.render();
  });

  // Look Down (Pitch) - Rotate around Local Right (1, 0, 0)
  document.getElementById("look-down").addEventListener("click", () => {
    scene.camera.rotateLocal(new Vector(1, 0, 0), -ROTATION_ANGLE);
    scene.render();
  });

  // --- Movement Controls ---

  // Move Forward (Local Z)
  document.getElementById("move-forward").addEventListener("click", () => {
    scene.camera.moveLocal(0, 0, MOVEMENT_STEP);
    scene.render();
  });

  // Move Back (Local Z)
  document.getElementById("move-back").addEventListener("click", () => {
    scene.camera.moveLocal(0, 0, -MOVEMENT_STEP);
    scene.render();
  });

  // Move Left (Local X)
  document.getElementById("move-left").addEventListener("click", () => {
    scene.camera.moveLocal(-MOVEMENT_STEP, 0, 0);
    scene.render();
  });

  // Move Right (Local X)
  document.getElementById("move-right").addEventListener("click", () => {
    scene.camera.moveLocal(MOVEMENT_STEP, 0, 0);
    scene.render();
  });

  // Move Up (Local Y)
  document.getElementById("move-up").addEventListener("click", () => {
    scene.camera.moveLocal(0, MOVEMENT_STEP, 0);
    scene.render();
  });

  // Move Down (Local Y)
  document.getElementById("move-down").addEventListener("click", () => {
    scene.camera.moveLocal(0, -MOVEMENT_STEP, 0);
    scene.render();
  });
}
