import React from 'react';

import './styles.css';
import Header from '../Header';

interface IPageProps {
  title: string;
  children: React.ReactNode;
  isMain: Boolean;
}

const Container: React.FC<IPageProps> = ({ title, children, isMain }) => {
  return (
    <div className="page-container">
      {isMain && <Header />}
      <div className={`page-title ${isMain ? 'isMain' : ''}`}>
        <p>{title}</p>
      </div>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}

export default Container;