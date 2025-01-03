import { render } from '@testing-library/react';

import SatelliteDetails from './satellite-details';

describe('SatelliteDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SatelliteDetails />);
    expect(baseElement).toBeTruthy();
  });
});
