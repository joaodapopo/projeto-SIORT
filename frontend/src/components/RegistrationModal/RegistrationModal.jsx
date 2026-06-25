import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, UserPlus } from 'lucide-react';
import styles from './RegistrationModal.module.css';

const initialForm = {
  name: '',
  email: '',
  institution: '',
  role: '',
};

const initialErrors = {};

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Nome completo é obrigatório.';
  } else if (form.name.trim().length < 3) {
    errors.name = 'Nome deve ter ao menos 3 caracteres.';
  }

  if (!form.email.trim()) {
    errors.email = 'E-mail é obrigatório.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'E-mail inválido.';
  }

  if (!form.institution.trim()) {
    errors.institution = 'Instituição é obrigatória.';
  }

  if (!form.role.trim()) {
    errors.role = 'Cargo é obrigatório.';
  }

  return errors;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.25 },
  },
};

export default function RegistrationModal({ isOpen, onClose, onRegister }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState({});

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleChange = useCallback(
    (field) => (e) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      // Live validation for touched fields
      if (touched[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          const fieldErrors = validate({ ...form, [field]: value });
          if (fieldErrors[field]) {
            newErrors[field] = fieldErrors[field];
          } else {
            delete newErrors[field];
          }
          return newErrors;
        });
      }
    },
    [form, touched]
  );

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(form);
    if (fieldErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, institution: true, role: true });
    const validationErrors = validate(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onRegister({ ...form, registeredAt: new Date().toISOString() });
    setSubmitting(false);
    setSuccess(true);
  };

  const handleClose = () => {
    setForm(initialForm);
    setErrors(initialErrors);
    setTouched({});
    setSubmitting(false);
    setSuccess(false);
    onClose();
  };

  const renderField = (field, label, type = 'text', placeholder = '') => (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor={`field-${field}`}>
        {label}
        <span className={styles.required}>*</span>
      </label>
      <input
        id={`field-${field}`}
        type={type}
        className={`${styles.input} ${errors[field] && touched[field] ? styles.inputError : ''}`}
        value={form[field]}
        onChange={handleChange(field)}
        onBlur={handleBlur(field)}
        placeholder={placeholder}
        disabled={submitting}
      />
      {errors[field] && touched[field] && (
        <span className={styles.errorMessage}>
          <AlertCircle size={12} />
          {errors[field]}
        </span>
      )}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
          id="registration-overlay"
        >
          <motion.div
            className={styles.modal}
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            id="registration-modal"
          >
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Fechar"
              id="modal-close"
            >
              <X size={18} />
            </button>

            {success ? (
              <motion.div
                className={styles.successState}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={styles.successIcon}>
                  <CheckCircle size={36} />
                </div>
                <h3 className={styles.successTitle}>Inscrição Confirmada!</h3>
                <p className={styles.successText}>
                  Sua inscrição foi registrada com sucesso. Em breve você
                  receberá um e-mail com mais detalhes sobre o evento.
                </p>
                <button
                  className={styles.successClose}
                  onClick={handleClose}
                  id="modal-success-close"
                >
                  Fechar
                </button>
              </motion.div>
            ) : (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.modalIcon}>
                    <UserPlus size={24} />
                  </div>
                  <h2 className={styles.modalTitle}>Inscreva-se</h2>
                  <p className={styles.modalSubtitle}>
                    Preencha os campos abaixo para garantir sua vaga no simpósio.
                  </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  {renderField('name', 'Nome Completo', 'text', 'Dr. João Silva')}
                  {renderField('email', 'E-mail', 'email', 'joao@hospital.com')}
                  {renderField('institution', 'Instituição', 'text', 'Hospital das Clínicas')}
                  {renderField('role', 'Cargo', 'text', 'Ortopedista')}

                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={submitting}
                    id="modal-submit"
                  >
                    {submitting ? (
                      <>
                        <span className={styles.spinner} />
                        Processando...
                      </>
                    ) : (
                      'Confirmar Inscrição'
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
