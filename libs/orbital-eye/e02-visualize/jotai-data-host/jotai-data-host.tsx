import { ReactNode, useEffect } from 'react';
import styles from './jotai-data-host.module.scss';
import { atom, useSetAtom } from 'jotai';
import { satelliteDataAtom, useLoadSatelliteData } from './data/satellite-data';
import {
  conjunctionForecastAtom,
  useLoadConjunctionData,
} from './data/public-conjunction-data';

export interface JotaiDataHostProps {
  children: ReactNode;
}
export function JotaiDataHost(props: JotaiDataHostProps) {
  useLoadSatelliteData();
  useLoadConjunctionData();

  return (props.children)
}

export default JotaiDataHost;
