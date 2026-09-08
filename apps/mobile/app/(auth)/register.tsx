import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { AuthShell } from "@/components/AuthShell";
import { AppInput } from "@/components/AppInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuth } from "@/lib/auth";
import { useTheme, fontFamily, fontSize } from "@/theme";

export default function RegisterScreen() {
  const { register } = useAuth();
  const { palette } = useTheme();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
      });
      router.replace("/(app)");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Start your ledger."
      subtitle="Create a free account — no card, no noise."
      footer={
        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: palette.muted }]}>
            Already have an account?{" "}
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
      <View style={styles.form}>
        <View style={styles.nameRow}>
          <View style={styles.nameField}>
            <AppInput
              label="First name"
              placeholder="Ada"
              value={firstName}
              onChangeText={setFirstName}
              autoComplete="given-name"
            />
          </View>
          <View style={styles.nameField}>
            <AppInput
              label="Last name"
              placeholder="Lovelace"
              value={lastName}
              onChangeText={setLastName}
              autoComplete="family-name"
            />
          </View>
        </View>
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
          placeholder="At least 8 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
        />
        <AppInput
          label="Confirm password"
          placeholder="Repeat password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          autoComplete="new-password"
        />
        {error ? (
          <Text style={[styles.error, { color: palette.semanticError }]}>
            {error}
          </Text>
        ) : null}
        <PrimaryButton
          title="Create Account"
          onPress={handleRegister}
          loading={loading}
          icon={<Sparkles size={18} color={palette.onPrimary} />}
        />
      </View>
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameField: {
    flex: 1,
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
