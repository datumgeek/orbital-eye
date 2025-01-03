import styles from './time-slice-viz.module.scss';
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import * as satellite from "satellite.js";
import { useAtom } from 'jotai';
import { satelliteDataAtom } from '../jotai-data-host/data/satellite-data';

interface Satellite {
  id: string;
  radius: number; // Distance from the Earth's center
  size: number; // Size of the satellite
  speed: number; // Speed of orbiting
  color: string; // Satellite color
}

interface SatelliteData {
  tle1: string;
  tle2: string;
}

// Example TLE data for demonstration
const satelliteTLEs: SatelliteData[] = [
  {
    tle1: '1 25544U 98067A   22348.54006157  .00006103  00000-0  11825-3 0  9992',
    tle2: '2 25544  51.6425 176.7285 0006165 126.4565 356.6350 15.49916600375289',
  },
  {
    tle1: '1 33591U 09005A   22347.73945833  .00000056  00000-0  25333-4 0  9991',
    tle2: '2 33591  98.7043 350.4700 0011920  73.8302  89.4896 14.19516861624014',
  },
  // Add more TLEs as needed
];

const Earth = () => {
  const texture = new TextureLoader().load('/docs/images/ne1-small.png');
  return (
    <mesh>
      <sphereGeometry args={[6.571, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const SatellitePointCloud = () => {
    const [satelliteData] = useAtom(satelliteDataAtom);
  
  const { positions } = useMemo(() => {
    const satPositions: number[] = [];
    const date = new Date();

    satelliteData.forEach((sat) => {
      const tle1 = sat.TLE_LINE1;
      const tle2 = sat.TLE_LINE2;
      if (!tle1 || !tle2) {
        return;
      }
      
      const satrec = satellite.twoline2satrec(tle1, tle2);
      const positionAndVelocity = satellite.propagate(satrec, date);

      const pos = positionAndVelocity.position;
      if (
        pos &&
        typeof pos !== 'boolean'
      ) {
        const gmst = satellite.gstime(date);
        const eciPos = satellite.eciToEcf(
          positionAndVelocity.position as satellite.EciVec3<number>,
          gmst
        );

        // Convert to XYZ and scale down
        const x = (eciPos.x / 1000);
        const y = (eciPos.y / 1000);
        const z = (eciPos.z / 1000);

        console.log('satellite', {x, y, z});

        satPositions.push(x, z, y); // Adjust axes for visualization
      }
    });

    return { positions: new Float32Array(satPositions) };
  }, [satelliteData]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="white" />
    </points>
  );
};

export const TimeSliceViz = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 60 }}
      style={{ background: 'black' }}
    >
      <ambientLight intensity={0.9} />
      <pointLight position={[10, 10, 10]} />
      <Earth />
      <SatellitePointCloud />
      <OrbitControls />
    </Canvas>
  );
};

export default TimeSliceViz;
