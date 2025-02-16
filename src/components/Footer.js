// components/Footer.js
import React from 'react';
import '../css/Footer.css';

const Footer = () => {
  return (
    <footer id="main-footer" className="text-center mt-5 pt-4 border-top">
      <p id="footer-made-by" className="text-muted text-light">
        🎮 Made with ❤️ by{" "}
        <a
          id="footer-github-link-1"
          href="https://github.com/AvilesDanie"
          target="_blank"
          rel="noopener noreferrer"
          className="text-light"
        >
          Daniel Aviles, {" "}
        </a>
        <a
          id="footer-github-link-2"
          href="https://github.com/ArielReyes04"
          target="_blank"
          rel="noopener noreferrer"
          className="text-light"
        >
          Ariel Reyes, {" "}
        </a>
        <a
          id="footer-github-link-2"
          href="https://github.com/KevinColoma"
          target="_blank"
          rel="noopener noreferrer"
          className="text-light"
        >
          Kevin Coloma
        </a>
      </p>
      <p id="footer-github-repo" className="text-muted">
        <a
          id="footer-repo-link"
          href="https://github.com/AvilesDanie/FrontLec.git"
          target="_blank"
          rel="noopener noreferrer"
          className="text-light"
        >
          <i id="footer-github-icon" className="fab fa-github"></i> View on GitHub
        </a>
      </p>
    </footer>
  );
};

export default Footer;