import styles from './time-slice-viz.module.scss';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as satellite from 'satellite.js';
import { useAtom } from 'jotai';
import {
  SatelliteData,
  satelliteDataAtom,
} from '../jotai-data-host/data/satellite-data';
import { useShellDispatch } from '@porrtal/r-shell';

const Earth = () => {
  const basePath = window.location.pathname.startsWith('/orbital-eye')
    ? '/orbital-eye/'
    : '/';
  const texture = new TextureLoader().load(
    `${basePath}docs/images/ne1-small.png`
  );
  return (
    <mesh>
      <sphereGeometry args={[6.371, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

const SatellitePointCloud = (props: {
  positions: Float32Array;
  satelliteData: SatelliteData[];
}) => {
  const shellDispatch = useShellDispatch();

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();

    // Sort intersections by distanceToRay
    const sortedIntersections = event.intersections.sort(
      (a, b) => (a.distanceToRay ?? 0) - (b.distanceToRay ?? 0)
    );

    // Take the first (closest) intersection
    const closest = sortedIntersections[0];

    console.log('sorted intersections', sortedIntersections);

    if (!closest || closest.index === undefined) return;

    const index = closest.index; // Get the index of the clicked point
    // Access intersection to get the point index
    if (index === undefined) return;

    const satelliteInfo = props.satelliteData[index];
    if (satelliteInfo) {
      shellDispatch({
        type: 'launchView',
        viewId: 'SatelliteDetailsInNav',
        state: {
          noradCatId: satelliteInfo.NORAD_CAT_ID,
          objectName: satelliteInfo.OBJECT_NAME as string,
        },
      });
    }
  };

  return (
    <points onClick={handleClick}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={props.positions}
          count={props.positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} sizeAttenuation color="white" />
    </points>
  );
};

export const TimeSliceViz = () => {
  const [satelliteData] = useAtom(satelliteDataAtom);
  const [positions, setPositions] = useState<Float32Array>();
  const [satelliteCloudData, setSatelliteCloudData] = useState<SatelliteData[]>(
    []
  );

  useEffect(() => {
    if (!satelliteData) {
      return;
    }

    const satPositions: number[] = [];
    const satData: SatelliteData[] = [];
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
      if (pos && typeof pos !== 'boolean') {
        const gmst = satellite.gstime(date);
        const eciPos = satellite.eciToEcf(
          positionAndVelocity.position as satellite.EciVec3<number>,
          gmst
        );

        // Convert to XYZ and scale down
        const x = eciPos.x / 1000;
        const y = eciPos.y / 1000;
        const z = eciPos.z / 1000;

        // console.log('satellite', {x, y, z});

        satPositions.push(x, z, y); // Adjust axes for visualization
        satData.push(sat);
      }
    });

    setPositions(new Float32Array(satPositions));
    setSatelliteCloudData(satData);
  }, [satelliteData]);

  // console.log('positions: ', positions);
  if (
    !satelliteData ||
    satelliteData.length === 0 ||
    !positions ||
    positions.length === 0
  ) {
    return <div>loading...</div>;
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 60 }}
      style={{ background: 'black' }}
    >
      <ambientLight intensity={0.9} />
      <pointLight position={[10, 10, 10]} />
      <Earth />
      <SatellitePointCloud
        positions={positions}
        satelliteData={satelliteData}
      />
      <OrbitControls />
    </Canvas>
  );
};

export default TimeSliceViz;
