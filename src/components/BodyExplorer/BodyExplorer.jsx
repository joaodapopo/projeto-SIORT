import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';
import BodyCanvas from './BodyCanvas';
import ImplantDetail from './ImplantDetail';
import { implantData } from '../../data/implantData';
import styles from './BodyExplorer.module.css';

const jointKeys = Object.keys(implantData);

function SkeletonLoader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.radarWrapper}>
        <div className={styles.radarRing} />
        <div className={styles.radarScan} />
        <span className={styles.loaderIcon}>🦴</span>
      </div>
      <div className={styles.loaderStatus}>
        <span className={styles.pulseDot} />
        Sincronizando Holograma 3D...
      </div>
      <span className={styles.loaderProgress}>Carregando HUMANSKELETON-v1.glb</span>
    </div>
  );
}

export default function BodyExplorer() {
  const [selectedJoint, setSelectedJoint] = useState(null);

  return (
    <section className={`${styles.section} section-padding`} id="implantes">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.eyebrow}>Exploração Interativa</span>
          <h2 className={styles.sectionTitle}>Ciência dos Implantes</h2>
          <p className={styles.sectionSubtitle}>
            Explore o corpo humano e descubra a engenharia por trás de cada
            implante ortopédico.
          </p>
        </motion.div>

        {/* Joint navigation pills */}
        <div className={styles.jointNav}>
          {jointKeys.map((key) => (
            <button
              key={key}
              className={`${styles.jointPill} ${
                selectedJoint === key ? styles.active : ''
              }`}
              onClick={() => setSelectedJoint(key)}
              id={`joint-pill-${key}`}
            >
              {implantData[key].icon} {implantData[key].name}
            </button>
          ))}
        </div>

        <div className={styles.explorerLayout}>
          {/* 3D Canvas */}
          <motion.div
            className={styles.canvasWrapper}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={<SkeletonLoader />}>
              <BodyCanvas
                selectedJoint={selectedJoint}
                onSelectJoint={setSelectedJoint}
              />
            </Suspense>
            <div className={styles.canvasInstructions}>
              Clique nas articulações iluminadas para explorar
            </div>
          </motion.div>

          {/* Detail panel */}
          <motion.div
            className={styles.detailPanel}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {selectedJoint ? (
              <ImplantDetail jointKey={selectedJoint} styles={styles} />
            ) : (
              <div className={styles.placeholder}>
                <div className={styles.placeholderIcon}>
                  <MousePointerClick size={32} color="#5BB5F5" />
                </div>
                <h3 className={styles.placeholderTitle}>
                  Selecione uma Articulação
                </h3>
                <p className={styles.placeholderText}>
                  Clique em um dos pontos iluminados no modelo 3D ou use os
                  botões acima para explorar os detalhes de cada implante.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
