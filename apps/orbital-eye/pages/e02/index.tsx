import styles from './index.module.scss';
import dynamic from 'next/dynamic';

const DynamicPorrtalWrapper = dynamic(
  () => import('../../components/e02-porrtal-wrapper/e02-porrtal-wrapper').then((mod) => mod.E02PorrtalWrapper),
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
