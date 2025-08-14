'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void
  }
}

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Google Analytics pageview tracking
export const pageview = (url: string) => {
  if (!GA_TRACKING_ID || !window.gtag) return
  
  window.gtag('config', GA_TRACKING_ID, {
    page_location: url,
    page_title: document.title,
  })
}

// Google Analytics event tracking
export const event = (
  action: string,
  {
    event_category,
    event_label,
    value,
  }: {
    event_category?: string
    event_label?: string
    value?: number
  } = {}
) => {
  if (!GA_TRACKING_ID || !window.gtag) return

  window.gtag('event', action, {
    event_category,
    event_label,
    value,
  })
}

// Hook for tracking pageviews on route changes
export function useGoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_TRACKING_ID) return

    const url = pathname + searchParams.toString()
    pageview(url)
  }, [pathname, searchParams])
}

// Main Google Analytics component
export default function GoogleAnalytics() {
  if (!GA_TRACKING_ID) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GA_TRACKING_ID}', {
              page_location: window.location.href,
              page_title: document.title,
              send_page_view: true
            });
          `,
        }}
      />
    </>
  )
}