import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      // Offset scroll height for fixed navbar (approx 80px)
      const navbarHeight = 80;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      id="navbar"
    >
      <div className={`container ${styles.navContent}`}>
        <a href="#home" className={styles.logo} onClick={(e) => handleNavClick(e, 'home')}>
          <span className={styles.logoIcon}>🦴</span>
          <span>SIORT</span>
        </a>

        <div className={`${styles.navLinks} ${mobileOpen ? styles.open : ''}`}>
          <a
            href="#home"
            className={`${styles.navLink} ${activeSection === 'home' ? styles.navLinkActive : ''}`}
            onClick={(e) => handleNavClick(e, 'home')}
          >
            Início
          </a>
          <a
            href="#apresentacao"
            className={`${styles.navLink} ${activeSection === 'apresentacao' ? styles.navLinkActive : ''}`}
            onClick={(e) => handleNavClick(e, 'apresentacao')}
          >
            Sobre
          </a>
          <a
            href="#implantes"
            className={`${styles.navLink} ${activeSection === 'implantes' ? styles.navLinkActive : ''}`}
            onClick={(e) => handleNavClick(e, 'implantes')}
          >
            Implantes
          </a>
          <a
            href="#minicursos"
            className={`${styles.navLink} ${activeSection === 'minicursos' ? styles.navLinkActive : ''}`}
            onClick={(e) => handleNavClick(e, 'minicursos')}
          >
            Minicursos
          </a>
          <a
            href="#certificados"
            className={`${styles.navLink} ${activeSection === 'certificados' ? styles.navLinkActive : ''}`}
            onClick={(e) => handleNavClick(e, 'certificados')}
          >
            Certificados
          </a>
          <button
            className={styles.ctaButton}
            onClick={(e) => handleNavClick(e, 'inscricao')}
            id="nav-cta-inscreva"
          >
            Inscreva-se
          </button>
        </div>

        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Abrir menu"
          id="hamburger-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
