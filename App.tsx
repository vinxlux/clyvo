import React from 'react';
import { Platform } from 'react-native';
import ErrorBoundary from './components/ErrorBoundary';
import WebShell from './components/WebShell';

// Render ExpoRoot so the app's file-based routing and `app/_layout` control
// which screen is shown (login vs tabs). Previous web fallbacks caused the
// Auth screen to be forced even when routing was available.
export default function App(): React.ReactElement {
  // Global JS error / promise rejection handlers to capture runtime details
  try {
    // ErrorUtils exists in React Native JS runtime
    const rnGlobal: any = global as any;
    if (rnGlobal?.ErrorUtils && typeof rnGlobal.ErrorUtils.setGlobalHandler === 'function') {
      rnGlobal.ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
        console.error('🚨 Global JS Error (ErrorUtils) — isFatal:', isFatal, 'message:', error?.message, 'stack:', error?.stack, 'errorObj:', error);
        // fallback to default behaviour (keep app from silently swallowing errors in dev)
        try {
          const prev = rnGlobal.ErrorUtils.getGlobalHandler && rnGlobal.ErrorUtils.getGlobalHandler();
          if (prev && prev !== rnGlobal.ErrorUtils.setGlobalHandler) prev(error, isFatal);
        } catch (e) {
          // ignore
        }
      });
    }
  } catch (e) {
    // ignore setting global handler failures
  }
  // Unhandled promise rejections
  try {
    if (typeof globalThis !== 'undefined' && (globalThis as any).addEventListener) {
      (globalThis as any).addEventListener('unhandledrejection', (ev: any) => {
        console.error('🚨 UnhandledPromiseRejection:', ev?.reason);
      });
    }
  } catch (e) {
    // ignore
  }
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

  // On native platforms, some versions of `expo-router` may fail at runtime in this
  // project (observed as `Cannot read property 'keys' of undefined`). As a pragmatic
  // fallback, render the app entry screen directly so Android/iOS can run without
  // relying on the router. This keeps behavior close to the intended app while we
  // investigate router compatibility separately.
  if (Platform.OS !== 'web') {
    try {
      // Load the main native-only index screen (avoids invoking ExpoRoot / router)
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const NativeIndex = require('./native/NativeIndex').default;
      return (
        <ErrorBoundary>
          <NativeIndex />
        </ErrorBoundary>
      );
    } catch (e) {
      console.error('Failed to load native fallback index screen:', e);
      // fall back to ExpoRoot if possible
    }
  }

  // For web, load ExpoRoot lazily to avoid importing `expo-router` on native platforms
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ExpoRoot: LazyExpoRoot } = require('expo-router');
    return (
      <ErrorBoundary>
        <LazyExpoRoot {...({} as any)} />
      </ErrorBoundary>
    );
  } catch (e) {
    console.error('Failed to load ExpoRoot:', e);
    return (
      <ErrorBoundary>
        <WebShell />
      </ErrorBoundary>
    );
  }
}
