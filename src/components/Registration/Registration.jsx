import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, User, Mail, Phone, CheckCircle, AlertCircle, LogIn } from 'lucide-react';
import styles from './Registration.module.css';

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    const navbarHeight = 80;
    const pos = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top: pos, behavior: 'smooth' });
  }
}

export default function Registration({
  participants,
  onRegister,
  activeUser,
  onLogin,
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Mode: 'register' or 'login'
  const [mode, setMode] = useState('register');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // Form validations
  const validateForm = useCallback((formData) => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Nome completo é obrigatório.';
    } else if (formData.name.trim().length < 3) {
      errs.name = 'O nome deve ter pelo menos 3 caracteres.';
    }

    if (!formData.email.trim()) {
      errs.email = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'E-mail inválido.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Telefone é obrigatório.';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Telefone deve conter DDD e pelo menos 10 dígitos.';
    }
    return errs;
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const newForm = { ...form, [field]: value };
    setForm(newForm);

    if (touched[field]) {
      const fieldErrors = validateForm(newForm);
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldErrors[field]) {
          next[field] = fieldErrors[field];
        } else {
          delete next[field];
        }
        return next;
      });
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateForm(form);
    if (fieldErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true });
    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Register
    onRegister(form);
    setLoading(false);
    setSuccess(true);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const emailStr = loginEmail.trim().toLowerCase();
    const found = participants.find((p) => p.email.toLowerCase() === emailStr);
    
    if (found) {
      onLogin(found);
      // Scroll directly to minicourses section
      setTimeout(() => scrollTo('minicursos'), 300);
    } else {
      setLoginError('E-mail não cadastrado no evento. Por favor, verifique a grafia ou inscreva-se.');
    }
  };

  // Live registration counter calculation (base mock number 142 + actual state count)
  const counterBase = 142;
  const totalSubscribers = counterBase + participants.length;

  return (
    <section className={styles.section} id="inscricao">
      <div className="container">
        <div className={styles.grid}>
          
          {/* Info Panel with Real-time Counter */}
          <motion.div
            className={styles.infoPanel}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.eyebrow}>INSCRIÇÃO ONLINE</span>
            <h2 className={styles.title}>Participe do SIORT 2026</h2>
            <p className={styles.description}>
              Garanta já sua vaga no maior simpósio de implantes ortopédicos do país. Ao realizar sua inscrição no evento principal, você libera acesso para se matricular em nossos minicursos teóricos e práticos exclusivos.
            </p>

            {/* Counter Card */}
            <div className={styles.counterCard}>
              <div className={styles.counterIcon}>
                <Users size={32} />
              </div>
              <div className={styles.counterDetails}>
                <span className={styles.counterTitle}>Participantes Confirmados</span>
                <span className={styles.counterValue}>
                  {totalSubscribers}
                </span>
                <span className={styles.counterSubtitle}>
                  Vagas preenchendo rapidamente (limite de 300)
                </span>
              </div>
            </div>

            {/* Session Info if logged in */}
            {activeUser && (
              <div className={styles.activeUserCard}>
                <CheckCircle size={20} className={styles.successColor} />
                <div>
                  <p className={styles.activeUserTitle}>Conectado como:</p>
                  <p className={styles.activeUserName}>{activeUser.name}</p>
                  <p className={styles.activeUserEmail}>{activeUser.email}</p>
                </div>
                <button
                  onClick={() => scrollTo('minicursos')}
                  className={styles.activeUserBtn}
                >
                  Ir para Minicursos
                </button>
              </div>
            )}
          </motion.div>

          {/* Form Panel */}
          <motion.div
            className={styles.formPanel}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {success ? (
              <div className={styles.successState}>
                <div className={styles.successIconWrapper}>
                  <CheckCircle size={48} />
                </div>
                <h3 className={styles.successTitle}>Inscrição Confirmada!</h3>
                <p className={styles.successText}>
                  Parabéns! Sua inscrição no <strong>I Simpósio de Implantes Ortopédicos</strong> foi concluída com sucesso.
                </p>
                <div className={styles.registeredSummary}>
                  <p><strong>Nome:</strong> {form.name}</p>
                  <p><strong>E-mail:</strong> {form.email}</p>
                  <p><strong>Telefone:</strong> {form.phone}</p>
                </div>
                <div className={styles.successActions}>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setForm({ name: '', email: '', phone: '' });
                      setTouched({});
                      setTimeout(() => scrollTo('minicursos'), 300);
                    }}
                    className={styles.btnPrimary}
                  >
                    Acessar Minicursos
                  </button>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setForm({ name: '', email: '', phone: '' });
                      setTouched({});
                      setMode('register');
                    }}
                    className={styles.btnSecondary}
                  >
                    Nova Inscrição
                  </button>
                </div>
              </div>
            ) : (
              <>

                {/* Tabs inside panel for Register / Login */}
                <div className={styles.tabsHeader}>
                  <button
                    className={`${styles.tabBtn} ${mode === 'register' ? styles.activeTab : ''}`}
                    onClick={() => setMode('register')}
                  >
                    Nova Inscrição
                  </button>
                  <button
                    className={`${styles.tabBtn} ${mode === 'login' ? styles.activeTab : ''}`}
                    onClick={() => setMode('login')}
                  >
                    Já sou inscrito
                  </button>
                </div>

                {mode === 'register' ? (
                  <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <h3 className={styles.panelTitle}>Preencha seus dados</h3>

                    {/* Full Name */}
                    <div className={styles.fieldGroup}>
                      <label htmlFor="reg-name" className={styles.label}>
                        Nome Completo <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWrapper}>
                        <User size={18} className={styles.inputIcon} />
                        <input
                          id="reg-name"
                          type="text"
                          className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
                          placeholder="Dr(a). Alexandre de Mello"
                          value={form.name}
                          onChange={handleChange('name')}
                          onBlur={handleBlur('name')}
                          disabled={loading}
                        />
                      </div>
                      {errors.name && touched.name && (
                        <span className={styles.errorMsg}>
                          <AlertCircle size={12} /> {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Email */}
                    <div className={styles.fieldGroup}>
                      <label htmlFor="reg-email" className={styles.label}>
                        E-mail <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWrapper}>
                        <Mail size={18} className={styles.inputIcon} />
                        <input
                          id="reg-email"
                          type="email"
                          className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                          placeholder="exemplo@hospital.com"
                          value={form.email}
                          onChange={handleChange('email')}
                          onBlur={handleBlur('email')}
                          disabled={loading}
                        />
                      </div>
                      {errors.email && touched.email && (
                        <span className={styles.errorMsg}>
                          <AlertCircle size={12} /> {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Phone */}
                    <div className={styles.fieldGroup}>
                      <label htmlFor="reg-phone" className={styles.label}>
                        Telefone de Contato <span className={styles.required}>*</span>
                      </label>
                      <div className={styles.inputWrapper}>
                        <Phone size={18} className={styles.inputIcon} />
                        <input
                          id="reg-phone"
                          type="tel"
                          className={`${styles.input} ${errors.phone && touched.phone ? styles.inputError : ''}`}
                          placeholder="(11) 99999-9999"
                          value={form.phone}
                          onChange={handleChange('phone')}
                          onBlur={handleBlur('phone')}
                          disabled={loading}
                        />
                      </div>
                      {errors.phone && touched.phone && (
                        <span className={styles.errorMsg}>
                          <AlertCircle size={12} /> {errors.phone}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={loading}
                      id="registration-submit"
                    >
                      {loading ? (
                        <>
                          <span className={styles.spinner} /> Registrando...
                        </>
                      ) : (
                        'Confirmar Inscrição'
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleLoginSubmit} className={styles.form}>
                    <h3 className={styles.panelTitle}>Acesse seu Painel</h3>
                    <p className={styles.loginSubtitle}>
                      Digite seu e-mail cadastrado no simpósio para fazer login e gerenciar seus minicursos.
                    </p>

                    {/* Email Input */}
                    <div className={styles.fieldGroup}>
                      <label htmlFor="login-email" className={styles.label}>
                        E-mail de Cadastro
                      </label>
                      <div className={styles.inputWrapper}>
                        <Mail size={18} className={styles.inputIcon} />
                        <input
                          id="login-email"
                          type="email"
                          className={styles.input}
                          placeholder="digite seu e-mail"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                      {loginError && (
                        <span className={styles.errorMsg}>
                          <AlertCircle size={12} /> {loginError}
                        </span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className={styles.submitBtn}
                      id="login-submit"
                    >
                      <LogIn size={18} />
                      Conectar
                    </button>
                  </form>
                )}
              </>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
