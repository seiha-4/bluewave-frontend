import "../globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  VisualEditing,
  toPlainText,
  type PortableTextBlock,
} from "next-sanity";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import Link from "next/link";

import AlertBanner from "./alert-banner";
import PortableText from "./portable-text";
import GoogleAnalytics from "../components/GoogleAnalytics";
import PageViewTracker from "../components/PageViewTracker";

import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await sanityFetch({ query: settingsQuery });
  const footer = data?.footer || [];
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={`${inter.variable} bg-white text-black`}>
      <body>
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <section className="min-h-screen">
          {isDraftMode && <AlertBanner />}
          <main>{children}</main>
          <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {footer.length > 0 ? (
                <PortableText
                  className="prose-sm text-pretty bottom-0 w-full max-w-none py-12 text-center md:py-20 text-gray-300"
                  value={footer as PortableTextBlock[]}
                />
              ) : (
                <div className="py-16">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                        BlueWave24
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        成長と幸せのブログ。毎日をより良く、より豊かにするためのヒントをお届けします。
                      </p>
                      <div className="flex space-x-4">
                        <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                          <span className="sr-only">Twitter</span>
                          🐦
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-secondary-400 transition-colors duration-200">
                          <span className="sr-only">Facebook</span>
                          📘
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-primary-400 transition-colors duration-200">
                          <span className="sr-only">Instagram</span>
                          📷
                        </Link>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-white">クイックリンク</h4>
                      <ul className="space-y-2">
                        <li><Link href="/" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">ホーム</Link></li>
                        <li><Link href="/audible" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">Audible無料体験</Link></li>
                        <li><Link href="#" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">記事一覧</Link></li>
                        <li><Link href="#" className="text-gray-300 hover:text-primary-400 transition-colors duration-200">お問い合わせ</Link></li>
                      </ul>
                    </div>

                    
                  </div>

                  {/* Bottom Bar */}
                  <div className="border-t border-gray-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <p className="text-gray-400 text-sm mb-4 md:mb-0">
                        © 2024 BlueWave24. All rights reserved.
                      </p>
                      <div className="flex space-x-6">
                        <Link href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200">
                          プライバシーポリシー
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-200">
                          利用規約
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </footer>
        </section>
        {isDraftMode && <VisualEditing />}
        <SpeedInsights />
      </body>
    </html>
  );
}
