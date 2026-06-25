import { motion, AnimatePresence } from 'framer-motion';
import { implantData } from '../../data/implantData';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.95,
    transition: { duration: 0.25 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function ImplantDetail({ jointKey, styles }) {
  const data = implantData[jointKey];

  if (!data) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={jointKey}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div className={styles.jointHeader} variants={headerVariants}>
          <h3 className={styles.jointName}>
            {data.icon} {data.name}
          </h3>
          <span className={styles.jointSubtitle}>{data.subtitle}</span>
        </motion.div>

        <div className={styles.topicsList}>
          {data.topics.map((topic) => (
            <motion.div
              key={topic.id}
              className={styles.topicCard}
              variants={cardVariants}
            >
              <div className={styles.topicHeader}>
                <span className={styles.topicIcon}>{topic.icon}</span>
                <h4 className={styles.topicTitle}>{topic.title}</h4>
              </div>
              <p className={styles.topicDescription}>{topic.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
