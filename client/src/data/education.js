/* ============================================================
   education.js
   Ronak Vaghela Portfolio — Education Data

   Three rows displayed in the Education section table.
   Ordered chronologically, earliest first.

   Fields:
     id          {string}  — unique key for React
     examination {string}  — qualification name
     board       {string}  — examining board / university
     institution {string}  — school / college name
     location    {string}  — city
     year        {string}  — year of completion
     result      {string}  — score / percentage / CGPA
     resultType  {string}  — "%" | "CGPA" — for display formatting
   ============================================================ */

export const education = [
  {
    id:          'ssc',
    examination: 'SSC',
    board:       'GSEB',
    institution: 'Navyug Vidhyalaya',
    location:    'Jambusar',
    year:        '2020',
    result:      '88.50',
    resultType:  '%',
  },
  {
    id:          'hsc',
    examination: 'HSC',
    board:       'GSEB',
    institution: 'H.S Shah High School',
    location:    'Jambusar',
    year:        '2022',
    result:      '79.05',
    resultType:  '%',
  },
  {
    id:          'be',
    examination: 'B.E Computer Engineering',
    board:       'GTU',
    institution: 'LDCE Ahmedabad',
    location:    'Ahmedabad',
    year:        '2026',
    result:      '7.92',
    resultType:  'CGPA',
  },
];