'use client';

import { NewSwipeableContainer } from '@/components/NewSwipeableContainer';
import './home.css';

export default function Home() {
  // Use NewSwipeableContainer which includes arrow navigation between search and island
  return <NewSwipeableContainer />;
}