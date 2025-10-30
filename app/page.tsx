'use client';

import ExamSearch from '@/components/ExamSearch';
import './home.css';

export default function Home() {
  // Always default to search page - no landing page restrictions
  return <ExamSearch />;
}