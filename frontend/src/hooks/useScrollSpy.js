import { useState, useEffect } from 'react';

/**
 * Custom scroll spy hook to track active section ID on scroll.
 * @param {string[]} ids - List of element IDs to track.
 * @param {number} offset - Scroll offset to trigger active state in pixels.
 * @returns {string} The active section ID.
 */
export default function useScrollSpy(ids, offset = 160) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      // Current scroll position + offset
      const scrollPosition = window.scrollY + offset;

      let currentSection = '';
      
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          // If current scroll position falls within the section bounds
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = id;
          }
        }
      }

      // Special case: very top of the page should activate the first ID
      if (window.scrollY < 80 && ids.length > 0) {
        currentSection = ids[0];
      }

      // Special case: scrolled to the bottom of the page
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        currentSection = ids[ids.length - 1];
      }

      if (currentSection && currentSection !== activeId) {
        setActiveId(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initially to capture current position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [ids, activeId, offset]);

  return activeId;
}
