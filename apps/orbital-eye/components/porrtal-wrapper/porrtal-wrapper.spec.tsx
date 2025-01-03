import { render } from '@testing-library/react';

import PorrtalWrapper from './porrtal-wrapper';

describe('PorrtalWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PorrtalWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
