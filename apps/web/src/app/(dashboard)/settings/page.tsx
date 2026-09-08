"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { apiRequest, tokenStore } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);
    setProfileError(null);
    try {
      await apiRequest("/users/me", {
        method: "PATCH",
        token: tokenStore.access,
        body: { firstName: firstName || null, lastName: lastName || null },
      });
      await refreshUser();
      setProfileMsg("Profile updated.");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMsg(null);
    setPasswordError(null);
    try {
      await apiRequest("/users/change-password", {
        method: "POST",
        token: tokenStore.access,
        body: { currentPassword, newPassword },
      });
      setPasswordMsg("Password changed.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Change failed");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="font-display text-display-lg text-ink">Settings</h1>
        <p className="mt-1 text-body-sm text-muted">
          Manage your profile and security.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <Card.Header>
          <Card.Title>Profile</Card.Title>
        </Card.Header>
        <Card.Body>
          <form onSubmit={saveProfile} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <Input
              label="Email"
              value={user?.email || ""}
              disabled
              className="opacity-60"
            />
            {profileMsg && (
              <p className="text-sm text-semantic-success">{profileMsg}</p>
            )}
            {profileError && (
              <p className="text-sm text-semantic-error">{profileError}</p>
            )}
            <div>
              <Button type="submit" loading={savingProfile}>
                Save Profile
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      {/* Security */}
      <Card>
        <Card.Header>
          <Card.Title>Change password</Card.Title>
        </Card.Header>
        <Card.Body>
          <form onSubmit={changePassword} className="flex flex-col gap-5">
            <Input
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <Input
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
            />
            {passwordMsg && (
              <p className="text-sm text-semantic-success">{passwordMsg}</p>
            )}
            {passwordError && (
              <p className="text-sm text-semantic-error">{passwordError}</p>
            )}
            <div>
              <Button type="submit" variant="outline" loading={savingPassword}>
                Change Password
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}
