import styles from './time-slice-viz.module.scss';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, ThreeEvent, useFrame } from '@react-three/fiber';
import {
  ArrowHelper,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  TextureLoader,
  Vector3,
} from 'three';
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
  const refMouseDownTime = useRef<number | undefined>();

  const EARTH_RADIUS = 6.371; // Earth's radius in your units

  useEffect(() => {
    const handleMouseDown = () => {
      refMouseDownTime.current = Date.now();
    }

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    }
  }, []);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {

    // only consider it a click (selection) if mouse is down less or equal to 350 ms
    if (!refMouseDownTime.current || (Date.now() - refMouseDownTime.current > 350)) {
      return;
    }

    event.stopPropagation();

    const cameraPosition = event.camera.position; // Camera's position
    const earthPosition = new Vector3(0, 0, 0); // Assuming Earth is at the origin

    // Filter intersections to exclude satellites obscured by the Earth
    const validIntersections = event.intersections.filter((intersection) => {
      const pointPosition = intersection.point;

      // Vector from the Earth center to the satellite point
      const earthToPoint = new Vector3().subVectors(
        pointPosition,
        earthPosition
      );
      const cameraToPoint = new Vector3().subVectors(
        pointPosition,
        cameraPosition
      );

      // Check if the point is in front of the Earth relative to the camera
      const toPoint = new Vector3().subVectors(pointPosition, cameraPosition);
      const toEarth = new Vector3().subVectors(earthPosition, cameraPosition);

      const isInFront = toPoint.dot(toEarth) > 0;

      // Check if the satellite is outside the Earth's shadow
      const distanceToEarthCenter = earthToPoint.length();
      const isOutsideEarth = distanceToEarthCenter > EARTH_RADIUS;

      return isInFront && isOutsideEarth;
    });

    // Sort by distanceToRay and take the closest valid intersection
    const closest = validIntersections.sort((a, b) => {
      if (a.distanceToRay === undefined) {
        return 0;
      }
      if (b.distanceToRay === undefined) {
        return 1;
      }
      return a.distanceToRay - b.distanceToRay;
    })[0];

    if (!closest || closest.index === undefined) return;

    // Visualize the ray and selected point
    const scene = event.object.parent; // Assuming the scene is accessible from the clicked object

    if (scene) {
      // Visualize the ray
      // const rayHelper = new ArrowHelper(
      //   event.ray.direction,
      //   event.ray.origin,
      //   10, // Length of the arrow
      //   0xff0000 // Color: red
      // );
      // scene.add(rayHelper);

      // Visualize the selected point
      const pointHelper = new Mesh(
        new SphereGeometry(0.06), // Small sphere
        new MeshBasicMaterial({ color: 'red' }) // Green color
      );
      pointHelper.position.copy(closest.point);
      scene.add(pointHelper);
    }
    const index = closest.index;
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
