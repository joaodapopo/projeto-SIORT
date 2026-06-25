import { useState } from 'react';
import { Play, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './VideoSection.module.css';

const videos = [
  {
    id: 1,
    number: 'VÍDEO 01',
    title: 'O Cenário da Ortopedia Moderna',
    description:
      'Uma visão panorâmica sobre os avanços tecnológicos e científicos que estão redefinindo o tratamento de lesões ósseas e articulares em todo o mundo.',
    duration: '12 min',
    thumbnail: null,
    // Placeholder embed — replace with real URL
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    id: 2,
    number: 'VÍDEO 02',
    title: 'Programação do Evento',
    description:
      'Conheça a grade completa do simpósio: palestrantes renomados, workshops práticos, sessões de debate e networking com especialistas do setor.',
    duration: '8 min',
    thumbnail: null,
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];

function VideoCard({ video, index }) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      className={styles.videoCard}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {playing ? (
        <div className={styles.iframeWrapper}>
          <iframe
            src={`${video.embedUrl}?autoplay=1&rel=0`}
            title={video.title}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          className={styles.thumbnailWrapper}
          onClick={() => setPlaying(true)}
          role="button"
          tabIndex={0}
          aria-label={`Reproduzir: ${video.title}`}
          onKeyDown={(e) => e.key === 'Enter' && setPlaying(true)}
        >
          {/* Gradient placeholder thumbnail */}
          <div className={styles.thumbnailOverlay}>
            <div className={styles.playButton}>
              <Play size={28} fill="currentColor" />
            </div>
          </div>
          <span className={styles.videoNumber}>{video.number}</span>
        </div>
      )}

      <div className={styles.videoContent}>
        <h3 className={styles.videoTitle}>{video.title}</h3>
        <p className={styles.videoDescription}>{video.description}</p>
        <span className={styles.videoDuration}>
          <Clock size={14} />
          {video.duration}
        </span>
      </div>
    </motion.div>
  );
}

export default function VideoSection() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className={`${styles.section} section-padding`} id="videos" ref={ref}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.eyebrow}>Conteúdo Exclusivo</span>
          <h2 className={styles.sectionTitle}>Entenda o Evento</h2>
          <p className={styles.sectionSubtitle}>
            Assista aos vídeos de apresentação e descubra por que este simpósio
            é um marco na ortopedia brasileira.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {videos.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
