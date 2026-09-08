import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme, fontSize, fontFamily } from "@/theme";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  body?: string;
}

export function EmptyState({ icon, title, body }: EmptyStateProps) {
  const { palette } = useTheme();
  return (
    <View style={styles.wrap}>
      {icon ? (
        <View
          style={[styles.iconWrap, { backgroundColor: palette.surfaceStrong }]}
        >
          {icon}
        </View>
      ) : null}
      <Text
        style={[
          styles.title,
          { color: palette.bodyStrong, fontFamily: fontFamily.bodySemibold },
        ]}
      >
        {title}
      </Text>
      {body ? (
        <Text
          style={[
            styles.body,
            { color: palette.muted, fontFamily: fontFamily.body },
          ]}
        >
          {body}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: fontSize.bodyMd,
    textAlign: "center",
  },
  body: {
    fontSize: fontSize.bodySm,
    textAlign: "center",
    maxWidth: 260,
  },
});
