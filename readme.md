# Graphics from Scratch - Ray Tracer

A pure Vanilla JavaScript implementation of a Ray Tracer, built from scratch to understand the fundamentals of computer graphics. This project demonstrates core concepts like ray casting, vector mathematics, matrix transformations, lighting models, and camera systems without relying on external 3D libraries.

## Features

- **Ray Tracing Engine**: Core rendering engine that simulates light rays interacting with objects.
- **Parametric Geometric Objects**: Optimized intersection algorithms for Spheres.
- **Advanced Lighting Model**:
  - **Ambient Lighting**: Base illumination.
  - **Diffuse Lighting**: Lambertian reflection based on light incidence.
  - **Specular Highlights**: Configurable shininess (Phong model).
  - **Shadows**: Hard shadows calculated by casting rays towards light sources to check for occlusions.
- **Recursive Reflections**: Simulates reflective surfaces (like mirrors) using recursive ray tracing.
- **Multiple Light Sources**:
  - **Point Lights**: Emit light from a specific position in all directions.
  - **Directional Lights**: Simulate infinite light sources (like the sun) with parallel rays.
- **6-DoF Camera System**:
  - Full movement control (Forward/Back, Left/Right, Up/Down).
  - Rotation control (Pitch and Yaw).
  - Implemented using 4x4 Matrices for robust transformations.
- **Interactive UI**: Real-time control over the scene using on-screen buttons.

## Theory & Implementation Details

### 1. The Camera System

The camera is implemented as a physical object in the world using a **4x4 View Matrix**.

- **Transformation Matrices**: We use 4x4 matrices to handle rotation and translation combined.
- **Local vs. World Space**:
  - **Movement**: Can be applied relative to the camera's current orientation (Local) or the global axes (World).
  - **Rotation**: Uses Rodrigues' rotation formula (embedded in a matrix) to rotate around arbitrary axes.

### 2. Ray Tracing (The "Reverse" Approach)

Instead of tracing light from the source to the eye, we trace rays **from the camera**, through each pixel of the viewport, into the scene.

- **Viewport Mapping**: The 2D canvas pixels are mapped to a 3D viewport in front of the camera.
- **Intersection Testing**: For every ray, we calculate if and where it intersects with scene objects (Spheres). We solve the quadratic equation derived from the line-sphere intersection formula.

### 3. Lighting & Shading

The color of a pixel is determined by the **Phong Reflection Model**:
`Color = Ambient + Diffuse + Specular`

- **Diffuse**: Calculated using the dot product of the Surface Normal ($N$) and Light Direction ($L$). If surfaces face the light, they are brighter.
- **Specular**: Calculated using the dot product of the Reflection Vector ($R$) and View Vector ($V$). This creates the bright "shine" on glossy objects.
- **Shadows**: Before lighting a point, we cast a "shadow ray" towards the light. If it hits an object before the light, the point is in shadow (only Ambient applies).

### 4. Reflections

To create mirror-like effects, we recursively trace rays.

1. When a ray hits a reflective object, we calculate the **Reflected Ray** ($R$) relative to the surface normal.
2. We fire a new ray in direction $R$.
3. The color returned is blended with the object's local color based on its reflectivity.

## Setup & Installation

This project uses standard ES Modules, so it requires a local server to run (browsers block file system imports for security).

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd graphics-programming
   ```

2. **Run a local server**:
   You can use any static file server.
   _Using VS Code:_ Install the "Live Server" extension and click "Go Live".
   _Using Python:_

   ```bash
   python -m http.server
   ```

   _Using Node:_

   ```bash
   npx serve
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:8000` (or the port shown by your server).

## How to Use

### Controls

The interface provides a D-Pad style control panel:

- **Movement (WASD + Arrows)**:
  - **Up/Down Arrows**: Move Camera Up/Down (Y-axis)
  - **W/S**: Move Forward/Backward (Z-axis)
  - **A/D**: Move Left/Right (X-axis)
- **Rotation (Look)**:
  - **Arrow Buttons**: Rotate the camera view (Look Up/Down/Left/Right).

### Playing Around (Modifying the Scene)

The main entry point is `main.js`. You can edit this file to change the scene setup.

**Adding a new Sphere:**

```javascript
// In main.js
const mySphere = new Sphere(new Color(255, 0, 255)) // Purple
  .setPosition(2, 0, 5) // x, y, z
  .setRadius(1.5)
  .addSpecularity(100) // Shininess
  .addReflectiveness(0.5); // 50% reflective

scene.addObject(mySphere);
```

**Adding a Light:**

```javascript
import { PointLightSource } from "./light/lightSource.js";

// Intensity (0-1), Position (x, y, z)
scene.addLight(new PointLightSource(0.8, new Point(-2, 5, -2)));
```

**Changing Resolution:**
You can adjust the canvas size in `index.html` and `constants.js` (if defined there) or `scene.js` rendering loop to trade off between quality and performance.
