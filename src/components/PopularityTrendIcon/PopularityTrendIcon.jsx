import { useId } from 'react';
import styles from './PopularityTrendIcon.module.css';

const UP_POINTS = '3,14 8,10 12,11 16,7 20,8 25,4';
const DOWN_POINTS = '3,6 8,10 12,9 16,13 20,12 25,16';

export function PopularityTrendIcon({ trend = 'up' }) {
  const rawId = useId();
  const markerId = `trend-arrow-${rawId.replace(/:/g, '')}`;
  const isUp = trend === 'up';

  return (
    <svg
      className={`${styles.chart} ${isUp ? styles.up : styles.down}`}
      viewBox="0 0 28 20"
      aria-hidden
    >
      <rect className={styles.bg} width="28" height="20" rx="4" />
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 8 8"
          markerWidth="4"
          markerHeight="4"
          refX="6"
          refY="4"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path className={styles.markerHead} d="M0,1 L7,4 L0,7 Z" />
        </marker>
      </defs>
      <polyline
        className={styles.line}
        points={isUp ? UP_POINTS : DOWN_POINTS}
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  );
}
