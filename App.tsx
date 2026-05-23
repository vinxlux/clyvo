import React from 'react';
import { Platform } from 'react-native';
import { ExpoRoot } from 'expo-router';
import ErrorBoundary from './components/ErrorBoundary';
import WebShell from './components/WebShell';

// Render ExpoRoot so the app's file-based routing and `app/_layout` control
// which screen is shown (login vs tabs). Previous web fallbacks caused the
// Auth screen to be forced even when routing was available.
export default function App(): React.ReactElement {
  // If the router failed on web (detected by ErrorBoundary), render an independent web shell
  if (Platform.OS === 'web') {
    try {
      if (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('@clyvo:expoRouterFailed') === 'true') {
        return (
          <ErrorBoundary>
            <WebShell />
          </ErrorBoundary>
        );
      }
    } catch {
      // ignore and fall through to ExpoRoot
    }
  }

  return (
    <ErrorBoundary>
      {/* ExpoRoot's TypeScript signature may require a context prop in some versions; cast to any to satisfy checks */}
      <ExpoRoot {...({} as any)} />
    </ErrorBoundary>
  );
}
