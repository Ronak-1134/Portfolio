/* ============================================================
   ProjectCard.jsx — Portrait card with 3D tilt
   ============================================================ */

import { useCallback } from 'react';
import { useTilt }  from '../../hooks/useTilt';
import Tag          from '../../components/ui/Tag';
import styles       from './ProjectCard.module.css';

export default function ProjectCard({ project, featured = false, cardRef }) {
  const { number, title, description, tags, links } = project;

  const tiltRef = useTilt({
    maxX:  6,
    maxY:  8,
    glare: true,
    scale: 1.015,
  });

  /* Merge the GSAP tilt ref with the parent's cardRef (for entrance animation) */
  const setRefs = useCallback(node => {
    tiltRef.current = node;
    if (typeof cardRef === 'function') cardRef(node);
    else if (cardRef) cardRef.current = node;
  }, [tiltRef, cardRef]);

  return (
    <article
      ref={setRefs}
      className={`${styles.card} ${featured ? styles.cardFeatured : ''}`}
      aria-label={`Project: ${title}`}
      data-cursor="project"
    >
      {/* Blueprint corner marks */}
      <span className={`${styles.corner} ${styles.cornerTL}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerTR}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerBL}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cornerBR}`} aria-hidden="true" />

      {/* Top row: number + links */}
      <div className={styles.cardTop}>
        <div className={styles.numberCircle} aria-hidden="true">
          <span className={styles.numberText}>{number}</span>
        </div>
        <div className={styles.cardLinks}>
          {links.github && (
            <a
              href={links.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
              aria-label={`${title} on GitHub`}
              onClick={e => e.stopPropagation()}
            >
              <span className={styles.cardLinkText}>GH</span>
              <span className={styles.cardLinkArrow} aria-hidden="true">↗</span>
            </a>
          )}
          {links.live && (
            <a
              href={links.live}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
              aria-label={`${title} live`}
              onClick={e => e.stopPropagation()}
            >
              <span className={styles.cardLinkText}>Live</span>
              <span className={styles.cardLinkArrow} aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <h3 className={`${styles.cardTitle} ${featured ? styles.cardTitleFeatured : ''}`}>
          {title}
        </h3>
        <p className={styles.cardDesc}>{description}</p>
      </div>

      {/* Bottom */}
      <div className={styles.cardBottom}>
        <div className={styles.cardTags} aria-label="Technologies">
          {tags.slice(0, featured ? 6 : 4).map(tag => (
            <Tag key={tag} label={tag} variant="ghost" />
          ))}
        </div>
        <div className={styles.annotationRow} aria-hidden="true">
          <span className={styles.annotationArrow} />
          <span className={styles.annotationLabel}>
            {featured ? 'featured' : 'project'}
          </span>
        </div>
      </div>
    </article>
  );
}