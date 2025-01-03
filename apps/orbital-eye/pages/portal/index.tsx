import styles from './index.module.scss';
import dynamic from 'next/dynamic';

const DynamicPorrtalWrapper = dynamic(
  () => import('../../components/porrtal-wrapper/porrtal-wrapper').then((mod) => mod.PorrtalWrapper),
  {
    ssr: false,
  }
)

export default function Index() {
  return (
    <div className={styles['container']}>
      <DynamicPorrtalWrapper />
    </div>
  );
}
