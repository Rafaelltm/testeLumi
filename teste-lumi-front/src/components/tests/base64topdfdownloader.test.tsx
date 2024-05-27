import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import "@testing-library/jest-dom";
import Base64ToPdfDownloader from '../Base64ToPdfDownloader';

describe('Base64ToPdfDownloader', () => {
  test('renders Base64ToPdfDownloader', () => {
    render(
      <BrowserRouter>
        <Base64ToPdfDownloader base64String='teste' fileName='teste.pdf' isDisabled={false} btnClassName='teste' />
      </BrowserRouter>
    );

    const downloadBtn = screen.getByText('Download Fatura');
    expect(downloadBtn).toBeInTheDocument();
  });
});