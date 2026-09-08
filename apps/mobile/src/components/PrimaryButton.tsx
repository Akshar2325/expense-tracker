import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme, radius, fontSize, fontFamily } from "@/theme";

interface PrimaryButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "ghost";
  style?: ViewStyle | ViewStyle[];
  icon?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  style,
  icon,
}: PrimaryButtonProps) {
  const { palette } = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 18, stiffness: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 18, stiffness: 300 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";

  const bg = isPrimary
    ? palette.primary
    : isOutline
      ? "transparent"
      : "transparent";
  const textColor = isPrimary
    ? palette.onPrimary
    : isOutline
      ? palette.ink
      : palette.muted;
  const borderColor = isOutline ? palette.hairlineStrong : "transparent";

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderColor,
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              { color: textColor, fontFamily: fontFamily.bodySemibold },
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  label: {
    fontSize: fontSize.bodyMd,
    letterSpacing: 0.2,
  },
});
