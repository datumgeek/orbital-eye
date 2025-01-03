import { ReactNode } from 'react';
import styles from './jotai-data-host.module.scss';

export interface JotaiDataHostProps {
  children: ReactNode;
}
export function JotaiDataHost(props: JotaiDataHostProps) {
  return props.children;
}

export default JotaiDataHost;
