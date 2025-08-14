'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function AudibleLandingPage() {
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 15);
    targetDate.setHours(23, 59, 59, 999);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        targetDate.setDate(targetDate.getDate() + 30);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      const secondsEl = document.getElementById('seconds');

      if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
      if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
      if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
      if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown();

    const smoothScroll = (e: MouseEvent) => {
      e.preventDefault();
      const targetId = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
      if (!targetId) return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = 70;
        const targetTop = (targetElement as HTMLElement).offsetTop - headerHeight;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    };
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', smoothScroll as EventListener);
    });

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    const animateElements = document.querySelectorAll('.problem-card, .solution-card, .timeline-item, .pricing-card');
    animateElements.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = '0';
      htmlEl.style.transform = 'translateY(30px)';
      htmlEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    let lastScrollTop = 0;
    const handleHeaderScroll = () => {
      const header = document.querySelector('.header') as HTMLElement;
      if (!header) return;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0)';
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };
    window.addEventListener('scroll', handleHeaderScroll);

    return () => {
      clearInterval(countdownInterval);
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', smoothScroll as EventListener);
      });
      animateElements.forEach(el => observer.unobserve(el));
      window.removeEventListener('scroll', handleHeaderScroll);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* Reset and Base Settings */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Noto Sans JP', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        /* Header */
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            border-bottom: 1px solid rgba(0, 188, 212, 0.1);
        }

        .header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
        }

        .logo h1 {
            font-size: 24px;
            font-weight: 700;
            color: #00bcd4;
        }

        .nav ul {
            display: flex;
            list-style: none;
            gap: 30px;
        }

        .nav a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav a:hover {
            color: #00bcd4;
        }

        /* Button Styles */
        .btn {
            display: inline-block;
            padding: 16px 32px;
            border: none;
            border-radius: 16px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }

        .btn-primary {
            background: linear-gradient(135deg, #00bcd4 0%, #00acc1 100%);
            color: white;
            box-shadow: 0 8px 25px rgba(0, 188, 212, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(0, 188, 212, 0.4);
        }

        .btn-secondary {
            background: white;
            color: #00bcd4;
            border: 2px solid #00bcd4;
        }

        .btn-secondary:hover {
            background: #00bcd4;
            color: white;
            transform: translateY(-2px);
        }

        .btn-cta {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: white;
            font-size: 18px;
            padding: 20px 40px;
            box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        /* Hero Section */
        .hero {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            overflow: hidden;
            margin-top: 70px;
        }

        .hero-bg-animation {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="grad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="rgba(255,255,255,0.1)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient></defs><circle cx="200" cy="300" r="100" fill="url(%23grad)" opacity="0.6"><animate attributeName="cx" values="200;800;200" dur="20s" repeatCount="indefinite"/></circle><circle cx="800" cy="700" r="150" fill="url(%23grad)" opacity="0.4"><animate attributeName="cy" values="700;200;700" dur="25s" repeatCount="indefinite"/></circle></svg>') center/cover;
            animation: float 30s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(1deg); }
        }

        .hero-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
            position: relative;
            z-index: 2;
        }

        .hero-title {
            font-size: 52px;
            font-weight: 700;
            line-height: 1.2;
            color: white;
            margin-bottom: 24px;
        }

        .highlight {
            background: linear-gradient(135deg, #00bcd4 0%, #00acc1 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .hero-subtitle {
            font-size: 20px;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 40px;
            line-height: 1.6;
        }

        .hero-stats {
            display: flex;
            gap: 40px;
            margin-bottom: 40px;
        }

        .stat {
            text-align: center;
        }

        .stat-number {
            display: block;
            font-size: 32px;
            font-weight: 700;
            color: #00bcd4;
        }

        .stat-label {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
        }

        .hero-buttons {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        /* Phone Mockup */
        .phone-mockup {
            width: 300px;
            height: 600px;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            border-radius: 40px;
            padding: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            position: relative;
            margin: 0 auto;
        }

        .phone-screen {
            width: 100%;
            height: 100%;
            background: #000;
            border-radius: 30px;
            padding: 40px 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .audio-player {
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            text-align: center;
        }

        .now-playing h4 {
            font-size: 18px;
            margin-bottom: 8px;
            color: #333;
        }

        .now-playing p {
            color: #666;
            margin-bottom: 20px;
        }

        .progress-bar {
            width: 100%;
            height: 4px;
            background: #e0e0e0;
            border-radius: 2px;
            margin-bottom: 20px;
            overflow: hidden;
        }

        .progress {
            height: 100%;
            background: linear-gradient(90deg, #00bcd4 0%, #00acc1 100%);
            border-radius: 2px;
        }

        .controls {
            display: flex;
            justify-content: center;
            gap: 20px;
        }

        .control-btn {
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .control-btn.play {
            background: #00bcd4;
            transform: scale(1.2);
        }

        .control-btn:hover {
            transform: scale(1.1);
        }

        /* Section Common Styles */
        section {
            padding: 100px 0;
        }

        .section-title {
            font-size: 40px;
            font-weight: 700;
            text-align: center;
            margin-bottom: 60px;
            color: #333;
        }

        /* Problem Section */
        .problem-section {
            background: #f8f9fa;
        }

        .problem-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 40px;
        }

        .problem-card {
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .problem-card:hover {
            transform: translateY(-10px);
        }

        .problem-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .problem-card h3 {
            font-size: 24px;
            margin-bottom: 16px;
            color: #333;
        }

        .problem-card p {
            color: #666;
            line-height: 1.6;
        }

        /* Solution Section */
        .solution-section {
            background: white;
        }

        .solution-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 40px;
        }

        .solution-card {
            padding: 40px;
            border-radius: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            transition: transform 0.3s ease;
        }

        .solution-card:hover {
            transform: translateY(-10px);
        }

        .solution-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }

        .solution-card h3 {
            font-size: 24px;
            margin-bottom: 16px;
        }

        .solution-card p {
            margin-bottom: 20px;
            opacity: 0.9;
        }

        .solution-card ul {
            list-style: none;
        }

        .solution-card li {
            margin-bottom: 8px;
            opacity: 0.9;
        }

        /* Usage Scene Section */
        .usage-section {
            background: #f8f9fa;
        }

        .usage-timeline {
            max-width: 800px;
            margin: 0 auto;
        }

        .timeline-item {
            display: flex;
            align-items: center;
            margin-bottom: 40px;
            padding: 30px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }

        .timeline-item:hover {
            transform: translateX(10px);
        }

        .timeline-time {
            font-size: 18px;
            font-weight: 600;
            color: #00bcd4;
            min-width: 140px;
            margin-right: 30px;
        }

        .timeline-content h3 {
            font-size: 20px;
            margin-bottom: 8px;
            color: #333;
        }

        .timeline-content p {
            color: #666;
        }

        /* Pricing Section */
        .pricing-section {
            background: white;
        }

        .pricing-card {
            max-width: 600px;
            margin: 0 auto;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 30px;
            padding: 50px;
            color: #fff;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .pricing-card h3, .pricing-card p, .pricing-card span {
            color: #fff;
        }

        .pricing-header h3 {
            font-size: 28px;
            margin-bottom: 20px;
        }

        .price {
            margin-bottom: 40px;
        }

        .currency {
            font-size: 18px;
        }

        .amount {
            font-size: 48px;
            font-weight: 700;
            margin: 0 8px;
        }

        .pricing-features {
            margin-bottom: 40px;
        }

        .feature {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 16px;
            text-align: left;
        }

        .check {
            margin-right: 12px;
            font-size: 18px;
        }

        .trial-note {
            font-size: 14px;
            opacity: 0.9;
        }

        /* CTA Section */
        .cta-section {
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            color: white;
            text-align: center;
        }

        .cta-title {
            font-size: 40px;
            font-weight: 700;
            margin-bottom: 24px;
        }

        .cta-subtitle {
            font-size: 20px;
            margin-bottom: 40px;
            opacity: 0.9;
        }

        .countdown-timer {
            margin-bottom: 40px;
        }

        .timer-label {
            font-size: 18px;
            margin-bottom: 20px;
            opacity: 0.9;
        }

        .timer-display {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 40px;
        }

        .time-unit {
            background: rgba(255, 255, 255, 0.2);
            padding: 20px;
            border-radius: 15px;
            min-width: 80px;
        }

        .time-number {
            display: block;
            font-size: 32px;
            font-weight: 700;
        }

        .time-label {
            font-size: 14px;
            opacity: 0.8;
        }

        .guarantee {
            margin-top: 24px;
            font-size: 16px;
            opacity: 0.9;
        }

        /* Footer */
        .footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 40px 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .hero-content {
                grid-template-columns: 1fr;
                text-align: center;
            }
            
            .hero-title {
                font-size: 36px;
            }
            
            .hero-buttons {
                justify-content: center;
            }
            
            .phone-mockup {
                width: 250px;
                height: 500px;
            }
            
            .nav ul {
                display: none;
            }
            
            .section-title {
                font-size: 28px;
            }
            
            .problem-grid,
            .solution-grid {
                grid-template-columns: 1fr;
            }
            
            .timeline-item {
                flex-direction: column;
                text-align: center;
            }
            
            .timeline-time {
                margin-right: 0;
                margin-bottom: 16px;
            }
            
            .timer-display {
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .time-unit {
                min-width: 60px;
                padding: 15px;
            }
            
            .time-number {
                font-size: 24px;
            }
            
            .cta-title {
                font-size: 28px;
            }
        }

        @media (max-width: 480px) {
            .container {
                padding: 0 15px;
            }
            
            section {
                padding: 60px 0;
            }
            
            .hero-title {
                font-size: 28px;
            }
            
            .btn {
                width: 100%;
                margin-bottom: 10px;
            }
            
            .hero-stats {
                justify-content: center;
                gap: 20px;
            }
            
            .stat-number {
                font-size: 24px;
            }
        }
      `}</style>
      <div className="audible-landing-page">
        {/* Header */}
        <header className="header">
            <div className="container">
                <div className="logo">
                    <h1>🎧 Audible</h1>
                </div>
                <nav className="nav">
                    <ul>
                        <li><a href="#features">特徴</a></li>
                        <li><a href="#benefits">メリット</a></li>
                        <li><a href="#pricing">料金</a></li>
                        <li><a href="#start">始め方</a></li>
                    </ul>
                </nav>
            </div>
        </header>

        {/* Main Hero */}
        <section className="hero">
            <div className="container">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            毎日30分で<br />
                            <span className="highlight">人生が変わる</span><br />
                            聞く読書体験
                        </h1>
                        <p className="hero-subtitle">
                            Amazon Audibleなら、通勤時間が学習時間に。<br />
                            プロのナレーションで40万冊以上の本を楽しめます。
                        </p>
                        <div className="hero-stats">
                            <div className="stat">
                                <span className="stat-number">40万+</span>
                                <span className="stat-label">タイトル数</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">30日間</span>
                                <span className="stat-label">無料体験</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">30%OFF</span>
                                <span className="stat-label">追加購入</span>
                            </div>
                        </div>
                        <div className="hero-buttons">
                            <a href="https://amzn.to/47vbF3c" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                🎁 30日間無料で始める
                            </a>
                            <a href="#features" className="btn btn-secondary">
                                📖 詳しく見る
                            </a>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="phone-mockup">
                            <div className="phone-screen">
                                <div className="audio-player">
                                    <div className="now-playing">
                                        <h4>📚 7つの習慣</h4>
                                        <p>スティーブン・R・コヴィー</p>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress" style={{width: '35%'}}></div>
                                    </div>
                                    <div className="controls">
                                        <button className="control-btn">⏮</button>
                                        <button className="control-btn play">▶️</button>
                                        <button className="control-btn">⏭</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="hero-bg-animation"></div>
        </section>

        {/* Problem Section */}
        <section className="problem-section">
            <div className="container">
                <h2 className="section-title">こんな悩みはありませんか？</h2>
                <div className="problem-grid">
                    <div className="problem-card text-white">
                        <div className="problem-icon">😴</div>
                        <h3>読書すると眠くなる</h3>
                        <p>文字を追っているうちに集中力が切れて、気づいたら同じページを何度も読んでいる...</p>
                    </div>
                    <div className="problem-card text-white">
                        <div className="problem-icon">⏰</div>
                        <h3>読書の時間がない</h3>
                        <p>仕事や家事で忙しく、ゆっくり本を読む時間が取れない。積読が増える一方...</p>
                    </div>
                    <div className="problem-card text-white">
                        <div className="problem-icon">📱</div>
                        <h3>スマホに気が散る</h3>
                        <p>読書中でもついスマホを見てしまい、集中できない。SNSやYouTubeに時間を取られる...</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Solution Section */}
        <section className="solution-section" id="features">
            <div className="container">
                <h2 className="section-title">
                    Audibleが全ての問題を<span className="highlight">解決</span>します
                </h2>
                <div className="solution-grid">
                    <div className="solution-card">
                        <div className="solution-icon">🎧</div>
                        <h3>「ながら読書」で時間を有効活用</h3>
                        <p>通勤中、家事中、運動中など、あらゆるスキマ時間が読書時間に変わります。月に2〜3冊の読書も可能に。</p>
                        <ul>
                            <li>✅ 通勤・通学時間を活用</li>
                            <li>✅ 家事をしながら学習</li>
                            <li>✅ 運動中もインプット</li>
                        </ul>
                    </div>
                    <div className="solution-card">
                        <div className="solution-icon">🎭</div>
                        <h3>プロのナレーションで理解度UP</h3>
                        <p>感情豊かな朗読で内容が頭に入りやすく、著者の真意がダイレクトに伝わります。</p>
                        <ul>
                            <li>✅ 人気声優・俳優が朗読</li>
                            <li>✅ 著者本人の朗読も</li>
                            <li>✅ 正しい発音で学習</li>
                        </ul>
                    </div>
                    <div className="solution-card">
                        <div className="solution-icon">📖</div>
                        <h3>40万冊以上の豊富なラインナップ</h3>
                        <p>ビジネス、自己啓発、小説、実用書など、あらゆるジャンルの本が揃っています。</p>
                        <ul>
                            <li>✅ 最新のベストセラー</li>
                            <li>✅ 名作・古典作品</li>
                            <li>✅ オリジナルコンテンツ</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* Usage Scene Section */}
        <section className="usage-section" id="benefits">
            <div className="container">
                <h2 className="section-title">こんなシーンで活用できます</h2>
                <div className="usage-timeline">
                    <div className="timeline-item">
                        <div className="timeline-time">🌅 朝7:00</div>
                        <div className="timeline-content">
                            <h3>通勤中にビジネス書</h3>
                            <p>電車や車での移動時間が、スキルアップの時間に変わります。</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-time">🏠 昼12:00</div>
                        <div className="timeline-content">
                            <h3>家事をしながら小説</h3>
                            <p>料理や掃除の時間も、物語の世界に浸ることができます。</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-time">🏃‍♂️ 夕方18:00</div>
                        <div className="timeline-content">
                            <h3>運動中に自己啓発書</h3>
                            <p>ジョギングやジムでの運動時間が、心の成長時間にもなります。</p>
                        </div>
                    </div>
                    <div className="timeline-item">
                        <div className="timeline-time">🛁 夜22:00</div>
                        <div className="timeline-content">
                            <h3>入浴中にリラックス</h3>
                            <p>エッセイや詩集で、一日の疲れを癒やしながら教養を深められます。</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section" id="pricing">
            <div className="container">
                <h2 className="section-title">シンプルで分かりやすい料金プラン</h2>
                <div className="pricing-card">
                    <div className="pricing-header">
                        <h3>Audible会員プラン</h3>
                        <div className="price">
                            <span className="currency">月額</span>
                            <span className="amount">1,500</span>
                            <span className="currency">円（税込）</span>
                        </div>
                    </div>
                    <div className="pricing-features">
                        <div className="feature">
                            <span className="check">✅</span>
                            <span>毎月好きな本1冊が無料</span>
                        </div>
                        <div className="feature">
                            <span className="check">✅</span>
                            <span>追加購入はすべて30%OFF</span>
                        </div>
                        <div className="feature">
                            <span className="check">✅</span>
                            <span>40万冊以上から選び放題</span>
                        </div>
                        <div className="feature">
                            <span className="check">✅</span>
                            <span>気に入らなければ返品・交換可能</span>
                        </div>
                        <div className="feature">
                            <span className="check">✅</span>
                            <span>オフライン再生対応</span>
                        </div>
                        <div className="feature">
                            <span className="check">✅</span>
                            <span>再生速度調整（0.5倍〜3.5倍）</span>
                        </div>
                    </div>
                    <div className="pricing-cta">
                         <a href="https://amzn.to/47vbF3c" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{width: '80%', margin: '0 auto 20px'}}>
                            🎁 30日間無料体験
                        </a>
                        <p className="trial-note">※いつでも解約OK。単品購入したタイトルは解約後もあなたのものに。</p>
                    </div>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section" id="start">
            <div className="container">
                <div className="cta-content">
                    <h2 className="cta-title">今すぐ始めて、人生を変えませんか？</h2>
                    <p className="cta-subtitle">
                        30日間の無料体験で、「聞く読書」の魅力を実感してください。<br />
                        あなたの毎日が、もっと豊かになります。
                    </p>
                    <div className="countdown-timer">
                        <div className="timer-label">⚡ 限定キャンペーン終了まで</div>
                        <div className="timer-display">
                            <div className="time-unit">
                                <span className="time-number" id="days">15</span>
                                <span className="time-label">日</span>
                            </div>
                            <div className="time-unit">
                                <span className="time-number" id="hours">12</span>
                                <span className="time-label">時間</span>
                            </div>
                            <div className="time-unit">
                                <span className="time-number" id="minutes">34</span>
                                <span className="time-label">分</span>
                            </div>
                            <div className="time-unit">
                                <span className="time-number" id="seconds">56</span>
                                <span className="time-label">秒</span>
                            </div>
                        </div>
                    </div>
                    <a href="https://amzn.to/47vbF3c" target="_blank" rel="noopener noreferrer" className="btn btn-cta">
                        🚀 今すぐ30日間無料で始める
                    </a>
                    <p className="guarantee">
                        ✅ いつでもキャンセル可能 ✅ 自動更新なし ✅ リスクゼロ
                    </p>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="footer">
            <div className="container">
                <p>&copy; 2024 Amazon Audible Landing Page. All rights reserved.</p>
            </div>
        </footer>
      </div>
    </>
  );
}

