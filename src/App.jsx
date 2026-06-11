import { useState, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Presentation from './components/Presentation/Presentation';
import VideoSection from './components/VideoSection/VideoSection';
import BodyExplorer from './components/BodyExplorer/BodyExplorer';
import Registration from './components/Registration/Registration';
import Minicourses from './components/Minicourses/Minicourses';
import Certificates from './components/Certificates/Certificates';
import Footer from './components/Footer/Footer';
import useScrollSpy from './hooks/useScrollSpy';

// ========================================
// Simulated Local Database (InMemory)
// ========================================
const initialParticipants = [
  { name: 'Ana Souza', email: 'ana@orto.com', phone: '(11) 98765-4321', registeredAt: new Date().toISOString() },
  { name: 'Dr. Pedro Rocha', email: 'pedro@implante.com', phone: '(21) 99888-7766', registeredAt: new Date().toISOString() },
  { name: 'Prof. Carla Dias', email: 'carla@biomed.com', phone: '(31) 97777-8888', registeredAt: new Date().toISOString() },
  { name: 'Teste Simpósio', email: 'teste@simposio.com', phone: '(61) 91234-5678', registeredAt: new Date().toISOString() },
];

const initialEnrollments = [
  { usuarioEmail: 'ana@orto.com', cursoId: 1 },
  { usuarioEmail: 'pedro@implante.com', cursoId: 1 },
  { usuarioEmail: 'pedro@implante.com', cursoId: 2 },
];

// Section IDs for the scroll spy
const SECTION_IDS = ['home', 'apresentacao', 'implantes', 'inscricao', 'minicursos', 'certificados'];

export default function App() {
  const [participants, setParticipants] = useState(initialParticipants);
  const [courseEnrollments, setCourseEnrollments] = useState(initialEnrollments);
  const [activeUser, setActiveUser] = useState(null);

  // Scroll spy tracking
  const activeSection = useScrollSpy(SECTION_IDS);

  const handleRegister = useCallback((formData) => {
    const newParticipant = {
      ...formData,
      registeredAt: new Date().toISOString(),
    };
    setParticipants((prev) => [...prev, newParticipant]);
    setActiveUser(newParticipant);
    console.log('[SIORT] Nova inscrição registrada:', newParticipant);
  }, []);

  const handleLogin = useCallback((user) => {
    setActiveUser(user);
    console.log('[SIORT] Usuário conectado:', user);
  }, []);

  const handleEnroll = useCallback((email, courseId) => {
    setCourseEnrollments((prev) => {
      const exists = prev.some(
        (en) => en.usuarioEmail.toLowerCase() === email.toLowerCase() && en.cursoId === courseId
      );
      if (exists) {
        return prev.filter(
          (en) => !(en.usuarioEmail.toLowerCase() === email.toLowerCase() && en.cursoId === courseId)
        );
      }
      return [...prev, { usuarioEmail: email, cursoId }];
    });
  }, []);

  return (
    <>
      <Navbar activeSection={activeSection} />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Apresentação do Congresso */}
        <Presentation />

        {/* Vídeos do Evento */}
        <VideoSection />

        {/* Exploração Interativa 3D */}
        <BodyExplorer />

        {/* Inscrição no Evento */}
        <Registration
          participants={participants}
          onRegister={handleRegister}
          activeUser={activeUser}
          onLogin={handleLogin}
        />

        {/* Minicursos */}
        <Minicourses
          activeUser={activeUser}
          participants={participants}
          courseEnrollments={courseEnrollments}
          onEnroll={handleEnroll}
          onLogin={handleLogin}
        />

        {/* Certificados */}
        <Certificates
          participants={participants}
          courseEnrollments={courseEnrollments}
        />
      </main>

      <Footer />
    </>
  );
}
