import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ArrowLeftRight, Plus, Search, X } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassCard } from "@/components/GlassCard";
import { EmptyState } from "@/components/EmptyState";
import { useFetch } from "@/hooks/useFetch";
import { useTheme, fontFamily, fontSize } from "@/theme";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

interface Transaction {
  id: string;
  title: string;
  amount: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  transactionAt: string;
  category?: { name: string; color: string } | null;
  account?: { name: string } | null;
}

export default function TransactionsScreen() {
  const { palette } = useTheme();
  const [search, setSearch] = useState("");
  const { columns, contentWidth } = useResponsive();
  const { data, loading, error } = useFetch<{ items: Transaction[] }>(
    "/transactions",
  );

  const filtered = data?.items.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Screen>
      <ScreenHeader
        title="Transactions"
        subtitle="Every entry in your ledger."
        right={
          <Pressable
            onPress={() => {}}
            style={[
              styles.addBtn,
              { backgroundColor: palette.ink, borderRadius: 999 },
            ]}
          >
            <Plus size={16} color={palette.canvas} />
          </Pressable>
        }
      />

      {/* Search */}
      <View
        style={[
          styles.searchRow,
          {
            backgroundColor: palette.surface,
            borderColor: palette.hairline,
            borderRadius: 12,
          },
        ]}
      >
        <Search size={16} color={palette.muted} />
        <TextInput
          style={[
            styles.searchInput,
            { color: palette.body, fontFamily: fontFamily.body },
          ]}
          placeholder="Search transactions…"
          placeholderTextColor={palette.mutedSoft}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
        {search.length > 0 ? (
          <Pressable onPress={() => setSearch("")} hitSlop={6}>
            <X size={16} color={palette.muted} />
          </Pressable>
        ) : null}
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={palette.ink} />
        </View>
      ) : error ? (
        <GlassCard>
          <EmptyState title={error} body="Could not load transactions." />
        </GlassCard>
      ) : filtered && filtered.length === 0 ? (
        <EmptyState
          icon={<ArrowLeftRight size={20} color={palette.muted} />}
          title={search ? "No results." : "No transactions yet."}
          body={search ? "Try a different search." : "Tap + to add your first."}
        />
      ) : (
        <View style={{ gap: 10 }}>
          {filtered?.map((t) => (
            <GlassCard key={t.id} style={styles.card}>
              <View style={styles.cardRow}>
                <View
                  style={[
                    styles.cardIcon,
                    {
                      backgroundColor:
                        t.category?.color || palette.surfaceStrong,
                    },
                  ]}
                >
                  <ArrowLeftRight size={14} color={palette.ink} />
                </View>
                <View style={styles.cardInfo}>
                  <Text
                    style={[
                      styles.cardTitle,
                      { color: palette.ink, fontFamily: fontFamily.bodyMedium },
                    ]}
                  >
                    {t.title}
                  </Text>
                  <Text style={[styles.cardSub, { color: palette.muted }]}>
                    {t.category?.name || "Uncategorized"}
                    {t.account ? ` · ${t.account.name}` : ""}
                    {"  "}
                    {formatDate(t.transactionAt)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.cardAmount,
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
            </GlassCard>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.body,
  },
  loading: {
    paddingVertical: 48,
    alignItems: "center",
  },
  card: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.body,
  },
  cardSub: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.body,
    marginTop: 2,
  },
  cardAmount: {
    fontSize: fontSize.body,
  },
});
