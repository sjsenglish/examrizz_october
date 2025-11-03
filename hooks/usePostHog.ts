'use client'

import { useEffect, useState } from 'react'
import posthog from 'posthog-js'

export function usePostHog() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && posthog.__loaded) {
      setIsReady(true)
    }
  }, [])

  const capture = (event: string, properties?: Record<string, any>) => {
    if (isReady) {
      posthog.capture(event, properties)
    }
  }

  const identify = (distinctId: string, properties?: Record<string, any>) => {
    if (isReady) {
      posthog.identify(distinctId, properties)
    }
  }

  const setPersonProperties = (properties: Record<string, any>) => {
    if (isReady) {
      posthog.setPersonProperties(properties)
    }
  }

  const reset = () => {
    if (isReady) {
      posthog.reset()
    }
  }

  const alias = (alias: string) => {
    if (isReady) {
      posthog.alias(alias)
    }
  }

  const group = (groupType: string, groupKey: string, properties?: Record<string, any>) => {
    if (isReady) {
      posthog.group(groupType, groupKey, properties)
    }
  }

  return {
    posthog: isReady ? posthog : null,
    isReady,
    capture,
    identify,
    setPersonProperties,
    reset,
    alias,
    group
  }
}