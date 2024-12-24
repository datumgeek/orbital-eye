import styles from './index.module.scss';
import dynamic from 'next/dynamic';

const DynamicOrbitVisualizer = dynamic(
  () => import('@orbital-eye/e01-visualize').then((mod) => mod.OrbitVisualizer),
  {
    ssr: false, // Disable SSR for this component
  }
);

export function Index() {
  return (
    <div>
      <div>hello orbital-eye :)</div>
      <DynamicOrbitVisualizer />
    </div>
  );
}

export default Index;
