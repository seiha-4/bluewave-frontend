import Link from "next/link";
import { Suspense } from "react";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";
import PortableText from "./portable-text";

import type { HeroQueryResult } from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery } from "@/sanity/lib/queries";

function Intro(props: { title: string | null | undefined; description: any }) {
  const title = props.title || demo.title;
  const description = props.description?.length
    ? props.description
    : demo.description;
  return (
    <section className="mt-16 mb-16 flex flex-col items-center lg:mb-12 lg:flex-row lg:justify-between">
      <h1 className="text-balance text-6xl font-bold leading-tight tracking-tighter lg:pr-8 lg:text-8xl">
        {title || demo.title}
      </h1>
      <h2 className="text-pretty mt-5 text-center text-lg lg:pl-8 lg:text-left">
        <PortableText
          className="prose-lg"
          value={description?.length ? description : demo.description}
        />
      </h2>
    </section>
  );
}

function HeroPost({
  title,
  slug,
  excerpt,
  coverImage,
  date,
  author,
}: Pick<
  Exclude<HeroQueryResult, null>,
  "title" | "coverImage" | "date" | "excerpt" | "author" | "slug"
>) {
  return (
    <article className="card max-w-4xl mx-auto overflow-hidden">
      <Link className="group block" href={`/posts/${slug}`}>
        <div className="aspect-video overflow-hidden rounded-t-xl">
          <CoverImage image={coverImage} priority />
        </div>
      </Link>
      <div className="p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-3 py-1 rounded-full">
              注目記事
            </span>
            <DateComponent dateString={date} />
          </div>
        </div>
        
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight text-gray-900">
          <Link href={`/posts/${slug}`} className="hover:text-primary-600 transition-colors duration-200">
            {title}
          </Link>
        </h3>
        
        {excerpt && (
          <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
            {excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          {author && (
            <div className="flex items-center space-x-3">
              <Avatar name={author.name} picture={author.picture} />
              <span className="text-sm text-gray-500">by {author.name}</span>
            </div>
          )}
          <Link 
            href={`/posts/${slug}`}
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            記事を読む →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default async function Page() {
  const [settings, heroPost] = await Promise.all([
    sanityFetch({
      query: settingsQuery,
    }),
    sanityFetch({ query: heroQuery }),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-1 via-white to-secondary-50">
      {/* Modern Header with Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-soft">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-gradient">
                BlueWave24
              </h1>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-700 hover:text-primary-600 font-medium">ホーム</Link>
                <Link href="/audible" className="text-gray-700 hover:text-primary-600 font-medium">Audible</Link>
                <Link href="#" className="text-gray-700 hover:text-primary-600 font-medium">記事</Link>
                <Link href="#" className="text-gray-700 hover:text-primary-600 font-medium">お問い合わせ</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/audible"
                className="btn-primary text-sm"
              >
                Audible無料体験
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="section-padding hero-gradient">
        <div className="container mx-auto container-padding text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block">成長と幸せの</span>
              <span className="block text-yellow-100">ブログ</span>
            </h1>
            <p className="text-xl md:text-2xl text-yellow-100 mb-8 leading-relaxed max-w-3xl mx-auto">
              毎日をより良く、より豊かにするためのヒントをお届けします。
              <br className="hidden md:block" />
              自己成長、読書、そして幸せな人生について一緒に学びましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/audible" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 hover:text-primary-700">
                📚 Audible無料体験を始める
              </Link>
              <Link href="#posts" className="text-white hover:text-yellow-200 font-semibold underline underline-offset-4">
                記事を読む
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto container-padding">
        {/* Featured Post Section */}
        {heroPost ? (
          <section id="posts" className="section-padding">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                注目の記事
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                最新の記事をチェックして、あなたの成長に役立つ情報を見つけてください
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <HeroPost
                title={heroPost.title}
                slug={heroPost.slug}
                coverImage={heroPost.coverImage}
                excerpt={heroPost.excerpt}
                date={heroPost.date}
                author={heroPost.author}
              />
            </div>
          </section>
        ) : (
          <Onboarding />
        )}

        {/* More Stories Section */}
        {heroPost?._id && (
          <section className="pb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                その他の記事
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 mx-auto rounded-full"></div>
            </div>
            <Suspense>
              <MoreStories skip={heroPost._id} limit={100} />
            </Suspense>
          </section>
        )}
      </div>
    </div>
  );
}
