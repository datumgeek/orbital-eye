import styles from './orbit-visualizer.module.scss';

/* eslint-disable-next-line */
export interface OrbitVisualizerProps {}

export function OrbitVisualizer(props: OrbitVisualizerProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to OrbitVisualizer!</h1>
    </div>
  );
}

export default OrbitVisualizer;
