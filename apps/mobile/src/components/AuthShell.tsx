import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Moon, Sun } from "lucide-react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useTheme, fontFamily, fontSize, radius } from "@/theme";
import { AnimatedOrb } from "./AnimatedOrb";
import { Mascot } from "./Mascot";
import { GlassCard } from "./GlassCard";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

/**
 * Shared animated shell for login/register: floating orbs, cartoon mascot,
 * glassy form card, and a theme toggle.
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  const { palette, resolved, toggle } = useTheme();
  const router = useRouter();
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, [glow]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + glow.value * 0.25,
  }));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.canvas }]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AnimatedOrb
          color="mint"
          size={300}
          top={-100}
          left={-110}
          opacity={0.45}
        />
        <AnimatedOrb
          color="lavender"
          size={260}
          top={-60}
          right={-90}
          opacity={0.4}
          delay={900}
        />
        <AnimatedOrb
          color="peach"
          size={240}
          bottom={-80}
          right={-70}
          opacity={0.35}
          delay={1800}
        />
        <AnimatedOrb
          color="sky"
          size={200}
          bottom={-60}
          left={-60}
          opacity={0.3}
          delay={2600}
        />
      </View>

      {/* Theme toggle */}
      <View style={styles.topBar}>
        <Pressable
          onPress={toggle}
          hitSlop={12}
          style={[
            styles.toggle,
            {
              backgroundColor: palette.glass,
              borderColor: palette.glassBorder,
            },
          ]}
        >
          {resolved === "dark" ? (
            <Sun size={18} color={palette.ink} />
          ) : (
            <Moon size={18} color={palette.ink} />
          )}
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Mascot */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(700)}
            style={styles.mascotWrap}
          >
            <Animated.View style={glowStyle}>
              <Mascot size={170} />
            </Animated.View>
          </Animated.View>

          {/* Heading */}
          <Animated.View
            entering={FadeInDown.delay(250).duration(600)}
            style={styles.heading}
          >
            <Text
              style={[
                styles.title,
                { color: palette.ink, fontFamily: fontFamily.display },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: palette.muted, fontFamily: fontFamily.body },
              ]}
            >
              {subtitle}
            </Text>
          </Animated.View>

          {/* Glass form card */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(650)}
            style={styles.cardWrap}
          >
            <GlassCard style={styles.card} intensity={32}>
              {children}
            </GlassCard>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            entering={FadeInDown.delay(550).duration(600)}
            style={styles.footer}
          >
            {footer}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  topBar: {
    position: "absolute",
    top: 8,
    right: 20,
    zIndex: 10,
  },
  toggle: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotWrap: {
    marginTop: 24,
    alignItems: "center",
  },
  heading: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  title: {
    fontSize: fontSize.display,
    lineHeight: 46,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontSize.body,
    marginTop: 8,
    textAlign: "center",
    maxWidth: 300,
  },
  cardWrap: {
    width: "100%",
    maxWidth: 420,
  },
  card: {
    padding: 24,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
});
