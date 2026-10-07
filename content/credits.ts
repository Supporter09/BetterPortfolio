import { MEDIA } from './media';
import type { Credit } from './types';
/**
 * Scene 07 — Credits (02b Scene 07). `role` = left column (mono), `name` + `detail` = right column.
 * Never shown: GPA/CPA (unconfirmed), graduation month, student ID. IELTS shows the score only —
 * no test date or validity (master §7).
 */
// source: mai-van-nhat-minh.md §4 (HUST, July 2023–present; three scholarships 2024.1/2024.2/2025.1; IELTS 7.5), §7 (awards, KAIST GPW 2026).
export const CREDITS: Credit[] = [
  {
    role: 'STUDYING',
    name: 'Cyber Security — Hanoi University of Science and Technology (SOICT)',
    detail: '2023–present',
    claim: 'verified',
  },
  { role: 'ACADEMIC ACHIEVEMENT SCHOLARSHIP', name: 'HUST', detail: 'Semester 2024.1', claim: 'verified' },
  { role: 'ACADEMIC ACHIEVEMENT SCHOLARSHIP', name: 'HUST', detail: 'Semester 2024.2', claim: 'verified' },
  { role: 'ACADEMIC ACHIEVEMENT SCHOLARSHIP', name: 'HUST', detail: 'Semester 2025.1', claim: 'verified' },
  { role: 'THIRD PLACE', name: 'Student Creative Ideas Challenge 2024', claim: 'verified' },
  {
    role: 'FOURTH PLACE, TRACK',
    name: 'Samsung SOICT Hackathon 2023',
    detail: 'HUST Smart Assistant',
    claim: 'verified',
    evidence: MEDIA.evidence['hust-smart-assistant'],
  },
  {
    role: 'SECOND PRIZE',
    name: 'IAI Hackathon 2023',
    detail: 'Testeria',
    claim: 'verified',
    evidence: MEDIA.evidence['iai-hackathon'],
  },
  {
    role: 'SECOND PRIZE',
    name: 'Future Blue Innovation 2022',
    detail: 'AnimalShelter',
    claim: 'verified',
    evidence: MEDIA.evidence['future-blue'],
  },
  {
    role: 'COMPLETED IN PERSON',
    name: 'KAIST School of Computing Global Preview Week 2026',
    detail: 'Daejeon & Seoul',
    claim: 'verified',
  },
  { role: 'ENGLISH', name: 'IELTS Academic 7.5', claim: 'verified' },
];
