# OrbitalEye

A playground for orbital visualizations, calculations, and experiments

![image](./apps/orbital-eye/public/docs/images/orbital-eye.png)

# Orbital Eye Recipe

## Create GitHub Repo
    
- https://github.com/datumgeek/orbital-eye.git
- [Readme](https://github.com/datumgeek/orbital-eye?tab=readme-ov-file#orbitaleye)
    
## Install NodeJS LTS
    
- [https://nodejs.org](https://nodejs.org)
    
## Create Nx Workspace
    
    npx create-nx-workspace
    
## Install nx globally

    npm install -g nx

## Run it
    
    cd orbital-eye
    nx dev orbital-eye
- http://localhost:3000
    
## Add remote
    
    git remote add origin https://github.com/datumgeek/orbital-eye.git

## Add Library `@orbital-eye/e01-visualize`

    nx g @nx/react:library --name=orbital-eye-e01-visualize --bundler=rollup --directory=libs/orbital-eye/e01-visualize --component=false --importPath=@orbital-eye/e01-visualize --projectNameAndRootFormat=as-provided --publishable=true --style=scss --unitTestRunner=jest

## Add Component

     nx g @nx/react:component --name=orbit-visualizer --directory=libs/orbital-eye/e01-visualize/orbit-visualizer --export=true --nameAndDirectoryFormat=as-provided --style=scss

## Add ThreeJS Visualization

     npm install @react-three/fiber @react-three/drei @mui/material @emotion/react @emotion/styled --save

## Boom shaka-laka !! :)

![image](./apps/orbital-eye/public/docs/images/e01-visualize-orbital-visualizer-01.png)

## Getting Good !! :)

![image](./apps/orbital-eye/public/docs/images/e01-visualize-orbital-visualizer-02.png)

### Orbital Parameters Definitions

- **Inclination**:  
  The angle between the orbital plane and the equatorial plane of the primary body (e.g., Earth). Measured in degrees, it determines the tilt of the orbit.  
  - **0° Inclination**: An orbit directly above the equator (equatorial orbit).  
  - **90° Inclination**: A polar orbit, passing over the poles.  
  - Values between 0° and 180° represent various inclinations of the orbital plane relative to the equator.

- **Right Ascension of the Ascending Node (RAAN)**:  
  The angle from a fixed reference direction (usually the vernal equinox) to the ascending node, measured in the equatorial plane. The ascending node is the point where the satellite crosses the equatorial plane from the southern to the northern hemisphere. RAAN defines the rotation of the orbital plane around the planet.

- **Argument of Perigee**:  
  The angle between the ascending node and the orbit's closest point to the primary body (perigee), measured within the orbital plane. This parameter describes the orientation of the ellipse within the orbital plane.

- **True Anomaly**:  
  The angle between the perigee and the satellite's current position, measured at the primary body’s center. It indicates the satellite’s location along its orbit at a specific time.

- **Eccentricity**:  
  A measure of how much the orbit deviates from a perfect circle.  
  - **0**: A circular orbit.  
  - **Between 0 and 1**: An elliptical orbit, where values closer to 1 indicate a more elongated ellipse.  
  - **1 or greater**: Parabolic or hyperbolic trajectories, representing escape orbits.

These parameters work together to describe the shape, orientation, and position of a satellite's orbit at any given time. They are essential for understanding and visualizing orbital mechanics.

### Increase Eccentricity

(make it more elliptical and less circular)

![image](./apps/orbital-eye/public/docs/images/e01-visualize-orbital-visualizer-03.png)

### Increase Inclination

(make more up-and-down and less across)

![image](./apps/orbital-eye/public/docs/images/e01-visualize-orbital-visualizer-04.png)

### Increase Argument of Perigee

(roll the ellipse counter-clockwise in elliptical plane - notice node of descention (purple ball) is furthur away than node of assention (yellow ball))
(both ascending node and descending node still fall along the line of nodes (purple line))

![image](./apps/orbital-eye/public/docs/images/e01-visualize-orbital-visualizer-05.png)

## Publish orbital-eye App to GitHub Pages

Publishing the orbital-eye Next.js app from an NX monorepo to GitHub Pages involves additional considerations because Next.js apps are dynamic by nature, but they can be exported as static websites using the `next export` command. Below is step-by-step guide:

---

### **1. Prerequisites**
- Ensure your app is fully static or can be exported using `next export`.
- You have a GitHub repository set up for your project.

---

### **2. Install `gh-pages` Package**
Install the `gh-pages` package to simplify deployment to GitHub Pages:

```bash
npm install --save-dev gh-pages
```

---

### **3. Update Next.js App for Static Export**
1. Open the `next.config.js` file in your Next.js app directory (`apps/orbital-eye`).
2. Add the `exportTrailingSlash` and `basePath` configuration:

```javascript
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  trailingSlash: true,
  basePath: '/orbital-eye'
};
```

This ensures the app can be statically exported and hosted under the `/` route of your GitHub Pages site.

---

### **4. Configure `project.json` for Static Export**
Update the `project.json` for your Next.js app (`apps/orbital-eye/project.json`) to include the static export step:

```json
{
  "targets": {
    "build": {
      "executor": "@nrwl/next:build",
      "options": {
        "outputPath": "dist/apps/orbital-eye",
        "basePath": "/orbital-eye"
      }
    },
    "export": {
      "executor": "@nrwl/next:export",
      "options": {
        "buildTarget": "orbital-eye:build",
        "outputPath": "dist/apps/orbital-eye"
      }
    }
  }
}
```

---

### **5. Add a Deploy Script to `package.json`**
Add a `deploy` script to the root `package.json`:

```json
"scripts": {
  "deploy": "nx export orbital-eye && gh-pages -d dist/apps/orbital-eye"
}
```

---

### **6. Set Up GitHub Repository**
1. Go to your GitHub repository.
2. Navigate to **Settings > Pages**.
3. Under **Source**, select `gh-pages` branch.
4. Save the changes.

---

### **7. Build and Export Your App**
Run the following commands to build and export your app:

```bash
nx build orbital-eye
nx export orbital-eye
```

This will generate static files in the `dist/apps/orbital-eye` directory.

---

### **8. Deploy to GitHub Pages**
Run the deploy script:

```bash
npm run deploy
```

This pushes the exported static files to the `gh-pages` branch in your GitHub repository.

---

### **9. Verify Deployment**
- Go to `https://datumgeek.github.io/orbital-eye/` to view your deployed site.
- Check that all routes and assets load correctly.

---

### **10. Automate Deployment (Optional)**
You can automate this process using GitHub Actions:
1. Create a new workflow file at `.github/workflows/deploy.yml`.
2. Use a workflow that builds, exports, and deploys your Next.js app to GitHub Pages.

## OrbitVisualizer Component: Interactive 3D Orbital Simulation

The **OrbitVisualizer** component (above) is a React component that visualizes a satellite's orbit in a 3D space using the [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) library for rendering, [@react-three/drei](https://github.com/pmndrs/drei) for additional 3D utilities, and [@mui/material](https://mui.com/) for the UI controls. This project demonstrates how orbital mechanics can be modeled and visualized interactively.

### Features

- **3D Visualization of Orbit and Satellite:**
  - Displays the satellite's orbit as an elliptical path.
  - Highlights key orbital parameters such as inclination, eccentricity, and orientation.
  - Positions the satellite dynamically based on the input parameters.
- **Interactive Axes and Ecliptic Plane:**
  - Visualizes coordinate axes (X, Y, Z) for spatial orientation.
  - Shows the ecliptic plane for reference.
- **Adjustable Orbital Parameters:**
  - Use sliders to adjust orbital parameters in real time:
    - Inclination
    - Right Ascension of Ascending Node (RAAN)
    - Argument of Perigee
    - True Anomaly
    - Eccentricity

### Code Overview

#### Main Components

1. **AxisVisualization**:
   - Renders the coordinate axes (X, Y, Z) with cylinders and cones.
   - Each axis is color-coded:
     - **Red:** X-axis
     - **Green:** Y-axis
     - **Blue:** Z-axis

2. **OrbitVisualization**:
   - Computes and renders the satellite's elliptical orbit based on Keplerian elements:
     - **Inclination** (tilt of the orbit plane relative to the equatorial plane).
     - **RAAN** (rotation of the orbit plane around the Z-axis).
     - **Argument of Perigee** (orientation of the orbit within the plane).
     - **Eccentricity** (shape of the orbit, circular to elliptical).
     - **True Anomaly** (satellite's position along the orbit).
   - Key features:
     - **Ellipse:** Generated using parametric equations.
     - **Satellite:** Displayed as a red sphere moving along the orbit.
     - **Nodes:** Ascending and descending nodes are shown as purple and orange spheres, respectively.
     - **Axes of the Orbit:** Visualizes major and minor axes.

3. **EclipticVisualization**:
   - Represents the ecliptic plane with a transparent green circle for orientation.

4. **Orbital Parameter Sliders**:
   - A user interface for modifying the orbital parameters in real time.

#### Key Code Highlights

##### Ellipse Calculation

- The elliptical orbit is calculated using the semi-major and semi-minor axes:
  ```typescript
  const semiMajorAxis = 5;
  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2);
  ```
- Points are generated using polar equations and transformed to Cartesian coordinates.

##### Rotational Transformations

- Rotations are applied to align the orbit in 3D space:
  ```typescript
  const orbitTransform = new THREE.Matrix4()
    .multiply(raanMatrix)
    .multiply(inclinationMatrix)
    .multiply(argumentMatrix);
  ```

##### Real-Time Updates

- User interactions with sliders update the `parameters` state, which recalculates and re-renders the orbit dynamically.

#### User Interface

- **Material-UI (MUI)** sliders allow users to intuitively modify orbital parameters.
- **@react-three/drei's OrbitControls** provides drag, zoom, and pan controls for interacting with the 3D scene.

#### Example Orbital Parameters

The default parameters create a typical elliptical orbit:
```typescript
{
  inclination: 45,         // Degrees
  raan: 0,                 // Degrees
  argumentOfPerigee: 0,    // Degrees
  trueAnomaly: 0,          // Degrees
  eccentricity: 0.5        // 0 (circle) to 1 (elongated ellipse)
}
```

### How to Use

1. **Install Dependencies**:
   Make sure you have `react`, `@react-three/fiber`, `@mui/material`, and `three` installed.

2. **Render the Component**:
   Import and use the `OrbitVisualizer` component in your React application:
   ```tsx
   import React from 'react';
   import OrbitVisualizer from './OrbitVisualizer';

   const App = () => <OrbitVisualizer />;
   export default App;
   ```

3. **Adjust Parameters**:
   Use the sliders to explore how different orbital parameters affect the satellite's trajectory.

## Technologies Used

- **React** for the UI framework.
- **Three.js** (via @react-three/fiber) for 3D rendering.
- **MUI** for sliders and layout components.
- **TypeScript** for type safety.

## Future Enhancements

- Add textures to the Earth and satellite.
- Display orbital metrics (e.g., altitude, velocity).
- Animate the satellite to move along its orbit.

# Developer Overview

Here's a detailed developer's explanation of the code for inclusion in the README:

---

### Developer's Explanation

This code is a React component named **`OrbitVisualizer`**, designed to render and interactively visualize a satellite's orbit in 3D space. It uses **Three.js** (via `@react-three/fiber`) for rendering the 3D scene and **MUI** for the user interface elements that control orbital parameters. Below is a breakdown of its key components, functionality, and implementation details.

---

#### **1. Application Structure**

- The app is divided into **three main functional components**:
  1. **`AxisVisualization`**: Renders the X, Y, and Z coordinate axes as reference lines in the 3D scene.
  2. **`OrbitVisualization`**: Computes and renders the satellite's orbit, its position, and key reference points based on user-provided orbital parameters.
  3. **`EclipticVisualization`**: Displays the ecliptic plane, a reference circle to visualize the relationship between the orbital plane and the equatorial plane.

- **`OrbitVisualizer`**: The primary component combining the above elements into a single interactive visualization. It includes:
  - A slider-based UI for adjusting orbital parameters.
  - A `Canvas` element for rendering the 3D scene.

---

#### **2. 3D Scene Rendering**

- **Rendering Engine**: 
  - **@react-three/fiber** is used for WebGL-based rendering, wrapping the core Three.js functionality in React components.
  - **@react-three/drei** provides utilities like `OrbitControls` for camera interactions and `Line` for drawing the orbit path.

- **Scene Composition**:
  - The 3D scene includes:
    - A spherical Earth (green sphere at the origin).
    - The satellite as a red sphere positioned along its orbit.
    - Elliptical orbit paths based on input parameters.
    - Ascending and descending nodes as reference points.
    - Axes (X, Y, Z) for orientation.
    - Ecliptic plane as a transparent green circle for spatial context.

---

#### **3. Interactive Orbital Parameter Adjustment**

- **State Management**:
  - The orbital parameters are stored in a `useState` object:
    ```tsx
    const [parameters, setParameters] = useState<OrbitalParameters>({
      inclination: 45,
      raan: 0,
      argumentOfPerigee: 0,
      trueAnomaly: 0,
      eccentricity: 0.5,
    });
    ```
    - `inclination`, `raan`, `argumentOfPerigee`, `trueAnomaly`, and `eccentricity` control the orbit's orientation, shape, and satellite position.

- **UI for Adjustments**:
  - Sliders from **MUI** allow users to modify these parameters dynamically.
  - Changes are propagated through an `onChange` handler:
    ```tsx
    const handleChange = (name: keyof OrbitalParameters) =>
      (event: Event, value: number | number[]) => {
        setParameters((prev) => ({
          ...prev,
          [name]: value as number,
        }));
      };
    ```

---

#### **4. Orbital Calculations**

- **Ellipse Geometry**:
  - The semi-major and semi-minor axes of the orbit are calculated based on the **eccentricity**:
    ```tsx
    const semiMajorAxis = 5;
    const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2);
    ```
  - The orbit is constructed as an array of points using polar equations, transformed into Cartesian coordinates.

- **Rotation Matrices**:
  - A series of 3D transformations are applied to align the orbit correctly in space:
    - **Inclination**: Tilt of the orbital plane.
    - **RAAN**: Rotation of the orbital plane about the Z-axis.
    - **Argument of Perigee**: Rotation within the orbital plane.
  - These are implemented using Three.js `Matrix4` and `Quaternion` operations:
    ```tsx
    const orbitTransform = new THREE.Matrix4()
      .multiply(raanMatrix)
      .multiply(inclinationMatrix)
      .multiply(argumentMatrix);
    ```

- **Reference Points**:
  - Ascending and descending nodes are computed where the orbit crosses the equatorial plane.
  - The line of nodes, connecting these points, is visualized using a cylinder.

- **Satellite Position**:
  - The satellite's position is determined by the **True Anomaly**, calculating its radial distance along the elliptical path:
    ```tsx
    const satelliteRadius =
      (semiMajorAxis * (1 - eccentricity ** 2)) /
      (1 + eccentricity * Math.cos(trueAnomalyRad));
    const satellitePosition = new THREE.Vector3(
      satelliteRadius * Math.cos(trueAnomalyRad),
      satelliteRadius * Math.sin(trueAnomalyRad),
      0
    );
    ```

---

#### **5. Key Libraries and Tools**

- **Three.js** (via `@react-three/fiber`): Provides the 3D rendering engine.
- **@react-three/drei**: Simplifies 3D scene management with reusable components like `OrbitControls` and `Line`.
- **Material-UI (MUI)**: Supplies sliders and layout components for a modern, responsive UI.
- **TypeScript**: Ensures type safety and helps describe the structure of orbital parameters.

---

#### **6. Future Development Ideas**

- **Enhancements**:
  - Add animations to show the satellite moving in real-time along its orbit.
  - Introduce textures for the Earth and satellite to improve realism.
  - Display numerical orbital properties (e.g., altitude, velocity).
  - Allow users to input parameters numerically or select pre-defined orbits.

- **Integration**:
  - Combine with APIs for real-world orbital data to visualize actual satellite orbits.
  - Provide options to export the current orbital configuration.

---

This code provides a foundational visualization tool for orbital mechanics, enabling developers and enthusiasts to explore satellite dynamics interactively. Its modular structure makes it extensible for advanced features and real-world applications.

# Nx Stuff

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, Smart Monorepos · Fast CI.](https://nx.dev)** ✨

## Integrate with editors

Enhance your Nx experience by installing [Nx Console](https://nx.dev/nx-console) for your favorite editor. Nx Console
provides an interactive UI to view your projects, run tasks, generate code, and more! Available for VSCode, IntelliJ and
comes with a LSP for Vim users.

## Start the application

Run `npx nx dev orbital-eye` to start the development server. Happy coding!

## Build for production

Run `npx nx build orbital-eye` to build the application. The build artifacts are stored in the output directory (e.g. `dist/` or `build/`), ready to be deployed.

## Running tasks

To execute tasks with Nx use the following syntax:

```
npx nx <target> <project> <...options>
```

You can also run multiple targets:

```
npx nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```
npx nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Set up CI!

Nx comes with local caching already built-in (check your `nx.json`). On CI you might want to go a step further.

- [Set up remote caching](https://nx.dev/features/share-your-cache)
- [Set up task distribution across multiple machines](https://nx.dev/nx-cloud/features/distribute-task-execution)
- [Learn more how to setup CI](https://nx.dev/recipes/ci)

## Explore the project graph

Run `npx nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)

## Connect with us!

- [Join the community](https://nx.dev/community)
- [Subscribe to the Nx Youtube Channel](https://www.youtube.com/@nxdevtools)
- [Follow us on Twitter](https://twitter.com/nxdevtools)
