'use client';

import React from 'react';

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
    <div className={`audio-player ${className}`}>
      <div className="now-playing">
        <h4>{title}</h4>
        <p>{author}</p>
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: '35%' }}></div>
      </div>
      <div className="controls">
        <button className="control-btn">⏮</button>
        <button className="control-btn play">▶️</button>
        <button className="control-btn">⏭</button>
      </div>
    </div>
  );
};

export default AudioPlayerClient;
