import { atom, useSetAtom } from 'jotai';
import { useEffect } from 'react';

export interface SatelliteData {
  CCSDS_OMM_VERS: string; // Version of the CCSDS OMM standard
  COMMENT: string; // Descriptive comment about the data set
  CREATION_DATE?: Date; // Date and time the record was created (optional)
  ORIGINATOR: string; // Entity responsible for generating the data
  OBJECT_NAME?: string; // Common name of the satellite (optional)
  OBJECT_ID?: string; // Unique identifier for the satellite (optional)
  CENTER_NAME: string; // Name of the celestial center, typically 'EARTH'
  REF_FRAME: string; // Reference frame, typically 'TEME'
  TIME_SYSTEM: string; // Time system used, typically 'UTC'
  MEAN_ELEMENT_THEORY: string; // Theory used for mean orbital elements, typically 'SGP4'
  EPOCH?: Date; // Epoch of the orbital elements (optional)
  MEAN_MOTION?: number; // Mean motion (revolutions per day) (optional)
  ECCENTRICITY?: number; // Orbital eccentricity (optional)
  INCLINATION?: number; // Orbital inclination (degrees) (optional)
  RA_OF_ASC_NODE?: number; // Right ascension of the ascending node (degrees) (optional)
  ARG_OF_PERICENTER?: number; // Argument of perigee (degrees) (optional)
  MEAN_ANOMALY?: number; // Mean anomaly (degrees) (optional)
  EPHEMERIS_TYPE?: number; // Ephemeris type indicator (optional)
  CLASSIFICATION_TYPE?: string; // Classification type ('U' for unclassified) (optional)
  NORAD_CAT_ID: number; // NORAD catalog ID
  ELEMENT_SET_NO?: number; // Element set number (optional)
  REV_AT_EPOCH?: number; // Revolution number at epoch (optional)
  BSTAR?: number; // BSTAR drag term (optional)
  MEAN_MOTION_DOT?: number; // First derivative of mean motion (optional)
  MEAN_MOTION_DDOT?: number; // Second derivative of mean motion (optional)
  SEMIMAJOR_AXIS?: number; // Semi-major axis (km) (optional)
  PERIOD?: number; // Orbital period (minutes) (optional)
  APOAPSIS?: number; // Apogee altitude (km) (optional)
  PERIAPSIS?: number; // Perigee altitude (km) (optional)
  OBJECT_TYPE?: string; // Type of object (e.g., 'PAYLOAD', 'ROCKET BODY') (optional)
  RCS_SIZE?: string; // Radar cross-section size ('SMALL', 'MEDIUM', 'LARGE') (optional)
  COUNTRY_CODE?: string; // Country code of ownership (optional)
  LAUNCH_DATE?: Date; // Launch date of the object (optional)
  SITE?: string; // Launch site (optional)
  DECAY_DATE?: Date; // Decay date (if applicable) (optional)
  FILE?: number; // File identifier (optional)
  GP_ID: number; // Unique identifier for the GP record
  TLE_LINE0?: string; // TLE line 0 (name of the satellite) (optional)
  TLE_LINE1?: string; // TLE line 1 containing orbital elements (optional)
  TLE_LINE2?: string; // TLE line 2 containing orbital elements (optional)
}

export const satelliteDataAtom = atom<SatelliteData[]>([]);

export const useLoadSatelliteData = () => {
  const setSatelliteData = useSetAtom(satelliteDataAtom);
  
  useEffect(() => {
    const loadSatelliteData = async () => {
      const basePath = window.location.pathname.startsWith('/orbital-eye')
        ? '/orbital-eye/'
        : '/';
      const response = await fetch(`${basePath}data/satellite-gp.json`);
      const data = await response.json();
      setSatelliteData(data);
    };
    loadSatelliteData();
  });
};
