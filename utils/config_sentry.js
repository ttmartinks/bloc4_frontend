import * as Sentry from "@sentry/react-native";

const initSentry = () => {
  Sentry.init({
    dsn: "https://4bbc3a105e57382669c2711d4aa41985@o4509582909243392.ingest.de.sentry.io/4509583276507216",
    
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