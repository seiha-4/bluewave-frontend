'use client';

import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { PortableTextBlock } from "next-sanity";
import AudioPlayerClient from "./AudioPlayerClient";

interface PostPageClientProps {
  page: {
    _id: string;
    status: 'published' | 'draft';
    title: string;
    slug: string | null;
    body: PortableTextBlock[] | null;
    date: string;
  };
  settings: {
    title?: string;
    // Add other settings properties as needed
  };
}

export default function PostPageClient({ page, settings }: PostPageClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            {settings?.title || 'BlueWave'}
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
              <li><Link href="/blog" className="hover:text-primary-600">Blog</Link></li>
              <li><Link href="/about" className="hover:text-primary-600">About</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto">
            <div className="text-center py-16 md:py-20">
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900 mb-8">
                {page.title}
              </h1>
            </div>

            {page.body && page.body.length > 0 && (
              <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 mb-16">
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-primary-200 prose-blockquote:bg-primary-50 prose-blockquote:text-gray-700">
                  <PortableText 
                    value={page.body}
                  />
                </div>
              </div>
            )}

            {/* Audio Player Section */}
            <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                オーディオブックを試聴する
              </h2>
              <AudioPlayerClient 
                title="📚 7つの習慣"
                author="スティーブン・R・コヴィー"
                audioSrc="/sample-audio.mp3"
                coverImage="/images/7-habits.jpg"
              />
            </div>
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} {settings?.title || 'BlueWave'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
