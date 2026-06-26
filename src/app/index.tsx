import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../constants/theme';

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={theme.colors.secondary} />
    </View>
  );
}
