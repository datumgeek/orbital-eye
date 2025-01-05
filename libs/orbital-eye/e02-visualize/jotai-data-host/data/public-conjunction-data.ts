import { atom, useSetAtom } from 'jotai';
import { useEffect } from 'react';

export interface ConjunctionWarning {
  cdmId: number; // Unique identifier for the conjunction
  created?: Date; // Date the CDM was generated
  emergencyReportable?: boolean; // Indicates if the conjunction is reportable as an emergency
  tca?: Date; // Time of closest approach
  minDistance?: number; // Minimum range between the satellites
  probability?: number; // Probability of collision
  satellite1: {
    id?: number;
    name?: string;
    objectType?: string;
    rcs?: string; // Radar cross-section size
    exclusionVolume?: string;
  };
  satellite2: {
    id?: number;
    name?: string;
    objectType?: string;
    rcs?: string;
    exclusionVolume?: string;
  };
}

export interface RawConjuctionWarning {
  CDM_ID: string; // Unique identifier for the conjunction (string to match raw incoming data)
  CREATED?: string; // Date the CDM was generated (nullable)
  EMERGENCY_REPORTABLE?: 'Y' | 'N'; // Indicates if the conjunction is reportable as an emergency (nullable)
  TCA?: string; // Time of closest approach (nullable)
  MIN_RNG?: string; // Minimum range between the satellites (nullable, raw data may be string)
  PC?: string; // Probability of collision (nullable, raw data may be string)
  SAT_1_ID?: string; // Satellite 1 ID (nullable, raw data may be string)
  SAT_1_NAME?: string; // Satellite 1 name (nullable)
  SAT1_OBJECT_TYPE?: string; // Satellite 1 object type (nullable)
  SAT1_RCS?: string; // Satellite 1 radar cross-section size (nullable)
  SAT_1_EXCL_VOL?: string; // Satellite 1 exclusion volume (nullable)
  SAT_2_ID?: string; // Satellite 2 ID (nullable, raw data may be string)
  SAT_2_NAME?: string; // Satellite 2 name (nullable)
  SAT2_OBJECT_TYPE?: string; // Satellite 2 object type (nullable)
  SAT2_RCS?: string; // Satellite 2 radar cross-section size (nullable)
  SAT_2_EXCL_VOL?: string; // Satellite 2 exclusion volume (nullable)
}

// Utility function to transform raw JSON into ConjunctionWarning objects
const transformConjunctionData = (
  data: RawConjuctionWarning[]
): ConjunctionWarning[] => {
  return data.map((item) => ({
    cdmId: parseInt(item.CDM_ID, 10),
    created: item?.CREATED ? new Date(item.CREATED) : undefined,
    emergencyReportable: item.EMERGENCY_REPORTABLE === 'Y',
    tca: item?.TCA ? new Date(item.TCA) : undefined,
    minDistance: item?.MIN_RNG ? parseFloat(item.MIN_RNG) : undefined,
    probability: item?.PC ? parseFloat(item.PC) : undefined,
    satellite1: {
      id: item?.SAT_1_ID ? parseInt(item.SAT_1_ID, 10) : undefined,
      name: item.SAT_1_NAME,
      objectType: item.SAT1_OBJECT_TYPE,
      rcs: item.SAT1_RCS,
      exclusionVolume: item.SAT_1_EXCL_VOL,
    },
    satellite2: {
      id: item?.SAT_2_ID ? parseInt(item.SAT_2_ID, 10) : undefined,
      name: item.SAT_2_NAME,
      objectType: item.SAT2_OBJECT_TYPE,
      rcs: item.SAT2_RCS,
      exclusionVolume: item.SAT_2_EXCL_VOL,
    },
  }));
};

export const conjunctionForecastAtom = atom<ConjunctionWarning[]>([]);

// React hook to load data from the JSON file into the Jotai atom
export const useLoadConjunctionData = () => {
    const setConjunctionWarnings = useSetAtom(conjunctionForecastAtom);
  
    useEffect(() => {
      const loadConjuctionForecastData = async () => {
        try {
          const response = await fetch('/data/public-conjunction.json');
          if (!response.ok) {
            throw new Error('Failed to fetch conjunction data');
          }
          const rawData = await response.json();
          const transformedData = transformConjunctionData(rawData);
          setConjunctionWarnings(transformedData);
        } catch (error) {
          console.error('Error loading conjunction data:', error);
        }
      };
  
      loadConjuctionForecastData();
    }, [setConjunctionWarnings]);
  };
  
  