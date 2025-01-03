import { render } from '@testing-library/react';

import ConjunctionDetails from './conjunction-details';

describe('ConjunctionDetails', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ConjunctionDetails />);
    expect(baseElement).toBeTruthy();
  });
});
