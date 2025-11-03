import posthog from 'posthog-js'

// Common analytics events for the examrizz platform
export const Analytics = {
  // User events
  userSignUp: (properties?: Record<string, any>) => {
    posthog.capture('user_sign_up', properties)
  },

  userLogin: (properties?: Record<string, any>) => {
    posthog.capture('user_login', properties)
  },

  userLogout: () => {
    posthog.capture('user_logout')
  },

  // Subscription events
  subscriptionUpgraded: (tier: string, properties?: Record<string, any>) => {
    posthog.capture('subscription_upgraded', { tier, ...properties })
  },

  subscriptionCanceled: (tier: string, properties?: Record<string, any>) => {
    posthog.capture('subscription_canceled', { tier, ...properties })
  },

  paymentPageViewed: (properties?: Record<string, any>) => {
    posthog.capture('payment_page_viewed', properties)
  },

  // Learning events
  questionAttempted: (subject: string, questionType: string, properties?: Record<string, any>) => {
    posthog.capture('question_attempted', { subject, question_type: questionType, ...properties })
  },

  questionCompleted: (subject: string, questionType: string, correct: boolean, properties?: Record<string, any>) => {
    posthog.capture('question_completed', { 
      subject, 
      question_type: questionType, 
      correct,
      ...properties 
    })
  },

  searchPerformed: (query: string, subject: string, resultsCount: number, properties?: Record<string, any>) => {
    posthog.capture('search_performed', { 
      query, 
      subject, 
      results_count: resultsCount,
      ...properties 
    })
  },

  filterApplied: (subject: string, filterType: string, filterValue: string, properties?: Record<string, any>) => {
    posthog.capture('filter_applied', { 
      subject, 
      filter_type: filterType, 
      filter_value: filterValue,
      ...properties 
    })
  },

  // Draft/Writing events
  draftCreated: (properties?: Record<string, any>) => {
    posthog.capture('draft_created', properties)
  },

  draftSaved: (versionNumber: number, wordCount: number, properties?: Record<string, any>) => {
    posthog.capture('draft_saved', { 
      version_number: versionNumber, 
      word_count: wordCount,
      ...properties 
    })
  },

  draftDeleted: (versionNumber: number, properties?: Record<string, any>) => {
    posthog.capture('draft_deleted', { version_number: versionNumber, ...properties })
  },

  // AI Chat events
  chatMessageSent: (messageLength: number, properties?: Record<string, any>) => {
    posthog.capture('chat_message_sent', { message_length: messageLength, ...properties })
  },

  chatSessionStarted: (properties?: Record<string, any>) => {
    posthog.capture('chat_session_started', properties)
  },

  // Material/Study events
  materialUploaded: (category: string, fileType: string, properties?: Record<string, any>) => {
    posthog.capture('material_uploaded', { category, file_type: fileType, ...properties })
  },

  materialViewed: (materialId: string, category: string, properties?: Record<string, any>) => {
    posthog.capture('material_viewed', { material_id: materialId, category, ...properties })
  },

  // Navigation events
  tabSwitched: (fromTab: string, toTab: string, properties?: Record<string, any>) => {
    posthog.capture('tab_switched', { from_tab: fromTab, to_tab: toTab, ...properties })
  },

  // Feature usage
  featureUsed: (featureName: string, properties?: Record<string, any>) => {
    posthog.capture('feature_used', { feature_name: featureName, ...properties })
  },

  // Error tracking
  errorOccurred: (errorType: string, errorMessage: string, properties?: Record<string, any>) => {
    posthog.capture('error_occurred', { 
      error_type: errorType, 
      error_message: errorMessage,
      ...properties 
    })
  },

  // Helper function to identify users
  identifyUser: (userId: string, userProperties: Record<string, any>) => {
    posthog.identify(userId, userProperties)
  },

  // Helper function to set user properties
  setUserProperties: (properties: Record<string, any>) => {
    posthog.setPersonProperties(properties)
  }
}

export default Analytics