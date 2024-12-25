import { render } from '@testing-library/react';

import BoxScore from './box-score';

describe('BoxScore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BoxScore />);
    expect(baseElement).toBeTruthy();
  });
});
