import { render } from '@testing-library/react';

import OrbitVisualizer from './orbit-visualizer';

describe('OrbitVisualizer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<OrbitVisualizer />);
    expect(baseElement).toBeTruthy();
  });
});
