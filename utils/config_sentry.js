import * as Sentry from "@sentry/react-native";

const initSentry = () => {
  Sentry.init({
    dsn: "https://5c787e9ffe375bb4b753c111b682a45b@o4509582909243392.ingest.de.sentry.io/4509582964031568",
    
    // Context data (IP, cookies, user info)
    sendDefaultPii: true,
    
    // Sample rates
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    
    // Session Replays
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Intégrations - SUPPRIMÉ BrowserTracing qui cause l'erreur
    integrations: [
      Sentry.mobileReplayIntegration(),
      // Removed BrowserTracing - not available in react-native package
    ],
    
    // Environment
    environment: __DEV__ ? "development" : "production",
    debug: __DEV__,
  });
};

export default initSentry;