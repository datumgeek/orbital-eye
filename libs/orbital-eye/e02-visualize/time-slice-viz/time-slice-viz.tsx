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

const isBlockedBySphere = (
  camera: Vector3,
  point: Vector3,
  sphereRadius: number
): boolean => {
  // Direction vector from camera to point
  const vx = point.x - camera.x;
  const vy = point.y - camera.y;
  const vz = point.z - camera.z;

  // V dot V (magnitude squared of V)
  const vv = vx * vx + vy * vy + vz * vz;

  // If direction is zero-length, treat as "at same position"?
  // Might return blocked or not, depending on your scenario.
  if (vv === 0) {
    return false; // No line to test, can't be "blocked" in the usual sense
  }

  // Param t* for the closest approach to the origin (sphere center)
  // (S - C) is just (0 - camera.x, 0 - camera.y, 0 - camera.z) = -camera
  const cx = camera.x;
  const cy = camera.y;
  const cz = camera.z;
  const dotCV = cx * vx + cy * vy + cz * vz; // camera dot direction
  // but note we want -(camera) dot V, so:
  const tStar = -dotCV / vv;

  // Function to get a point on the line for parameter t
  // L(t) = camera + t*V
  function getLinePoint(t: number) {
    return new Vector3(camera.x + t * vx, camera.y + t * vy, camera.z + t * vz);
  }

  // Helper to get distance squared from origin
  function distSqFromOrigin(p: Vector3) {
    return p.x * p.x + p.y * p.y + p.z * p.z;
  }

  // 1) If 0 <= tStar <= 1, check the closest point on the segment
  if (tStar >= 0 && tStar <= 1) {
    const closest = getLinePoint(tStar);
    const distSq = distSqFromOrigin(closest);
    return distSq < sphereRadius * sphereRadius;
  }

  // 2) If tStar < 0, the closest approach is "behind" the camera,
  //    so check distance from the camera to the origin
  if (tStar < 0) {
    const distSqCamera = distSqFromOrigin(camera);
    return distSqCamera < sphereRadius * sphereRadius;
  }

  // 3) If tStar > 1, the closest approach is "beyond" the point,
  //    so check distance from the point to the origin
  const distSqPoint = distSqFromOrigin(point);
  return distSqPoint < sphereRadius * sphereRadius;
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
    };

    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    // only consider it a click (selection) if mouse is down less or equal to 350 ms
    if (
      !refMouseDownTime.current ||
      Date.now() - refMouseDownTime.current > 350
    ) {
      return;
    }

    event.stopPropagation();

    const cameraPosition = event.camera.position; // Camera's position
    const earthPosition = new Vector3(0, 0, 0); // Assuming Earth is at the origin

    // Filter intersections to exclude satellites obscured by the Earth
    const validIntersections = event.intersections.filter((intersection) => {
      const satellitePosition = intersection.point;

      const isBlocked = isBlockedBySphere(
        cameraPosition,
        satellitePosition,
        EARTH_RADIUS
      );
      return !isBlocked;
    });

    // Sort valid intersections by distance to the ray
    const closest = validIntersections.sort((a, b) => {
      if (a.distanceToRay === undefined) return 0;
      if (b.distanceToRay === undefined) return 1;
      return a.distanceToRay - b.distanceToRay;
    })[0];

    if (!closest || closest.index === undefined) return;

    const satelliteInfo = props.satelliteData[closest.index];

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
