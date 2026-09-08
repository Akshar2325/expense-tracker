import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Tags } from "lucide-react-native";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ScreenHeader";
import { GlassCard } from "@/components/GlassCard";
import { EmptyState } from "@/components/EmptyState";
import { useFetch } from "@/hooks/useFetch";
import { useTheme, fontFamily, fontSize } from "@/theme";
import { useResponsive } from "@/hooks/useResponsive";

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string | null;
  type: string;
}

export default function CategoriesScreen() {
  const { palette } = useTheme();
  const { columns } = useResponsive();
  const { data, loading, error } = useFetch<{ items: Category[] }>(
    "/categories",
  );

  const categories = Array.isArray(data?.items) ? data!.items : [];

  return (
    <Screen>
      <ScreenHeader title="Categories" subtitle="Organize your spending." />

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={palette.ink} />
        </View>
      ) : error ? (
        <GlassCard>
          <EmptyState title={error} body="Could not load categories." />
        </GlassCard>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Tags size={20} color={palette.muted} />}
          title="No categories yet."
          body="Categories help you sort transactions."
        />
      ) : (
        <View style={[styles.grid, { gap: 12 }]}>
          {categories.map((c) => (
            <GlassCard
              key={c.id}
              style={[styles.card, { flexBasis: columns > 1 ? "48%" : "100%" }]}
            >
              <View style={styles.row}>
                <View
                  style={[
                    styles.icon,
                    { backgroundColor: c.color || palette.surfaceStrong },
                  ]}
                >
                  <Tags size={16} color={palette.ink} />
                </View>
                <View style={styles.info}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.name,
                      { color: palette.ink, fontFamily: fontFamily.bodyMedium },
                    ]}
                  >
                    {c.name}
                  </Text>
                  <Text style={[styles.type, { color: palette.muted }]}>
                    {c.type}
                  </Text>
                </View>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
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
});
