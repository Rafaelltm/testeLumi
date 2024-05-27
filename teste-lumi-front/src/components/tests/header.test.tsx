import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

import "@testing-library/jest-dom";

describe('Header', () => {
  test('renders header with links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();

    const bibliotecaLink = screen.getByText('Biblioteca de Faturas');
    expect(bibliotecaLink).toBeInTheDocument();
    expect(bibliotecaLink).toHaveAttribute('href', '/library');

    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute('href', '/');

    fireEvent.click(dashboardLink);

    expect(window.location.pathname).toBe('/');

    fireEvent.click(bibliotecaLink);

    expect(window.location.pathname).toBe('/library');
  });
});