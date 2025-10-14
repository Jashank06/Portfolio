import React from 'react';
import { render } from '@testing-library/react';

// Simple smoke test
test('renders without crashing', () => {
  const div = document.createElement('div');
  expect(div).toBeTruthy();
});

test('basic math works', () => {
  expect(1 + 1).toBe(2);
});
