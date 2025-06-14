"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun, Palette } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

interface Settings {
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  gender: string;
  status: string;
  role: string[];
  notificationSettings: {
    emailNotifications: boolean;
    lowStockAlerts: boolean;
    newUserRegistrations: boolean;
    systemUpdates: boolean;
  };
  appearanceSettings: {
    theme: string;
    density: string;
  };
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const { setTheme } = useTheme();

  // Apply theme and density when settings are loaded
  useEffect(() => {
    if (settings?.appearanceSettings?.theme) {
      setTheme(settings.appearanceSettings.theme);
    }
    if (settings?.appearanceSettings?.density) {
      document.body.classList.remove("compact", "comfortable", "spacious");
      document.body.classList.add(settings.appearanceSettings.density);
    }
  }, [settings?.appearanceSettings?.theme, settings?.appearanceSettings?.density, setTheme]);

  useEffect(() => {
    if (user?.id) {
      fetchSettings();
    }
  }, [user?.id]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/settings/user/${user?.id}`,
        {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      const data = await response.json();
      setSettings(data.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!settings) return;

    const token = localStorage.getItem("auth-token");
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/settings/user/${user?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            email: settings.email,
            firstName: settings.firstName,
            lastName: settings.lastName,
            mobile: settings.mobile,
            gender: settings.gender,
            status: settings.status,
            role: settings.role,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      setSettings(data.data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/settings/user/${user?.id}/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/settings/user/${user?.id}/notifications`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          credentials: "include",
          body: JSON.stringify(settings.notificationSettings),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update notification settings");
      }

      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update notification settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAppearance = async () => {
    if (!settings) return;

    setIsSaving(true);
    try {
      const response = await fetch(
        `http://localhost:8081/api/v1/settings/user/${user?.id}/appearance`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
          },
          credentials: "include",
          body: JSON.stringify(settings.appearanceSettings),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appearance settings");
      }

      // Update theme and density immediately after save
      setTheme(settings.appearanceSettings.theme);
      document.body.classList.remove("compact", "comfortable", "spacious");
      document.body.classList.add(settings.appearanceSettings.density);

      toast({
        title: "Success",
        description: "Appearance settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update appearance settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={settings.firstName}
                      onChange={(e) =>
                        setSettings({ ...settings, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={settings.lastName}
                      onChange={(e) =>
                        setSettings({ ...settings, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={settings.role[0]}
                    onValueChange={(value) =>
                      setSettings({ ...settings, role: [value] })
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GUEST">Guest</SelectItem>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email.
                      </p>
                    </div>
                    <Switch
                      checked={settings.notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notificationSettings: {
                            ...settings.notificationSettings,
                            emailNotifications: checked,
                          },
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when products are running low.
                      </p>
                    </div>
                    <Switch
                      checked={settings.notificationSettings.lowStockAlerts}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notificationSettings: {
                            ...settings.notificationSettings,
                            lowStockAlerts: checked,
                          },
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        New User Registrations
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts when new users register.
                      </p>
                    </div>
                    <Switch
                      checked={settings.notificationSettings.newUserRegistrations}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notificationSettings: {
                            ...settings.notificationSettings,
                            newUserRegistrations: checked,
                          },
                        })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about system updates and maintenance.
                      </p>
                    </div>
                    <Switch
                      checked={settings.notificationSettings.systemUpdates}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          notificationSettings: {
                            ...settings.notificationSettings,
                            systemUpdates: checked,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how the dashboard looks.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className={`h-10 w-10 ${
                            settings.appearanceSettings.theme === "light"
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                          onClick={() =>
                            setSettings({
                              ...settings,
                              appearanceSettings: {
                                ...settings.appearanceSettings,
                                theme: "light",
                              },
                            })
                          }
                        >
                          <Sun className="h-5 w-5" />
                          <span className="sr-only">Light mode</span>
                        </Button>
                        <span className="text-sm">Light</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className={`h-10 w-10 ${
                            settings.appearanceSettings.theme === "dark"
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                          onClick={() =>
                            setSettings({
                              ...settings,
                              appearanceSettings: {
                                ...settings.appearanceSettings,
                                theme: "dark",
                              },
                            })
                          }
                        >
                          <Moon className="h-5 w-5" />
                          <span className="sr-only">Dark mode</span>
                        </Button>
                        <span className="text-sm">Dark</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className={`h-10 w-10 ${
                            settings.appearanceSettings.theme === "system"
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                          onClick={() =>
                            setSettings({
                              ...settings,
                              appearanceSettings: {
                                ...settings.appearanceSettings,
                                theme: "system",
                              },
                            })
                          }
                        >
                          <Palette className="h-5 w-5" />
                          <span className="sr-only">System preference</span>
                        </Button>
                        <span className="text-sm">System</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="density">Density</Label>
                    <Select
                      value={settings.appearanceSettings.density}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          appearanceSettings: {
                            ...settings.appearanceSettings,
                            density: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger id="density">
                        <SelectValue placeholder="Select density" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveAppearance} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSavePassword} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

