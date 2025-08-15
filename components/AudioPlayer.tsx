'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  title?: string;
  author?: string;
  audioSrc?: string;
  coverImage?: string;
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  title = 'サンプルオーディオ',
  author = '著者名',
  audioSrc = '/sample-audio.mp3',
  coverImage = '/sample-cover.jpg',
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // 再生/一時停止の切り替え
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(error => {
        console.error('再生に失敗しました:', error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  // 再生時間のフォーマット（mm:ss）
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // プログレスバークリックでシーク
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // オーディオメタデータの読み込み
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // 再生時間の更新
  const handleTimeUpdate = () => {
    if (audioRef.current && !isSeeking) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // 再生終了時の処理
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // シーク中かどうかのフラグ管理
  const startSeeking = () => setIsSeeking(true);
  const stopSeeking = () => setIsSeeking(false);

  // コンポーネントのアンマウント時にイベントリスナーをクリーンアップ
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  // オーディオ要素のイベントリスナーを設定
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioRef]);

  // 進捗バーの幅を計算
  const progressWidth = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`audio-player bg-white rounded-xl shadow-lg p-4 max-w-md mx-auto ${className}`}>
      {/* オーディオ要素（非表示） */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        className="hidden"
      />
      
      {/* 再生情報 */}
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 mr-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
            {coverImage && (
              <img
                src={coverImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{title}</h3>
          <p className="text-xs text-gray-500 truncate">{author}</p>
        </div>
      </div>
      
      {/* プログレスバー */}
      <div className="mb-2">
        <div 
          ref={progressBarRef}
          className="h-1.5 bg-gray-200 rounded-full cursor-pointer overflow-hidden"
          onClick={handleProgressBarClick}
          onMouseDown={startSeeking}
          onMouseUp={stopSeeking}
          onMouseLeave={stopSeeking}
        >
          <div 
            className="h-full bg-blue-600 transition-all duration-200 ease-out"
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
      
      {/* 再生時間とコントロール */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {formatTime(currentTime)}
        </span>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={togglePlayPause}
            className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            aria-label={isPlaying ? '一時停止' : '再生'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        <span className="text-xs text-gray-500">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
