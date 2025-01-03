import { render } from '@testing-library/react';

import JotaiDataHost from './jotai-data-host';

describe('JotaiDataHost', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<JotaiDataHost />);
    expect(baseElement).toBeTruthy();
  });
});
