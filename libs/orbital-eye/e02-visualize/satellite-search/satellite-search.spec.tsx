import { render } from '@testing-library/react';

import SatelliteSearch from './satellite-search';

describe('SatelliteSearch', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SatelliteSearch />);
    expect(baseElement).toBeTruthy();
  });
});
