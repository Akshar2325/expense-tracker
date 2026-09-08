import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { useTheme, radius, fontSize, fontFamily, spacing } from "@/theme";

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string | null;
}

export function AppInput({ label, error, style, ...rest }: AppInputProps) {
  const { palette } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      {label ? (
        <Text
          style={[
            styles.label,
            { color: palette.muted, fontFamily: fontFamily.bodyMedium },
          ]}
        >
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={palette.mutedSoft}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          {
            backgroundColor: palette.surfaceCard,
            color: palette.ink,
            borderColor: focused ? palette.ink : palette.hairline,
            fontFamily: fontFamily.body,
          },
          style,
        ]}
        {...rest}
      />
      {error ? (
        <Text
          style={[
            styles.error,
            { color: palette.semanticError, fontFamily: fontFamily.body },
          ]}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontSize: fontSize.bodySm,
    marginLeft: 4,
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.base,
    fontSize: fontSize.body,
  },
  error: {
    fontSize: fontSize.caption,
    marginLeft: 4,
  },
});
