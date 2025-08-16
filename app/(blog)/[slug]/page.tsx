import { defineQuery } from "next-sanity";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "../../../sanity/lib/fetch";
import { pageQuery, settingsQuery } from "../../../sanity/lib/queries";
import PostPageClient from "../../components/PostPageClient";
import AudibleLandingPageClient from "../components/AudibleLandingPageClient";
import type { PagePayload } from "../../types/sanity";

interface Settings {
  title?: string;
  // Add other settings properties as needed
}

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
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const resolvedParams = await params;
  const page = await sanityFetch({
    query: pageQuery,
    params: resolvedParams,
    stega: false,
  });

  return {
    title: page?.title,
    description: page?.title,
  } satisfies Metadata;
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  // Handle Audible landing page separately
  if (slug === 'audible') {
    return <AudibleLandingPageClient />;
  }

  const [page, settings] = await Promise.all([
    sanityFetch({
      query: pageQuery,
      params: { slug },
    }) as Promise<PagePayload>,
    sanityFetch({
      query: settingsQuery,
    }) as Promise<Settings | null>,
  ]);

  if (!page?._id || !settings) {
    return notFound();
  }

  // Ensure settings has at least an empty object to avoid null
  const safeSettings = settings || {};
  
  return <PostPageClient page={page} settings={safeSettings} />;
}
