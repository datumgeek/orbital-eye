import { Box, Typography } from '@mui/material';
import styles from './satellite-details.module.scss';
import { StateObject, ViewComponentProps } from '@porrtal/r-api';
import { useAtom } from 'jotai';
import { satelliteDataAtom } from '../jotai-data-host/data/satellite-data';

export function SatelliteDetails(props: ViewComponentProps) {
  const state: StateObject | undefined = props.viewState.state;
  const noradCatId = state?.['noradCatId'] as number;
  const [satelliteData] = useAtom(satelliteDataAtom);
  const satellite = satelliteData.find(
    (s) => noradCatId && s.NORAD_CAT_ID === noradCatId
  );

  return (
    <div className={styles['container']}>
      <h1>Satellite Details: {satellite?.OBJECT_NAME}</h1>
      {satellite && (
        <Box>
          {Object.entries(satellite).map(([key, value]) => (
            <Typography key={key} variant="body2" gutterBottom>
              <strong>{key}:</strong> {value?.toString() || 'N/A'}
            </Typography>
          ))}
        </Box>
      )}
      {!satellite && 'Satellite not found.'}
    </div>
  );
}

export default SatelliteDetails;
