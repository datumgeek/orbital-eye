import { render } from '@testing-library/react';

import TimeSliceViz from './time-slice-viz';

describe('TimeSliceViz', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TimeSliceViz />);
    expect(baseElement).toBeTruthy();
  });
});
