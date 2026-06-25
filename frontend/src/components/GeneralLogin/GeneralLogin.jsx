import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';
import styles from './GeneralLogin.module.css';

export default function GeneralLogin({ onLogin, onBackToLanding }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await onLogin(email.trim().toLowerCase());
    } catch (err) {
      setErrorMsg(err.message || 'E-mail não cadastrado no simpósio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button className={styles.backBtn} onClick={onBackToLanding}>
          <ArrowLeft size={16} /> Voltar ao Início
        </button>

        <div className={styles.header}>
          <div className={styles.logo}>🦴 SIORT 2026</div>
          <h2 className={styles.title}>Login Geral</h2>
          <p className={styles.subtitle}>
            Insira o e-mail cadastrado para acessar a Área do Aluno ou o Painel do Administrador.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="login-email" className={styles.label}>
              E-mail de Inscrição
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="login-email"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className={styles.input}
              />
            </div>
            {errorMsg && (
              <span className={styles.errorMsg}>
                <ShieldAlert size={14} /> {errorMsg}
              </span>
            )}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <LogIn size={18} /> Entrar no Painel
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
