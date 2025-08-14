'use client'

import { useGoogleAnalytics } from './GoogleAnalytics'

export default function PageViewTracker() {
  useGoogleAnalytics()
  return null
}