import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Slider, Typography, Box, Grid } from '@mui/material';

interface OrbitalParameters {
  inclination: number; // in degrees
  raan: number; // Right Ascension of Ascending Node (degrees)
  argumentOfPerigee: number; // Argument of Perigee (degrees)
  trueAnomaly: number; // True Anomaly (degrees)
}

const OrbitVisualization: React.FC<{ parameters: OrbitalParameters }> = ({ parameters }) => {
  const { inclination, raan, argumentOfPerigee, trueAnomaly } = parameters;

  const inclinationRad = (inclination * Math.PI) / 180;
  const raanRad = (raan * Math.PI) / 180;
  const argumentOfPerigeeRad = (argumentOfPerigee * Math.PI) / 180;
  const trueAnomalyRad = (trueAnomaly * Math.PI) / 180;

  return (
    <group rotation={[inclinationRad, raanRad, 0]}>
      <mesh rotation={[0, 0, argumentOfPerigeeRad]}>
        <torusGeometry args={[5, 0.1, 32, 100]} />
        <meshBasicMaterial color="blue" wireframe />
      </mesh>
      <mesh position={[5 * Math.cos(trueAnomalyRad), 5 * Math.sin(trueAnomalyRad), 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </group>
  );
};

export const OrbitVisualizer: React.FC = () => {
  const [parameters, setParameters] = useState<OrbitalParameters>({
    inclination: 45,
    raan: 0,
    argumentOfPerigee: 0,
    trueAnomaly: 0,
  });

  const handleChange = (name: keyof OrbitalParameters) => (event: Event, value: number | number[]) => {
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
        </Box>
      </Grid>
      <Grid item xs={12} md={8}>
        <Canvas style={{ height: '500px' }} camera={{ position: [10, 10, 10], fov: 50 }}>
          <OrbitControls enableZoom enablePan enableRotate />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitVisualization parameters={parameters} />
        </Canvas>
      </Grid>
    </Grid>
  );
};

export default OrbitVisualizer;
