import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import { AuthShell } from "@/components/AuthShell";
import { AppInput } from "@/components/AppInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuth } from "@/lib/auth";
import { useTheme, fontFamily, fontSize } from "@/theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const { palette } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(app)");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back."
      subtitle="Sign in to continue to your ledger."
      footer={
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: palette.muted }]}>
            New to Ledger?{" "}
          </Text>
          <Link href="/(auth)/register" asChild>
            <Pressable hitSlop={8}>
              <Text
                style={[
                  styles.footerLink,
                  { color: palette.ink, fontFamily: fontFamily.bodySemibold },
                ]}
              >
                Create account
              </Text>
            </Pressable>
          </Link>
        </View>
      }
    >
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
        <AppInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
        />
        <View style={styles.forgotRow}>
          <Link href="/(auth)/forgot" asChild>
            <Pressable hitSlop={8}>
              <Text
                style={[
                  styles.forgot,
                  { color: palette.muted, fontFamily: fontFamily.bodyMedium },
                ]}
              >
                Forgot password?
              </Text>
            </Pressable>
          </Link>
        </View>
        {error ? (
          <Text style={[styles.error, { color: palette.semanticError }]}>
            {error}
          </Text>
        ) : null}
        <PrimaryButton
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          icon={<ArrowRight size={18} color={palette.onPrimary} />}
        />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  forgotRow: {
    alignItems: "flex-end",
    marginTop: -6,
  },
  forgot: {
    fontSize: fontSize.bodySm,
  },
  error: {
    fontSize: fontSize.bodySm,
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
