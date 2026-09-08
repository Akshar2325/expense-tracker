import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import { MailCheck } from "lucide-react-native";
import { AuthShell } from "@/components/AuthShell";
import { AppInput } from "@/components/AppInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { apiRequest } from "@/lib/api";
import { useTheme, fontFamily, fontSize } from "@/theme";

export default function ForgotPasswordScreen() {
  const { palette } = useTheme();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await apiRequest("/auth/forgot-password", {
        body: { email: email.trim() },
      });
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset password."
      subtitle="We'll send you a link to reset your password."
      footer={
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: palette.muted }]}>
            Remembered it?{" "}
          </Text>
          <Link href="/(auth)/login" asChild>
            <Pressable hitSlop={8}>
              <Text
                style={[
                  styles.footerLink,
                  { color: palette.ink, fontFamily: fontFamily.bodySemibold },
                ]}
              >
                Sign in
              </Text>
            </Pressable>
          </Link>
        </View>
      }
    >
      {sent ? (
        <View style={styles.sent}>
          <View
            style={[
              styles.sentIcon,
              { backgroundColor: palette.surfaceStrong },
            ]}
          >
            <MailCheck size={28} color={palette.ink} />
          </View>
          <Text
            style={[
              styles.sentTitle,
              { color: palette.ink, fontFamily: fontFamily.bodySemibold },
            ]}
          >
            Check your inbox
          </Text>
          <Text
            style={[
              styles.sentBody,
              { color: palette.muted, fontFamily: fontFamily.body },
            ]}
          >
            If an account exists for {email}, a reset link is on its way.
          </Text>
        </View>
      ) : (
        <View style={styles.form}>
          <AppInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          {error ? (
            <Text style={[styles.error, { color: palette.semanticError }]}>
              {error}
            </Text>
          ) : null}
          <PrimaryButton
            title="Send Reset Link"
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
      )}
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  error: {
    fontSize: fontSize.bodySm,
    fontFamily: fontFamily.body,
  },
  sent: {
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  sentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  sentTitle: {
    fontSize: fontSize.title,
  },
  sentBody: {
    fontSize: fontSize.bodySm,
    textAlign: "center",
    fontFamily: fontFamily.body,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: fontSize.bodySm,
    fontFamily: fontFamily.body,
  },
  footerLink: {
    fontSize: fontSize.bodySm,
  },
});
