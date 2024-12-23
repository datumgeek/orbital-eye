import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import { Slider, Typography, Box, Grid } from '@mui/material';
import * as THREE from 'three';

interface OrbitalParameters {
  inclination: number; // in degrees
  raan: number; // Right Ascension of Ascending Node (degrees)
  argumentOfPerigee: number; // Argument of Perigee (degrees)
  trueAnomaly: number; // True Anomaly (degrees)
  eccentricity: number; // Eccentricity (0 = circle, closer to 1 = elongated ellipse)
}

const AxisVisualization: React.FC = () => {
  return (
    <group>
      {/* X-axis */}
      <group>
        <mesh position={[3, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 6, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>
        <mesh position={[6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.3, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </group>
      {/* Y-axis */}
      <group>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 10, 32]} />
          <meshBasicMaterial color="green" />
        </mesh>
        <mesh position={[0, -5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <coneGeometry args={[0.1, -0.3, 32]} />
          <meshBasicMaterial color="green" />
        </mesh>
      </group>
      {/* Z-axis */}
      <group>
        <mesh position={[0, 0, 2.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 5, 32]} />
          <meshBasicMaterial color="blue" />
        </mesh>
        <mesh position={[0, 0, 5]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.3, 32]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      </group>
    </group>
  );
};

const OrbitVisualization: React.FC<{ parameters: OrbitalParameters }> = ({
  parameters,
}) => {
  const { inclination, raan, argumentOfPerigee, trueAnomaly, eccentricity } =
    parameters;

  const inclinationRad = (inclination * Math.PI) / 180;
  const raanRad = (raan * Math.PI) / 180;
  const argumentOfPerigeeRad = (argumentOfPerigee * Math.PI) / 180;
  const trueAnomalyRad = (trueAnomaly * Math.PI) / 180;

  const semiMajorAxis = 5; // Adjust as needed
  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity ** 2);

  // Focal Offset
  const focalOffset = (1 - eccentricity ** 2) * semiMajorAxis;

  // Node Positions (in the orbital plane)
  const ascendingNode = new THREE.Vector3(
    0, // Y-coordinate
    -focalOffset, // X-coordinate
    0 // Z-coordinate
  );

  const descendingNode = new THREE.Vector3(
    0, // Y-coordinate
    focalOffset, // X-coordinate
    0 // Z-coordinate
  );

  // Calculate Midpoint of line of nodes
  const midpointLineOfNodes = new THREE.Vector3()
    .addVectors(ascendingNode, descendingNode)
    .multiplyScalar(0.5);

  // Calculate Length of the Line of Nodes
  const lengthLineOfNodes = ascendingNode.distanceTo(descendingNode);

  // Calculate Orientation of the Line of Nodes
  const directionLineOfNodes = new THREE.Vector3()
    .subVectors(descendingNode, ascendingNode)
    .normalize();
  const quaternionLineOfNodes = new THREE.Quaternion();
  quaternionLineOfNodes.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    directionLineOfNodes
  ); // Align Y-axis of cylinder to direction vector

  // Create Elliptical Path
  const points = [];
  const numPoints = 100;
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    const radius =
      (semiMajorAxis * (1 - eccentricity ** 2)) /
      (1 + eccentricity * Math.cos(angle));
    points.push(
      new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0)
    );
  }

  // Satellite Position
  const satelliteRadius =
    (semiMajorAxis * (1 - eccentricity ** 2)) /
    (1 + eccentricity * Math.cos(trueAnomalyRad));
  const satellitePosition = new THREE.Vector3(
    satelliteRadius * Math.cos(trueAnomalyRad),
    satelliteRadius * Math.sin(trueAnomalyRad),
    0
  );

  // Rotation Transformations
  const raanMatrix = new THREE.Matrix4().makeRotationZ(raanRad); // RAAN: Rotate orbital plane around Z-axis
  const inclinationMatrix = new THREE.Matrix4().makeRotationY(inclinationRad); // Inclination: Rotate around line of nodes
  const argumentMatrix = new THREE.Matrix4().makeRotationZ(
    argumentOfPerigeeRad
  ); // Argument of Perigee: Rotate within orbital plane

  // Apply Rotations
  const orbitTransform = new THREE.Matrix4()
    .multiply(raanMatrix)
    .multiply(inclinationMatrix)
    .multiply(argumentMatrix);

  return (
    <group>
      {/* Earth */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="green" />
      </mesh>

      {/* Orbit and Satellite */}
      <group matrixAutoUpdate={false} matrix={orbitTransform}>
        {/* Elliptical Orbit */}
        <Line
          points={points.map((point) => [point.x, point.y, point.z])} // Convert Vector3 to [x, y, z]
          color="blue"
          lineWidth={2}
        />

        {/* Satellite */}
        <mesh
          position={[
            satellitePosition.x,
            satellitePosition.y,
            satellitePosition.z,
          ]}
        >
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial color="red" />
        </mesh>

        {/* Ascending Node */}
        <mesh position={[ascendingNode.x, ascendingNode.y, ascendingNode.z]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial color="purple" />
        </mesh>

        {/* Descending Node */}
        <mesh position={[descendingNode.x, descendingNode.y, descendingNode.z]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial color="orange" />
        </mesh>

        {/* Line of Nodes */}
        <mesh
          position={[
            midpointLineOfNodes.x,
            midpointLineOfNodes.y,
            midpointLineOfNodes.z,
          ]}
          quaternion={quaternionLineOfNodes}
        >
          <cylinderGeometry args={[0.02, 0.02, lengthLineOfNodes, 32]} />
          <meshBasicMaterial color="purple" />
        </mesh>
      </group>
    </group>
  );
};

const EclipticVisualization: React.FC = () => {
  return (
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="blue" />
      </mesh>
      <circleGeometry args={[5, 64]} />
      <meshBasicMaterial color="green" transparent opacity={0.3} side={2} />
    </mesh>
  );
};

export const OrbitVisualizer: React.FC = () => {
  const [parameters, setParameters] = useState<OrbitalParameters>({
    inclination: 45,
    raan: 0,
    argumentOfPerigee: 0,
    trueAnomaly: 0,
    eccentricity: 0.5,
  });

  const handleChange =
    (name: keyof OrbitalParameters) =>
    (event: Event, value: number | number[]) => {
      setParameters((prev) => ({
        ...prev,
        [name]: value as number,
      }));
    };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Box padding={2}>
          <Typography variant="h6">Adjust Orbital Parameters</Typography>
          <Box>
            <Typography gutterBottom>Inclination (degrees)</Typography>
            <Slider
              value={parameters.inclination}
              onChange={handleChange('inclination')}
              min={0}
              max={180}
              step={1}
            />
          </Box>
          <Box>
            <Typography gutterBottom>RAAN (degrees)</Typography>
            <Slider
              value={parameters.raan}
              onChange={handleChange('raan')}
              min={0}
              max={360}
              step={1}
            />
          </Box>
          <Box>
            <Typography gutterBottom>Argument of Perigee (degrees)</Typography>
            <Slider
              value={parameters.argumentOfPerigee}
              onChange={handleChange('argumentOfPerigee')}
              min={0}
              max={360}
              step={1}
            />
          </Box>
          <Box>
            <Typography gutterBottom>True Anomaly (degrees)</Typography>
            <Slider
              value={parameters.trueAnomaly}
              onChange={handleChange('trueAnomaly')}
              min={0}
              max={360}
              step={1}
            />
          </Box>
          <Box>
            <Typography gutterBottom>Eccentricity</Typography>
            <Slider
              value={parameters.eccentricity}
              onChange={handleChange('eccentricity')}
              min={0}
              max={1}
              step={0.01}
            />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <Canvas
          style={{ height: '500px' }}
          camera={{ position: [10, 10, 10], fov: 50 }}
        >
          <OrbitControls enableZoom enablePan enableRotate />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <AxisVisualization />
          <EclipticVisualization />
          <OrbitVisualization parameters={parameters} />
        </Canvas>
      </Grid>
    </Grid>
  );
};

export default OrbitVisualizer;
