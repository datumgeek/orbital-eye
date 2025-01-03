import { ReactNode, useEffect } from 'react';
import styles from './jotai-data-host.module.scss';
import { useSetAtom } from 'jotai';
import { satelliteDataAtom } from './data/satellite-data';

export interface JotaiDataHostProps {
  children: ReactNode;
}
export function JotaiDataHost(props: JotaiDataHostProps) {
  const setSatelliteData = useSetAtom(satelliteDataAtom);
  useEffect(() => {
    const loadSatelliteData = async () => {
      const response = await fetch('/data/satellite-gp.json');
      const data = await response.json();
      setSatelliteData(data);
    }
    loadSatelliteData();
  })
  return props.children;
}

export default JotaiDataHost;
