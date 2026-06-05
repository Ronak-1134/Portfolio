/* ============================================================
   Education.jsx — Official Academic Record Document
   ============================================================ */

import { useEffect, useRef } from 'react';
import { gsap }              from '../../utils/gsapConfig';
import SectionLabel          from '../../components/ui/SectionLabel';
import CountUp               from '../../components/CountUp/CountUp';
import { education }         from '../../data/education';
import styles                from './Education.module.css';

/* Document metadata */
const DOC_NUMBER  = 'FORM-AC/2024/0339';
const ISSUED_BY   = 'L.D. College of Engineering, Ahmedabad';
const ISSUED_DATE = '2022–2026';

export default function Education() {
  const sectionRef  = useRef(null);
  const documentRef = useRef(null);
  const rowRefs     = useRef([]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    /* Whole document unfolds into view */
    gsap.fromTo(documentRef.current,
      { opacity: 0, y: 32, rotateX: 4, transformPerspective: 800, transformOrigin: 'top center' },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      }
    );

    /* Rows stagger in */
    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      gsap.fromTo(row,
        { opacity: 0, x: -12 },
        {
          opacity: 1, x: 0, duration: 0.6, ease: 'power3.out',
          delay: 0.35 + i * 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} id="education" className={styles.section} aria-label="Education">
      <div className={styles.inner}>

        <SectionLabel number="01" label="Education" />

        {/* The document */}
        <div ref={documentRef} className={styles.document}>

          {/* ---- DOCUMENT HEADER ---- */}
          <div className={styles.docHeader}>
            {/* Left: institution seal area */}
            <div className={styles.docHeaderLeft}>
              <div className={styles.seal} aria-hidden="true">
                <span className={styles.sealInner}>GTU</span>
              </div>
              <div className={styles.docHeaderMeta}>
                <span className={styles.docTitle}>Academic Record</span>
                <span className={styles.docSubtitle}>
                  Gujarat Technological University · Affiliated Institution
                </span>
              </div>
            </div>

            {/* Right: form number + date */}
            <div className={styles.docHeaderRight}>
              <div className={styles.docField}>
                <span className={styles.docFieldLabel}>Document No.</span>
                <span className={styles.docFieldValue}>{DOC_NUMBER}</span>
              </div>
              <div className={styles.docField}>
                <span className={styles.docFieldLabel}>Period</span>
                <span className={styles.docFieldValue}>{ISSUED_DATE}</span>
              </div>
              <div className={styles.docField}>
                <span className={styles.docFieldLabel}>Issued by</span>
                <span className={styles.docFieldValue}>{ISSUED_BY}</span>
              </div>
            </div>
          </div>

          {/* Header rule */}
          <div className={styles.docRule} />

          {/* ---- CANDIDATE ROW ---- */}
          <div className={styles.candidateRow}>
            <div className={styles.candidateField}>
              <span className={styles.docFieldLabel}>Candidate Name</span>
              <span className={styles.candidateName}>Ronak Vaghela</span>
            </div>
            <div className={styles.candidateField}>
              <span className={styles.docFieldLabel}>Programme</span>
              <span className={styles.candidateValue}>
                B.E Computer Engineering
              </span>
            </div>
            <div className={styles.candidateField}>
              <span className={styles.docFieldLabel}>Enrolment Status</span>
              <span className={styles.statusBadge}>
                <span className={styles.statusDot} />
                Active · 2022–2026
              </span>
            </div>
          </div>

          <div className={styles.docRule} />

          {/* ---- TABLE ---- */}
          <table className={styles.table} aria-label="Academic qualifications">
            <thead>
              <tr>
                <th className={styles.th} scope="col">Examination</th>
                <th className={styles.th} scope="col">Board</th>
                <th className={styles.th} scope="col">Institution</th>
                <th className={`${styles.th} ${styles.thCenter}`} scope="col">Year</th>
                <th className={`${styles.th} ${styles.thRight}`}  scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {education.map((row, i) => (
                <tr
                  key={row.id}
                  ref={el => rowRefs.current[i] = el}
                  className={`${styles.row} ${i === 0 ? styles.rowFeatured : ''}`}
                >
                  <td className={styles.td}>
                    <span className={styles.examinationName}>{row.examination}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.boardName}>{row.board}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.institutionName}>{row.institution}</span>
                  </td>
                  <td className={`${styles.td} ${styles.tdCenter}`}>
                    <span className={styles.yearValue}>{row.year}</span>
                  </td>
                  <td className={`${styles.td} ${styles.tdRight}`}>
                    <span className={styles.resultValue}>
                      <CountUp
                        target={parseFloat(row.result)}
                        decimals={row.result.includes('.') ? row.result.split('.')[1].length : 0}
                        duration={1600}
                      />
                      <span className={styles.resultType}>{row.resultType}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ---- DOCUMENT FOOTER ---- */}
          <div className={styles.docFooter}>
            <span className={styles.docFooterNote}>
              ↳ Currently enrolled · Expected graduation May 2026
            </span>
            <span className={styles.docFooterStamp}>
              Verified · {DOC_NUMBER}
            </span>
          </div>

          {/* Watermark */}
          <div className={styles.watermark} aria-hidden="true">
            ACADEMIC RECORD
          </div>

        </div>
      </div>
    </section>
  );
}