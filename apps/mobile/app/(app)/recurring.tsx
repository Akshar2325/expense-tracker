import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Repeat } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassCard } from "@/components/GlassCard";
import { EmptyState } from "@/components/EmptyState";
import { useFetch } from "@/hooks/useFetch";
import { useTheme, fontFamily, fontSize } from "@/theme";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Recurring {
  id: string;
  title: string;
  amount: string;
  frequency: string;
  nextRunAt: string;
  isActive: boolean;
  category?: { name: string; color: string } | null;
}

export default function RecurringScreen() {
  const { palette } = useTheme();
  const { data, loading, error } = useFetch<{ items: Recurring[] }>(
    "/recurring-transactions",
  );

  const items = Array.isArray(data?.items) ? data!.items : [];

  return (
    <Screen>
      <ScreenHeader
        title="Recurring"
        subtitle="Subscriptions and scheduled bills."
      />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={palette.ink} />
        </View>
      ) : error ? (
        <GlassCard>
          <EmptyState title={error} body="Could not load recurring items." />
        </GlassCard>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<Repeat size={20} color={palette.muted} />}
          title="Nothing scheduled."
          body="Recurring bills and income appear here."
        />
      ) : (
        <View style={styles.list}>
          {items.map((r) => (
            <GlassCard key={r.id} style={styles.card}>
              <View style={styles.row}>
                <View
                  style={[
                    styles.icon,
                    {
                      backgroundColor: r.isActive
                        ? palette.surfaceStrong
                        : palette.surface,
                    },
                  ]}
                >
                  <Repeat size={16} color={palette.ink} />
                </View>
                <View style={styles.info}>
                  <Text
                    style={[
                      styles.name,
                      { color: palette.ink, fontFamily: fontFamily.bodyMedium },
                    ]}
                  >
                    {r.title}
                  </Text>
                  <Text style={[styles.sub, { color: palette.muted }]}>
                    {r.frequency}
                    {r.category?.name ? ` · ${r.category.name}` : ""}
                    {"  ·  next "}
                    {formatDate(r.nextRunAt)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.amount,
                    { color: palette.ink, fontFamily: fontFamily.bodySemibold },
                  ]}
                >
                  {formatCurrency(r.amount)}
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
  sub: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.body,
    marginTop: 2,
    textTransform: "capitalize",
  },
  amount: {
    fontSize: fontSize.body,
  },
});
