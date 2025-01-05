import { ReactNode } from 'react';
import { useLoadSatelliteData } from './data/satellite-data';
import {
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
