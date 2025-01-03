import { render } from '@testing-library/react';

import E02PorrtalWrapper from './e02-porrtal-wrapper';

describe('E02PorrtalWrapper', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<E02PorrtalWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
