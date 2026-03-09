const hasAnalyticsConsent = () => {
  try {
    return localStorage.getItem("cookie_consent") === "accepted";
  } catch (_err) {
    return false;
  }
};

export const trackEvent = (eventName, properties = {}) => {
  try {
    if (
      typeof window !== "undefined" &&
      hasAnalyticsConsent() &&
      window.posthog?.capture
    ) {
      window.posthog.capture(eventName, properties);
    }
  } catch (_err) {
    // noop
  }
};
