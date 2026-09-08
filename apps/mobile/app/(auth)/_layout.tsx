import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/lib/auth";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  // Already signed in? Skip the auth screens.
  if (!loading && user) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot" />
    </Stack>
  );
}
