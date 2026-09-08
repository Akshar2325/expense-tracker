import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { gradients, type GradientName } from "@/theme";

interface AnimatedOrbProps {
  color?: GradientName;
  size?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Opacity of the orb. */
  opacity?: number;
  /** Delay before animation starts (ms). */
  delay?: number;
}

/**
 * A soft pastel gradient orb that gently drifts — the mobile equivalent of
 * the web's GradientOrb. Uses Reanimated for 60fps motion.
 */
export function AnimatedOrb({
  color = "mint",
  size = 240,
  top,
  left,
  right,
  bottom,
  duration = 9000,
  opacity = 0.5,
  delay = 0,
}: AnimatedOrbProps) {
  const driftX = useSharedValue(0);
  const driftY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const start = setTimeout(() => {
      driftX.value = withRepeat(
        withTiming(size * 0.18, {
          duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      );
      driftY.value = withRepeat(
        withTiming(size * 0.14, {
          duration: duration * 0.8,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      );
      scale.value = withRepeat(
        withTiming(1.08, {
          duration: duration * 0.6,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      );
    }, delay);
    return () => clearTimeout(start);
  }, [driftX, driftY, scale, size, duration, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: driftX.value },
      { translateY: driftY.value },
      { scale: scale.value },
    ],
  }));

  const [c1, c2] = gradients[color];

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          top,
          left,
          right,
          bottom,
          opacity,
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={[c1, c2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: "absolute",
    borderRadius: 9999,
    overflow: "hidden",
  },
});
