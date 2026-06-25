import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Award, AlertCircle, FileText, Download, Calendar, CheckCircle } from 'lucide-react';
import styles from './Certificates.module.css';
import { fetchCertificateData } from '../../services/api';

export default function Certificates() {
  const [emailInput, setEmailInput] = useState('');
  const [searchResult, setSearchResult] = useState(null); // 'not_found' | participant object
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    try {
      const data = await fetchCertificateData(emailInput.trim().toLowerCase());
      if (data && data.participant) {
        setSearchResult({
          name: data.participant.name,
          email: data.participant.email,
          courses: data.courses || [],
        });
      } else {
        setSearchResult('not_found');
      }
    } catch (err) {
      setSearchResult('not_found');
    }
  };

  return (
    <section className={styles.section} id="certificados">
      <div className="container">
        
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>VALIDAÇÃO DE DOCUMENTOS</span>
          <h2 className={styles.title}>Emissão de Certificados</h2>
          <p className={styles.subtitle}>
            Digite seu e-mail de inscrição para consultar e visualizar seus certificados de participação e minicursos.
          </p>
        </div>

        {/* Search Bar */}
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.inputWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="email"
                placeholder="digite seu e-mail de cadastro (ex: ana@orto.com)"
                className={styles.searchInput}
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.searchBtn} id="certificates-search-btn">
              Consultar
            </button>
          </form>
        </div>

        {/* Results */}
        <div className={styles.resultsArea}>
          <AnimatePresence mode="wait">
            {searched && searchResult === 'not_found' && (
              <motion.div
                key="not_found"
                className={styles.errorCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <AlertCircle className={styles.errorIcon} size={36} />
                <div className={styles.errorDetails}>
                  <h3>Participante não encontrado</h3>
                  <p>
                    O e-mail <strong>{emailInput}</strong> não consta em nossa lista de inscritos. Certifique-se de que digitou o e-mail correto ou realize sua inscrição.
                  </p>
                </div>
              </motion.div>
            )}

            {searched && searchResult && searchResult !== 'not_found' && (
              <motion.div
                key="found"
                className={styles.successContainer}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                
                {/* Main Event Certificate */}
                <div className={styles.certificateCard}>
                  {/* Decorative Borders */}
                  <div className={styles.certBorder} />
                  <div className={styles.certContent}>
                    <div className={styles.certHeader}>
                      <div className={styles.certLogo}>🦴 SIORT 2026</div>
                      <div className={styles.certSeal}>
                        <Award size={48} />
                      </div>
                    </div>

                    <h3 className={styles.certMainTitle}>CERTIFICADO DE PARTICIPAÇÃO</h3>
                    <p className={styles.certIntro}>Certificamos para os devidos fins de direito que</p>
                    <p className={styles.participantName}>{searchResult.name}</p>
                    <p className={styles.certBody}>
                      participou ativamente do <strong>I Simpósio de Implantes Ortopédicos (SIORT)</strong>, realizado no Centro de Convenções de Brasília — DF, no período de 15 a 17 de Agosto de 2026, na qualidade de <strong>Congressista</strong>, cumprindo uma carga horária total de <strong>24 horas</strong> acadêmicas.
                    </p>

                    <div className={styles.certMeta}>
                      <span className={styles.metaText}>
                        <Calendar size={14} /> Brasília, 17 de Agosto de 2026.
                      </span>
                    </div>

                    <div className={styles.signatures}>
                      <div className={styles.sigLine}>
                        <div className={styles.handwrittenSig}>Dr. Alexandre de Mello</div>
                        <span className={styles.sigTitle}>Presidente da Comissão Científica</span>
                      </div>
                      <div className={styles.sigLine}>
                        <div className={styles.handwrittenSig}>Dra. Clarice Mendes</div>
                        <span className={styles.sigTitle}>Coordenação Geral SIORT</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Certificates if enrolled */}
                {searchResult.courses && searchResult.courses.length > 0 ? (
                  <div className={styles.coursesArea}>
                    <h3 className={styles.coursesSectionTitle}>
                      <CheckCircle size={22} className={styles.successColor} />
                      Certificados dos Minicursos Concluídos
                    </h3>
                    
                    <div className={styles.coursesGrid}>
                      {searchResult.courses.map((course) => (
                        <div key={course.id} className={styles.miniCertCard}>
                          <div className={styles.miniCertBorder} />
                          <div className={styles.miniCertContent}>
                            <div className={styles.miniCertHeader}>
                              <span className={styles.miniLogo}>SIORT 🦴 MINICURSO</span>
                              <Award size={24} className={styles.goldColor} />
                            </div>
                            <h4 className={styles.miniCertTitle}>{course.title}</h4>
                            <p className={styles.miniCertText}>
                              Certificamos que <strong>{searchResult.name}</strong> concluiu com aproveitamento o minicurso teórico-prático acima, ministrado durante o simpósio com carga horária de <strong>4 horas</strong>.
                            </p>
                            <div className={styles.miniCertFooter}>
                              <span className={styles.miniInstructor}>Instrutor: {course.instructor || 'Especialista SIORT'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className={styles.noCoursesAlert}>
                    <FileText size={20} />
                    <span>Nenhum minicurso registrado para este participante. Acesse a aba de Minicursos para se inscrever.</span>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
