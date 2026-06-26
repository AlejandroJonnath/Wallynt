import type { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@shared/components/ThemedText';
import { ThemedView } from '@shared/components/ThemedView';

type HintRowProps = {
  title?: string;
  hint?: ReactNode;
};

export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) {
  return (
    <View style={styles.stepRow}>
      <ThemedText type="small">{title}</ThemedText>
      <ThemedView style={styles.codeSnippet}>
        <ThemedText>{hint}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  stepRow: { flexDirection: 'row', justifyContent: 'space-between' },
  codeSnippet: { borderRadius: 4, paddingVertical: 2, paddingHorizontal: 8 },
});
