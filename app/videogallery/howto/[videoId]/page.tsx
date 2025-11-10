import React from 'react';
import HowToVideoPageClient from './HowToVideoPageClient';

export default async function HowToVideoPage({ params }: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await params;

  return <HowToVideoPageClient videoId={videoId} />;
}
