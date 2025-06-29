import * as Sentry from "@sentry/react-native";

const initSentry = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN || "YOUR_SENTRY_DSN_HERE",
    debug: __DEV__,
    environment: __DEV__ ? "development" : "production",
    
    // Pour React Native Web
    integrations: [
      new Sentry.BrowserTracing(),
    ],
    
    tracesSampleRate: 1.0,
    autoSessionTracking: true,
  });
};

export default initSentry;