import React from 'react';
import { Platform } from 'react-native';
import { ExpoRoot } from 'expo-router';

// On web, expo-router file-based routing can fail in some setups (contextModule undefined).
// Render a simple fallback home screen on web to avoid the crash while keeping ExpoRoot on native.
let WebFallback: any = null;
if (Platform.OS === 'web') {
  try {
    WebFallback = require('./app/(tabs)/index').default;
  } catch {
    WebFallback = null;
  }
}

export default function App(): JSX.Element {
  if (Platform.OS === 'web' && WebFallback) {
    return React.createElement(WebFallback);
  }
  return <ExpoRoot />;
}
