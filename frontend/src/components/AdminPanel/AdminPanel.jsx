import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  BookOpen, 
  Shield, 
  ArrowLeft, 
  Users, 
  UserCheck, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Mail,
  Phone,
  FileText
} from 'lucide-react';
import { 
  fetchCourses, 
  createCourse, 
  updateCourse, 
  deleteCourse, 
  fetchParticipants 
} from '../../services/api';
import styles from './AdminPanel.module.css';

export default function AdminPanel({ onBackToLanding }) {
  const [courses, setCourses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Tabs: 'participants' | 'enrollments' | 'crud'
  const [activeTab, setActiveTab] = useState('participants');

  // Search & Accordion State
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCourses, setExpandedCourses] = useState({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null); // null if creating, course object if editing

  // Form State
  const [form, setForm] = useState({
    title: '',
    instructor: '',
    description: '',
    duration: '',
    schedule: '',
    tagsString: '',
  });

  const loadAllData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [coursesData, participantsData] = await Promise.all([
        fetchCourses(),
        fetchParticipants()
      ]);
      setCourses(coursesData);
      setParticipants(participantsData);
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao carregar dados administrativos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCourse(null);
    setForm({
      title: '',
      instructor: '',
      description: '',
      duration: '',
      schedule: '',
      tagsString: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingCourse(course);
    const tagsArr = Array.isArray(course.parsedTags)
      ? course.parsedTags
      : Array.isArray(course.tags)
        ? course.tags
        : typeof course.tags === 'string'
          ? JSON.parse(course.tags || '[]')
          : [];

    setForm({
      title: course.title,
      instructor: course.instructor,
      description: course.description,
      duration: course.duration,
      schedule: course.schedule,
      tagsString: tagsArr.join(', '),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Deseja realmente excluir este minicurso permanentemente?')) return;
    try {
      await deleteCourse(id);
      loadAllData();
    } catch (err) {
      alert(err.message || 'Erro ao excluir minicurso.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedTags = form.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, {
          title: form.title,
          instructor: form.instructor,
          description: form.description,
          duration: form.duration,
          schedule: form.schedule,
          tags: parsedTags,
        });
      } else {
        await createCourse(
          form.title,
          form.instructor,
          form.description,
          form.duration,
          form.schedule,
          parsedTags
        );
      }
      setIsModalOpen(false);
      loadAllData();
    } catch (err) {
      setErrorMsg(err.message || 'Erro ao salvar minicurso.');
    }
  };

  const toggleExpandCourse = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  // Filter participants by search term (name, email, or cpf)
  const filteredParticipants = participants.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(searchLower) ||
      p.email.toLowerCase().includes(searchLower) ||
      p.cpf.includes(searchLower)
    );
  });

  return (
    <div className={styles.container}>
      {/* Admin Header */}
      <header className={styles.navbar}>
        <div className={styles.navLeft}>
          <span className={styles.shieldIcon}><Shield size={20} /></span>
          <span className={styles.viewName}>SIORT 2026 — Painel de Controle</span>
        </div>
        <button className={styles.backBtn} onClick={onBackToLanding}>
          <ArrowLeft size={16} /> Sair do Painel
        </button>
      </header>

      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>Administração</h1>
            <p className={styles.subtitle}>Gerencie inscritos, matrículas e minicursos.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabsList}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'participants' ? styles.tabBtnActive : ''}`}
            onClick={() => {
              setActiveTab('participants');
              setSearchTerm('');
            }}
          >
            <Users size={16} /> Usuários Inscritos
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'enrollments' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('enrollments')}
          >
            <UserCheck size={16} /> Cursos & Inscrições
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'crud' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('crud')}
          >
            <BookOpen size={16} /> Gerenciamento de Minicursos
          </button>
        </div>

        {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

        {loading ? (
          <div className={styles.loadingArea}>
            <div className={styles.spinner} />
            <p>Carregando informações...</p>
          </div>
        ) : (
          <div className={styles.tabContentPanel}>
            
            {/* TAB 1: Participants */}
            {activeTab === 'participants' && (
              <div>
                <div className={styles.actionRow}>
                  <div className={styles.searchWrapper}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                      type="text"
                      placeholder="Buscar por nome, e-mail ou CPF..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                  <span className={styles.counterLabel}>
                    Total: {filteredParticipants.length} participante(s)
                  </span>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>CPF</th>
                        <th>Telefone</th>
                        <th>Minicursos Matriculados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredParticipants.length === 0 ? (
                        <tr>
                          <td colSpan={5} className={styles.emptyCell}>
                            Nenhum participante encontrado.
                          </td>
                        </tr>
                      ) : (
                        filteredParticipants.map((p) => (
                          <tr key={p.id}>
                            <td className={styles.boldText}>{p.name}</td>
                            <td>
                              <div className={styles.iconText}>
                                <Mail size={14} className={styles.mutedIcon} />
                                {p.email}
                              </div>
                            </td>
                            <td>
                              <div className={styles.iconText}>
                                <FileText size={14} className={styles.mutedIcon} />
                                {p.cpf}
                              </div>
                            </td>
                            <td>
                              <div className={styles.iconText}>
                                <Phone size={14} className={styles.mutedIcon} />
                                {p.phone}
                              </div>
                            </td>
                            <td>
                              <div className={styles.courseBadges}>
                                {p.enrollments && p.enrollments.length > 0 ? (
                                  p.enrollments.map((e) => (
                                    <span key={e.id} className={styles.courseBadge}>
                                      {e.course?.title || `Curso ID: ${e.courseId}`}
                                    </span>
                                  ))
                                ) : (
                                  <span className={styles.noEnrollments}>Nenhuma matrícula</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Enrollments per Course */}
            {activeTab === 'enrollments' && (
              <div className={styles.enrollmentsTabContainer}>
                <h3 className={styles.tabSectionTitle}>Distribuição de Alunos por Minicurso</h3>
                <div className={styles.coursesGrid}>
                  {courses.length === 0 ? (
                    <div className={styles.emptyGridState}>Nenhum minicurso cadastrado no sistema.</div>
                  ) : (
                    courses.map((course) => {
                      const isExpanded = !!expandedCourses[course.id];
                      const enrolledList = course.enrollments || [];
                      return (
                        <div key={course.id} className={styles.courseEnrollmentCard}>
                          <div
                            className={styles.courseEnrollmentHeader}
                            onClick={() => toggleExpandCourse(course.id)}
                          >
                            <div className={styles.courseInfoLeft}>
                              <h4 className={styles.courseTitleText}>{course.title}</h4>
                              <span className={styles.courseInstructorText}>Instrutor: {course.instructor}</span>
                            </div>
                            <div className={styles.courseInfoRight}>
                              <span className={styles.enrolledCountBadge}>
                                {enrolledList.length} {enrolledList.length === 1 ? 'matriculado' : 'matriculados'}
                              </span>
                              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className={styles.studentsListWrapper}
                              >
                                {enrolledList.length > 0 ? (
                                  <table className={styles.nestedTable}>
                                    <thead>
                                      <tr>
                                        <th>Nome</th>
                                        <th>E-mail</th>
                                        <th>Telefone</th>
                                        <th>CPF</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {enrolledList.map((e) => {
                                        const student = e.participant;
                                        if (!student) return null;
                                        return (
                                          <tr key={e.id}>
                                            <td className={styles.boldText}>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.phone}</td>
                                            <td>{student.cpf}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                ) : (
                                  <div className={styles.noStudentsEnrolled}>
                                    Nenhum participante matriculado neste minicurso até o momento.
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: CRUD Courses */}
            {activeTab === 'crud' && (
              <div>
                <div className={styles.tableHeader}>
                  <div>
                    <h3 className={styles.tabSectionTitle}>Minicursos Oferecidos</h3>
                    <p className={styles.tabSectionSubtitle}>Adicione novos cursos ou altere os existentes.</p>
                  </div>
                  <button className={styles.createBtn} onClick={handleOpenCreateModal}>
                    <Plus size={18} /> Novo Minicurso
                  </button>
                </div>

                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Instrutor</th>
                        <th>Duração</th>
                        <th>Horário</th>
                        <th>Tags</th>
                        <th className={styles.alignRight}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.length === 0 ? (
                        <tr>
                          <td colSpan={6} className={styles.emptyCell}>
                            Nenhum minicurso cadastrado. Clique em "Novo Minicurso" para adicionar.
                          </td>
                        </tr>
                      ) : (
                        courses.map((course) => {
                          const tagsArr = Array.isArray(course.parsedTags)
                            ? course.parsedTags
                            : Array.isArray(course.tags)
                              ? course.tags
                              : typeof course.tags === 'string'
                                ? JSON.parse(course.tags || '[]')
                                : [];
                          return (
                            <tr key={course.id}>
                              <td>
                                <span className={styles.courseTitle}>{course.title}</span>
                              </td>
                              <td>
                                <span className={styles.instructor}>{course.instructor}</span>
                              </td>
                              <td>{course.duration}</td>
                              <td>{course.schedule}</td>
                              <td>
                                <div className={styles.tagsContainer}>
                                  {tagsArr.map((tag) => (
                                    <span key={tag} className={styles.tag}>
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className={styles.actionsCell}>
                                <button
                                  className={styles.actionBtnEdit}
                                  onClick={() => handleOpenEditModal(course)}
                                  title="Editar"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  className={styles.actionBtnDelete}
                                  onClick={() => handleDelete(course.id)}
                                  title="Excluir"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div
              className={styles.modalCard}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.modalHeader}>
                <h3>{editingCourse ? 'Editar Minicurso' : 'Novo Minicurso'}</h3>
                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Título do Minicurso</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      required
                      placeholder="Ex: Minicurso 3: Planejamento Clínico 3D"
                    />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Instrutor</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={form.instructor}
                      onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                      required
                      placeholder="Ex: Dr. Roberto Costa (USP)"
                    />
                  </div>
                </div>

                <div className={styles.fieldRowGrid}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Duração (carga horária)</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      required
                      placeholder="Ex: 4 horas"
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Horário/Data</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={form.schedule}
                      onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                      required
                      placeholder="Ex: 17/08 às 14:00"
                    />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Tags (separadas por vírgula)</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={form.tagsString}
                      onChange={(e) => setForm({ ...form, tagsString: e.target.value })}
                      placeholder="Ex: Ortopedia, Simulação, 3D"
                    />
                  </div>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>Descrição Completa</label>
                    <textarea
                      className={styles.textarea}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                      rows={4}
                      placeholder="Descreva detalhadamente o cronograma e objetivos do minicurso..."
                    />
                  </div>
                </div>

                {errorMsg && <p className={styles.modalError}>{errorMsg}</p>}

                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className={styles.saveBtn}>
                    {editingCourse ? 'Salvar Alterações' : 'Criar Minicurso'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

