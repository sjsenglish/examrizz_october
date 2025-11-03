'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

export function PostHogPageView(): JSX.Element {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])

  return <></>
}

interface PostHogProviderProps {
  children: React.ReactNode
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

      if (posthogKey) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          capture_pageview: false, // We'll manually capture pageviews
          capture_pageleave: true,
          debug: process.env.NODE_ENV === 'development',
          // Additional configuration options
          loaded: (posthog) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('PostHog loaded')
            }
          }
        })
      } else {
        console.warn('PostHog key not found. Make sure NEXT_PUBLIC_POSTHOG_KEY is set in your environment variables.')
      }
    }
  }, [])

  return <>{children}</>
}