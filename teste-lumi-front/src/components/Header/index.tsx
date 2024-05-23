import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to={`/`} className="nav-link">Biblioteca de Faturas</Link>
          </li>
          <li className="nav-item">
            <Link to={`/dashboard`} className="nav-link">Dashboard</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;