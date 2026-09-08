import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Wallet,
  Repeat,
  Tags,
  Settings,
  ChevronRight,
} from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassCard } from "@/components/GlassCard";
import { useTheme, fontFamily, fontSize } from "@/theme";

const links = [
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/recurring", label: "Recurring", icon: Repeat },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export default function MoreScreen() {
  const { palette } = useTheme();
  const router = useRouter();

  return (
    <Screen>
      <ScreenHeader title="More" subtitle="Everything else in Ledger." />

      <GlassCard style={styles.card}>
        {links.map((link, i) => (
          <Pressable
            key={link.href}
            onPress={() => router.push(link.href as never)}
            style={[
              styles.row,
              i < links.length - 1 && {
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: palette.hairline,
              },
            ]}
          >
            <View
              style={[styles.icon, { backgroundColor: palette.surfaceStrong }]}
            >
              <link.icon size={16} color={palette.ink} />
            </View>
            <Text
              style={[
                styles.label,
                { color: palette.ink, fontFamily: fontFamily.bodyMedium },
              ]}
            >
              {link.label}
            </Text>
            <ChevronRight size={18} color={palette.muted} />
          </Pressable>
        ))}
      </GlassCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontSize: fontSize.body,
  },
});
