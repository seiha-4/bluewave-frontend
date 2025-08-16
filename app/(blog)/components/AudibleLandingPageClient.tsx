'use client';

import { useEffect, useRef, useState } from 'react';

export default function AudibleLandingPageClient() {
  const [countdown, setCountdown] = useState({
    days: 15,
    hours: 12,
    minutes: 34,
    seconds: 56
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // カウントダウンタイマー
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

      setCountdown({
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // スムーススクロール
  const handleSmoothScroll = (targetId: string) => {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = 70;
      const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    }
  };

  // オーディオプレイヤーのモックインタラクション
  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 0.5;
          return newProgress > 100 ? 0 : newProgress;
        });
      }, 1000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  };


  // 詳しく見るボタンクリック
  const handleLearnMoreClick = () => {
    handleSmoothScroll('#features');
  };

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // スクロールアニメーション
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
      '.problem-card, .solution-card, .timeline-item, .pricing-card'
    );

    animateElements.forEach(el => {
      const element = el as HTMLElement;
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // ヘッダーのスクロール効果
  useEffect(() => {
    let lastScrollTop = 0;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const header = document.querySelector('.header') as HTMLElement;
      
      if (header) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      {/* ヘッダー */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h1>🎧 Audible</h1>
          </div>
          <nav className="nav">
            <ul>
              <li><a href="#features" onClick={(e) => { e.preventDefault(); handleSmoothScroll('#features'); }}>特徴</a></li>
              <li><a href="#benefits" onClick={(e) => { e.preventDefault(); handleSmoothScroll('#benefits'); }}>メリット</a></li>
              <li><a href="#pricing" onClick={(e) => { e.preventDefault(); handleSmoothScroll('#pricing'); }}>料金</a></li>
              <li><a href="#start" onClick={(e) => { e.preventDefault(); handleSmoothScroll('#start'); }}>始め方</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* メインヒーロー */}
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
                <a href="https://amzn.to/3V454Fu" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  🎁 30日間無料で始める
                </a>
                <button className="btn btn-secondary" onClick={handleLearnMoreClick}>
                  📖 詳しく見る
                </button>
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
                      <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="controls">
                      <button className="control-btn">⏮</button>
                      <button className="control-btn play" onClick={handlePlayClick}>
                        {isPlaying ? '⏸️' : '▶️'}
                      </button>
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

      {/* 問題提起セクション */}
      <section className="problem-section">
        <div className="container">
          <h2 className="section-title">こんな悩みはありませんか？</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">😴</div>
              <h3>読書すると眠くなる</h3>
              <p>文字を追っているうちに集中力が切れて、気づいたら同じページを何度も読んでいる...</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">⏰</div>
              <h3>読書の時間がない</h3>
              <p>仕事や家事で忙しく、ゆっくり本を読む時間が取れない。積読が増える一方...</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">📱</div>
              <h3>スマホに気が散る</h3>
              <p>読書中でもついスマホを見てしまい、集中できない。SNSやYouTubeに時間を取られる...</p>
            </div>
          </div>
        </div>
      </section>

      {/* 解決策セクション */}
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

      {/* 利用シーンセクション */}
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

      {/* 料金セクション */}
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
              <div className="trial-badge">🎁 30日間無料体験</div>
              <a href="https://amzn.to/3V454Fu" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{marginTop: '16px'}}>
                🎁 30日間無料で始める
              </a>
              <p className="trial-note">※無料期間中に解約しても、ダウンロードした本は聴き続けられます</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
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
                  <span className="time-number">{countdown.days.toString().padStart(2, '0')}</span>
                  <span className="time-label">日</span>
                </div>
                <div className="time-unit">
                  <span className="time-number">{countdown.hours.toString().padStart(2, '0')}</span>
                  <span className="time-label">時間</span>
                </div>
                <div className="time-unit">
                  <span className="time-number">{countdown.minutes.toString().padStart(2, '0')}</span>
                  <span className="time-label">分</span>
                </div>
                <div className="time-unit">
                  <span className="time-number">{countdown.seconds.toString().padStart(2, '0')}</span>
                  <span className="time-label">秒</span>
                </div>
              </div>
            </div>
            <a href="https://amzn.to/3V454Fu" target="_blank" rel="noopener noreferrer" className="btn btn-cta">
              🚀 今すぐ30日間無料で始める
            </a>
            <p className="guarantee">
              ✅ いつでもキャンセル可能 ✅ 自動更新なし ✅ リスクゼロ
            </p>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 Amazon Audible Landing Page. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}