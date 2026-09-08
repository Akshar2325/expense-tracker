import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme, fontFamily, fontSize } from "@/theme";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, right }: ScreenHeaderProps) {
  const { palette } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.textWrap}>
        <Text
          style={[
            styles.title,
            { color: palette.ink, fontFamily: fontFamily.display },
          ]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              { color: palette.muted, fontFamily: fontFamily.body },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 12,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: fontSize.displaySm,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: fontSize.bodySm,
    marginTop: 4,
  },
  right: {
    flexShrink: 0,
  },
});
