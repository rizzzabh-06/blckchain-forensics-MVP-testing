"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressSearch } from "@/components/AddressSearch";
import { AlertFeed } from "@/components/AlertFeed";
import { CaseManagement } from "@/components/CaseManagement";
import { Shield, Bell, FolderOpen, BarChart3, Brain, Globe, Webhook, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>();
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users to welcome page
  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/welcome");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error("Failed to sign out");
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      toast.success("Signed out successfully");
      router.push("/welcome");
    }
  };

  // Show loading state while checking authentication
  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading platform...</p>
        </div>
      </div>
    );
  }

  // Don't render platform if not authenticated
  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight">
                Crypto Deanonymization Platform
              </h1>
              <p className="text-muted-foreground">
                Advanced blockchain analysis, risk assessment, and investigation tools
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="flex items-center gap-1">
                <Webhook className="h-3 w-3" />
                Discord Alerts Active
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                AI-Powered
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {session.user.name || session.user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-500" />
                AI Money Laundering Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Gemini 2.0 Flash AI detects layering, structuring, and 6+ ML schemes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                Cross-Chain Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Track activity across Ethereum, Polygon, BSC, Arbitrum & more
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Webhook className="h-4 w-4 text-green-500" />
                Discord Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Automatic alerts for critical risks sent directly to Discord
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Cases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <AddressSearch 
              onAddressAnalyzed={(result) => setSelectedAddress(result.address)} 
            />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertFeed />
          </TabsContent>

          <TabsContent value="cases" className="space-y-6">
            <CaseManagement />
          </TabsContent>
        </Tabs>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Risk Calculation:</strong> Sanctions (40%) + Scam Reports (20%) + AI ML Detection (25%) + Anomalies (10%) + Cross-Chain (3%) + Tx Patterns (2%)
          </p>
        </footer>
      </div>
    </div>
  );
}