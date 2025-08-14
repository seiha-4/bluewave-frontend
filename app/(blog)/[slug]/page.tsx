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

  return (
    <div className="container mx-auto px-5">
      {/* Blog Title Header */}
      <header className="text-center py-12 border-b border-gray-200 mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          成長と幸せのブログ
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          毎日をより良く、より豊かにするためのヒントをお届けします
        </p>
      </header>

      <h2 className="mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
        <Link href="/" className="hover:underline">
          {settings?.title || demo.title}
        </Link>
      </h2>
      
      <article>
        <h1 className="text-balance mb-12 text-6xl font-bold leading-tight tracking-tighter md:text-7xl md:leading-none lg:text-8xl">
          {page.title}
        </h1>
        
        {page.body?.length && (
          <PortableText
            className="mx-auto max-w-4xl prose prose-lg"
            value={page.body as PortableTextBlock[]}
          />
        )}
      </article>
    </div>
  );
}