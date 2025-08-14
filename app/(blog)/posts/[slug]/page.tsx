import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Avatar from "../../avatar";
import CoverImage from "../../cover-image";
import DateComponent from "../../date";
import MoreStories from "../../more-stories";
import PortableText from "../../portable-text";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

const postSlugs = defineQuery(
  `*[_type == "post" && defined(slug.current)]{"slug": slug.current}`,
);

export async function generateStaticParams() {
  return await sanityFetch({
    query: postSlugs,
    perspective: "published",
    stega: false,
  });
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = await sanityFetch({
    query: postQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    authors: post?.author?.name ? [{ name: post?.author?.name }] : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage({ params }: Props) {
  const [post, settings] = await Promise.all([
    sanityFetch({ query: postQuery, params }),
    sanityFetch({ query: settingsQuery }),
  ]);

  if (!post?._id) {
    return notFound();
  }

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

      <div className="container mx-auto container-padding">
        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="text-center py-16 md:py-20">
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200">
                ← ホームに戻る
              </Link>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900 mb-8">
              {post.title}
            </h1>
            
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-gray-600">
              {post.author && (
                <div className="flex items-center space-x-3">
                  <Avatar name={post.author.name} picture={post.author.picture} />
                  <span className="font-medium">{post.author.name}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <DateComponent dateString={post.date} />
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-card">
            <CoverImage image={post.coverImage} priority />
          </div>

          {/* Article Content */}
          {post.body?.length && (
            <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 mb-16">
              <PortableText
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-primary-200 prose-blockquote:bg-primary-50 prose-blockquote:text-gray-700"
                value={post.body as PortableTextBlock[]}
              />
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 md:p-12 text-center text-white mb-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              📚 この記事が役に立ったら
            </h3>
            <p className="text-lg text-primary-100 mb-6 max-w-2xl mx-auto">
              Amazon Audibleで「聴く読書」を始めませんか？30日間無料でお試しいただけます。
            </p>
            <Link 
              href="/audible"
              className="btn-primary bg-white text-primary-600 hover:bg-gray-100 hover:text-primary-700 text-lg px-8 py-4"
            >
              Audible無料体験を始める →
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        <section className="pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                おすすめの記事
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-secondary-400 mx-auto rounded-full"></div>
            </div>
            <Suspense>
              <MoreStories skip={post._id} limit={3} />
            </Suspense>
          </div>
        </section>
      </div>
    </div>
  );
}
