import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  ArrowLeftRight,
  Repeat,
  Tags,
  ChevronRight,
} from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { StatCard } from "@/components/StatCard";
import { GlassCard } from "@/components/GlassCard";
import { EmptyState } from "@/components/EmptyState";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/lib/auth";
import { useTheme, fontFamily, fontSize } from "@/theme";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface DashboardData {
  month: { expense: number; income: number; net: number };
  topCategories: {
    categoryId: string | null;
    name: string;
    color: string;
    icon: string | null;
    amount: number;
  }[];
  recentTransactions: {
    id: string;
    title: string;
    amount: string;
    type: string;
    transactionAt: string;
    category?: { name: string; color: string; icon: string } | null;
  }[];
}

const quickLinks = [
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/recurring", label: "Recurring", icon: Repeat },
  { href: "/categories", label: "Categories", icon: Tags },
] as const;

export default function DashboardScreen() {
  const { user } = useAuth();
  const { palette } = useTheme();
  const router = useRouter();
  const { columns } = useResponsive();
  const { data, loading, error } = useFetch<DashboardData>(
    "/insights/dashboard",
  );

  const firstName = user?.firstName || user?.displayName || "there";

  return (
    <Screen>
      <ScreenHeader
        title={`Good day, ${firstName}.`}
        subtitle="A quiet overview of your finances this month."
      />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={palette.ink} />
        </View>
      ) : error || !data ? (
        <GlassCard>
          <EmptyState
            title={error || "Could not load dashboard."}
            body="Pull to refresh or try again shortly."
          />
        </GlassCard>
      ) : (
        <>
          {/* Stats */}
          <View style={[styles.statsRow, { gap: 12 }]}>
            <StatCard
              label="Spent this month"
              value={formatCurrency(data.month.expense)}
              icon={<TrendingDown size={14} color={palette.semanticError} />}
              accent={palette.surfaceStrong}
            />
            <StatCard
              label="Income this month"
              value={formatCurrency(data.month.income)}
              icon={<TrendingUp size={14} color={palette.semanticSuccess} />}
              accent={palette.surfaceStrong}
            />
            <StatCard
              label="Net balance"
              value={formatCurrency(data.month.net)}
              icon={<Wallet size={14} color={palette.ink} />}
              accent={palette.surfaceStrong}
            />
          </View>

          {/* Quick links */}
          <View style={[styles.quickRow, { gap: 10 }]}>
            {quickLinks.map((link) => (
              <Pressable
                key={link.href}
                onPress={() => router.push(link.href as never)}
                style={[
                  styles.quickLink,
                  {
                    backgroundColor: palette.glass,
                    borderColor: palette.glassBorder,
                  },
                ]}
              >
                <link.icon size={16} color={palette.ink} />
                <Text
                  style={[
                    styles.quickLabel,
                    {
                      color: palette.bodyStrong,
                      fontFamily: fontFamily.bodyMedium,
                    },
                  ]}
                >
                  {link.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Top categories */}
          <GlassCard style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: palette.ink, fontFamily: fontFamily.bodySemibold },
              ]}
            >
              Top categories
            </Text>
            {data.topCategories.length === 0 ? (
              <Text style={[styles.muted, { color: palette.muted }]}>
                No spending yet.
              </Text>
            ) : (
              <View style={styles.catList}>
                {data.topCategories.map((c) => (
                  <View key={c.categoryId ?? c.name} style={styles.catRow}>
                    <View
                      style={[
                        styles.catDot,
                        { backgroundColor: c.color || palette.surfaceStrong },
                      ]}
                    />
                    <Text
                      style={[
                        styles.catName,
                        { color: palette.body, fontFamily: fontFamily.body },
                      ]}
                    >
                      {c.name}
                    </Text>
                    <Text
                      style={[
                        styles.catAmount,
                        {
                          color: palette.ink,
                          fontFamily: fontFamily.bodySemibold,
                        },
                      ]}
                    >
                      {formatCurrency(c.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </GlassCard>

          {/* Recent activity */}
          <GlassCard style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: palette.ink, fontFamily: fontFamily.bodySemibold },
                ]}
              >
                Recent activity
              </Text>
              <Pressable
                onPress={() => router.push("/transactions" as never)}
                hitSlop={8}
              >
                <ChevronRight size={18} color={palette.muted} />
              </Pressable>
            </View>
            {data.recentTransactions.length === 0 ? (
              <Text style={[styles.muted, { color: palette.muted }]}>
                No transactions yet. Add your first one.
              </Text>
            ) : (
              <View style={styles.txList}>
                {data.recentTransactions.slice(0, 5).map((t) => (
                  <View key={t.id} style={styles.txRow}>
                    <View
                      style={[
                        styles.txIcon,
                        {
                          backgroundColor:
                            t.category?.color || palette.surfaceStrong,
                        },
                      ]}
                    >
                      <ArrowLeftRight size={14} color={palette.ink} />
                    </View>
                    <View style={styles.txInfo}>
                      <Text
                        style={[
                          styles.txTitle,
                          {
                            color: palette.ink,
                            fontFamily: fontFamily.bodyMedium,
                          },
                        ]}
                      >
                        {t.title}
                      </Text>
                      <Text style={[styles.txDate, { color: palette.muted }]}>
                        {formatDate(t.transactionAt)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.txAmount,
                        {
                          color:
                            t.type === "INCOME"
                              ? palette.semanticSuccess
                              : palette.ink,
                          fontFamily: fontFamily.bodySemibold,
                        },
                      ]}
                    >
                      {t.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </GlassCard>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    paddingVertical: 60,
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  quickLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  quickLabel: {
    fontSize: fontSize.bodySm,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: fontSize.titleSm,
    marginBottom: 12,
  },
  muted: {
    fontSize: fontSize.bodySm,
    fontFamily: fontFamily.body,
  },
  catList: {
    gap: 10,
  },
  catRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  catDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  catName: {
    flex: 1,
    fontSize: fontSize.bodySm,
  },
  catAmount: {
    fontSize: fontSize.bodySm,
  },
  txList: {
    gap: 12,
  },
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: fontSize.body,
  },
  txDate: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.body,
    marginTop: 2,
  },
  txAmount: {
    fontSize: fontSize.body,
  },
});
