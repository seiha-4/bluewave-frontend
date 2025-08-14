import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from 'react';
import AudibleLandingPage from "../audible-page";

import PortableText from "../portable-text";

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
    return <AudibleLandingPage />;
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
