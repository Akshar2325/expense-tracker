import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { PieChart } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassCard } from "@/components/GlassCard";
import { EmptyState } from "@/components/EmptyState";
import { useFetch } from "@/hooks/useFetch";
import { useTheme, fontFamily, fontSize } from "@/theme";
import { formatCurrency } from "@/lib/utils";

interface BudgetBreakdown {
  budgetLimit: number;
  spent: number;
  percentageUsed: number;
  category: { name: string; color: string };
}

interface BudgetResponse {
  monthlyBudget: number;
  totalSpent: number;
  overallPercentage: number;
  breakdown: BudgetBreakdown[];
}

export default function BudgetsScreen() {
  const { palette } = useTheme();
  const { data, loading, error } = useFetch<BudgetResponse>(
    "/budgets/current-month-breakdown",
  );

  const breakdown = Array.isArray(data?.breakdown) ? data!.breakdown : [];

  return (
    <Screen>
      <ScreenHeader
        title="Budgets"
        subtitle="Stay comfortably within limits."
      />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={palette.ink} />
        </View>
      ) : error || !data ? (
        <GlassCard>
          <EmptyState
            title={error || "Nothing here yet."}
            body="Set a monthly budget to begin."
          />
        </GlassCard>
      ) : (
        <>
          <GlassCard style={styles.summary}>
            <Text
              style={[
                styles.summaryValue,
                { color: palette.ink, fontFamily: fontFamily.display },
              ]}
            >
              {Math.round(data.overallPercentage)}%
            </Text>
            <Text style={[styles.summaryCaption, { color: palette.muted }]}>
              of your {formatCurrency(data.monthlyBudget)} monthly budget used
            </Text>
            <ProgressTrack percent={data.overallPercentage} />
            <Text style={[styles.spentNote, { color: palette.muted }]}>
              Spent {formatCurrency(data.totalSpent)} of{" "}
              {formatCurrency(data.monthlyBudget)}
            </Text>
          </GlassCard>

          {breakdown.length === 0 ? (
            <EmptyState
              icon={<PieChart size={20} color={palette.muted} />}
              title="No tracked categories."
              body="Your spend against budget shows up here."
            />
          ) : (
            <View style={styles.list}>
              {breakdown.map((item) => (
                <GlassCard key={item.category.name} style={styles.item}>
                  <View style={styles.itemHead}>
                    <View style={styles.itemCat}>
                      <View
                        style={[
                          styles.dot,
                          { backgroundColor: item.category.color },
                        ]}
                      />
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.itemName,
                          {
                            color: palette.ink,
                            fontFamily: fontFamily.bodyMedium,
                          },
                        ]}
                      >
                        {item.category.name}
                      </Text>
                    </View>
                    <Text style={[styles.itemAmt, { color: palette.muted }]}>
                      {formatCurrency(item.spent)} /{" "}
                      {formatCurrency(item.budgetLimit)}
                    </Text>
                  </View>
                  <ProgressTrack
                    percent={item.percentageUsed}
                    danger={item.percentageUsed >= 85}
                  />
                </GlassCard>
              ))}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

function ProgressTrack({
  percent,
  danger,
}: {
  percent: number;
  danger?: boolean;
}) {
  const { palette } = useTheme();
  const capped = Math.min(Math.max(percent, 0), 94);
  const filled = danger ? palette.semanticError : palette.accentGreen;
  return (
    <View
      style={[
        styles.trackOuter,
        { backgroundColor: palette.progressBg, overflow: "hidden" },
      ]}
    >
      <View
        style={[
          styles.trackFill,
          { width: `${capped}%`, backgroundColor: filled },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingVertical: 72,
    alignItems: "center",
  },
  summary: {
    marginBottom: 16,
  },
  summaryValue: {
    fontSize: fontSize.displayLg,
    lineHeight: 84,
  },
  summaryCaption: {
    fontSize: fontSize.bodySm,
    fontFamily: fontFamily.body,
    marginTop: 6,
  },
  spentNote: {
    fontSize: fontSize.bodySm,
    fontFamily: fontFamily.body,
    marginTop: 8,
  },
  list: {
    gap: 12,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  itemHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 12,
  },
  itemCat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  itemName: {
    fontSize: fontSize.body,
    flex: 1,
  },
  itemAmt: {
    fontSize: fontSize.bodySm,
    fontFamily: fontFamily.body,
  },
  trackOuter: {
    height: 8,
    borderRadius: 4,
  },
  trackFill: {
    height: "100%",
    borderRadius: 4,
  },
});
