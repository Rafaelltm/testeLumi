import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Header: React.FC<{ path?: string }> = ({ path }) => {
  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to={`/`} className={`nav-link ${path === '/' ? 'selected' : ''}`}>Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to={`/library`} className={`nav-link ${path === '/library' ? 'selected' : ''}`}>Biblioteca de Faturas</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;