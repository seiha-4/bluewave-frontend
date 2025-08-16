'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const AudioPlayer = dynamic(() => import('@/components/AudioPlayer'), {
  ssr: false,
  loading: () => <div className="audio-player-loading">Loading player...</div>
});

interface AudioPlayerClientProps {
  title?: string;
  author?: string;
  audioSrc?: string;
  coverImage?: string;
  className?: string;
}

const AudioPlayerClient: React.FC<AudioPlayerClientProps> = ({
  title = '📚 7つの習慣',
  author = 'スティーブン・R・コヴィー',
  audioSrc = '/sample-audio.mp3',
  coverImage = '/images/7-habits.jpg',
  className = ''
}) => {
  return (
    <AudioPlayer 
      title={title}
      author={author}
      audioSrc={audioSrc}
      coverImage={coverImage}
      className={className}
    />
  );
};

export default AudioPlayerClient;
