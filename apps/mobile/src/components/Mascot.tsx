import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Ellipse, G, Path, Rect } from "react-native-svg";
import { useTheme } from "@/theme";

interface MascotProps {
  size?: number;
}

/**
 * A cute animated "Ledger" mascot — a smiling wallet with blinking eyes and
 * floating coins. Built with SVG + Reanimated for a playful cartoon feel on
 * the auth screens.
 */
export function Mascot({ size = 180 }: MascotProps) {
  const { palette } = useTheme();
  const bob = useSharedValue(0);
  const blink = useSharedValue(1);
  const coin1 = useSharedValue(0);
  const coin2 = useSharedValue(0);
  const coin3 = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
    blink.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600 }),
        withTiming(0.1, { duration: 160 }),
        withTiming(1, { duration: 160 }),
      ),
      -1,
    );
    coin1.value = withRepeat(
      withSequence(
        withTiming(-14, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
    coin2.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
    coin3.value = withRepeat(
      withSequence(
        withTiming(-16, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
  }, [bob, blink, coin1, coin2, coin3]);

  const bobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));
  const blinkStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: blink.value }],
  }));
  const coin1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: coin1.value }],
  }));
  const coin2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: coin2.value }],
  }));
  const coin3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: coin3.value }],
  }));

  const wallet = palette.canvas === "#f5f5f5" ? "#292524" : "#f5f5f5";
  const walletLight = palette.canvas === "#f5f5f5" ? "#44403c" : "#e7e5e4";
  const accent = "#a7e5d3";
  const coin = "#f4c5a8";

  return (
    <View style={{ width: size, height: size * 0.9 }}>
      {/* Floating coins */}
      <Animated.View
        style={[
          styles.coin,
          { left: size * 0.02, top: size * 0.05 },
          coin1Style,
        ]}
      >
        <Svg width={size * 0.22} height={size * 0.22} viewBox="0 0 48 48">
          <Circle cx="24" cy="24" r="22" fill={coin} />
          <Circle
            cx="24"
            cy="24"
            r="16"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            opacity="0.6"
          />
          <Path
            d="M24 14v20M17 20l7-4 7 4"
            stroke="#fff"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
      <Animated.View
        style={[
          styles.coin,
          { right: size * 0.02, top: size * 0.12 },
          coin2Style,
        ]}
      >
        <Svg width={size * 0.18} height={size * 0.18} viewBox="0 0 48 48">
          <Circle cx="24" cy="24" r="22" fill={accent} />
          <Circle
            cx="24"
            cy="24"
            r="16"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            opacity="0.6"
          />
          <Path
            d="M24 14v20M17 20l7-4 7 4"
            stroke="#fff"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
      <Animated.View
        style={[
          styles.coin,
          { left: size * 0.28, top: size * 0.0 },
          coin3Style,
        ]}
      >
        <Svg width={size * 0.16} height={size * 0.16} viewBox="0 0 48 48">
          <Circle cx="24" cy="24" r="22" fill="#c8b8e0" />
          <Circle
            cx="24"
            cy="24"
            r="16"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            opacity="0.6"
          />
          <Path
            d="M24 14v20M17 20l7-4 7 4"
            stroke="#fff"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>

      {/* Wallet character */}
      <Animated.View style={[styles.mascot, bobStyle]}>
        <Svg width={size} height={size * 0.9} viewBox="0 0 200 180">
          <G>
            {/* Body */}
            <Rect
              x="30"
              y="40"
              width="140"
              height="100"
              rx="34"
              fill={wallet}
            />
            {/* Card slot */}
            <Rect
              x="30"
              y="40"
              width="140"
              height="34"
              rx="34"
              fill={walletLight}
            />
            {/* Card peeking out */}
            <Rect x="52" y="26" width="96" height="34" rx="12" fill={accent} />
            <Rect
              x="64"
              y="36"
              width="40"
              height="6"
              rx="3"
              fill="#fff"
              opacity="0.7"
            />
            {/* Coin slot */}
            <Circle cx="100" cy="96" r="16" fill={coin} />
            <Circle
              cx="100"
              cy="96"
              r="11"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              opacity="0.6"
            />
            {/* Eyes */}
            <G>
              <Ellipse cx="72" cy="66" rx="7" ry="9" fill="#fff" />
              <Ellipse cx="128" cy="66" rx="7" ry="9" fill="#fff" />
              <Animated.View style={blinkStyle}>
                <Circle cx="74" cy="67" r="4" fill="#0c0a09" />
                <Circle cx="126" cy="67" r="4" fill="#0c0a09" />
              </Animated.View>
            </G>
            {/* Smile */}
            <Path
              d="M84 84 Q100 96 116 84"
              stroke="#fff"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            {/* Blush */}
            <Ellipse
              cx="60"
              cy="80"
              rx="8"
              ry="5"
              fill="#e8b8c4"
              opacity="0.7"
            />
            <Ellipse
              cx="140"
              cy="80"
              rx="8"
              ry="5"
              fill="#e8b8c4"
              opacity="0.7"
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  mascot: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  coin: {
    position: "absolute",
  },
});
