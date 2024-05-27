import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles.css';

const Header: React.FC = () => {
  const location = useLocation();
  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to={`/`} className={`nav-link ${location.pathname === '/' ? 'selected' : ''}`}>Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to={`/library`} className={`nav-link ${location.pathname === '/library' ? 'selected' : ''}`}>Biblioteca de Faturas</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;