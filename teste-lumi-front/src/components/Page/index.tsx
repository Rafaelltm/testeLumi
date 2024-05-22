import React from 'react';

import './styles.css';

interface IPageProps {
  title: string;
  children: React.ReactNode;
}

const PageContainer: React.FC<IPageProps> = ({ title, children }) => {
  return (
    <div className="page-container">
      <div className="page-title">
        <p>{title}</p>
      </div>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
}

export default PageContainer;