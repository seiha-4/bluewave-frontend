'use client';

import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import AudioPlayer with no SSR to avoid window is not defined errors
const AudioPlayer = dynamic(() => import('@/components/AudioPlayer'), {
  ssr: false,
  loading: () => <div className="audio-player-loading">Loading player...</div>
});

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery, settingsQuery } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

const pageSlugs = defineQuery(
  `*[_type == "page" && defined(slug.current)]{'slug': slug.current}`,
);

export async function generateStaticParams() {
  return await sanityFetch({
    query: pageSlugs,
    perspective: "published",
    stega: false,
  });
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const page = await sanityFetch({
    query: pageQuery,
    params,
    stega: false,
  });

  return {
    title: page?.title,
    description: page?.title,
  } satisfies Metadata;
}

export default async function PagePage({ params }: Props) {
  const { slug } = await params;
  const isAudiblePage = slug === 'audible';

  if (isAudiblePage) {
    return (
      <>
        {/* ヘッダー */}
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
                  <button className="btn btn-primary">
                    🎁 30日間無料で始める
                  </button>
                  <button className="btn btn-secondary">
                    📖 詳しく見る
                  </button>
                </div>
              </div>
              <div className="hero-image">
                <div className="phone-mockup">
                  <div className="phone-screen">
                    <AudioPlayer 
                      title="📚 7つの習慣"
                      author="スティーブン・R・コヴィー"
                      audioSrc="/sample-audio.mp3"
                      coverImage="/images/7-habits.jpg"
                    />
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
                <div className="countdown-display">
                  <div className="countdown-item">
                    <span id="days" className="countdown-value">15</span>
                    <span className="countdown-label">日</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <span id="hours" className="countdown-value">12</span>
                    <span className="countdown-label">時間</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <span id="minutes" className="countdown-value">34</span>
                    <span className="countdown-label">分</span>
                  </div>
                  <div className="countdown-separator">:</div>
                  <div className="countdown-item">
                    <span id="seconds" className="countdown-value">56</span>
                    <span className="countdown-label">秒</span>
                  </div>
                </div>
              </div>
              <button className="btn btn-cta">
                🚀 今すぐ30日間無料で始める
              </button>
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
      </>
    );
  }

  const [page, settings] = await Promise.all([
    sanityFetch({ query: pageQuery, params }),
    sanityFetch({ query: settingsQuery }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  // Regular page content
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-1 via-white to-secondary-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-soft">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-gradient">
                BlueWave24
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto container-padding">
        <article className="max-w-4xl mx-auto">
          <div className="text-center py-16 md:py-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900 mb-8">
              {page.title}
            </h1>
          </div>

          {page.body?.length && (
            <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 mb-16">
              <PortableText
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-primary-200 prose-blockquote:bg-primary-50 prose-blockquote:text-gray-700"
                value={page.body as PortableTextBlock[]}
              />
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
