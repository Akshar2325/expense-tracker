import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassCard } from "./GlassCard";
import { useTheme, fontSize, fontFamily } from "@/theme";

interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  accent?: string;
}

export function StatCard({ label, value, icon, accent }: StatCardProps) {
  const { palette } = useTheme();
  return (
    <GlassCard style={styles.card}>
      <View style={styles.row}>
        {icon ? (
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: accent ?? palette.surfaceStrong },
            ]}
          >
            {icon}
          </View>
        ) : null}
        <Text
          style={[
            styles.label,
            { color: palette.muted, fontFamily: fontFamily.bodyMedium },
          ]}
        >
          {label}
        </Text>
      </View>
      <Text
        style={[
          styles.value,
          { color: palette.ink, fontFamily: fontFamily.bodyBold },
        ]}
      >
        {value}
      </Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: fontSize.caption,
    flexShrink: 1,
  },
  value: {
    fontSize: fontSize.titleMd,
  },
});
