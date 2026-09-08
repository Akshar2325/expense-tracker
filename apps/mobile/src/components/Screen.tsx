import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import { AnimatedOrb } from "./AnimatedOrb";
import { useResponsive } from "@/hooks/useResponsive";

interface ScreenProps {
  children: React.ReactNode;
  /** Scrollable content (default true). */
  scroll?: boolean;
  /** Show decorative gradient orbs. */
  orbs?: boolean;
  style?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];
  scrollProps?: ScrollViewProps;
}

/**
 * Themed screen wrapper: safe area, canvas background, decorative orbs,
 * and responsive horizontal padding.
 */
export function Screen({
  children,
  scroll = true,
  orbs = true,
  style,
  contentContainerStyle,
  scrollProps,
}: ScreenProps) {
  const { palette } = useTheme();
  const { padding } = useResponsive();

  const content = (
    <View
      style={[
        styles.content,
        { paddingHorizontal: padding, paddingVertical: 16 },
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: palette.canvas }, style]}
      edges={["top", "left", "right"]}
    >
      {orbs ? (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <AnimatedOrb
            color="mint"
            size={260}
            top={-80}
            left={-90}
            opacity={0.4}
          />
          <AnimatedOrb
            color="lavender"
            size={220}
            top={-40}
            right={-80}
            opacity={0.35}
            delay={1200}
          />
          <AnimatedOrb
            color="peach"
            size={200}
            bottom={-70}
            right={-60}
            opacity={0.3}
            delay={2400}
          />
        </View>
      ) : null}
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          {...scrollProps}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
});
