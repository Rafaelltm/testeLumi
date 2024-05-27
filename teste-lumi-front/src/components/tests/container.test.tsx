import React from 'react';
import { render, screen } from '@testing-library/react';
import Container from '../Container';

import "@testing-library/jest-dom";

describe('Container', () => {
  test('renders title and children', () => {
    const title = 'Test Title';
    const content = 'Test Content';

    render(
      <Container title={title} isMain={false}>
        {content}
      </Container>
    );

    const titleElement = screen.getByText(title);
    expect(titleElement).toBeInTheDocument();

    const contentElement = screen.getByText(content);
    expect(contentElement).toBeInTheDocument();
  });
});