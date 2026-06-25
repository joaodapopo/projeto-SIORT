import { Mail, MapPin, Phone } from 'lucide-react';
import styles from './Footer.module.css';

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    const navbarHeight = 80;
    const pos = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top: pos, behavior: 'smooth' });
  }
}

export default function Footer() {
  const handleClick = (e, id) => {
    e.preventDefault();
    scrollTo(id);
  };

  return (
    <footer className={styles.footer} id="contato">
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <span className={styles.footerLogoIcon}>🦴</span>
              <span>SIORT</span>
            </div>
            <p className={styles.footerDescription}>
              I Simpósio de Implantes Ortopédicos — Conectando ciência,
              tecnologia e prática clínica para transformar o futuro da
              ortopedia no Brasil.
            </p>
          </div>

          {/* Navigation */}
          <div className={styles.footerColumn}>
            <h4>Navegação</h4>
            <ul>
              <li>
                <a href="#home" onClick={(e) => handleClick(e, 'home')}>Início</a>
              </li>
              <li>
                <a href="#implantes" onClick={(e) => handleClick(e, 'implantes')}>Implantes</a>
              </li>
              <li>
                <a href="#minicursos" onClick={(e) => handleClick(e, 'minicursos')}>Minicursos</a>
              </li>
              <li>
                <a href="#inscricao" onClick={(e) => handleClick(e, 'inscricao')}>Inscreva-se</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className={styles.footerColumn}>
            <h4>Contato</h4>
            <ul>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="#5BB5F5" />
                contato@siort.com.br
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="#5BB5F5" />
                (61) 3000-0000
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color="#5BB5F5" />
                Brasília — DF
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span className={styles.copyright}>
            © 2026 SIORT — I Simpósio de Implantes Ortopédicos. Todos os
            direitos reservados.
          </span>
          <div className={styles.footerSocial}>
            <a href="#" className={styles.socialLink} aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" className={styles.socialLink} aria-label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" className={styles.socialLink} aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
