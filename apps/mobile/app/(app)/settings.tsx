import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import {
  Sun,
  Moon,
  MonitorSmartphone,
  LogOut,
  User,
  Check,
} from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassCard } from "@/components/GlassCard";
import { useAuth } from "@/lib/auth";
import { useTheme, ThemeMode, fontFamily, fontSize } from "@/theme";

const themeOptions: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "system", label: "System", icon: MonitorSmartphone },
  { mode: "light", label: "Light", icon: Sun },
  { mode: "dark", label: "Dark", icon: Moon },
];

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { palette, mode, setMode } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <Screen>
      <ScreenHeader title="Settings" subtitle="Make Ledger yours." />

      {/* Profile */}
      <GlassCard style={styles.card}>
        <View style={styles.profileRow}>
          <View
            style={[styles.avatar, { backgroundColor: palette.surfaceStrong }]}
          >
            <User size={20} color={palette.ink} />
          </View>
          <View style={styles.profileInfo}>
            <Text
              style={[
                styles.profileName,
                { color: palette.ink, fontFamily: fontFamily.bodySemibold },
              ]}
            >
              {user?.displayName || user?.firstName || "Ledger user"}
            </Text>
            <Text style={[styles.profileEmail, { color: palette.muted }]}>
              {user?.email}
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* Theme */}
      <GlassCard style={styles.card}>
        <Text
          style={[
            styles.sectionLabel,
            { color: palette.ink, fontFamily: fontFamily.bodySemibold },
          ]}
        >
          Appearance
        </Text>
        <View style={styles.themeRow}>
          {themeOptions.map((opt) => {
            const active = mode === opt.mode;
            return (
              <Pressable
                key={opt.mode}
                onPress={() => setMode(opt.mode)}
                style={[
                  styles.themeOption,
                  {
                    backgroundColor: active ? palette.ink : palette.surface,
                    borderColor: active ? palette.ink : palette.hairline,
                  },
                ]}
              >
                <opt.icon
                  size={16}
                  color={active ? palette.canvas : palette.body}
                />
                <Text
                  style={[
                    styles.themeLabel,
                    {
                      color: active ? palette.canvas : palette.body,
                      fontFamily: fontFamily.bodyMedium,
                    },
                  ]}
                >
                  {opt.label}
                </Text>
                {active ? <Check size={14} color={palette.canvas} /> : null}
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.hint, { color: palette.muted }]}>
          System follows your device appearance by default.
        </Text>
      </GlassCard>

      {/* Logout */}
      <Pressable
        onPress={handleLogout}
        style={[
          styles.logout,
          {
            backgroundColor: palette.surface,
            borderColor: palette.hairline,
          },
        ]}
      >
        <LogOut size={16} color={palette.semanticError} />
        <Text
          style={[
            styles.logoutLabel,
            {
              color: palette.semanticError,
              fontFamily: fontFamily.bodySemibold,
            },
          ]}
        >
          Sign out
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: fontSize.body,
  },
  profileEmail: {
    fontSize: fontSize.bodySm,
    fontFamily: fontFamily.body,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: fontSize.titleSm,
    marginBottom: 14,
  },
  themeRow: {
    flexDirection: "row",
    gap: 10,
  },
  themeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  themeLabel: {
    fontSize: fontSize.bodySm,
  },
  hint: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.body,
    marginTop: 12,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  logoutLabel: {
    fontSize: fontSize.body,
  },
});
