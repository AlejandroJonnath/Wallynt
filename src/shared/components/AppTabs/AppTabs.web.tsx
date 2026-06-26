import { Tabs, TabList, TabTrigger, TabSlot, TabTriggerSlotProps, TabListProps } from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';

import { ThemedText } from '@shared/components/ThemedText';
import { ThemedView } from '@shared/components/ThemedView';

/**
 * AppTabs web — componente de tabs web (no usado en Wallynt actualmente).
 * Expo template legacy. Guardado para referencia futura.
 */
export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/(app)/home" asChild>
            <TabButton>Home</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView style={styles.tabButtonView}>
        <ThemedText type="small">{children}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView style={styles.innerContainer}>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: { position: 'absolute', width: '100%', padding: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  innerContainer: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', flexGrow: 1, gap: 8 },
  pressed: { opacity: 0.7 },
  tabButtonView: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12 },
});
