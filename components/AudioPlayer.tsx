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
  // Audio player states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(35); // For mock player
  
  // Countdown timer states
  const [days, setDays] = useState<string>('15');
  const [hours, setHours] = useState<string>('23');
  const [minutes, setMinutes] = useState<string>('59');
  const [seconds, setSeconds] = useState<string>('59');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const mockProgressInterval = useRef<NodeJS.Timeout | null>(null);
  const targetDate = useRef<Date>(new Date());

  useEffect(() => {
    // Set the target date 15 days from now at 23:59:59.999
    const date = new Date();
    date.setDate(date.getDate() + 15);
    date.setHours(23, 59, 59, 999);
    targetDate.current = date;
  }, []);

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.current.getTime() - now;

      if (distance < 0) {
        // Reset for another 30 days if countdown ends
        targetDate.current.setDate(targetDate.current.getDate() + 30);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      setDays(days.toString().padStart(2, '0'));
      setHours(hours.toString().padStart(2, '0'));
      setMinutes(mins.toString().padStart(2, '0'));
      setSeconds(secs.toString().padStart(2, '0'));
    };

    // Initial call
    updateCountdown();
    
    // Update every second
    countdownInterval.current = setInterval(updateCountdown, 1000);

    // Cleanup
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, []);

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement;
      if (!target) return;
      
      e.preventDefault();
      const targetId = target.getAttribute('href');
      
      if (targetId && typeof targetId === 'string') {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerHeight = 70;
          const targetTop = (targetElement as HTMLElement).offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  // Scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe all elements that need animation
    const animateElements = document.querySelectorAll(
      '.problem-card, .solution-card, .timeline-item, .pricing-card'
    );

    animateElements.forEach(el => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(30px)';
      (el as HTMLElement).style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Header scroll effect
  useEffect(() => {
    const header = document.querySelector('.header') as HTMLElement;
    if (!header) return;
    
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scroll down - hide header
        header.style.transform = 'translateY(-100%)';
      } else {
        // Scroll up - show header
        header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock audio player progress
  useEffect(() => {
    if (isPlaying) {
      mockProgressInterval.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 0.5;
          return newProgress > 100 ? 0 : newProgress;
        });
      }, 1000);
    } else if (mockProgressInterval.current) {
      clearInterval(mockProgressInterval.current);
    }

    return () => {
      if (mockProgressInterval.current) {
        clearInterval(mockProgressInterval.current);
      }
    };
  }, [isPlaying]);

  // Format time (mm:ss)
  const formatTime = (time: number): string => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle button click effects
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    
    // Add click effect
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);

    // Handle CTA button
    if (button.classList.contains('btn-cta') || button.classList.contains('btn-primary')) {
      alert('🎉 Audibleの30日間無料体験にご登録いただき、ありがとうございます！\n\n※これはデモサイトです。実際の登録は公式サイトで行ってください。');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
      if (mockProgressInterval.current) clearInterval(mockProgressInterval.current);
    };
  }, []);

  return (
    <div className={`audio-player ${className}`}>
      {/* Countdown Timer */}
      <div className="countdown-timer">
        <div className="countdown-item">
          <span id="days" className="countdown-value">{days}</span>
          <span className="countdown-label">日</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span id="hours" className="countdown-value">{hours}</span>
          <span className="countdown-label">時間</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span id="minutes" className="countdown-value">{minutes}</span>
          <span className="countdown-label">分</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <span id="seconds" className="countdown-value">{seconds}</span>
          <span className="countdown-label">秒</span>
        </div>
      </div>

      {/* Audio Player */}
      <div className="audio-player-container">
        <div className="audio-info">
          <h4 className="audio-title">{title}</h4>
          <p className="audio-author">{author}</p>
        </div>
        
        <div className="progress-bar" onClick={(e) => {
          if (!progressBarRef.current) return;
          const rect = progressBarRef.current.getBoundingClientRect();
          const pos = (e.clientX - rect.left) / rect.width;
          setProgress(pos * 100);
        }}>
          <div 
            ref={progressBarRef}
            className="progress" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="audio-controls">
          <button 
            className="control-btn skip-backward"
            aria-label="15秒戻る"
          >
            <span>⏪ 15秒</span>
          </button>
          
          <button 
            className={`control-btn ${isPlaying ? 'pause' : 'play'}`}
            onClick={togglePlayPause}
            aria-label={isPlaying ? '一時停止' : '再生'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button 
            className="control-btn skip-forward"
            aria-label="30秒進む"
          >
            <span>30秒 ⏩</span>
          </button>
        </div>
        
        <div className="playback-rate">
          <span>再生速度: </span>
          <select defaultValue="1.0" className="playback-select">
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1.0">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2.0">2.0x</option>
          </select>
        </div>
      </div>
      
      {/* Hidden audio element for actual playback */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        className="hidden"
      />
    </div>
  );
};

export default AudioPlayer;
