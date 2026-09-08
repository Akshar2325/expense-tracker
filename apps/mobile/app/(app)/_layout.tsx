import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  MoreHorizontal,
} from "lucide-react-native";
import { useTheme, fontFamily, fontSize } from "@/theme";
import { useResponsive } from "@/hooks/useResponsive";
import { useAuth } from "@/lib/auth";

export default function AppLayout() {
  const { palette, resolved } = useTheme();
  const { isPhone } = useResponsive();
  const { user, loading } = useAuth();

  // Auth-first routing: redirect to login when unauthenticated.
  if (!loading && !user) {
    return <Redirect href="/(auth)/login" />;
  }

  const tabColor = resolved === "dark" ? "#f5f5f5" : "#0c0a09";
  const inactiveColor = palette.mutedSoft;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tabColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: palette.glass,
            borderTopColor: palette.hairline,
          },
        ],
        tabBarLabelStyle: {
          fontFamily: fontFamily.bodyMedium,
          fontSize: fontSize.caption,
        },
        tabBarItemStyle: styles.tabItem,
        sceneStyle: { backgroundColor: palette.canvas },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: "Txns",
          tabBarIcon: ({ color, size }) => (
            <ArrowLeftRight size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="budgets"
        options={{
          title: "Budgets",
          tabBarIcon: ({ color, size }) => (
            <PiggyBank size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ color, size }) => (
            <MoreHorizontal size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabItem: {
    paddingVertical: 2,
  },
});
