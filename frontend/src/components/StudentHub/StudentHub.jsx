import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, LogOut, BookOpen, Clock, Award, FileText, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import styles from './StudentHub.module.css';

export default function StudentHub({ activeUser, courses = [], userEnrollments = [], onLogout }) {
  // Filter courses that the student is actually enrolled in
  const myCourses = useMemo(() => {
    return courses.filter((c) => userEnrollments.includes(c.id));
  }, [courses, userEnrollments]);

  // Active selected course
  const [selectedCourse, setSelectedCourse] = useState(myCourses[0] || null);

  // Active selected lesson/video (mock)
  const mockLessons = [
    { id: 1, title: 'Parte 1: Conceitos Iniciais e Biofísica', duration: '45 min' },
    { id: 2, title: 'Parte 2: Análise e Seleção de Caso Clínico', duration: '55 min' },
    { id: 3, title: 'Parte 3: Demonstração Cirúrgica e Implantação', duration: '1h 15min' },
  ];
  const [activeLesson, setActiveLesson] = useState(mockLessons[0]);

  // Video completion checklist (simulated state)
  const [completedLessons, setCompletedLessons] = useState({});

  const toggleLessonComplete = (lessonId) => {
    setCompletedLessons((prev) => ({
      ...prev,
      [selectedCourse.id]: {
        ...(prev[selectedCourse.id] || {}),
        [lessonId]: !(prev[selectedCourse.id] || {})[lessonId],
      },
    }));
  };

  const getProgress = (courseId) => {
    const courseCompletes = completedLessons[courseId] || {};
    const count = Object.values(courseCompletes).filter(Boolean).length;
    return Math.round((count / mockLessons.length) * 100);
  };

  return (
    <div className={styles.container}>
      {/* Top Navbar */}
      <header className={styles.navbar}>
        <div className={styles.navLeft}>
          <span className={styles.logo}>🦴 SIORT</span>
          <span className={styles.divider}>/</span>
          <span className={styles.viewName}>Portal do Aluno</span>
        </div>
        <div className={styles.navRight}>
          <span className={styles.welcomeText}>
            Olá, <strong>{activeUser?.name}</strong>
          </span>
          <button className={styles.logoutBtn} onClick={onLogout}>
            <LogOut size={16} /> Sair
          </button>
        </div>
      </header>

      {myCourses.length === 0 ? (
        <div className={styles.emptyState}>
          <BookOpen size={48} className={styles.emptyIcon} />
          <h2>Nenhuma Matrícula Ativa</h2>
          <p>Você ainda não está matriculado em nenhum minicurso do SIORT 2026.</p>
          <button className={styles.backButton} onClick={onLogout}>
            <ArrowLeft size={16} /> Voltar à Página Principal
          </button>
        </div>
      ) : (
        <div className={styles.mainLayout}>
          {/* Left Panel: Course Curriculum & Video Player */}
          <div className={styles.contentArea}>
            {selectedCourse && (
              <motion.div
                key={selectedCourse.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className={styles.coursePanel}
              >
                <div className={styles.courseHeaderInfo}>
                  <span className={styles.eyebrow}>ASSISTINDO AGORA</span>
                  <h1 className={styles.courseTitle}>{selectedCourse.title}</h1>
                  <span className={styles.instructor}>Instrutor: {selectedCourse.instructor}</span>
                </div>

                {/* Simulated Video Player */}
                <div className={styles.videoPlayerContainer}>
                  <div className={styles.videoOverlay}>
                    <Play size={48} className={styles.playIcon} />
                    <span className={styles.videoTitle}>Reproduzindo: {activeLesson.title}</span>
                  </div>
                  <div className={styles.videoControls}>
                    <div className={styles.progressLine}>
                      <div className={styles.progressFill} style={{ width: '40%' }} />
                    </div>
                    <div className={styles.controlsRow}>
                      <span>15:40 / {activeLesson.duration}</span>
                      <button
                        className={styles.completeBtn}
                        onClick={() => toggleLessonComplete(activeLesson.id)}
                      >
                        {(completedLessons[selectedCourse.id] || {})[activeLesson.id] ? (
                          <>
                            <CheckCircle2 size={16} className={styles.checked} /> Aula Concluída
                          </>
                        ) : (
                          'Marcar como Concluída'
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selected Lesson Description */}
                <div className={styles.descriptionSection}>
                  <h3>Sobre esta aula</h3>
                  <p>{selectedCourse.description}</p>
                  <div className={styles.metaRow}>
                    <div className={styles.metaBadge}>
                      <Clock size={14} /> <span>Duração: {selectedCourse.duration}</span>
                    </div>
                    <div className={styles.metaBadge}>
                      <Award size={14} /> <span>Horário: {selectedCourse.schedule}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Panel: Sidebar Course List & Lessons */}
          <aside className={styles.sidebar}>
            {/* My Courses List */}
            <div className={styles.sidebarSection}>
              <h3 className={styles.sidebarTitle}>Meus Minicursos ({myCourses.length})</h3>
              <div className={styles.courseList}>
                {myCourses.map((c) => {
                  const active = selectedCourse?.id === c.id;
                  const progress = getProgress(c.id);
                  return (
                    <button
                      key={c.id}
                      className={`${styles.courseItem} ${active ? styles.courseItemActive : ''}`}
                      onClick={() => {
                        setSelectedCourse(c);
                        setActiveLesson(mockLessons[0]);
                      }}
                    >
                      <span className={styles.courseItemTitle}>{c.title}</span>
                      <div className={styles.progressContainer}>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFillBar} style={{ width: `${progress}%` }} />
                        </div>
                        <span className={styles.progressPercent}>{progress}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Course's Lessons */}
            {selectedCourse && (
              <div className={styles.sidebarSection}>
                <h3 className={styles.sidebarTitle}>Grade de Aulas</h3>
                <div className={styles.lessonsList}>
                  {mockLessons.map((l) => {
                    const isActive = activeLesson.id === l.id;
                    const isDone = (completedLessons[selectedCourse.id] || {})[l.id];
                    return (
                      <button
                        key={l.id}
                        className={`${styles.lessonItem} ${isActive ? styles.lessonItemActive : ''}`}
                        onClick={() => setActiveLesson(l)}
                      >
                        <div className={styles.lessonMeta}>
                          {isDone ? (
                            <CheckCircle2 size={16} className={styles.lessonChecked} />
                          ) : (
                            <Play size={14} className={styles.lessonPlay} />
                          )}
                          <span className={styles.lessonTitle}>{l.title}</span>
                        </div>
                        <span className={styles.lessonDuration}>{l.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
