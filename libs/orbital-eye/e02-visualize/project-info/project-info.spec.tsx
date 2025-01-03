import { render } from '@testing-library/react';

import ProjectInfo from './project-info';

describe('ProjectInfo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProjectInfo />);
    expect(baseElement).toBeTruthy();
  });
});
