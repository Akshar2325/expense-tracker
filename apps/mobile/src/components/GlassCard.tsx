import React from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme, radius, shadow } from "@/theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  /** Extra blur intensity (default 20). */
  intensity?: number;
  /** Rounded corner radius. */
  borderRadius?: number;
  /** Disable the blur (fallback for web where BlurView may be heavy). */
  plain?: boolean;
}

/**
 * Glassy card with backdrop blur — the "glassy iPhone effect".
 * Uses a translucent fill + hairline border + soft shadow.
 */
export function GlassCard({
  children,
  style,
  intensity = 24,
  borderRadius = radius.lg,
  plain = false,
}: GlassCardProps) {
  const { palette } = useTheme();

  if (plain) {
    return (
      <View
        style={[
          styles.base,
          {
            backgroundColor: palette.glass,
            borderColor: palette.glassBorder,
            borderRadius,
          },
          shadow.soft,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.wrap,
        {
          borderRadius,
          backgroundColor: palette.glassBorder,
        },
        shadow.soft,
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={palette.canvas === "#f5f5f5" ? "light" : "dark"}
        style={[styles.blur, { borderRadius }]}
      >
        <View
          style={[
            styles.inner,
            {
              borderRadius,
              borderColor: palette.glassBorder,
              backgroundColor: palette.glass,
            },
          ]}
        >
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    overflow: "hidden",
  },
  blur: {
    overflow: "hidden",
  },
  inner: {
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  base: {
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
});
