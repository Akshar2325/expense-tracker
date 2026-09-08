import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Wallet } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassCard } from "@/components/GlassCard";
import { EmptyState } from "@/components/EmptyState";
import { useFetch } from "@/hooks/useFetch";
import { useTheme, fontFamily, fontSize } from "@/theme";
import { formatCurrency } from "@/lib/utils";

interface Account {
  id: string;
  name: string;
  type: string;
  balance: string;
  currency: string;
  isArchived?: boolean;
}

export default function AccountsScreen() {
  const { palette } = useTheme();
  const { data, loading, error } = useFetch<{ items: Account[] }>("/accounts");

  const accounts = Array.isArray(data?.items) ? data!.items : [];

  return (
    <Screen>
      <ScreenHeader title="Accounts" subtitle="All your money, in one place." />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={palette.ink} />
        </View>
      ) : error ? (
        <GlassCard>
          <EmptyState title={error} body="Could not load accounts." />
        </GlassCard>
      ) : accounts.length === 0 ? (
        <EmptyState
          icon={<Wallet size={20} color={palette.muted} />}
          title="No accounts yet."
          body="Add an account to start tracking."
        />
      ) : (
        <View style={styles.list}>
          {accounts.map((a) => (
            <GlassCard key={a.id} style={styles.card}>
              <View style={styles.row}>
                <View
                  style={[
                    styles.icon,
                    { backgroundColor: palette.surfaceStrong },
                  ]}
                >
                  <Wallet size={16} color={palette.ink} />
                </View>
                <View style={styles.info}>
                  <Text
                    style={[
                      styles.name,
                      { color: palette.ink, fontFamily: fontFamily.bodyMedium },
                    ]}
                  >
                    {a.name}
                  </Text>
                  <Text style={[styles.type, { color: palette.muted }]}>
                    {a.type}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.balance,
                    { color: palette.ink, fontFamily: fontFamily.bodySemibold },
                  ]}
                >
                  {formatCurrency(a.balance)}
                </Text>
              </View>
            </GlassCard>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingVertical: 72,
    alignItems: "center",
  },
  list: {
    gap: 12,
  },
  card: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: fontSize.body,
  },
  type: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.body,
    marginTop: 2,
    textTransform: "capitalize",
  },
  balance: {
    fontSize: fontSize.body,
  },
});
