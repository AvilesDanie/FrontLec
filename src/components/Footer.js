// components/Footer.js
import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer className="text-center mt-5 pt-4 border-top">
      <p className="text-muted">🎮 Made with ❤️ by <a href="https://github.com/AvilesDanie" target="_blank" rel="noopener noreferrer" className="text-light">Daniel Aviles, Ariel Reyes, Kevin Coloma</a></p>
      <p className="text-muted">
        <a href="https://github.com/AvilesDanie/FrontLec.git" target="_blank" rel="noopener noreferrer" className="text-light">
          <i className="fab fa-github"></i> View on GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;