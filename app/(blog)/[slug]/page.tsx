import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";

import PortableText from "../portable-text";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery, settingsQuery } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

const pageSlugs = defineQuery(
  `*[_type == "page" && defined(slug.current)]{"slug": slug.current}`,
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
  const [page, settings] = await Promise.all([
    sanityFetch({ query: pageQuery, params }),
    sanityFetch({ query: settingsQuery }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  const { slug } = await params;
  const isAudiblePage = slug === 'audible';

  if (isAudiblePage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-1 via-white to-secondary-50">
        {/* Header Navigation */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-soft">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-2xl font-bold text-gradient">
                  BlueWave24
                </Link>
                <div className="hidden md:flex space-x-6">
                  <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">ホーム</Link>
                  <Link href="/audible" className="text-gray-700 hover:text-primary-600 font-medium">Audible</Link>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <div className="container mx-auto container-padding">
          {/* Hero Section */}
          <section className="text-center py-16 md:py-24">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6">
                📚 忙しいあなたも<br className="md:hidden" />
                <span className="text-gradient">「ながら読書」</span>で<br className="md:hidden" />
                成長できる
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                Amazon Audible（オーディブル）30日間無料体験
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <a 
                  href="https://amzn.to/47vbF3c" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary text-lg px-8 py-4 transform hover:scale-105 transition-all duration-300"
                >
                  🎧 30日間無料体験を始める
                </a>
                <div className="text-sm text-gray-500">
                  ※期間中解約で完全無料
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                🎧 Audibleが選ばれる5つの理由
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="card text-center">
                  <div className="text-4xl mb-4">⏰</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">いつでもどこでも学習</h3>
                  <p className="text-gray-600">通勤時間、家事をしながら、ジョギング中など、今まで「空いている」と思っていた時間を有効活用。1日30分でも、1年間で約180時間の学習時間を確保できます。</p>
                </div>
                <div className="card text-center">
                  <div className="text-4xl mb-4">🎭</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">プロの朗読で理解度アップ</h3>
                  <p className="text-gray-600">プロの声優や俳優による朗読で、内容がより深く理解できます。感情豊かな朗読は、文字を読むだけでは得られない新しい読書体験をもたらします。</p>
                </div>
                <div className="card text-center">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">12万冊以上の豊富なライブラリー</h3>
                  <p className="text-gray-600">ビジネス書、小説、自己啓発書、語学学習書など、あらゆるジャンルの本が12万冊以上。あなたの興味や目標に合った本が必ず見つかります。</p>
                </div>
                <div className="card text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">再生速度を調整可能</h3>
                  <p className="text-gray-600">0.5倍速から3.5倍速まで調整可能。じっくり聞きたい部分はゆっくりと、慣れてきたら倍速で効率的に。あなたのペースで学習できます。</p>
                </div>
                <div className="card text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">オフライン再生対応</h3>
                  <p className="text-gray-600">事前にダウンロードしておけば、ネット環境がない場所でも聴くことができます。通信量を気にせず、どこでも読書を楽しめます。</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="py-16 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl my-16">
            <div className="max-w-4xl mx-auto text-center px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
                💬 実際の利用者の声
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-soft">
                  <p className="text-gray-700 mb-4 italic">&quot;通勤時間が毎日1時間あるので、その時間を使ってビジネス書を聴いています。1ヶ月で3〜4冊は読めるようになり、仕事の知識も大幅にアップしました！&quot;</p>
                  <div className="text-sm text-gray-500">30代・会社員</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-soft">
                  <p className="text-gray-700 mb-4 italic">&quot;家事をしながら自己啓発書を聴いています。料理や掃除の時間が学習時間に変わって、一石二鳥！時間を有効活用できている実感があります。&quot;</p>
                  <div className="text-sm text-gray-500">40代・主婦</div>
                </div>
              </div>
            </div>
          </section>

          {/* How to Start */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
                📱 簡単3ステップで始められる
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600 mx-auto mb-4">1</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">無料体験に登録</h3>
                  <p className="text-gray-600">Amazonアカウントでログインして、30日間無料体験に登録するだけ。1分で完了します。</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600 mx-auto mb-4">2</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">お気に入りの本を選ぶ</h3>
                  <p className="text-gray-600">12万冊以上のライブラリーから、あなたの興味に合った本を選びます。人気ランキングやおすすめ機能で簡単に見つけられます。</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600 mx-auto mb-4">3</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">今すぐ聴き始める</h3>
                  <p className="text-gray-600">スマホアプリをダウンロードして、いつでもどこでも「聴く読書」をスタート！</p>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16">
            <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 md:p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                🚀 今すぐ始めて、新しい読書体験を！
              </h2>
              <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                時間がないを理由に読書を諦めていませんか？Audibleなら、今日から「ながら読書」で知識を増やせます。
                <br className="hidden md:block" />
                30日間無料なので、リスクゼロで始められます。
              </p>
              <div className="space-y-4">
                <a 
                  href="https://amzn.to/47vbF3c" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100 hover:text-primary-700 text-xl px-10 py-5 inline-block transform hover:scale-105 transition-all duration-300"
                >
                  🎧 今すぐ30日間無料体験を始める
                </a>
                <div className="text-primary-100 text-sm">
                  ※Amazonアカウントでかんたん登録・期間中解約で完全無料
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
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