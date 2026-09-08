import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassCard } from "@/components/GlassCard";
import { EmptyState } from "@/components/EmptyState";
import {
  BarChart,
  DonutChart,
  TrendPoint,
  CategorySlice,
} from "@/components/Charts";
import { useFetch } from "@/hooks/useFetch";
import { useTheme, fontFamily, fontSize } from "@/theme";
import { formatCurrency } from "@/lib/utils";

interface ReportsResponse {
  trends: TrendPoint[];
  categories: CategorySlice[];
  totalExpense: number;
  totalIncome: number;
}

export default function ReportsScreen() {
  const { palette } = useTheme();
  const { data, loading, error } =
    useFetch<ReportsResponse>("/reports/overview");

  return (
    <Screen>
      <ScreenHeader title="Reports" subtitle="Where your money flows." />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={palette.ink} />
        </View>
      ) : error || !data ? (
        <GlassCard>
          <EmptyState
            title={error || "No reports yet."}
            body="Add transactions to see trends."
          />
        </GlassCard>
      ) : (
        <>
          <GlassCard style={styles.card}>
            <Text
              style={[
                styles.cardTitle,
                { color: palette.ink, fontFamily: fontFamily.bodySemibold },
              ]}
            >
              Spending trend
            </Text>
            <BarChart data={data.trends} height={180} />
          </GlassCard>

          <GlassCard style={styles.card}>
            <Text
              style={[
                styles.cardTitle,
                { color: palette.ink, fontFamily: fontFamily.bodySemibold },
              ]}
            >
              By category
            </Text>
            {data.categories.length === 0 ? (
              <Text style={[styles.muted, { color: palette.muted }]}>
                No category data yet.
              </Text>
            ) : (
              <View style={styles.donutWrap}>
                <DonutChart data={data.categories} size={180} />
                <View style={styles.legend}>
                  {data.categories.slice(0, 6).map((c) => (
                    <View key={c.name} style={styles.legendRow}>
                      <View
                        style={[styles.legendDot, { backgroundColor: c.color }]}
                      />
                      <Text
                        numberOfLines={1}
                        style={[styles.legendName, { color: palette.body }]}
                      >
                        {c.name}
                      </Text>
                      <Text
                        style={[
                          styles.legendValue,
                          {
                            color: palette.ink,
                            fontFamily: fontFamily.bodyMedium,
                          },
                        ]}
                      >
                        {formatCurrency(c.total)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </GlassCard>

          <View style={styles.totals}>
            <GlassCard style={styles.totalCard}>
              <Text style={[styles.totalLabel, { color: palette.muted }]}>
                Total spent
              </Text>
              <Text
                style={[
                  styles.totalValue,
                  { color: palette.ink, fontFamily: fontFamily.display },
                ]}
              >
                {formatCurrency(data.totalExpense)}
              </Text>
            </GlassCard>
            <GlassCard style={styles.totalCard}>
              <Text style={[styles.totalLabel, { color: palette.muted }]}>
                Total income
              </Text>
              <Text
                style={[
                  styles.totalValue,
                  {
                    color: palette.semanticSuccess,
                    fontFamily: fontFamily.display,
                  },
                ]}
              >
                {formatCurrency(data.totalIncome)}
              </Text>
            </GlassCard>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingVertical: 72,
    alignItems: "center",
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: fontSize.titleSm,
    marginBottom: 16,
  },
  muted: {
    fontSize: fontSize.bodySm,
    fontFamily: fontFamily.body,
  },
  donutWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
  },
  legend: {
    flex: 1,
    minWidth: 140,
    gap: 8,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendName: {
    flex: 1,
    fontSize: fontSize.bodySm,
    fontFamily: fontFamily.body,
  },
  legendValue: {
    fontSize: fontSize.bodySm,
  },
  totals: {
    flexDirection: "row",
    gap: 12,
  },
  totalCard: {
    flex: 1,
  },
  totalLabel: {
    fontSize: fontSize.bodySm,
    fontFamily: fontFamily.body,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: fontSize.title,
  },
});
