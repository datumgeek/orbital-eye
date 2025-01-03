import { render } from '@testing-library/react';

import ConjunctionList from './conjunction-list';

describe('ConjunctionList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ConjunctionList />);
    expect(baseElement).toBeTruthy();
  });
});
