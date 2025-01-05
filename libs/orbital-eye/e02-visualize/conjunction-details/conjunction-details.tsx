import { StateObject, ViewComponentProps } from '@porrtal/r-api';
import styles from './conjunction-details.module.scss';
import { Box, Typography, Divider } from '@mui/material';
import { useAtom } from 'jotai';
import { satelliteDataAtom } from '../jotai-data-host/data/satellite-data';
import { conjunctionForecastAtom } from '../jotai-data-host/data/public-conjunction-data';

export const ConjunctionDetails = (props: ViewComponentProps) => {
  const state: StateObject | undefined = props.viewState.state;
  const cdmId = state?.['cdmId'] as number;
  const [conjunctionForecast] = useAtom(conjunctionForecastAtom);
  const conjunctionData = conjunctionForecast.find(
    (s) => cdmId && s.cdmId === cdmId
  );

  if (!conjunctionData) {
    return (<div>Conjunction not found.</div>);
  }

  return (
    <Box padding={2}>
      <Typography variant="h5" gutterBottom>
        Conjunction Details
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        CDM ID: {conjunctionData.cdmId}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Created: {conjunctionData.created ? conjunctionData.created.toLocaleString() : 'N/A'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Emergency Reportable: {conjunctionData.emergencyReportable ? 'Yes' : 'No'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        TCA: {conjunctionData.tca ? conjunctionData.tca.toLocaleString() : 'N/A'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Minimum Distance: {conjunctionData.minDistance !== undefined ? `${conjunctionData.minDistance.toFixed(3)} km` : 'N/A'}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Collision Probability: {conjunctionData.probability !== undefined ? conjunctionData.probability.toFixed(6) : 'N/A'}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Satellite 1 Details</Typography>
      <Typography variant="body1">
        ID: {conjunctionData.satellite1.id || 'N/A'}
      </Typography>
      <Typography variant="body1">
        Name: {conjunctionData.satellite1.name || 'N/A'}
      </Typography>
      <Typography variant="body1">
        Object Type: {conjunctionData.satellite1.objectType || 'N/A'}
      </Typography>
      <Typography variant="body1">
        RCS: {conjunctionData.satellite1.rcs || 'N/A'}
      </Typography>
      <Typography variant="body1">
        Exclusion Volume: {conjunctionData.satellite1.exclusionVolume || 'N/A'}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6">Satellite 2 Details</Typography>
      <Typography variant="body1">
        ID: {conjunctionData.satellite2.id || 'N/A'}
      </Typography>
      <Typography variant="body1">
        Name: {conjunctionData.satellite2.name || 'N/A'}
      </Typography>
      <Typography variant="body1">
        Object Type: {conjunctionData.satellite2.objectType || 'N/A'}
      </Typography>
      <Typography variant="body1">
        RCS: {conjunctionData.satellite2.rcs || 'N/A'}
      </Typography>
      <Typography variant="body1">
        Exclusion Volume: {conjunctionData.satellite2.exclusionVolume || 'N/A'}
      </Typography>
    </Box>
  );
};
export default ConjunctionDetails;
