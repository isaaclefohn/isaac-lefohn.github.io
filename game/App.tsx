/**
 * Color Block Blast — Root App component.
 * Sets up gesture handler, navigation, ads SDK, and status bar.
 */

// MUST be first import — initializes the Reanimated runtime
import 'react-native-reanimated';

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initializeAds } from './src/services/ads';

export default function App() {
  useEffect(() => {
    initializeAds();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <RootNavigator />
    </GestureHandlerRootView>
  );
}
